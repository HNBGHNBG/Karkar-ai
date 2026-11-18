"""Teacher Karkar — Flask backend (accounts + Drive intake + Gemini AI)."""
import argparse
import io
import json
import logging
import os
import re
import secrets
import sqlite3
import sys
import time
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from getpass import getpass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request as UrlRequest, urlopen

from cryptography.fernet import Fernet, InvalidToken
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, send_file, send_from_directory, session
from google.auth.exceptions import RefreshError
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaIoBaseDownload, MediaIoBaseUpload
from werkzeug.security import check_password_hash, generate_password_hash

ROOT = Path(__file__).resolve().parent
load_dotenv(ROOT / ".env")

DRIVE_SCOPES = [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
]
PARENT_FOLDER_ID = os.getenv("GOOGLE_DRIVE_PARENT_FOLDER_ID", "").strip()
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "").strip().lower()
APP_DATA_DIR = Path(os.getenv("APP_DATA_DIR", ROOT / ".private"))
APP_DATA_DIR.mkdir(parents=True, exist_ok=True)
TOKEN_PATH = APP_DATA_DIR / "drive-token.enc"
DB_PATH = APP_DATA_DIR / "accounts.sqlite3"
OWNER_SETUP_TOKEN = os.getenv("OWNER_SETUP_TOKEN", "").strip()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
FEEDBACK_FORM_URL = os.getenv("FEEDBACK_FORM_URL", "").strip()

MAX_FILE_BYTES = 50 * 1024 * 1024
MAX_FILES = 10
MAX_REQUEST_BYTES = MAX_FILES * MAX_FILE_BYTES + 2 * 1024 * 1024
UPLOAD_CHUNK_BYTES = 8 * 1024 * 1024

PERMISSION_KEYS = (
    "view_requests", "update_requests", "manage_accounts", "manage_content",
    "manage_settings", "manage_drive", "view_conversations",
)

DELIVERABLES = {"presentation", "audio_summary", "slide_deck", "video_summary", "mind_map",
                "report", "flashcards", "quiz", "chart", "spreadsheet"}
STAGES = {"primary", "middle", "secondary", "university"}
ROLES = {"teacher", "student", "other"}
COUNTRIES = {"oman", "outside_oman"}
SCHOOL_STATUSES = {"school", "independent", "other"}
STUDENT_TYPES = {"lesson", "oral", "project"}
PROFESSIONS = {
    "healthcare", "education", "engineering", "technology", "science", "business",
    "finance", "law", "public_service", "media", "arts_design", "marketing_sales",
    "trades", "agriculture", "environment", "hospitality", "transport", "safety",
    "social_services", "sports", "personal_care", "manufacturing", "retail", "other",
}
STATUSES = {"received", "partial_upload", "in_progress", "completed", "cancelled"}
LANGS = {
    "ar", "en", "es", "fr", "de", "pt", "ru", "zh", "ja", "ko", "hi", "bn", "ur", "tr",
    "id", "ms", "th", "vi", "fa", "he", "nl", "it", "pl", "uk", "el", "sv", "no", "da",
    "fi", "cs", "ro", "hu", "sw", "am", "yo", "ha", "zu", "ta", "te", "mr", "pa", "gu",
    "kn", "ml", "si", "ne", "fil", "ps", "hr", "sr",
}

RATE = {}
TRACK_RATE = {}
AUTH_RATE = {}
AI_RATE = {}

app = Flask(__name__, static_folder=None)
app.config.update(
    SECRET_KEY=os.getenv("FLASK_SECRET_KEY") or None,
    MAX_CONTENT_LENGTH=MAX_REQUEST_BYTES,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.getenv("APP_ENV", "development").lower() == "production",
    PERMANENT_SESSION_LIFETIME=60 * 60,
)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("karkar")


# ============================================================
#  Database
# ============================================================
@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_db() as db:
        db.execute("PRAGMA journal_mode = WAL")
        db.executescript("""
        CREATE TABLE IF NOT EXISTS accounts (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('owner','admin','circle','user')),
            permissions TEXT NOT NULL DEFAULT '{}',
            active INTEGER NOT NULL DEFAULT 1,
            country TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            account_id TEXT NOT NULL REFERENCES accounts(id),
            title TEXT NOT NULL,
            context_json TEXT NOT NULL DEFAULT '{}',
            ai_consent_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS conversation_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            sender TEXT NOT NULL CHECK (sender IN ('user','assistant')),
            content TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE UNIQUE INDEX IF NOT EXISTS one_owner ON accounts(role) WHERE role = 'owner';
        """)


init_db()


# ============================================================
#  Helpers
# ============================================================
def now_iso():
    return datetime.now(timezone.utc).isoformat()


def get_account(account_id):
    if not account_id:
        return None
    with get_db() as db:
        row = db.execute(
            "SELECT id, email, name, role, permissions, active FROM accounts WHERE id = ?",
            (account_id,),
        ).fetchone()
    if not row or not row["active"]:
        return None
    acc = dict(row)
    acc["permissions"] = json.loads(acc["permissions"] or "{}")
    return acc


def current_account():
    return get_account(session.get("account_id"))


def account_payload(acc):
    return {
        "id": acc["id"],
        "email": acc["email"],
        "name": acc["name"],
        "role": acc["role"],
        "permissions": acc["permissions"],
    }


def require_account():
    acc = current_account()
    if not acc:
        return None, (jsonify(error="Please sign in."), 401)
    return acc, None


def require_owner():
    acc, err = require_account()
    if err:
        return None, err
    if acc["role"] != "owner":
        return None, (jsonify(error="Owner access required."), 403)
    return acc, None


def require_permission(perm):
    acc, err = require_account()
    if err:
        return None, err
    if acc["role"] == "owner" or acc["permissions"].get(perm):
        return acc, None
    return None, (jsonify(error="Permission denied."), 403)


def set_session(account_id):
    session.clear()
    session["account_id"] = account_id
    session.permanent = True


def validate_account_fields(data, require_password=True, require_country=False):
    if not isinstance(data, dict):
        return ["Invalid data."]
    errors = []
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    country = str(data.get("country", "")).strip() if require_country else ""
    if not name or len(name) > 120:
        errors.append("Enter a name (max 120 chars).")
    if len(email) > 254 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        errors.append("Enter a valid email.")
    if require_password and (len(password) < 12 or len(password) > 256):
        errors.append("Password must be 12–256 chars.")
    if require_country and (not country or len(country) > 100):
        errors.append("Enter your country.")
    return errors


