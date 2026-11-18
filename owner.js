const permissionLabels = {
  view_requests: "الاطلاع على الطلبات",
  update_requests: "تعديل الطلبات",
  manage_accounts: "إدارة حسابات المستخدمين",
  manage_content: "إدارة المحتوى",
  manage_settings: "تعديل إعدادات الموقع",
  manage_drive: "إدارة اتصال Google Drive",
  view_conversations: "الاطلاع على المحادثات"
};

let currentPermissionKeys = Object.keys(permissionLabels);

function showOwnerStatus(message, isError = false) {
  const status = document.getElementById("owner-status");
  status.textContent = message;
  status.style.display = message ? "block" : "none";
  status.classList.toggle("error", isError);
}

async function ownerFetch(url, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.method && options.method !== "GET") {
    Object.assign(headers, await window.siteAccount.getHeaders());
  }
  const response = await fetch(url, { ...options, headers, credentials: "same-origin" });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "حدث خطأ أثناء تحميل البيانات.");
  return result;
}

function permissionEditor(values = {}) {
  const fieldset = document.getElementById("permission-editor");
  fieldset.replaceChildren();
  currentPermissionKeys.forEach((key) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = key;
    checkbox.checked = Boolean(values[key]);
    
    const text = document.createElement("span");
    text.textContent = permissionLabels[key] || key;
    
    label.append(checkbox, text);
    fieldset.append(label);
  });
}

