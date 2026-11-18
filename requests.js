(() => {
  const state = { language: "ar", requests: [], canUpdate: false, currentRequestId: "" };
  const list = document.getElementById("request-list");
  const statusBox = document.getElementById("requests-status");
  const dialog = document.getElementById("request-dialog");

  const LABELS = {
    received: "مستلم", partial_upload: "رفع غير مكتمل", in_progress: "قيد الإعداد", completed: "مكتمل", cancelled: "ملغي",
    teacher: "معلّم", student: "طالب", other: "مهنة أخرى",
    teacher_lesson: "درس للمعلم", professional: "طلب مهني", lesson: "درس دراسي", oral: "عرض شفهي", project: "مشروع أو بحث",
    school: "مدرسة", independent: "مستقل", otherOrganization: "جهة أخرى",
    oman: "نعم، داخل سلطنة عُمان", outside_oman: "لا، خارج سلطنة عُمان",
    primary: "ابتدائي", middle: "متوسط", secondary: "ثانوي", university: "جامعي",
    presentation: "عرض تقديمي", audio_summary: "ملخص صوتي", slide_deck: "مجموعة شرائح",
    video_summary: "ملخص بالفيديو", mind_map: "خريطة ذهنية", report: "تقارير",
    flashcards: "بطاقات تعليمية", quiz: "اختبار", chart: "مخطط بياني", spreadsheet: "جدول بيانات",
    pdf: "PDF", pptx: "PowerPoint", assistant: "مساعد ذكي", guided: "أسئلة منظمة",
    none: "لا يوجد", link: "رابط فيديو", review: "مراجعة من الفريق"
  };

  function setStatus(message, isError = false) {
    statusBox.textContent = message;
    statusBox.dataset.error = String(isError);
    if(!message) statusBox.style.display = "none";
    else statusBox.style.display = "block";
  }

  async function requestApi(url, options = {}) {
    const headers = { ...(options.headers || {}) };
    if (options.method && options.method !== "GET") {
      Object.assign(headers, await window.siteAccount.getHeaders());
    }
    const response = await fetch(url, { ...options, headers, credentials: "same-origin" });
    const result = response.headers.get("content-type")?.includes("application/json") ? await response.json() : {};
    if (!response.ok) throw new Error(result.error || "حدث خطأ غير متوقع.");
    return result;
  }

  function dateText(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ar", { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function filteredRequests() {
    const query = document.getElementById("request-search").value.trim().toLocaleLowerCase();
    const selectedStatus = document.getElementById("request-filter-status").value;
    return state.requests.filter((item) => {
      if (selectedStatus && item.status !== selectedStatus) return false;
      return !query || [item.requestId, item.name, item.email, item.topic].some((value) => String(value || "").toLocaleLowerCase().includes(query));
    });
  }

  function renderRequests() {
    if (!list) return;
    list.replaceChildren();
    const items = filteredRequests();
    
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "request-empty";
      empty.textContent = state.requests.length ? "لا توجد طلبات تطابق البحث." : "لا توجد طلبات محفوظة حتى الآن.";
      list.append(empty);
      return;
    }
    
    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "request-row";
      
      const body = document.createElement("div");
      const title = document.createElement("h2");
      title.textContent = item.topic || item.requestId;
      const name = document.createElement("p");
      name.textContent = `${item.name || "غير محدد"} · ${item.email || ""}`;
      
      const meta = document.createElement("div");
      meta.className = "request-row-meta";
      [item.requestId, dateText(item.receivedAt), `المرفقات: ${item.attachmentCount}`].forEach((val) => {
        const span = document.createElement("span");
        span.textContent = val;
        meta.append(span);
      });
      
      const badge = document.createElement("span");
      badge.className = "request-badge";
      badge.dataset.status = item.status || "received";
      badge.textContent = LABELS[item.status] || item.status;
      
      body.append(title, name, meta, badge);
      
      const openBtn = document.createElement("button");
      openBtn.className = "secondary-button";
      openBtn.type = "button";
      openBtn.textContent = "عرض التفاصيل";
      openBtn.addEventListener("click", () => showRequest(item.requestId));
      
      row.append(body, openBtn);
      list.append(row);
    });
  }

  function addDetailGroup(parent, heading, entries) {
    const group = document.createElement("section");
    group.className = "request-detail-group";
    const title = document.createElement("h3");
    title.textContent = heading;
    group.append(title);
    
    const grid = document.createElement("div");
    grid.className = "request-detail-grid";
    
    entries.forEach(([label, value]) => {
      if (value === null || value === undefined || value === "") return;
      const item = document.createElement("div");
      item.className = "request-detail-item";
      const b = document.createElement("b");
      b.textContent = label;
      const span = document.createElement("span");
      
      const values = Array.isArray(value) ? value : [value];
      span.textContent = values.map((v) => LABELS[v] || v).join(", ");
      
      item.append(b, span);
      grid.append(item);
    });
    
    if (grid.childElementCount) {
      group.append(grid);
      parent.append(group);
    }
  }

  function renderRequestDetails(record) {
    state.currentRequestId = record.requestId;
    document.getElementById("request-dialog-title").textContent = record.requestId;
    
    const updateRow = document.getElementById("request-update-row");
    updateRow.hidden = !state.canUpdate;
    if(state.canUpdate) {
      document.getElementById("request-status-select").value = record.status || "received";
    }
    
    const content = document.getElementById("request-detail-groups");
    content.replaceChildren();
    const data = record.request || {};
    
    addDetailGroup(content, "بيانات صاحب الطلب", [
      ["الاسم", data.name], ["البريد الإلكتروني", data.email], ["الهاتف", data.phone],
      ["الإقامة/الدراسة في عُمان", LABELS[data.countryScope] || data.countryScope],
      ["المرحلة الدراسية", LABELS[data.stage] || data.stage],
      ["المدرسة أو الجهة", data.schoolStatus === "independent" ? LABELS.independent : data.schoolName],
      ["صفة مقدم الطلب", LABELS[data.role] || data.role], ["المهنة", LABELS[data.profession] || data.profession]
    ]);
    
    addDetailGroup(content, "تفاصيل الطلب", [
      ["نوع الطلب", LABELS[data.requestType] || data.requestType], ["الموضوع", data.topic],
      ["المخرجات المطلوبة", data.deliverables], ["الهدف", data.objective],
      ["طريقة المتابعة", LABELS[data.method] || data.method],
      ["نقاط التركيز", data.focusDetails], ["الفئة المستهدفة", data.audience],
      ["المدة", data.duration], ["عدد الشرائح", data.slideCount],
      ["لغة المخرجات", LABELS[data.presentationLanguage] || data.presentationLanguage],
      ["صيغة العرض", LABELS[data.format] || data.format],
      ["ملاحظات", data.notes], ["الفيديو", LABELS[data.videoOption] || data.videoOption],
      ["رابط الفيديو", data.videoUrl], ["تاريخ الاستلام", dateText(record.receivedAt)]
    ]);
    
    const attachments = document.createElement("section");
    attachments.className = "request-detail-group";
    const heading = document.createElement("h3");
    heading.textContent = `المرفقات (${record.attachments.length})`;
    attachments.append(heading);
    
    if (!record.attachments.length) {
      const empty = document.createElement("span");
      empty.textContent = "لا توجد مرفقات.";
      empty.style.color = "var(--muted)";
      attachments.append(empty);
    } else {
      const items = document.createElement("ul");
      items.className = "request-attachment-list";
      record.attachments.forEach((file) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `/api/requests/${encodeURIComponent(record.requestId)}/attachments/${encodeURIComponent(file.driveFileId)}`;
        a.innerHTML = `📎 ${file.name || "تنزيل الملف"}`;
        li.append(a);
        items.append(li);
      });
      attachments.append(items);
    }
    content.append(attachments);
    
    dialog.showModal();
  }

  async function showRequest(requestId) {
    setStatus("جارٍ تحميل التفاصيل...");
    try {
      const result = await requestApi(`/api/requests/${encodeURIComponent(requestId)}`);
      setStatus("");
      renderRequestDetails(result.request);
    } catch (error) {
      setStatus(error.message || "تعذر تحميل التفاصيل.", true);
    }
  }

  async function loadRequests() {
    setStatus("جارٍ تحميل الطلبات...");
    document.getElementById("refresh-requests").disabled = true;
    try {
      const result = await requestApi("/api/requests");
      state.requests = result.requests;
      state.canUpdate = result.canUpdate;
      setStatus("");
      renderRequests();
    } catch (error) {
      state.requests = [];
      renderRequests();
      setStatus(error.message || "تعذر تحميل الطلبات.", true);
    } finally {
      document.getElementById("refresh-requests").disabled = false;
    }
  }

  async function saveRequestStatus() {
    const btn = document.getElementById("save-request-status");
    btn.disabled = true;
    btn.textContent = "جارٍ الحفظ...";
    try {
      await requestApi(`/api/requests/${encodeURIComponent(state.currentRequestId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: document.getElementById("request-status-select").value })
      });
      dialog.close();
      setStatus("تم تحديث حالة الطلب بنجاح.");
      await loadRequests();
    } catch (error) {
      setStatus(error.message || "تعذر تحديث الحالة.", true);
    } finally {
      btn.disabled = false;
      btn.textContent = "حفظ الحالة";
    }
  }

  document.getElementById("refresh-requests").addEventListener("click", loadRequests);
  document.getElementById("request-search").addEventListener("input", renderRequests);
  document.getElementById("request-filter-status").addEventListener("change", renderRequests);
  document.getElementById("save-request-status").addEventListener("click", saveRequestStatus);

  document.getElementById("year").textContent = new Date().getFullYear();
  loadRequests();
})();
