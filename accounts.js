(() => {
  const languages = [
    ["ar","العربية"],["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["pt","Português"],
    ["ru","Русский"],["zh","中文"],["ja","日本語"],["ko","한국어"],["hi","हिन्दी"],["bn","বাংলা"],
    ["ur","اردو"],["tr","Türkçe"],["id","Bahasa Indonesia"],["ms","Bahasa Melayu"],["th","ไทย"],["vi","Tiếng Việt"],
    ["fa","فارسی"],["he","עברית"],["nl","Nederlands"],["it","Italiano"],["pl","Polski"],["uk","Українська"],
    ["el","Ελληνικά"],["sv","Svenska"],["no","Norsk"],["da","Dansk"],["fi","Suomi"],["cs","Čeština"],
    ["ro","Română"],["hu","Magyar"],["sw","Kiswahili"],["am","አማርኛ"],["yo","Yorùbá"],["ha","Hausa"],
    ["zu","isiZulu"],["ta","தமிழ்"],["te","తెలుగు"],["mr","मराठी"],["pa","ਪੰਜਾਬੀ"],["gu","ગુજરાતી"],
    ["kn","ಕನ್ನಡ"],["ml","മലയാളം"],["si","සිංහල"],["ne","नेपाली"],["fil","Filipino"],["ps","پښتو"],
    ["hr","Hrvatski"],["sr","Српски"]
  ];

  const sharedTranslations = {
    ar: {
      interfaceLanguageLabel:"لغة واجهة الموقع", interfaceArabic:"العربية", interfaceEnglish:"English", otherLanguages:"لغات أخرى",
      siteSeries:"هذا الموقع يتبع سلسلة برامج مستر كركر",
      feedbackLabel:"اقتراحات وشكاوى", feedbackSoon:"قريبًا",
      feedbackInvite:"رأيك يهمنا", feedbackInviteText:"ساعدنا على تحسين سهولة الموقع وجودة الخدمة.",
      requestDashboard:"إدارة الطلبات", ownerDashboard:"لوحة المالك",
      signInCreate:"تسجيل الدخول / إنشاء حساب", signOut:"تسجيل الخروج", backToSite:"العودة للموقع",
      driveSetupKicker:"إعداد مسؤول الموقع", driveSetupTitle:"ربط Google Drive",
      driveSetupDescription:"هذه الصفحة مخصصة لصاحب الموقع. بعد إعداد OAuth، سجّل بحساب Workspace.",
      connectDrive:"تفويض حساب Google", refreshDrive:"تحديث الحالة", setupOnce:"مطلوب مرة واحدة قبل التفويض",
      driveApiStep:"تفعيل Google Drive API في مشروع Google Cloud.",
      oauthStep:"إنشاء OAuth Client من نوع Web application وإضافة رابط الرجوع.",
      adminEmailStep:"تحديد بريد المسؤول وإدخال بيانات OAuth محليًا في .env.",
      driveFolderStep:"التأكد أن مجلد Drive خاص، وأن المسؤول يستطيع إضافة الملفات.",
      noSecretsNotice:"لا ترسل Client Secret أو مفاتيح التشفير إلى المحادثة.",
      adminSpace:"مساحة المسؤول", adminLoginTitle:"تسجيل دخول المسؤول",
      adminLoginDescription:"سجّل بحساب Workspace المحدد لإدارة اتصال Drive.",
      googleConsentWarning:"هذا الاتصال يحتاج صلاحية Drive لإنشاء المجلدات ورفع المرفقات.",
      oauthGuide:"خطوات إعداد Google OAuth", cloudProjectStep:"أنشئ مشروعًا وفعّل Google Drive API.",
      oauthConsentStep:"أكمل شاشة موافقة OAuth.", oauthClientStep:"أنشئ OAuth Client Web وأضف رابط الرجوع.",
      localEnvStep:"ضع بيانات OAuth في .env.", privateDriveStep:"امنح المسؤول صلاحية محرر على مجلد Drive.",
      authorizeStep:"شغّل الخادم وافتح صفحة إعداد المسؤول.", continueGoogle:"المتابعة إلى Google",
      driveAdminFooter:"دخول المسؤول", driveChecking:"جارٍ التحقق...",
      driveNeedsSignIn:"سجّل الدخول بحساب المسؤول.", driveConnectedPrefix:"متصل بحساب ",
      driveConnectedSuffix:". مجلد الوجهة خاص وجاهز.", driveConfiguredNotConnected:"الإعدادات موجودة لكن لم يتم التفويض.",
      driveSetupIncompletePrefix:"إعداد OAuth غير مكتمل: ", driveSetupStatusReady:"الإعدادات موجودة؛ سجّل بحساب المسؤول.",
      driveSetupStatusAuthorized:"الإعدادات مكتملة. بعد الدخول سيُفحص المجلد ويُحفظ الرمز مشفرًا.",
      driveSetupStatusIncompletePrefix:"الإعداد المحلي غير مكتمل. أضف إلى .env: ",
      driveServerUnavailable:"تعذر الوصول للخادم. شغّله ثم أعد المحاولة.",
      driveOAuthDenied:"تم إلغاء تفويض Google؛ لم تُخزّن أي بيانات.",
      driveOAuthFailed:"تعذر إكمال التفويض. تحقق من OAuth ثم أعد المحاولة.",
      driveOAuthDeniedAdmin:"لم يكتمل التفويض.", driveOAuthFailedAdmin:"تعذر التفويض."
    },
    en: {
      interfaceLanguageLabel:"Interface language", interfaceArabic:"Arabic", interfaceEnglish:"English", otherLanguages:"Other languages",
      siteSeries:"This website is part of the Mr. Karkar programs series",
      feedbackLabel:"Suggestions and complaints", feedbackSoon:"Coming soon",
      feedbackInvite:"We value your feedback", feedbackInviteText:"Help us improve the website and service quality.",
      requestDashboard:"Request dashboard", ownerDashboard:"Owner dashboard",
      signInCreate:"Sign in / Create account", signOut:"Sign out", backToSite:"Back to website",
      driveSetupKicker:"Site administration setup", driveSetupTitle:"Connect Google Drive",
      driveSetupDescription:"This page is for the site owner. Configure OAuth first, then sign in with a Workspace account.",
      connectDrive:"Authorize Google account", refreshDrive:"Refresh status", setupOnce:"Required once before authorization",
      driveApiStep:"Enable Google Drive API in the Google Cloud project.",
      oauthStep:"Create a Web application OAuth client and add the redirect URI.",
      adminEmailStep:"Set the administrator email and enter OAuth settings in .env.",
      driveFolderStep:"Ensure the Drive folder is private and the admin can add files.",
      noSecretsNotice:"Do not send client secrets in chat.",
      adminSpace:"Administrator area", adminLoginTitle:"Administrator sign in",
      adminLoginDescription:"Use the configured Workspace account to manage Drive.",
      googleConsentWarning:"This connection needs Drive access for the admin account.",
      oauthGuide:"First-time Google OAuth setup", cloudProjectStep:"Create a project and enable Google Drive API.",
      oauthConsentStep:"Configure the OAuth consent screen.", oauthClientStep:"Create a Web OAuth client and add the redirect URI.",
      localEnvStep:"Put OAuth settings in .env.", privateDriveStep:"Grant the admin editor access to the private Drive folder.",
      authorizeStep:"Start the server and open the admin setup page.", continueGoogle:"Continue to Google",
      driveAdminFooter:"Administrator sign in", driveChecking:"Checking...",
      driveNeedsSignIn:"Sign in with the administrator account.", driveConnectedPrefix:"Connected as ",
      driveConnectedSuffix:". Destination folder is private and ready.", driveConfiguredNotConnected:"Settings present but Google account not authorized.",
      driveSetupIncompletePrefix:"OAuth setup incomplete: ", driveSetupStatusReady:"OAuth present; sign in with the admin account.",
      driveSetupStatusAuthorized:"Local setup complete. After Google authorization, the folder will be checked.",
      driveSetupStatusIncompletePrefix:"Local setup incomplete. Add to .env: ",
      driveServerUnavailable:"Cannot reach the server.", driveOAuthDenied:"Google authorization cancelled.",
      driveOAuthFailed:"Authorization failed.", driveOAuthDeniedAdmin:"Authorization not completed.",
      driveOAuthFailedAdmin:"Authorization failed."
    }
  };

  const rtlLanguages = new Set(["ar","fa","he","ur","ps"]);
  const separator = "|||MK-UI-TRANSLATION|||";

  const state = { account: null, authStatus: null, csrfToken: "", pendingRole: null, source: null, apply: null, dialogMode: "login" };

  window.siteAccountText = (key) => {
    const lang = document.documentElement.lang || "ar";
    return sharedTranslations[lang]?.[key] || sharedTranslations.en[key] || key;
  };
  window.siteUiTranslation = (language, key) => sharedTranslations[language]?.[key];

  window.siteAccount = {
    get account() { return state.account; },
    getHeaders: async () => {
      if (!state.csrfToken) await refreshCsrf();
      return { "X-CSRF-Token": state.csrfToken };
    },
    open: openAccountDialog,
    setPendingRole: (role, studentType = "") => { state.pendingRole = { role, studentType }; },
    fillRequestIdentity,
  };

  function fillLanguageSelect(select, selectedCode, displayLanguage = selectedCode || "en") {
    if (!select) return;
    const names = new Intl.DisplayNames([displayLanguage], { type: "language" });
    const selected = selectedCode || select.value || "es";
    select.replaceChildren(...languages.filter(([c]) => c !== "ar" && c !== "en").map(([code, native]) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = code === "ar" || code === "en" ? native : names.of(code) || native;
      opt.selected = code === selected;
      return opt;
    }));
  }

  async function configureFeedbackLinks() {
    const links = Array.from(document.querySelectorAll("[data-feedback-link]"));
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.getAttribute("aria-disabled") === "true") e.preventDefault();
      });
    });
    if (!links.length) return;
    try {
      const r = await fetch("/api/site-config", { credentials: "same-origin" });
      const result = await r.json();
      if (!r.ok) throw new Error(result.error || "Feedback config failed.");
      if (!result.feedbackFormUrl) return;
      links.forEach((link) => {
        link.href = result.feedbackFormUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.removeAttribute("aria-disabled");
        const soon = link.querySelector("[data-feedback-soon]");
        if (soon) soon.hidden = true;
      });
    } catch (e) { console.error("Feedback config failed.", e); }
  }

  function updateLanguageControls(language) {
    const primary = document.getElementById("interface-language");
    const additional = document.getElementById("other-interface-language");
    const labels = sharedTranslations[language] || sharedTranslations.en;
    if (primary) {
      primary.options[0].textContent = labels.interfaceArabic || sharedTranslations.en.interfaceArabic;
      primary.options[1].textContent = labels.interfaceEnglish || sharedTranslations.en.interfaceEnglish;
      primary.options[2].textContent = labels.otherLanguages || sharedTranslations.en.otherLanguages;
      primary.setAttribute("aria-label", labels.interfaceLanguageLabel || sharedTranslations.en.interfaceLanguageLabel);
      primary.value = language === "ar" || language === "en" ? language : "other";
    }
    if (additional) {
      additional.setAttribute("aria-label", labels.otherLanguages || sharedTranslations.en.otherLanguages);
      additional.hidden = language === "ar" || language === "en";
      fillLanguageSelect(additional, language, language);
      if (languages.some(([c]) => c === language)) additional.value = language;
    }
  }
  window.setLanguageControls = updateLanguageControls;

  async function refreshCsrf() {
    const r = await fetch("/api/auth/csrf", { credentials: "same-origin" });
    const result = await r.json();
    if (!r.ok || !result.csrfToken) throw new Error(result.error || "Session start failed.");
    state.csrfToken = result.csrfToken;
  }

  async function loadAuthStatus() {
    const r = await fetch("/api/auth/status", { credentials: "same-origin" });
    const result = await r.json();
    if (!r.ok) throw new Error(result.error || "Status check failed.");
    await refreshCsrf();
    state.authStatus = result;
    state.account = result.account;
    renderAccountHeader();
    fillRequestIdentity();
    if (document.getElementById("account-dialog")?.open) setAccountMode(state.dialogMode);
  }

  function renderAccountHeader() {
    const btn = document.getElementById("account-open");
    const signOut = document.getElementById("account-signout");
    const ownerLink = document.getElementById("owner-link");
    const requestsLink = document.getElementById("requests-link");
    if (btn) {
      btn.textContent = state.account ? state.account.name : localizeAccountLabel("signInCreate");
      btn.setAttribute("aria-label", state.account ? state.account.name : localizeAccountLabel("signInCreate"));
    }
    if (signOut) signOut.hidden = !state.account;
    if (ownerLink) ownerLink.hidden = state.account?.role !== "owner";
    if (requestsLink) requestsLink.hidden = !state.account || !(
      state.account.role === "owner"
      || (state.account.role === "admin" && state.account.permissions?.view_requests)
    );
  }

  function fillRequestIdentity() {
    const form = document.getElementById("request-form");
    if (!form || !state.account) return;
    form.elements.namedItem("name").value = state.account.name;
    form.elements.namedItem("email").value = state.account.email;
  }

  function localizeAccountLabel(key) {
    if (window.getUiText) return window.getUiText(key);
    const dict = sharedTranslations[document.documentElement.lang] || sharedTranslations.en;
    return dict[key] || state.source?.[key] || key;
  }

  function openAccountDialog(mode = "login") {
    const dialog = document.getElementById("account-dialog");
    if (!dialog) { location.href = `/?account=${encodeURIComponent(mode)}`; return; }
    setAccountMode(mode);
    if (!dialog.open) dialog.showModal();
  }

  function setAccountMode(mode) {
    state.dialogMode = mode;
    const tabs = document.getElementById("account-tabs");
    const login = document.getElementById("login-form");
    const register = document.getElementById("register-form");
    const ownerSetup = document.getElementById("owner-setup-form");
    const msg = document.getElementById("account-message");
    const setupRequired = !state.authStatus?.registrationAvailable;
    const setupAvailable = state.authStatus?.ownerSetupAvailable;
    const selected = mode === "owner" || (setupRequired && setupAvailable) ? "owner" : mode;
    msg.hidden = true;
    msg.textContent = "";
    tabs.hidden = selected === "owner" || setupRequired;
    login.hidden = selected !== "login" || setupRequired;
    register.hidden = selected !== "register" || setupRequired;
    ownerSetup.hidden = selected !== "owner" || !setupAvailable;
    document.querySelectorAll("[data-auth-mode]").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.authMode === selected);
      tab.hidden = setupRequired;
    });
    if (selected === "owner") {
      document.getElementById("account-title").textContent = localizeAccountLabel("ownerSetupTitle");
      document.getElementById("account-description").textContent = localizeAccountLabel("ownerSetupDescription");
    } else {
      document.getElementById("account-title").textContent = localizeAccountLabel("accountTitle");
      document.getElementById("account-description").textContent = localizeAccountLabel("accountDescription");
    }
  }

  function displayAuthError(error, details = []) {
    const msg = document.getElementById("account-message");
    msg.textContent = [error, ...details].filter(Boolean).join(" ");
    msg.hidden = false;
  }

  async function submitAuthForm(form, endpoint, includeConsent = false) {
    const payload = Object.fromEntries(new FormData(form).entries());
    if (includeConsent) {
      payload.ageConfirmed = form.elements.namedItem("ageConfirmed").checked;
      payload.privacyAccepted = form.elements.namedItem("privacyAccepted").checked;
    }
    const r = await fetch(endpoint, {
      method: "POST",
      headers: { ...(await window.siteAccount.getHeaders()), "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const result = await r.json();
    if (!r.ok) throw Object.assign(new Error(result.error || "Account action failed."), { details: result.details || [] });
    state.account = result.account;
    await loadAuthStatus();
    document.getElementById("account-dialog")?.close();
    if (state.pendingRole?.role && document.getElementById("age-confirm")?.checked && window.setRequestRole) {
      const pending = state.pendingRole;
      state.pendingRole = null;
      window.setRequestRole(pending.role, pending.studentType);
    }
  }

  function translateChunks(source, language) {
    const entries = Object.entries(source).map(([k, v]) => [k, String(v)]);
    const chunks = [];
    let group = [];
    let length = 0;
    for (const entry of entries) {
      const entryLength = entry[1].length + separator.length;
      if (group.length && length + entryLength > 2200) { chunks.push(group); group = []; length = 0; }
      group.push(entry);
      length += entryLength;
    }
    if (group.length) chunks.push(group);
    async function translateText(value) {
      const url = new URL("https://translate.googleapis.com/translate_a/single");
      url.searchParams.set("client", "gtx");
      url.searchParams.set("sl", "en");
      url.searchParams.set("tl", language);
      url.searchParams.set("dt", "t");
      url.searchParams.set("q", value);
      const ctrl = new AbortController();
      const tm = setTimeout(() => ctrl.abort(), 15000);
      let res;
      try { res = await fetch(url, { signal: ctrl.signal }); }
      finally { clearTimeout(tm); }
      if (!res.ok) throw new Error(`Translate ${res.status}`);
      const result = await res.json();
      const segs = result?.[0];
      if (!Array.isArray(segs) || segs.some((s) => typeof s?.[0] !== "string")) throw new Error("Invalid translate response");
      return segs.map((s) => s[0]).join("");
    }
    return chunks.reduce(async (prev, chunk) => {
      const translated = await prev;
      const packed = chunk.map(([, v]) => v).join(separator);
      const text = await translateText(packed);
      const parts = text.split(separator);
      if (parts.length === chunk.length) {
        chunk.forEach(([k], i) => { translated[k] = parts[i]; });
      } else {
        for (let i = 0; i < chunk.length; i += 8) {
          const sub = await Promise.all(chunk.slice(i, i + 8).map(async ([k, v]) => [k, await translateText(v)]));
          sub.forEach(([k, v]) => { translated[k] = v; });
        }
      }
      return translated;
    }, Promise.resolve({}));
  }

  function translationCacheKey(language) {
    const source = JSON.stringify(state.source || {});
    let hash = 2166136261;
    for (let i = 0; i < source.length; i++) {
      hash = Math.imul(hash ^ source.charCodeAt(i), 16777619);
    }
    return `mk-ui-translation:${language}:${(hash >>> 0).toString(36)}`;
  }

  async function changeLanguage(language) {
    const select = document.getElementById("interface-language");
    const additional = document.getElementById("other-interface-language");
    const status = document.getElementById("language-status");
    const current = languages.some(([c]) => c === language) ? language : "ar";
    if (select) select.disabled = true;
    if (additional) additional.disabled = true;
    try {
      if (current === "ar" || current === "en") {
        state.apply?.(current);
      } else {
        let dict;
        try { dict = JSON.parse(localStorage.getItem(translationCacheKey(current)) || "null"); } catch { dict = null; }
        if (!dict) {
          dict = await translateChunks(state.source || {}, current);
          try { localStorage.setItem(translationCacheKey(current), JSON.stringify(dict)); } catch {}
        }
        state.apply?.(current, dict);
      }
      try { localStorage.setItem("mk-interface-language", current); } catch {}
      updateLanguageControls(current);
      if (status) status.textContent = "";
      renderAccountHeader();
    } catch (e) {
      console.error("Language switch failed.", e);
      state.apply?.("en");
      updateLanguageControls("en");
      if (status) status.textContent = "Machine translation unavailable; showing English.";
      renderAccountHeader();
    } finally {
      if (select) select.disabled = false;
      if (additional) additional.disabled = false;
    }
  }

  window.configureSiteLanguage = (source, apply) => {
    state.source = source;
    state.apply = (language, dictionary) => {
      if (dictionary && window.updateUiDictionary) window.updateUiDictionary(language, dictionary);
      apply(language);
    };
    window.updateUiDictionary = (language, dictionary) => { sharedTranslations[language] = dictionary; };
    const select = document.getElementById("interface-language");
    const additional = document.getElementById("other-interface-language");
    if (select && additional) {
      let preferred = "ar";
      try { preferred = localStorage.getItem("mk-interface-language") || "ar"; } catch { preferred = "ar"; }
      if (!languages.some(([c]) => c === preferred)) preferred = "ar";
      fillLanguageSelect(additional, preferred);
      select.addEventListener("change", () => {
        if (select.value === "other") { additional.hidden = false; additional.focus(); }
        else changeLanguage(select.value);
      });
      additional.addEventListener("change", () => changeLanguage(additional.value));
      updateLanguageControls(preferred);
      if (preferred !== "ar") changeLanguage(preferred);
    }
  };

  document.getElementById("account-open")?.addEventListener("click", () => openAccountDialog("login"));
  document.getElementById("account-signout")?.addEventListener("click", async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: await window.siteAccount.getHeaders(),
        credentials: "same-origin",
      });
      state.account = null;
      await loadAuthStatus();
      document.querySelectorAll("#request-form input[name='name'], #request-form input[name='email']").forEach((i) => { i.value = ""; });
      location.href = "/";
    } catch (e) { displayAuthError(e.message); openAccountDialog("login"); }
  });
  document.querySelectorAll("[data-auth-mode]").forEach((tab) => tab.addEventListener("click", () => setAccountMode(tab.dataset.authMode)));
  document.querySelectorAll("[data-open-privacy]").forEach((btn) => btn.addEventListener("click", () => {
    const d = document.getElementById("privacy-dialog");
    if (d && !d.open) d.showModal();
  }));

  document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try { await submitAuthForm(e.currentTarget, "/api/auth/login"); }
    catch (err) { displayAuthError(err.message, err.details); }
  });
  document.getElementById("register-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try { await submitAuthForm(e.currentTarget, "/api/auth/register", true); }
    catch (err) { displayAuthError(err.message, err.details); }
  });
  document.getElementById("owner-setup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    try { await submitAuthForm(e.currentTarget, "/api/auth/owner-setup", true); }
    catch (err) { displayAuthError(err.message, err.details); }
  });

  (function setupThemeToggle() {
    const html = document.documentElement;
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    function currentTheme() {
      const t = html.getAttribute("data-theme");
      if (t === "light" || t === "dark") return t;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function render() {
      const dark = currentTheme() === "dark";
      btn.innerHTML = dark ? SUN : MOON;
      btn.setAttribute("aria-label", dark ? "تفعيل المظهر الفاتح" : "تفعيل المظهر الداكن");
      const meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (meta) meta.content = dark ? "#0c1110" : "#fbf5ed";
    }
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", next);
      try { localStorage.setItem("mk-theme", next); } catch {}
      render();
    });
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", render);
    render();
  })();

  refreshPresentationLanguages("ar");
  configureFeedbackLinks();
  loadAuthStatus().catch((err) => {
    console.error("Account status failed.", err);
    displayAuthError(err.message);
  });
  const params = new URLSearchParams(location.search);
  if (params.has("account") && params.get("account") !== "required") {
    openAccountDialog(params.get("account"));
  }
  
  function refreshPresentationLanguages(language) {
    const select = document.getElementById("presentation-language");
    if (!select) return;
    const selected = select.value || "ar";
    const names = new Intl.DisplayNames([language], { type: "language" });
    const options = languages.map(([code, nativeName]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = names.of(code) || nativeName;
      option.selected = code === selected;
      return option;
    });
    select.replaceChildren(...options);
  }
})();