def create_account(name, email, password, role="user", permissions=None, country=""):
    now = now_iso()
    aid = uuid.uuid4().hex
    with get_db() as db:
        db.execute(
            """INSERT INTO accounts
               (id, email, name, password_hash, role, permissions, country, created_at, updated_at)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (aid, email.strip().lower(), name.strip(),
             generate_password_hash(password, method="scrypt"),
             role, json.dumps(permissions or {}, separators=(",", ":")),
             country, now, now),
        )
    return get_account(aid)


def rate_limit(bucket, key, window, limit):
    now = time.time()
    recent = [s for s in bucket.get(key, []) if now - s < window]
    if len(recent) >= limit:
        bucket[key] = recent
        return True
    recent.append(now)
    bucket[key] = recent
    return False


# ============================================================
#  Security headers + CSRF
# ============================================================
@app.after_request
def add_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.before_request
def csrf_guard():
    if request.method in {"GET", "HEAD", "OPTIONS"}:
        return None
    if request.path == "/auth/google/callback":
        return None
    expected = session.get("csrf_token", "")
    supplied = request.headers.get("X-CSRF-Token", "")
    if not supplied or not expected or not secrets.compare_digest(supplied, expected):
        return jsonify(error="CSRF verification failed."), 400
    return None


@app.errorhandler(413)
def too_large(_):
    return jsonify(error="Request too large (10 files × 50 MB max)."), 413


# ============================================================
#  OAuth / Drive
# ============================================================
class SetupError(Exception):
    pass


class AIServiceError(Exception):
    pass


def required_oauth_settings():
    names = {
        "GOOGLE_OAUTH_CLIENT_ID": os.getenv("GOOGLE_OAUTH_CLIENT_ID", "").strip(),
        "GOOGLE_OAUTH_CLIENT_SECRET": os.getenv("GOOGLE_OAUTH_CLIENT_SECRET", "").strip(),
        "GOOGLE_REDIRECT_URI": os.getenv("GOOGLE_REDIRECT_URI", "").strip(),
        "ADMIN_EMAIL": ADMIN_EMAIL,
        "GOOGLE_DRIVE_PARENT_FOLDER_ID": PARENT_FOLDER_ID,
    }
    return [k for k, v in names.items() if not v]


def token_cipher():
    key = os.getenv("TOKEN_ENCRYPTION_KEY", "").strip()
    if not key:
        raise SetupError("TOKEN_ENCRYPTION_KEY is missing.")
    try:
        return Fernet(key.encode("ascii"))
    except (ValueError, UnicodeEncodeError):
        raise SetupError("TOKEN_ENCRYPTION_KEY is invalid.")


def load_credentials():
    if not TOKEN_PATH.is_file():
        return None
    try:
        enc = TOKEN_PATH.read_bytes()
        info = json.loads(token_cipher().decrypt(enc).decode("utf-8"))
        creds = Credentials.from_authorized_user_info(info, DRIVE_SCOPES)
    except (OSError, InvalidToken, ValueError, SetupError):
        raise SetupError("Saved Drive token is unreadable; reconnect at /admin.")
    if creds.expired and creds.refresh_token:
        try:
            creds.refresh(GoogleRequest())
            save_credentials(creds)
        except RefreshError:
            raise SetupError("Google authorization expired; reconnect at /admin.")
    if not creds.valid:
        raise SetupError("Google authorization is invalid; reconnect at /admin.")
    return creds


def save_credentials(creds):
    enc = token_cipher().encrypt(creds.to_json().encode("utf-8"))
    TOKEN_PATH.write_bytes(enc)


def drive_service(creds):
    return build("drive", "v3", credentials=creds, cache_discovery=False)


def check_parent_folder(service):
    folder = service.files().get(
        fileId=PARENT_FOLDER_ID,
        fields="id,name,mimeType,trashed,capabilities(canAddChildren),permissions(type)",
        supportsAllDrives=True,
    ).execute()
    if folder.get("trashed"):
        raise SetupError("Folder is in trash.")
    if folder.get("mimeType") != "application/vnd.google-apps.folder":
        raise SetupError("Destination is not a folder.")
    if not folder.get("capabilities", {}).get("canAddChildren"):
        raise SetupError("Cannot add files to folder.")
    if any(p.get("type") == "anyone" for p in folder.get("permissions", [])):
        raise SetupError("Folder is public; use a private folder.")
    return folder


def safe_google_error(exc):
    status = getattr(getattr(exc, "resp", None), "status", None)
    if status in (401, 403):
        return "Drive rejected authorization or permissions."
    if status == 404:
        return "Folder not found or not accessible."
    return "Drive operation failed."


@app.get("/auth/google")
def google_auth_start():
    missing = required_oauth_settings()
    if missing:
        return jsonify(error="OAuth settings incomplete.", missing=missing), 503
    if not app.config["SECRET_KEY"]:
        return jsonify(error="FLASK_SECRET_KEY missing."), 503
    cfg = {"web": {
        "client_id": os.environ["GOOGLE_OAUTH_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_OAUTH_CLIENT_SECRET"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [os.environ["GOOGLE_REDIRECT_URI"]],
    }}
    flow = Flow.from_client_config(cfg, scopes=DRIVE_SCOPES,
                                   redirect_uri=os.environ["GOOGLE_REDIRECT_URI"])
    url, state = flow.authorization_url(access_type="offline", include_granted_scopes="true",
                                         prompt="consent")
    session["oauth_state"] = state
    session.permanent = True
    return redirect(url)


@app.get("/auth/google/callback")
def google_auth_callback():
    if request.args.get("error"):
        session.pop("oauth_state", None)
        return redirect("/admin/sign-in?error=oauth_denied")
    state = session.pop("oauth_state", None)
    if not state or request.args.get("state") != state:
        return jsonify(error="OAuth state mismatch."), 400
    missing = required_oauth_settings()
    if missing:
        return jsonify(error="OAuth settings incomplete."), 503
    cfg = {"web": {
        "client_id": os.environ["GOOGLE_OAUTH_CLIENT_ID"],
        "client_secret": os.environ["GOOGLE_OAUTH_CLIENT_SECRET"],
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "redirect_uris": [os.environ["GOOGLE_REDIRECT_URI"]],
    }}
    flow = Flow.from_client_config(cfg, scopes=DRIVE_SCOPES, state=state,
                                   redirect_uri=os.environ["GOOGLE_REDIRECT_URI"])
    try:
        flow.fetch_token(authorization_response=request.url)
        creds = flow.credentials
        if not creds.token:
            raise SetupError("No access token returned.")
        info = build("oauth2", "v2", credentials=creds, cache_discovery=False).userinfo().get().execute()
        email = str(info.get("email", "")).lower()
        if not info.get("verified_email") or email != ADMIN_EMAIL:
            return "This account is not the configured admin.", 403
        check_parent_folder(drive_service(creds))
        if not os.getenv("TOKEN_ENCRYPTION_KEY"):
            raise SetupError("TOKEN_ENCRYPTION_KEY missing.")
        save_credentials(creds)
        session["admin_email"] = email
        session.permanent = True
        return redirect("/admin?connected=1")
    except (HttpError, SetupError, ValueError, OSError) as exc:
        log.exception("OAuth failed.")
        return f"Drive connection failed: {safe_google_error(exc) if isinstance(exc, HttpError) else exc}", 400


def session_has_admin():
    return bool(ADMIN_EMAIL and session.get("admin_email") == ADMIN_EMAIL)


def require_admin():
    if not session_has_admin():
        return jsonify(error="Admin sign-in required."), 401
    return None


# ============================================================
#  Static files
# ============================================================
@app.get("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.get("/<path:filename>")
def static_file(filename):
    if filename.startswith(".") or filename.startswith("server") or filename.startswith("requirements"):
        return "Not found", 404
    allowed = {
        "index.html", "styles.css", "app.js", "accounts.js",
        "admin.html", "admin-sign-in.html", "requests.html", "requests.js",
        "owner.html", "owner.js", "track.html",
        "lion-logo.svg", "تصميم بدون عنوان.png",
    }
    if filename not in allowed:
        return "Not found", 404
    return send_from_directory(ROOT, filename)


# ============================================================
#  Auth endpoints
# ============================================================
@app.get("/api/auth/csrf")
def auth_csrf():
    token = session.get("csrf_token")
    if not token:
        token = secrets.token_urlsafe(32)
        session["csrf_token"] = token
    return jsonify(csrfToken=token)


@app.get("/api/auth/status")
def auth_status():
    with get_db() as db:
        owner_exists = db.execute(
            "SELECT 1 FROM accounts WHERE role='owner' LIMIT 1"
        ).fetchone() is not None
    acc = current_account()
    return jsonify(
        authenticated=acc is not None,
        account=account_payload(acc) if acc else None,
        ownerSetupAvailable=not owner_exists and bool(OWNER_SETUP_TOKEN),
        registrationAvailable=owner_exists,
    )


@app.post("/api/auth/register")
def register():
    data = request.get_json(silent=True)
    errors = validate_account_fields(data, require_country=True)
    if not isinstance(data, dict):
        return jsonify(error="Invalid data.", details=errors), 400
    if data.get("ageConfirmed") is not True:
        errors.append("Confirm age 10+.")
    if data.get("privacyAccepted") is not True:
        errors.append("Accept privacy policy.")
    if errors:
        return jsonify(error="Fix account details.", details=errors), 400
    if rate_limit(AUTH_RATE, f"{request.remote_addr}:{data.get('email')}", 900, 10):
        return jsonify(error="Too many attempts."), 429
    with get_db() as db:
        if not db.execute("SELECT 1 FROM accounts WHERE role='owner'").fetchone():
            return jsonify(error="Owner setup required first."), 503
    try:
        acc = create_account(data["name"], data["email"], data["password"], country=data["country"])
    except sqlite3.IntegrityError:
        return jsonify(error="Email already registered."), 409
    set_session(acc["id"])
    return jsonify(account=account_payload(acc)), 201


@app.post("/api/auth/login")
def login():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Enter email and password."), 400
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if rate_limit(AUTH_RATE, f"{request.remote_addr}:{email}", 900, 10):
        return jsonify(error="Too many attempts."), 429
    with get_db() as db:
        row = db.execute(
            "SELECT id, password_hash, active FROM accounts WHERE email = ? COLLATE NOCASE",
            (email,),
        ).fetchone()
    if not row or not row["active"] or not check_password_hash(row["password_hash"], password):
        return jsonify(error="Invalid email or password."), 401
    set_session(row["id"])
    acc = get_account(row["id"])
    return jsonify(account=account_payload(acc))


@app.post("/api/auth/owner-setup")
def owner_setup():
    data = request.get_json(silent=True)
    errors = validate_account_fields(data)
    if not isinstance(data, dict):
        return jsonify(error="Invalid data.", details=errors), 400
    if data.get("ageConfirmed") is not True:
        errors.append("Confirm age 10+.")
    if data.get("privacyAccepted") is not True:
        errors.append("Accept privacy policy.")
    if errors:
        return jsonify(error="Fix details.", details=errors), 400
    if not OWNER_SETUP_TOKEN:
        return jsonify(error="Owner setup disabled. Set OWNER_SETUP_TOKEN."), 503
    if not secrets.compare_digest(str(data.get("setupToken", "")), OWNER_SETUP_TOKEN):
        return jsonify(error="Invalid setup code."), 403
    with get_db() as db:
        if db.execute("SELECT 1 FROM accounts WHERE role='owner'").fetchone():
            return jsonify(error="Owner already exists."), 409
    try:
        acc = create_account(data["name"], data["email"], data["password"], role="owner")
    except sqlite3.IntegrityError:
        return jsonify(error="Email already exists."), 409
    set_session(acc["id"])
    return jsonify(account=account_payload(acc)), 201


@app.post("/api/auth/logout")
def logout():
    session.pop("account_id", None)
    session.pop("csrf_token", None)
    return jsonify(signedOut=True)


# ============================================================
#  AI conversations (Gemini)
# ============================================================
def gemini_reply(context, messages):
    if not GEMINI_API_KEY:
        raise AIServiceError("AI assistant not configured.")
    if not re.fullmatch(r"[A-Za-z0-9._-]{1,80}", GEMINI_MODEL):
        raise AIServiceError("AI model config invalid.")

    system = (
        "You are the Teacher Karkar request-intake assistant. Help the user describe "
        "the educational materials they need. Ask one short, relevant follow-up at a time. "
        "Use the request details and prior answers. Focus on useful requirements such as "
        "key points, audience, duration, sources. Do NOT ask for passwords, contacts, or "
        "unnecessary personal data. Reply in the requested language. Be concise.\n"
        "Context: " + json.dumps(context, ensure_ascii=False)
    )
    contents = [
        {"role": "model" if m["sender"] == "assistant" else "user",
         "parts": [{"text": m["content"]}]}
        for m in messages[-24:]
    ]
    if not contents:
        contents = [{"role": "user", "parts": [{"text":
            "Greet the requester briefly and ask the first useful follow-up question."}]}]
    payload = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": contents,
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 220},
    }
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
    req = UrlRequest(url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY},
        method="POST")
    try:
        with urlopen(req, timeout=30) as r:
            body = r.read(1024 * 1024 + 1)
        if len(body) > 1024 * 1024:
            raise AIServiceError("AI response too large.")
        result = json.loads(body.decode("utf-8"))
    except HTTPError as exc:
        log.warning("Gemini HTTP %s", exc.code)
        raise AIServiceError("AI temporarily unavailable.")
    except (URLError, OSError, ValueError):
        raise AIServiceError("AI unavailable.")
    try:
        parts = result["candidates"][0]["content"]["parts"]
        text = "\n".join(p["text"] for p in parts if isinstance(p, dict) and isinstance(p.get("text"), str)).strip()
    except (IndexError, KeyError, TypeError):
        raise AIServiceError("AI returned invalid response.")
    if not text or len(text) > 4000:
        raise AIServiceError("AI returned invalid response.")
    return text


def clean_context(value):
    if not isinstance(value, dict):
        raise ValueError("Request details missing.")
    role = value.get("role")
    stage = value.get("stage")
    rt = value.get("requestType")
    lang = value.get("presentationLanguage")
    dels = value.get("deliverables")
    if role not in ROLES:
        raise ValueError("Invalid role.")
    if stage not in STAGES:
        raise ValueError("Invalid stage.")
    if role == "student":
        st = value.get("studentType")
        if st is None:
            st = "university" if stage == "university" else "school"
        if st not in ("school", "university"):
            raise ValueError("Invalid student type.")
    expected = {"teacher": {"teacher_lesson"}, "student": STUDENT_TYPES, "other": {"professional"}}
    if rt not in expected[role]:
        raise ValueError("Invalid request type.")
    if lang not in LANGS:
        raise ValueError("Invalid language.")
    if not (isinstance(dels, list) and 1 <= len(dels) <= len(DELIVERABLES)
            and all(isinstance(d, str) and d in DELIVERABLES for d in dels)
            and len(set(dels)) == len(dels)):
        raise ValueError("Invalid deliverables.")
    topic = str(value.get("topic", "")).strip()
    objective = str(value.get("objective", "")).strip()
    if not topic or len(topic) > 1200 or len(objective) > 500:
        raise ValueError("Invalid topic/objective.")
    ctx = {
        "role": role, "stage": stage, "requestType": rt,
        "deliverables": dels, "topic": topic,
        "objective": objective, "presentationLanguage": lang,
    }
    if role == "student":
        ctx["studentType"] = st
    if role == "other":
        prof = value.get("profession")
        if prof not in PROFESSIONS:
            raise ValueError("Invalid profession.")
        ctx["profession"] = prof
        if prof == "other":
            po = str(value.get("professionOther", "")).strip()
            if not po or len(po) > 120:
                raise ValueError("Invalid profession details.")
            ctx["professionOther"] = po
    return ctx


@app.post("/api/conversations")
def create_conversation():
    acc, err = require_account()
    if err:
        return err
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Missing data."), 400
    if data.get("aiConsent") is not True:
        return jsonify(error="AI consent required."), 400
    try:
        ctx = clean_context(data.get("context"))
    except ValueError as exc:
        return jsonify(error=str(exc)), 400
    if rate_limit(AI_RATE, acc["id"], 900, 30):
        return jsonify(error="Too many AI messages."), 429
    try:
        reply = gemini_reply(ctx, [])
    except AIServiceError as exc:
        return jsonify(error=str(exc)), 503
    cid = uuid.uuid4().hex
    now = now_iso()
    try:
        with get_db() as db:
            db.execute(
                """INSERT INTO conversations
                   (id, account_id, title, context_json, ai_consent_at, created_at, updated_at)
                   VALUES (?,?,?,?,?,?,?)""",
                (cid, acc["id"], ctx["topic"][:160],
                 json.dumps(ctx, ensure_ascii=False), now, now, now),
            )
            db.execute(
                "INSERT INTO conversation_messages (conversation_id, sender, content, created_at) VALUES (?, 'assistant', ?, ?)",
                (cid, reply, now),
            )
    except sqlite3.Error:
        log.exception("Conversation save failed.")
        return jsonify(error="Could not save conversation."), 503
    return jsonify(conversationId=cid, reply=reply), 201


@app.post("/api/conversations/<conversation_id>/reply")
def conversation_reply(conversation_id):
    acc, err = require_account()
    if err:
        return err
    data = request.get_json(silent=True)
    content = str(data.get("content", "")).strip() if isinstance(data, dict) else ""
    if not content or len(content) > 2000:
        return jsonify(error="Message 1–2000 chars."), 400
    if rate_limit(AI_RATE, acc["id"], 900, 30):
        return jsonify(error="Too many AI messages."), 429
    with get_db() as db:
        conv = db.execute(
            "SELECT account_id, context_json, ai_consent_at FROM conversations WHERE id = ?",
            (conversation_id,),
        ).fetchone()
        if not conv:
            return jsonify(error="Conversation not found."), 404
        if conv["account_id"] != acc["id"]:
            return jsonify(error="Not your conversation."), 403
        if not conv["ai_consent_at"]:
            return jsonify(error="AI consent missing."), 403
        try:
            ctx = json.loads(conv["context_json"])
        except json.JSONDecodeError:
            return jsonify(error="Conversation corrupted."), 500
        msgs = [
            {"sender": r["sender"], "content": r["content"]}
            for r in db.execute(
                "SELECT sender, content FROM conversation_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 24",
                (conversation_id,),
            ).fetchall()[::-1]
        ]
    msgs.append({"sender": "user", "content": content})
    try:
        reply = gemini_reply(ctx, msgs)
    except AIServiceError as exc:
        return jsonify(error=str(exc)), 503
    now = now_iso()
    with get_db() as db:
        db.execute(
            "INSERT INTO conversation_messages (conversation_id, sender, content, created_at) VALUES (?, 'user', ?, ?), (?, 'assistant', ?, ?)",
            (conversation_id, content, now, conversation_id, reply, now),
        )
        db.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conversation_id))
    return jsonify(reply=reply), 201


# ============================================================
#  Drive helpers
# ============================================================
def read_drive_json(service, file_id):
    buf = io.BytesIO()
    dl = MediaIoBaseDownload(buf, service.files().get_media(fileId=file_id))
    done = False
    while not done:
        _, done = dl.next_chunk()
    meta = json.loads(buf.getvalue().decode("utf-8"))
    if not isinstance(meta, dict):
        raise ValueError("Invalid metadata.")
    return meta


def find_drive_request(service, request_id):
    if not re.fullmatch(r"MK-\d{8}-[A-F0-9]{10}", request_id):
        return None
    folders = service.files().list(
        q=f"'{PARENT_FOLDER_ID}' in parents and name = '{request_id}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        pageSize=1, fields="files(id,name)",
        supportsAllDrives=True, includeItemsFromAllDrives=True,
    ).execute().get("files", [])
    if not folders:
        return None
    folder = folders[0]
    mfiles = service.files().list(
        q=f"'{folder['id']}' in parents and name = 'request.json' and trashed = false",
        pageSize=1, fields="files(id)",
        supportsAllDrives=True, includeItemsFromAllDrives=True,
    ).execute().get("files", [])
    if not mfiles:
        return None
    return {"folder": folder, "metadataFile": mfiles[0],
            "metadata": read_drive_json(service, mfiles[0]["id"])}


def list_drive_requests(service, limit=200):
    results = []
    page = None
    while len(results) < limit:
        resp = service.files().list(
            q=f"'{PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            orderBy="createdTime desc",
            pageSize=min(100, limit - len(results)),
            pageToken=page,
            fields="nextPageToken,files(id,name,createdTime)",
            supportsAllDrives=True, includeItemsFromAllDrives=True,
        ).execute()
        for folder in resp.get("files", []):
            if not re.fullmatch(r"MK-\d{8}-[A-F0-9]{10}", folder.get("name", "")):
                continue
            mf = service.files().list(
                q=f"'{folder['id']}' in parents and name = 'request.json' and trashed = false",
                pageSize=1, fields="files(id)",
                supportsAllDrives=True, includeItemsFromAllDrives=True,
            ).execute().get("files", [])
            if not mf:
                continue
            try:
                meta = read_drive_json(service, mf[0]["id"])
            except Exception:
                continue
            meta["requestId"] = folder["name"]
            meta["folderCreatedAt"] = folder.get("createdTime")
            meta["_metadataFileId"] = mf[0]["id"]
            results.append(meta)
            if len(results) >= limit:
                break
        page = resp.get("nextPageToken")
        if not page:
            break
    return results


def upload_stream(service, parent_id, name, mime, stream, size):
    media = MediaIoBaseUpload(stream, mimetype=mime or "application/octet-stream",
                              chunksize=UPLOAD_CHUNK_BYTES, resumable=True)
    r = service.files().create(
        body={"name": name, "parents": [parent_id]},
        media_body=media,
        fields="id,name,mimeType,size",
        supportsAllDrives=True,
    ).execute()
    r["size"] = int(r.get("size", size))
    return r


# ============================================================
#  Requests (submission)
# ============================================================
def validate_submission(data, uploads):
    errors = []
    if not isinstance(data, dict):
        return ["Invalid payload."]
    if not str(data.get("name", "")).strip():
        errors.append("Name required.")
    email = str(data.get("email", "")).strip()
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        errors.append("Valid email required.")
    if data.get("ageConfirmed") is not True:
        errors.append("Age confirmation required.")
    if data.get("consent") is not True:
        errors.append("Consent required.")
    if data.get("role") not in ROLES:
        errors.append("Invalid role.")
    if data.get("stage") not in STAGES:
        errors.append("Invalid stage.")
    if data.get("role") == "student":
        st = data.get("studentType")
        if st is not None and st not in ("school", "university"):
            errors.append("Invalid student type.")
        elif st == "school" and data.get("stage") == "university":
            errors.append("School student cannot be university.")
        elif st == "university" and data.get("stage") != "university":
            errors.append("University student must select university stage.")
    if data.get("countryScope") not in COUNTRIES:
        errors.append("Invalid country scope.")
    if data.get("schoolStatus") not in SCHOOL_STATUSES:
        errors.append("Invalid school status.")
    if data.get("schoolStatus") in ("school", "other") and not str(data.get("schoolName", "")).strip():
        errors.append("School name required.")
    if data.get("role") == "student" and data.get("requestType") not in STUDENT_TYPES:
        errors.append("Invalid request type.")
    if data.get("role") == "teacher" and data.get("requestType") != "teacher_lesson":
        errors.append("Invalid teacher request type.")
    if data.get("role") == "other":
        if data.get("requestType") != "professional":
            errors.append("Invalid professional request type.")
        if data.get("profession") not in PROFESSIONS:
            errors.append("Invalid profession.")
        if data.get("profession") == "other" and not str(data.get("professionOther", "")).strip():
            errors.append("Profession details required.")
    dels = data.get("deliverables")
    if not (isinstance(dels, list) and 1 <= len(dels) <= len(DELIVERABLES)
            and all(isinstance(d, str) and d in DELIVERABLES for d in dels)
            and len(set(dels)) == len(dels)):
        errors.append("Invalid deliverables.")
    if not str(data.get("topic", "")).strip() or len(str(data.get("topic", ""))) > 1200:
        errors.append("Topic required (max 1200).")
    if data.get("presentationLanguage") not in LANGS:
        errors.append("Invalid language.")
    has_slides = isinstance(dels, list) and bool({"presentation", "slide_deck"} & set(dels))
    if has_slides and data.get("format") not in ("pdf", "pptx"):
        errors.append("Invalid format.")
    if data.get("method") not in ("assistant", "guided"):
        errors.append("Invalid method.")
    cid = data.get("conversationId")
    if data.get("method") == "assistant" and (not isinstance(cid, str) or not re.fullmatch(r"[0-9a-f]{32}", cid)):
        errors.append("Complete AI conversation first.")
    if len(uploads) > MAX_FILES:
        errors.append(f"Max {MAX_FILES} files.")
    for u in uploads:
        if not u.filename:
            errors.append("File with no name.")
            continue
        if u.mimetype and u.mimetype.lower().startswith("video/"):
            errors.append("Video files not accepted.")
        try:
            pos = u.stream.tell()
            u.stream.seek(0, os.SEEK_END)
            size = u.stream.tell()
            u.stream.seek(pos)
        except (OSError, AttributeError):
            size = u.content_length or 0
        if size > MAX_FILE_BYTES:
            errors.append(f"{u.filename} exceeds 50 MB.")
        if re.search(r"\.(mp4|mov|avi|mkv|webm|m4v|mpeg|mpg|3gp|wmv|flv)$", u.filename, re.I):
            errors.append("Video files not accepted.")
    vo = data.get("videoOption", "none")
    if vo not in ("none", "link", "review"):
        errors.append("Invalid video option.")
    if vo == "link" and not re.fullmatch(r"https://[^\s]{1,2000}", str(data.get("videoUrl", ""))):
        errors.append("HTTPS video URL required.")
    return errors


def clean_submission(data):
    keys = ("name", "email", "phone", "countryScope", "schoolStatus", "schoolName",
            "stage", "role", "studentType", "requestType", "profession", "professionOther",
            "deliverables", "topic", "objective", "method", "focusDetails", "audience",
            "duration", "slideCount", "presentationLanguage", "format", "notes",
            "conversationId", "videoOption", "videoUrl")
    out = {k: data.get(k) for k in keys if k in data}
    if out.get("role") == "student":
        out["studentType"] = out.get("studentType") or ("university" if out.get("stage") == "university" else "school")
    else:
        out.pop("studentType", None)
    if out.get("role") != "other":
        out.pop("profession", None)
        out.pop("professionOther", None)
    elif out.get("professionOther"):
        out["professionOther"] = str(out["professionOther"]).strip()
    if out.get("method") != "assistant":
        out.pop("conversationId", None)
    if not ({"presentation", "slide_deck"} & set(out.get("deliverables", []))):
        out.pop("slideCount", None)
        out.pop("format", None)
    out["name"] = str(out.get("name", "")).strip()
    out["email"] = str(out.get("email", "")).strip().lower()
    out["receivedAt"] = now_iso()
    return out


@app.post("/api/requests")
def create_request():
    acc, err = require_account()
    if err:
        return err
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID:
        return jsonify(error="Drive intake not configured."), 503
    if not TOKEN_PATH.exists():
        return jsonify(error="Drive not authorized."), 503
    if rate_limit(RATE, request.remote_addr or "?", 3600, 20):
        return jsonify(error="Too many requests."), 429
    raw = request.form.get("requestData", "")
    try:
        data = json.loads(raw)
    except (TypeError, json.JSONDecodeError):
        return jsonify(error="Invalid request data."), 400
    if not isinstance(data, dict):
        return jsonify(error="Invalid request data."), 400
    uploads = request.files.getlist("attachments")
    data["name"] = acc["name"]
    data["email"] = acc["email"]
    errors = validate_submission(data, uploads)
    if errors:
        return jsonify(error="Fix request.", details=errors), 400
    if data.get("method") == "assistant":
        with get_db() as db:
            conv = db.execute(
                "SELECT account_id, ai_consent_at FROM conversations WHERE id = ?",
                (data.get("conversationId"),),
            ).fetchone()
        if not conv or conv["account_id"] != acc["id"] or not conv["ai_consent_at"]:
            return jsonify(error="Complete your AI conversation first."), 400
    try:
        creds = load_credentials()
        service = drive_service(creds)
        check_parent_folder(service)
        rid = datetime.now(timezone.utc).strftime("MK-%Y%m%d-") + uuid.uuid4().hex[:10].upper()
        folder = service.files().create(
            body={"name": rid, "mimeType": "application/vnd.google-apps.folder", "parents": [PARENT_FOLDER_ID]},
            fields="id,name", supportsAllDrives=True,
        ).execute()
        cleaned = clean_submission(data)
        cleaned["accountId"] = acc["id"]
        uploaded = []
        upload_error = None
        for u in uploads:
            safe = Path(u.filename.replace("\\", "/")).name[:180]
            try:
                r = upload_stream(service, folder["id"], safe,
                                  u.mimetype or "application/octet-stream",
                                  u.stream, u.content_length or 0)
                uploaded.append({"name": r.get("name"), "driveFileId": r.get("id"),
                                 "size": r.get("size"), "mimeType": r.get("mimeType")})
            except (HttpError, OSError, ValueError) as exc:
                upload_error = exc
                log.exception("Upload failed for %s", rid)
                break
        meta = {
            "requestId": rid,
            "status": "received" if not upload_error else "partial_upload",
            "request": cleaned,
            "attachments": uploaded,
            "receivedAt": cleaned["receivedAt"],
        }
        data_bytes = json.dumps(meta, ensure_ascii=False, indent=2).encode("utf-8")
        upload_stream(service, folder["id"], "request.json",
                      "application/json; charset=utf-8", io.BytesIO(data_bytes), len(data_bytes))
        if upload_error:
            return jsonify(error="Some files failed to upload.", requestId=rid,
                           uploadedFiles=len(uploaded)), 502
        return jsonify(requestId=rid, status="received"), 201
    except (SetupError, HttpError, OSError, ValueError) as exc:
        log.exception("Request intake failed.")
        msg = safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)
        return jsonify(error=msg), 502


@app.get("/api/requests")
def list_requests():
    acc, err = require_permission("view_requests")
    if err:
        return err
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID or not TOKEN_PATH.exists():
        return jsonify(error="Drive not configured."), 503
    try:
        items = list_drive_requests(drive_service(load_credentials()))
    except (SetupError, HttpError, OSError, ValueError) as exc:
        log.exception("List requests failed.")
        return jsonify(error=safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)), 502
    summaries = []
    for item in items:
        r = item.get("request", {})
        if not isinstance(r, dict):
            continue
        summaries.append({
            "requestId": item.get("requestId"),
            "status": item.get("status", "received"),
            "receivedAt": item.get("receivedAt") or item.get("folderCreatedAt"),
            "name": r.get("name", ""),
            "email": r.get("email", ""),
            "topic": r.get("topic", ""),
            "role": r.get("role", ""),
            "stage": r.get("stage", ""),
            "attachmentCount": len(item.get("attachments", [])),
        })
    return jsonify(
        requests=summaries,
        canUpdate=acc["role"] == "owner" or acc["permissions"].get("update_requests", False),
    )


@app.get("/api/requests/<request_id>")
def get_request(request_id):
    _, err = require_permission("view_requests")
    if err:
        return err
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID or not TOKEN_PATH.exists():
        return jsonify(error="Drive not configured."), 503
    try:
        rec = find_drive_request(drive_service(load_credentials()), request_id)
    except (SetupError, HttpError, OSError, ValueError) as exc:
        return jsonify(error=safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)), 502
    if not rec:
        return jsonify(error="Request not found."), 404
    m = rec["metadata"]
    return jsonify(request={
        "requestId": m.get("requestId", request_id),
        "status": m.get("status", "received"),
        "receivedAt": m.get("receivedAt"),
        "request": m.get("request", {}),
        "attachments": m.get("attachments", []),
    })


@app.patch("/api/requests/<request_id>")
def update_request(request_id):
    acc, err = require_permission("update_requests")
    if err:
        return err
    data = request.get_json(silent=True)
    status = data.get("status") if isinstance(data, dict) else None
    if status not in STATUSES:
        return jsonify(error="Invalid status."), 400
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID or not TOKEN_PATH.exists():
        return jsonify(error="Drive not configured."), 503
    try:
        service = drive_service(load_credentials())
        rec = find_drive_request(service, request_id)
        if not rec:
            return jsonify(error="Request not found."), 404
        rec["metadata"]["status"] = status
        rec["metadata"]["updatedAt"] = now_iso()
        rec["metadata"]["updatedBy"] = acc["id"]
        data_bytes = json.dumps(rec["metadata"], ensure_ascii=False, indent=2).encode("utf-8")
        media = MediaIoBaseUpload(io.BytesIO(data_bytes), mimetype="application/json; charset=utf-8", resumable=False)
        service.files().update(fileId=rec["metadataFile"]["id"], media_body=media,
                                fields="id", supportsAllDrives=True).execute()
    except (SetupError, HttpError, OSError, ValueError) as exc:
        return jsonify(error=safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)), 502
    return jsonify(updated=True, status=status)


@app.get("/api/requests/<request_id>/attachments/<file_id>")
def download_attachment(request_id, file_id):
    _, err = require_permission("view_requests")
    if err:
        return err
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID or not TOKEN_PATH.exists():
        return jsonify(error="Drive not configured."), 503
    try:
        service = drive_service(load_credentials())
        rec = find_drive_request(service, request_id)
        if not rec:
            return jsonify(error="Request not found."), 404
        att = next((f for f in rec["metadata"].get("attachments", []) if f.get("driveFileId") == file_id), None)
        if not att:
            return jsonify(error="Attachment not found."), 404
        buf = io.BytesIO()
        dl = MediaIoBaseDownload(buf, service.files().get_media(fileId=file_id, supportsAllDrives=True))
        done = False
        while not done:
            _, done = dl.next_chunk()
        buf.seek(0)
        resp = send_file(buf, mimetype="application/octet-stream", as_attachment=True,
                         download_name=Path(str(att.get("name", "file"))).name, max_age=0)
        resp.headers["Cache-Control"] = "private, no-store"
        return resp
    except (SetupError, HttpError, OSError, ValueError) as exc:
        return jsonify(error=safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)), 502


@app.get("/api/requests/track/<request_id>")
def track_public(request_id):
    """Public read-only tracking (no auth, rate-limited)."""
    if rate_limit(TRACK_RATE, request.remote_addr or "?", 60, 10):
        return jsonify(error="Too many attempts."), 429
    if not re.fullmatch(r"MK-\d{8}-[A-F0-9]{10}", request_id):
        return jsonify(error="Request not found."), 404
    if not ADMIN_EMAIL or not PARENT_FOLDER_ID or not TOKEN_PATH.exists():
        return jsonify(error="Tracking unavailable."), 503
    try:
        rec = find_drive_request(drive_service(load_credentials()), request_id)
    except Exception:
        return jsonify(error="Tracking unavailable."), 502
    if not rec:
        return jsonify(error="Request not found."), 404
    m = rec["metadata"]
    r = m.get("request", {})
    return jsonify({
        "requestId": m.get("requestId", request_id),
        "status": m.get("status", "received"),
        "receivedAt": m.get("receivedAt"),
        "updatedAt": m.get("updatedAt"),
        "topic": r.get("topic", ""),
        "stage": r.get("stage", ""),
        "requestType": r.get("requestType", ""),
    })


# ============================================================
#  Owner endpoints
# ============================================================
@app.get("/api/owner/accounts")
def owner_list_accounts():
    _, err = require_owner()
    if err:
        return err
    with get_db() as db:
        rows = db.execute(
            "SELECT id, email, name, role, permissions, active, country, created_at FROM accounts ORDER BY created_at"
        ).fetchall()
    return jsonify(
        accounts=[{
            "id": r["id"], "email": r["email"], "name": r["name"], "role": r["role"],
            "permissions": json.loads(r["permissions"] or "{}"),
            "active": bool(r["active"]), "country": r["country"],
            "createdAt": r["created_at"],
        } for r in rows],
        permissionKeys=PERMISSION_KEYS,
    )


@app.post("/api/owner/accounts")
def owner_create_account():
    owner, err = require_owner()
    if err:
        return err
    data = request.get_json(silent=True)
    errors = validate_account_fields(data)
    if not isinstance(data, dict):
        return jsonify(error="Invalid data.", details=errors), 400
    role = data.get("role")
    if role not in {"admin", "circle"}:
        errors.append("Role must be admin or circle.")
    perms = data.get("permissions", {})
    if role == "admin":
        if not isinstance(perms, dict):
            errors.append("Permissions must be dict.")
        else:
            perms = {k: bool(perms.get(k, False)) for k in PERMISSION_KEYS}
    else:
        perms = {}
    if errors:
        return jsonify(error="Fix details.", details=errors), 400
    try:
        acc = create_account(data["name"], data["email"], data["password"], role, perms)
    except sqlite3.IntegrityError:
        return jsonify(error="Email exists."), 409
    return jsonify(account=account_payload(acc)), 201


@app.patch("/api/owner/accounts/<account_id>")
def owner_update_account(account_id):
    owner, err = require_owner()
    if err:
        return err
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify(error="Invalid data."), 400
    with get_db() as db:
        target = db.execute("SELECT id, role FROM accounts WHERE id=?", (account_id,)).fetchone()
        if not target:
            return jsonify(error="Account not found."), 404
        if target["role"] == "owner":
            return jsonify(error="Cannot modify owner."), 403
        role = data.get("role", target["role"])
        if role not in {"admin", "circle", "user"}:
            return jsonify(error="Invalid role."), 400
        perms = data.get("permissions")
        if role == "admin":
            if perms is None:
                perms = json.loads(db.execute("SELECT permissions FROM accounts WHERE id=?", (account_id,)).fetchone()["permissions"] or "{}")
            if not isinstance(perms, dict):
                return jsonify(error="Invalid permissions."), 400
            perms = {k: bool(perms.get(k, False)) for k in PERMISSION_KEYS}
        else:
            perms = {}
        active = data.get("active", True)
        if not isinstance(active, bool):
            return jsonify(error="Active must be bool."), 400
        db.execute(
            "UPDATE accounts SET role=?, permissions=?, active=?, updated_at=? WHERE id=?",
            (role, json.dumps(perms, separators=(",", ":")), int(active), now_iso(), account_id),
        )
    return jsonify(updated=True)


@app.get("/api/conversations")
def list_conversations():
    acc, err = require_account()
    if err:
        return err
    may_all = acc["role"] == "owner" or acc["permissions"].get("view_conversations")
    with get_db() as db:
        if may_all:
            rows = db.execute("""
                SELECT c.id, c.account_id, c.title, c.created_at, c.updated_at, a.name, a.email,
                       COUNT(m.id) AS cnt
                FROM conversations c
                JOIN accounts a ON a.id = c.account_id
                LEFT JOIN conversation_messages m ON m.conversation_id = c.id
                GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 200
            """).fetchall()
        else:
            rows = db.execute("""
                SELECT c.id, c.account_id, c.title, c.created_at, c.updated_at, a.name, a.email,
                       COUNT(m.id) AS cnt
                FROM conversations c
                JOIN accounts a ON a.id = c.account_id
                LEFT JOIN conversation_messages m ON m.conversation_id = c.id
                WHERE c.account_id = ?
                GROUP BY c.id ORDER BY c.updated_at DESC LIMIT 200
            """, (acc["id"],)).fetchall()
    return jsonify(
        conversations=[{
            "id": r["id"], "accountId": r["account_id"], "accountName": r["name"],
            "accountEmail": r["email"] if may_all else None,
            "title": r["title"], "messageCount": r["cnt"],
            "createdAt": r["created_at"], "updatedAt": r["updated_at"],
        } for r in rows],
        canViewAll=may_all,
    )


@app.get("/api/conversations/<conversation_id>")
def read_conversation(conversation_id):
    acc, err = require_account()
    if err:
        return err
    may_all = acc["role"] == "owner" or acc["permissions"].get("view_conversations")
    with get_db() as db:
        c = db.execute("""
            SELECT c.id, c.account_id, c.title, c.created_at, c.updated_at, a.name, a.email
            FROM conversations c JOIN accounts a ON a.id = c.account_id WHERE c.id = ?
        """, (conversation_id,)).fetchone()
        if not c:
            return jsonify(error="Not found."), 404
        if c["account_id"] != acc["id"] and not may_all:
            return jsonify(error="Forbidden."), 403
        msgs = db.execute(
            "SELECT sender, content, created_at FROM conversation_messages WHERE conversation_id = ? ORDER BY id",
            (conversation_id,),
        ).fetchall()
    return jsonify(conversation={
        "id": c["id"], "accountName": c["name"],
        "accountEmail": c["email"] if may_all else None,
        "title": c["title"], "createdAt": c["created_at"], "updatedAt": c["updated_at"],
        "messages": [{"sender": m["sender"], "content": m["content"], "createdAt": m["created_at"]} for m in msgs],
    })


# ============================================================
#  Admin / setup / config
# ============================================================
@app.get("/api/setup/status")
def setup_status():
    missing = required_oauth_settings()
    return jsonify(configured=not missing, missing=missing, authorized=TOKEN_PATH.exists())


@app.get("/api/admin/drive-status")
def admin_drive_status():
    err = require_admin()
    if err:
        return err
    missing = required_oauth_settings()
    connected = False
    folder_name = None
    if not missing and TOKEN_PATH.exists():
        try:
            creds = load_credentials()
            folder = check_parent_folder(drive_service(creds))
            connected = True
            folder_name = folder.get("name")
        except (SetupError, HttpError) as exc:
            return jsonify(error=safe_google_error(exc) if isinstance(exc, HttpError) else str(exc)), 502
    return jsonify(configured=not missing, missing=missing, connected=connected,
                   adminEmail=ADMIN_EMAIL, folderName=folder_name)


@app.get("/api/site-config")
def site_config():
    return jsonify(feedbackFormUrl=FEEDBACK_FORM_URL)


@app.get("/api/health")
def health():
    return jsonify(status="ready")


# ============================================================
#  Admin pages
# ============================================================
@app.get("/admin")
def admin_page():
    if not session_has_admin():
        return redirect("/admin/sign-in")
    return send_from_directory(ROOT, "admin.html")


@app.get("/admin/sign-in")
def admin_sign_in():
    return send_from_directory(ROOT, "admin-sign-in.html")


@app.get("/owner")
def owner_page():
    acc, err = require_owner()
    if err:
        return redirect("/?account=required")
    return send_from_directory(ROOT, "owner.html")


@app.get("/requests")
def requests_page():
    acc = current_account()
    if not acc:
        return redirect("/?account=login")
    if acc["role"] != "owner" and not (acc["role"] == "admin" and acc["permissions"].get("view_requests")):
        return "Forbidden.", 403
    return send_from_directory(ROOT, "requests.html")


# ============================================================
#  CLI
# ============================================================
def prepare_env_file():
    env_path = ROOT / ".env"
    if env_path.exists():
        print(".env already exists — no changes made.")
        return
    key = Fernet.generate_key().decode("ascii")
    env_path.write_text("\n".join([
        "APP_ENV=development",
        "HOST=127.0.0.1",
        "PORT=8000",
        f"FLASK_SECRET_KEY={secrets.token_urlsafe(48)}",
        f"TOKEN_ENCRYPTION_KEY={key}",
        "GOOGLE_OAUTH_CLIENT_ID=",
        "GOOGLE_OAUTH_CLIENT_SECRET=",
        "GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback",
        "GOOGLE_DRIVE_PARENT_FOLDER_ID=",
        "ADMIN_EMAIL=",
        "GEMINI_API_KEY=",
        "GEMINI_MODEL=gemini-2.5-flash",
        "OWNER_SETUP_TOKEN=",
        "FEEDBACK_FORM_URL=",
        "",
    ]), encoding="utf-8")
    print("Created .env — fill in OAuth and admin email.")


def main():
    parser = argparse.ArgumentParser(description="Teacher Karkar site.")
    parser.add_argument("--init-secrets", action="store_true")
    parser.add_argument("--create-owner", action="store_true")
    args = parser.parse_args()
    if args.init_secrets:
        prepare_env_file()
        return
    if args.create_owner:
        with get_db() as db:
            if db.execute("SELECT 1 FROM accounts WHERE role='owner'").fetchone():
                print("Owner already exists.")
                sys.exit(1)
        name = input("Owner name: ").strip()
        email = input("Owner email: ").strip().lower()
        password = getpass("Password (12+ chars): ")
        errors = validate_account_fields({"name": name, "email": email, "password": password})
        if errors:
            for e in errors:
                print(e, file=sys.stderr)
            sys.exit(2)
        try:
            create_account(name, email, password, role="owner")
        except sqlite3.IntegrityError:
            print("Email exists.", file=sys.stderr)
            sys.exit(1)
        print("Owner created.")
        return
    if not app.config["SECRET_KEY"]:
        print("FLASK_SECRET_KEY missing. Run: py server.py --init-secrets", file=sys.stderr)
        sys.exit(2)
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    app.run(host=host, port=port, debug=False, threaded=True)


if __name__ == "__main__":
    main()