function renderAccount(account) {
  const card = document.createElement("article");
  card.className = "owner-account";
  
  const top = document.createElement("div");
  top.className = "owner-account-top";
  
  const identity = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = account.name;
  const email = document.createElement("small");
  email.textContent = account.email;
  
  const badge = document.createElement("span");
  badge.className = "owner-badge " + account.role;
  badge.textContent = account.role === "circle" ? "امتياز مدى الحياة"
    : account.role === "admin" ? "إدارة" : account.role === "owner" ? "المالك" : "مستخدم عادي";
    
  identity.append(name, email, badge);
  top.append(identity);
  card.append(top);

  if (account.role === "owner") return card;

  const controls = document.createElement("div");
  controls.className = "owner-account-controls";
  
  const roleSelect = document.createElement("select");
  roleSelect.setAttribute("aria-label", "نوع الحساب");
  [["user", "مستخدم عادي"], ["admin", "إدارة"], ["circle", "أقارب وأصدقاء"]].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    option.selected = value === account.role;
    roleSelect.append(option);
  });
  
  const activeLabel = document.createElement("label");
  activeLabel.style.display = "flex";
  activeLabel.style.alignItems = "center";
  activeLabel.style.gap = "8px";
  activeLabel.style.fontSize = "12px";
  activeLabel.style.cursor = "pointer";
  const activeCheckbox = document.createElement("input");
  activeCheckbox.type = "checkbox";
  activeCheckbox.checked = account.active;
  activeCheckbox.style.accentColor = "var(--green)";
  const activeText = document.createElement("span");
  activeText.textContent = account.active ? "الحساب مفعّل" : "الحساب موقوف";
  
  activeCheckbox.addEventListener("change", () => { 
    activeText.textContent = activeCheckbox.checked ? "الحساب مفعّل" : "الحساب موقوف"; 
  });
  activeLabel.append(activeCheckbox, activeText);

  const permissions = document.createElement("fieldset");
  permissions.className = "owner-permissions";
  const permissionInputs = {};
  
  currentPermissionKeys.forEach((key) => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(account.permissions[key]);
    checkbox.disabled = roleSelect.value !== "admin";
    permissionInputs[key] = checkbox;
    const text = document.createElement("span");
    text.textContent = permissionLabels[key] || key;
    label.append(checkbox, text);
    permissions.append(label);
  });
  
  roleSelect.addEventListener("change", () => {
    permissions.style.display = roleSelect.value !== "admin" ? "none" : "grid";
    Object.values(permissionInputs).forEach((cb) => { cb.disabled = roleSelect.value !== "admin"; });
  });
  permissions.style.display = roleSelect.value !== "admin" ? "none" : "grid";
  
  const saveBtn = document.createElement("button");
  saveBtn.className = "primary-button";
  saveBtn.type = "button";
  saveBtn.textContent = "حفظ التغييرات";
  saveBtn.style.width = "fit-content";
  
  saveBtn.addEventListener("click", async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = "جارٍ الحفظ...";
    try {
      await ownerFetch(`/api/owner/accounts/${encodeURIComponent(account.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleSelect.value,
          active: activeCheckbox.checked,
          permissions: Object.fromEntries(Object.entries(permissionInputs).map(([key, cb]) => [key, cb.checked])),
        }),
      });
      showOwnerStatus("تم تحديث الحساب بنجاح.");
      await loadAccounts();
    } catch (error) {
      showOwnerStatus(error.message || "تعذر حفظ التغييرات.", true);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "حفظ التغييرات";
    }
  });
  
  controls.append(roleSelect, activeLabel, permissions, saveBtn);
  card.append(controls);
  return card;
}

async function loadAccounts() {
  const container = document.getElementById("owner-accounts");
  container.replaceChildren();
  try {
    const result = await ownerFetch("/api/owner/accounts");
    if (result.permissionKeys) currentPermissionKeys = result.permissionKeys;
    
    if (!result.accounts.length) {
      container.textContent = "لا توجد حسابات.";
      return;
    }
    result.accounts.forEach((account) => container.append(renderAccount(account)));
  } catch (e) {
    container.textContent = e.message;
  }
}

async function loadConversations() {
  const container = document.getElementById("conversation-list");
  container.replaceChildren();
  try {
    const result = await ownerFetch("/api/conversations");
    if (!result.conversations.length) {
      container.textContent = "لا توجد محادثات محفوظة.";
      return;
    }
    result.conversations.forEach((conversation) => {
      const row = document.createElement("article");
      row.className = "conversation-row";
      
      const identity = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = conversation.title;
      const owner = document.createElement("small");
      owner.textContent = `صاحب المحادثة: ${conversation.accountName}`;
      const count = document.createElement("small");
      count.textContent = ` · ${conversation.messageCount} رسالة`;
      identity.append(title, owner, count);
      
      const open = document.createElement("button");
      open.className = "secondary-button";
      open.type = "button";
      open.textContent = "عرض المحادثة";
      open.addEventListener("click", () => showConversation(conversation.id));
      
      row.append(identity, open);
      container.append(row);
    });
  } catch (e) {
    container.textContent = e.message;
  }
}

async function showConversation(conversationId) {
  try {
    const result = await ownerFetch(`/api/conversations/${encodeURIComponent(conversationId)}`);
    const conversation = result.conversation;
    
    document.getElementById("conversation-title").textContent = conversation.title || "محادثة محفوظة";
    document.getElementById("conversation-owner").textContent = `صاحب المحادثة: ${conversation.accountName}${conversation.accountEmail ? ` · ${conversation.accountEmail}` : ""}`;
    
    const messages = document.getElementById("conversation-messages");
    messages.replaceChildren();
    
    if (!conversation.messages.length) messages.textContent = "لا توجد رسائل في هذه المحادثة.";
    
    conversation.messages.forEach((message) => {
      const bubble = document.createElement("div");
      bubble.className = "conversation-message";
      bubble.dataset.sender = message.sender;
      const sender = document.createElement("b");
      sender.textContent = message.sender === "assistant" ? "الذكاء الاصطناعي" : "المستخدم";
      const content = document.createElement("span");
      content.textContent = message.content;
      bubble.append(sender, content);
      messages.append(bubble);
    });
    
    document.getElementById("conversation-dialog").showModal();
  } catch (error) {
    showOwnerStatus(error.message, true);
  }
}

function renderRolePermissions() {
  const role = document.getElementById("privileged-role");
  const fieldset = document.getElementById("permission-editor");
  fieldset.style.display = role.value !== "admin" ? "none" : "grid";
}

document.getElementById("privileged-role").addEventListener("change", renderRolePermissions);
document.getElementById("privileged-account-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  
  const values = Object.fromEntries(new FormData(form).entries());
  values.permissions = Object.fromEntries(currentPermissionKeys.map((key) => [
    key, Boolean(form.querySelector(`[name="${key}"]`)?.checked)
  ]));
  
  btn.disabled = true;
  btn.textContent = "جارٍ الإنشاء...";
  
  try {
    await ownerFetch("/api/owner/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    form.reset();
    renderRolePermissions();
    permissionEditor();
    showOwnerStatus("تم إنشاء الحساب بنجاح.");
    await loadAccounts();
  } catch (error) {
    showOwnerStatus(error.message, true);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

document.getElementById("refresh-accounts").addEventListener("click", () => loadAccounts().catch((e) => showOwnerStatus(e.message, true)));
document.getElementById("refresh-conversations").addEventListener("click", () => loadConversations().catch((e) => showOwnerStatus(e.message, true)));
document.getElementById("year").textContent = new Date().getFullYear();

permissionEditor();
renderRolePermissions();
Promise.all([loadAccounts(), loadConversations()]).catch((error) => showOwnerStatus(error.message, true));
