/* Teacher Karkar — form, files, AI chat, review, submit */
const translations = {
  ar: {
    "interfaceLanguageLabel":"لغة واجهة الموقع","interfaceArabic":"العربية","interfaceEnglish":"English","otherLanguages":"لغات أخرى",
    "eyebrow":"التعلم أحلى مع مستر كركر","heroTitle":"اجعل فكرتك<br><em>تزأر مع تيتشر كركر.</em>",
    "heroDescription":"حوّل الدرس أو الفكرة إلى مخرج تعليمي يناسبك؛ اختر نوعًا واحدًا أو اجمع أكثر من نوع في طلبك.",
    "pointOne":"خطوات بسيطة وواضحة","pointTwo":"مجانًا للخدمات التعليمية",
    "heroNote":"بعد اكتمال ربط Google Drive، سيُحفظ طلبك ومرفقاتك في مجلد خاص.",
    "startKicker":"خطوتك الأولى","whoAreYou":"من معنا اليوم؟","whoDescription":"اختر مسارك، ومستر كركر يضبط الأسئلة على طلبك.",
    "teacher":"أنا معلّم","teacherHint":"درس مرتب، خطوة بخطوة مع مستر كركر",
    "schoolStudent":"أنا طالب مدرسي","schoolStudentHint":"للمراحل الدراسية المدرسية",
    "universityStudent":"أنا طالب جامعي","universityStudentHint":"للدراسة الجامعية",
    "otherRole":"آخر","otherRoleHint":"اختر مهنتك أو مجالك",
    "ageConfirm":"أؤكد أن عمري 10 سنوات أو أكثر","privacyNote":"تُرسل بياناتك بعد موافقتك وإرسال الطلب",
    "back":"رجوع","stepBasics":"الأساسيات","stepDetails":"التفاصيل","stepReview":"المراجعة",
    "yourJourney":"رحلتك مع مستر كركر","formTitle":"يلا نجهّز فكرتك<br>مع مستر كركر.","formDescription":"مستر كركر معك خطوة بخطوة؛ أجب براحتك، وتقدر ترجع وتعدّل قبل الإرسال.",
    "honestNote":"مستر كركر يقول: العدد تقديري؛ وقد نضيف شرائح عند الحاجة ليبقى الموضوع شاملًا.",
    "firstStepLabel":"الخطوة ١ من ٣","basicsHeading":"لنتعرّف عليك وعلى فكرتك","basicsSubheading":"مستر كركر يحتاج هذه الأساسيات ليختار لك أسئلة المتابعة المناسبة.",
    "fullName":"الاسم الكامل","email":"البريد الإلكتروني","phone":"رقم الهاتف (اختياري)",
    "countryScope":"هل تقيم أو تدرس في سلطنة عُمان؟","inOman":"نعم، داخل سلطنة عُمان","outsideOman":"لا، خارج سلطنة عُمان",
    "accountCountry":"بلد الإقامة أو الدراسة","accountCountryHint":"اكتب اسم الدولة التي تقيم أو تدرس فيها.",
    "countryNamePlaceholder":"مثال: سلطنة عُمان",
    "schoolStatus":"المدرسة أو الجامعة أو الجهة","chooseOption":"اختر خيارًا",
    "schoolOption":"أنتمي إلى مدرسة أو جامعة","independentOption":"مستقل، لا أنتمي إلى مدرسة أو جامعة","otherOption":"جهة أخرى",
    "schoolName":"اسم المدرسة","universityName":"اسم الجامعة","organizationName":"اسم الجهة",
    "educationStage":"المرحلة الدراسية",
    "primary":"ابتدائي","middle":"متوسط","secondary":"ثانوي","university":"جامعي",
    "requestType":"نوع الطلب","lesson":"درس دراسي","oral":"موضوع عام لعرض شفهي","project":"مشروع أو بحث",
    "profession":"المهنة أو المجال","professionOtherLabel":"اكتب مهنتك",
    "professionHealthcare":"الصحة والطب","professionEducation":"التعليم والتدريب","professionEngineering":"الهندسة والعمارة والبناء",
    "professionTechnology":"تقنية المعلومات والاتصالات","professionScience":"العلوم والبحث والمختبرات",
    "professionBusiness":"الأعمال والإدارة وريادة الأعمال","professionFinance":"المحاسبة والمالية والمصارف",
    "professionLaw":"القانون والشؤون القانونية","professionPublicService":"القطاع الحكومي والخدمة العامة",
    "professionMedia":"الإعلام والصحافة والاتصال","professionArtsDesign":"الفنون والتصميم وصناعة المحتوى",
    "professionMarketingSales":"التسويق والمبيعات","professionTrades":"الحرف والصيانة والخدمات الفنية",
    "professionAgriculture":"الزراعة والغذاء والثروة الحيوانية","professionEnvironment":"البيئة والاستدامة",
    "professionHospitality":"السياحة والضيافة والفعاليات","professionTransport":"النقل واللوجستيات",
    "professionSafety":"الأمن والسلامة والطوارئ","professionSocialServices":"الخدمات الاجتماعية والمجتمعية",
    "professionSports":"الرياضة واللياقة","professionPersonalCare":"العناية الشخصية والجمال",
    "professionManufacturing":"الصناعة والتصنيع","professionRetail":"التجزئة وخدمة العملاء",
    "professionOther":"مهنة أو مجال آخر",
    "deliverablesHeading":"ما الذي تريد إعداده؟","deliverablesHint":"اختر نوعًا واحدًا أو أكثر؛ يمكنك طلب كل مخرج وحده أو جمعه مع عرض تقديمي في الطلب نفسه.",
    "deliverablesRequired":"اختر مخرجًا واحدًا على الأقل.",
    "deliverablePresentation":"عرض تقديمي","deliverableAudioSummary":"ملخص صوتي","deliverableSlideDeck":"مجموعة شرائح",
    "deliverableVideoSummary":"ملخص بالفيديو","deliverableMindMap":"خريطة ذهنية","deliverableReport":"تقارير",
    "deliverableFlashcards":"بطاقات تعليمية","deliverableQuiz":"اختبار","deliverableChart":"مخطط بياني",
    "deliverableSpreadsheet":"جدول بيانات",
    "mainTopic":"المادة وموضوع الدرس","topicForTeacher":"المادة وموضوع الدرس",
    "topicForStudent":"العنوان أو الفكرة الرئيسية","topicForStudentLesson":"المادة وموضوع الدرس",
    "topicForStudentOral":"عنوان العرض الشفهي أو فكرته","topicForStudentProject":"عنوان المشروع أو سؤال البحث",
    "topicPlaceholderTeacher":"مثال: العلوم — دورة الماء","topicPlaceholderStudent":"اكتب عنوان الفكرة الرئيسية",
    "topicPlaceholderLesson":"مثال: العلوم — الجهاز الهضمي","topicPlaceholderOral":"مثال: أهمية القراءة أو الطاقة المتجددة",
    "topicPlaceholderProject":"اكتب عنوان المشروع أو سؤال البحث",
    "objective":"ما الهدف من المخرجات المطلوبة؟","requiredFields":"حقول مطلوبة","continue":"متابعة",
    "secondStepLabel":"الخطوة ٢ من ٣","detailsHeading":"مستر كركر جاهز يسمع التفاصيل",
    "detailsSubheading":"اختر طريقة المتابعة، ثم أضف ما يساعد على إعداد المخرجات التي طلبتها.",
    "methodLegend":"كيف تفضّل استكمال الطلب؟","assistantMethod":"محادثة مع مساعد ذكي","recommended":"موصى به",
    "assistantDescription":"تحدث معه ليجمع تفاصيل طلبك خطوة بخطوة.",
    "guidedMethod":"تعبئة النموذج","guidedDescription":"أجب عن الحقول المنظمة بنفسك دون محادثة ذكية.",
    "assistantChatTitle":"المحادثة مع المساعد الذكي",
    "assistantChatPrivacy":"عند اختيار المحادثة، تُرسل رسائلك وتفاصيل الموضوع إلى Google Gemini لتوليد الردود، وتُحفظ في سجل حسابك ليطلع عليها المالك والإدارة إذا منحها المالك الصلاحية.",
    "assistantConsent":"أوافق على معالجة رسائل المحادثة بواسطة Google Gemini وحفظها في سجل حسابي.",
    "assistantConsentRequired":"وافق على معالجة رسائل المحادثة قبل البدء.",
    "startAssistantChat":"ابدأ المحادثة","assistantStarting":"جارٍ بدء المحادثة…",
    "sendChatMessage":"إرسال","assistantThinking":"جارٍ الرد…",
    "chatAssistantLabel":"مستر كركر","chatUserLabel":"أنت",
    "chatStartFailed":"تعذر بدء المحادثة. يمكنك اختيار تعبئة النموذج بدلًا منها.",
    "chatSendFailed":"تعذر إرسال الرسالة. حاول مجددًا.",
    "assistantUnavailable":"المساعد غير متاح الآن.",
    "assistantTooMany":"تم تجاوز عدد الرسائل المسموح به مؤقتًا.",
    "focusDetails":"نقاط أو مفاهيم للتركيز عليها","focusDetailsLabel":"نقاط أو مفاهيم للتركيز عليها",
    "audience":"الصف أو الفئة المستهدفة","audienceTeacher":"الصف الذي تدرّسه","audienceStudent":"الصف أو الفئة المستهدفة",
    "branchTeacher":"أضف أهداف الدرس أو أهم المفاهيم التي تريد تغطيتها.",
    "branchOther":"اذكر موضوعك والنتيجة التي تريد الوصول إليها.",
    "branchLesson":"اذكر النقاط التي يصعب عليك فهمها أو أجزاء الدرس التي تريد شرحها بوضوح أكبر.",
    "branchOral":"فكّر في الجمهور والأفكار التي تود إبرازها في عرضك الشفهي.",
    "branchProject":"أضف سؤال البحث أو متطلبات المشروع.",
    "duration":"مدة المحتوى التقريبية","notSure":"لست متأكدًا","minutes":"دقائق","durationCustom":"مدة أخرى",
    "slideCount":"عدد الشرائح التقريبي","slidesCustom":"عدد آخر",
    "language":"لغة المخرجات","arabic":"العربية","english":"الإنجليزية",
    "format":"صيغة العرض","pdfDefault":"PDF (الافتراضي)","pptx":"PowerPoint",
    "extraDetails":"تفاصيل أو ملاحظات إضافية","attachments":"مرفقات تساعدنا",
    "attachmentsOptional":"اختيارية — ننصح بإضافة ملف أو أكثر عن الموضوع",
    "dropFiles":"اسحب الملفات إلى هنا أو اختر من جهازك","fileRules":"حتى 10 ملفات، بحد 50 MB للملف الواحد. لا يمكن رفع الفيديو.",
    "videoSection":"هل تحتاج إلى الإشارة لفيديو؟","videoHelp":"الفيديو لا يُرفع كملف؛ يمكنك لصق رابطه ليراجعه الفريق مع طلبك.",
    "noVideo":"لا يوجد","videoLinkOption":"لدي رابط فيديو","videoReviewOption":"أريد طلب مراجعة من الفريق",
    "paste":"لصق","videoReviewHint":"سيُرفق طلب مراجعة الفيديو بهذا الطلب ليراجعه الفريق يدويًا.",
    "consentText":"أوافق على استخدام بياناتي ومرفقاتي لمراجعة طلبي وإعداد المخرجات المطلوبة، والتواصل معي عبر البريد الإلكتروني.",
    "previous":"السابق","reviewRequest":"مراجعة الطلب","thirdStepLabel":"الخطوة ٣ من ٣",
    "reviewHeading":"ألقِ نظرة أخيرة","reviewSubheading":"تأكد من التفاصيل قبل إرسال طلبك.",
    "previewOnly":"سيُحفظ الطلب ومرفقاته في مجلد خاص على Google Drive بعد اكتمال إعداد الربط.",
    "editDetails":"تعديل التفاصيل","sendRequest":"إرسال الطلب","submitting":"جارٍ إرسال الطلب...",
    "requestReceived":"تم استلام الطلب","successTitle":"شكرًا لك!",
    "successMessage":"وصل طلبك إلى مجلد العمل على Google Drive. راجع بريدك للاحتفاظ برقم الطلب.",
    "driveSavedTitle":"تم الحفظ في Drive","driveSavedText":"حُفظ طلبك ومرفقاته في مجلد خاص، وسيُراجَع من الإدارة قبل تجهيز العرض.",
    "submissionFailed":"تعذر إرسال الطلب.","serviceUnavailable":"استقبال الطلبات غير متاح حاليًا.",
    "goHome":"العودة للرئيسية","footerNote":"هذا الموقع يتبع سلسلة برامج مستر كركر",
    "socialHeading":"تواصل مع مستر كركر","socialDescription":"تجدنا على منصات التواصل بالاسم نفسه:",
    "ageError":"يجب أن يكون العمر 10 سنوات أو أكثر للمتابعة.","nameError":"أدخل اسمك الكامل.",
    "emailError":"أدخل بريدًا إلكترونيًا صحيحًا.","fieldRequired":"هذا الحقل مطلوب.",
    "schoolError":"أدخل اسم المدرسة أو الجهة.","requestTypeError":"اختر نوع الطلب.",
    "professionError":"اختر مجال مهنتك.","professionOtherError":"اكتب اسم مهنتك أو مجالك.",
    "filesTooMany":"يمكن اختيار 10 ملفات كحد أقصى.","fileTooLarge":"يتجاوز أحد الملفات حد 50 MB.",
    "videoFileError":"لا يمكن رفع ملفات الفيديو. استخدم خيار لصق الرابط أو طلب مراجعة الفيديو.",
    "filesInvalid":"تعذر قراءة الملفات المختارة.","videoUrlError":"أدخل رابط فيديو صحيحًا يبدأ بـ https://.",
    "pasteDenied":"لم يتمكن المتصفح من الوصول إلى الحافظة. الصق الرابط يدويًا.",
    "reviewBasics":"بيانات صاحب الطلب","reviewRequestInfo":"تفاصيل الطلب","reviewAttachments":"المرفقات",
    "reviewName":"الاسم","reviewEmail":"البريد الإلكتروني","reviewPhone":"الهاتف",
    "reviewOmanStatus":"الإقامة أو الدراسة في عُمان","reviewSchool":"المدرسة/الجهة",
    "reviewProfession":"المهنة أو المجال","roleOther":"مهنة أخرى","professionalRequest":"طلب مهني",
    "independent":"مستقل","reviewStage":"المرحلة الدراسية","reviewRole":"صفة مقدم الطلب",
    "reviewTopic":"الموضوع","reviewType":"نوع الطلب","reviewDeliverables":"المخرجات المطلوبة",
    "reviewObjective":"الهدف","reviewMethod":"طريقة الاستكمال",
    "methodAssistant":"محادثة مع المساعد الذكي","methodGuided":"تعبئة النموذج",
    "reviewSubject":"المادة/المجال","reviewAudience":"الفئة المستهدفة",
    "reviewDuration":"المدة بالدقائق (تقريبية)","reviewSlides":"عدد الشرائح (تقريبي)",
    "reviewLanguage":"لغة المحتوى","reviewFormat":"صيغة العرض","reviewNotes":"ملاحظات","reviewVideo":"الفيديو",
    "fileCount":"عدد الملفات","reviewVideoLink":"رابط فيديو مرفق للمراجعة","reviewVideoReview":"طلب مراجعة فيديو",
    "roleTeacher":"معلّم","roleStudent":"طالب","roleSchoolStudent":"طالب مدرسي","roleUniversityStudent":"طالب جامعي",
    "notProvided":"لم يحدد","presentationTitle":"موضوع عام/عرض شفهي","projectTitle":"مشروع/بحث",
    "teacherLesson":"إعداد درس","fileCountValue":"{{count}} ملف/ملفات مختارة",
    "maxFiles":"حتى 10 ملفات","maxFileSize":"50 MB لكل ملف",
    "signInCreate":"تسجيل الدخول / إنشاء حساب","ownerDashboard":"لوحة المالك","signOut":"تسجيل الخروج",
    "accountKicker":"حساب مستر كركر","accountTitle":"مرحبًا بك","accountDescription":"سجّل الدخول أو أنشئ حساب مستخدم لتقديم طلبك.",
    "signIn":"تسجيل الدخول","createAccount":"إنشاء حساب","password":"كلمة المرور (12 حرفًا على الأقل)",
    "fullNamePlain":"الاسم الكامل","emailPlain":"البريد الإلكتروني","accountPrivacyAccept":"أوافق على سياسة الخصوصية",
    "readPolicy":"قراءة السياسة","ownerSetupCode":"رمز إعداد المالك","createOwner":"إنشاء حساب المالك الوحيد",
    "ownerSetupTitle":"إعداد حساب المالك الوحيد","ownerSetupDescription":"أدخل رمز الإعداد السري وأنشئ الحساب الوحيد الذي يملك صلاحيات كاملة.",
    "privacyKicker":"معلومات مهمة","privacyTitle":"سياسة الخصوصية واستخدام الموقع",
    "privacyAccountHeading":"الحسابات","privacyAccountText":"يُستخدم بريدك لإنشاء حسابك وتسجيل الدخول وربط طلباتك بك.",
    "privacyRequestHeading":"الطلبات والمرفقات","privacyRequestText":"نسألك إن كنت تقيم أو تدرس في عُمان. تُستخدم معلوماتك ومرفقاتك لمراجعة الطلب وإعداد المخرجات.",
    "privacyStorageHeading":"التخزين","privacyStorageText":"عند تفعيل الربط، تُحفظ الطلبات والمرفقات في مجلد Google Drive خاص.",
    "privacyAgeHeading":"العمر والموافقة","privacyAgeText":"يجب أن يكون عمر صاحب الحساب 10 سنوات أو أكثر.",
    "privacyContactHeading":"الاستفسارات","privacyContactText":"للاستفسار تواصل مع إدارة الموقع.",
    "privacyTranslationText":"عند اختيار لغة أخرى تُرسل العبارات الثابتة فقط للترجمة الآلية.","closePolicy":"إغلاق",
    "placeholderName":"مثال: نور أحمد","placeholderSchoolName":"اسم المدرسة","placeholderUniversityName":"اسم الجامعة",
    "placeholderOrganizationName":"اسم الجهة","placeholderTopic":"اكتب الموضوع والفكرة الرئيسية",
    "placeholderObjective":"ما الذي يجب أن تحققه المخرجات؟","placeholderFocus":"ما النقاط التي يجب أن يغطيها العرض؟",
    "placeholderAudience":"مثال: الصف الخامس","placeholderNotes":"أضف متطلبات أو أفكارًا.",
    "requestDashboard":"إدارة الطلبات","feedbackLabel":"اقتراحات وشكاوى","feedbackSoon":"قريبًا",
    "feedbackInvite":"رأيك يهمنا","feedbackInviteText":"ساعدنا على تحسين سهولة الموقع وجودة الخدمة.",
    "siteSeries":"هذا الموقع يتبع سلسلة برامج مستر كركر"
  },
  en: {
    "interfaceLanguageLabel":"Interface language","interfaceArabic":"Arabic","interfaceEnglish":"English","otherLanguages":"Other languages",
    "eyebrow":"Learning is more fun with Mr. Karkar","heroTitle":"Let your idea<br><em>roar with Teacher Karkar.</em>",
    "heroDescription":"Turn a lesson or idea into the educational material you need. Choose one type or combine several in the same request.",
    "pointOne":"Simple, guided steps","pointTwo":"Free educational services",
    "heroNote":"Once Google Drive is connected, your request and attachments will be saved in a private folder.",
    "startKicker":"Your first step","whoAreYou":"Who's joining us today?","whoDescription":"Choose a path and Mr. Karkar will tailor the questions to your request.",
    "teacher":"I'm a teacher","teacherHint":"A clear lesson deck, step by step with Mr. Karkar",
    "schoolStudent":"I'm a school student","schoolStudentHint":"For primary and secondary school",
    "universityStudent":"I'm a university student","universityStudentHint":"For university study",
    "otherRole":"Other","otherRoleHint":"Choose your profession or field",
    "ageConfirm":"I confirm that I am 10 years old or older","privacyNote":"Your details are sent only after you consent and submit.",
    "back":"Back","stepBasics":"Basics","stepDetails":"Details","stepReview":"Review",
    "yourJourney":"Your journey with Mr. Karkar","formTitle":"Let's shape your idea<br>with Mr. Karkar.",
    "formDescription":"Mr. Karkar is with you step by step. Take your time; you can go back and edit before submitting.",
    "honestNote":"Mr. Karkar says: slide count is a guide. We may add a few when needed to cover the topic well.",
    "firstStepLabel":"STEP 1 OF 3","basicsHeading":"Let's get to know you and your idea",
    "basicsSubheading":"Mr. Karkar uses these basics to choose the right follow-up questions.",
    "fullName":"Full name","email":"Email address","phone":"Phone number (optional)",
    "countryScope":"Do you live or study in the Sultanate of Oman?","inOman":"Yes, in the Sultanate of Oman","outsideOman":"No, outside the Sultanate of Oman",
    "accountCountry":"Country of residence or study","accountCountryHint":"Enter the country where you live or study.",
    "countryNamePlaceholder":"e.g. Oman",
    "schoolStatus":"School, university, or organization","chooseOption":"Choose an option",
    "schoolOption":"I belong to a school or university","independentOption":"Independent, not affiliated with a school or university","otherOption":"Other organization",
    "schoolName":"School name","universityName":"University name","organizationName":"Organization name",
    "educationStage":"Education stage","primary":"Primary","middle":"Middle school","secondary":"Secondary","university":"University",
    "requestType":"Request type","lesson":"School lesson","oral":"General topic for an oral presentation","project":"Project or research",
    "profession":"Profession or field","professionOtherLabel":"Enter your profession",
    "professionHealthcare":"Healthcare and medicine","professionEducation":"Education and training","professionEngineering":"Engineering, architecture, and construction",
    "professionTechnology":"Information technology and telecommunications","professionScience":"Science, research, and laboratories",
    "professionBusiness":"Business, management, and entrepreneurship","professionFinance":"Accounting, finance, and banking",
    "professionLaw":"Law and legal services","professionPublicService":"Government and public service",
    "professionMedia":"Media, journalism, and communications","professionArtsDesign":"Arts, design, and content creation",
    "professionMarketingSales":"Marketing and sales","professionTrades":"Trades, maintenance, and technical services",
    "professionAgriculture":"Agriculture, food, and animal care","professionEnvironment":"Environment and sustainability",
    "professionHospitality":"Tourism, hospitality, and events","professionTransport":"Transport and logistics",
    "professionSafety":"Security, safety, and emergency services","professionSocialServices":"Social and community services",
    "professionSports":"Sports and fitness","professionPersonalCare":"Personal care and beauty",
    "professionManufacturing":"Industry and manufacturing","professionRetail":"Retail and customer service",
    "professionOther":"Another profession or field",
    "deliverablesHeading":"What would you like us to create?","deliverablesHint":"Choose one or more. Request each item on its own or combine it with a presentation.",
    "deliverablesRequired":"Choose at least one requested item.",
    "deliverablePresentation":"Presentation","deliverableAudioSummary":"Audio summary","deliverableSlideDeck":"Slide deck",
    "deliverableVideoSummary":"Video summary","deliverableMindMap":"Mind map","deliverableReport":"Reports",
    "deliverableFlashcards":"Flashcards","deliverableQuiz":"Quiz","deliverableChart":"Chart","deliverableSpreadsheet":"Spreadsheet",
    "mainTopic":"Subject and lesson topic","topicForTeacher":"Subject and lesson topic",
    "topicForStudent":"Title or main idea","topicForStudentLesson":"Subject and lesson topic",
    "topicForStudentOral":"Oral presentation title or idea","topicForStudentProject":"Project title or research question",
    "topicPlaceholderTeacher":"e.g. Science — The water cycle","topicPlaceholderStudent":"Enter the main idea",
    "topicPlaceholderLesson":"e.g. Science — The digestive system","topicPlaceholderOral":"e.g. Why reading matters or renewable energy",
    "topicPlaceholderProject":"Enter the project title or research question",
    "objective":"What is the goal of the requested materials?","requiredFields":"Required fields","continue":"Continue",
    "secondStepLabel":"STEP 2 OF 3","detailsHeading":"Mr. Karkar is ready for the details",
    "detailsSubheading":"Choose how to continue, then add details that will help us prepare your requested materials.",
    "methodLegend":"How would you like to continue?","assistantMethod":"Chat with the AI assistant","recommended":"Recommended",
    "assistantDescription":"Chat with it to provide your request details step by step.",
    "guidedMethod":"Fill out the form","guidedDescription":"Answer the organized fields yourself without an AI conversation.",
    "assistantChatTitle":"Chat with the AI assistant",
    "assistantChatPrivacy":"If you choose chat, your messages and topic details are sent to Google Gemini to generate replies and saved in your account history.",
    "assistantConsent":"I agree to have my chat messages processed by Google Gemini and saved in my account history.",
    "assistantConsentRequired":"Agree to AI processing before starting the chat.",
    "startAssistantChat":"Start chat","assistantStarting":"Starting chat…",
    "sendChatMessage":"Send","assistantThinking":"Replying…",
    "chatAssistantLabel":"Mr. Karkar","chatUserLabel":"You",
    "chatStartFailed":"The chat could not start.","chatSendFailed":"The message could not be sent.",
    "assistantUnavailable":"The assistant is unavailable right now.",
    "assistantTooMany":"The temporary message limit has been reached.",
    "focusDetails":"Points or concepts to focus on","focusDetailsLabel":"Points or concepts to focus on",
    "audience":"Target grade or audience","audienceTeacher":"Grade you teach","audienceStudent":"Target grade or audience",
    "branchTeacher":"Add the lesson goals or key concepts you want covered.",
    "branchOther":"Describe your topic and what you want to achieve.",
    "branchLesson":"Share any points that are difficult to understand.",
    "branchOral":"Think about your audience and the ideas to highlight.",
    "branchProject":"Add the research question, project requirements, and any sources.",
    "duration":"Approximate content length","notSure":"Not sure","minutes":"minutes","durationCustom":"Other",
    "slideCount":"Approximate slide count","slidesCustom":"Other",
    "language":"Output language","arabic":"Arabic","english":"English",
    "format":"Presentation format","pdfDefault":"PDF (default)","pptx":"PowerPoint",
    "extraDetails":"Additional details or notes","attachments":"Helpful attachments",
    "attachmentsOptional":"Optional — we recommend attaching relevant files",
    "dropFiles":"Drop files here or browse your device","fileRules":"Up to 10 files, 50 MB each. Video files are not accepted.",
    "videoSection":"Need to reference a video?","videoHelp":"Video files cannot be uploaded. Paste a link for the team to review.",
    "noVideo":"None","videoLinkOption":"I have a video link","videoReviewOption":"Request a team review",
    "paste":"Paste","videoReviewHint":"A video review request will be attached to this submission.",
    "consentText":"I agree to use my details and attachments to review my request and prepare the requested materials.",
    "previous":"Previous","reviewRequest":"Review request","thirdStepLabel":"STEP 3 OF 3",
    "reviewHeading":"One last look","reviewSubheading":"Check your details before submitting.",
    "previewOnly":"Your request and attachments will be saved in a private Google Drive folder once the integration is configured.",
    "editDetails":"Edit details","sendRequest":"Submit request","submitting":"Submitting request...",
    "requestReceived":"Request received","successTitle":"Thank you!",
    "successMessage":"Your request was saved to the Google Drive work folder. Keep your request number for reference.",
    "driveSavedTitle":"Saved to Drive","driveSavedText":"Your request and attachments were saved in a private folder for administrator review.",
    "submissionFailed":"We could not submit the request.","serviceUnavailable":"Request intake is currently unavailable.",
    "goHome":"Back to home","footerNote":"This website is part of the Mr. Karkar programs series",
    "socialHeading":"Connect with Mr. Karkar","socialDescription":"Find us on social media using the same name:",
    "ageError":"You must be at least 10 years old to continue.","nameError":"Enter your full name.",
    "emailError":"Enter a valid email address.","fieldRequired":"This field is required.",
    "schoolError":"Enter your school or organization name.","requestTypeError":"Choose a request type.",
    "professionError":"Choose your professional field.","professionOtherError":"Enter your profession or field.",
    "filesTooMany":"You can select up to 10 files.","fileTooLarge":"A file exceeds the 50 MB limit.",
    "videoFileError":"Video files are not accepted.","filesInvalid":"The selected files could not be read.",
    "videoUrlError":"Enter a valid video URL starting with https://.","pasteDenied":"The browser could not access your clipboard.",
    "reviewBasics":"Requester details","reviewRequestInfo":"Request details","reviewAttachments":"Attachments",
    "reviewName":"Name","reviewEmail":"Email","reviewPhone":"Phone",
    "reviewOmanStatus":"Living or studying in Oman","reviewSchool":"School/organization",
    "reviewProfession":"Profession or field","roleOther":"Other profession","professionalRequest":"Professional request",
    "independent":"Independent","reviewStage":"Education stage","reviewRole":"Requester type",
    "reviewTopic":"Topic","reviewType":"Request type","reviewDeliverables":"Requested materials",
    "reviewObjective":"Goal","reviewMethod":"Detail method",
    "methodAssistant":"AI assistant chat","methodGuided":"Form",
    "reviewSubject":"Subject/field","reviewAudience":"Target audience",
    "reviewDuration":"Length in minutes (approx.)","reviewSlides":"Slide count (approx.)",
    "reviewLanguage":"Content language","reviewFormat":"Presentation format","reviewNotes":"Notes","reviewVideo":"Video",
    "fileCount":"File count","reviewVideoLink":"Video link for review","reviewVideoReview":"Video review request",
    "roleTeacher":"Teacher","roleStudent":"Student","roleSchoolStudent":"School student","roleUniversityStudent":"University student",
    "notProvided":"Not specified","presentationTitle":"General topic/oral presentation","projectTitle":"Project/research",
    "teacherLesson":"Lesson presentation","fileCountValue":"{{count}} file(s) selected",
    "maxFiles":"Up to 10 files","maxFileSize":"50 MB each",
    "signInCreate":"Sign in / Create account","ownerDashboard":"Owner dashboard","signOut":"Sign out",
    "accountKicker":"Mr. Karkar account","accountTitle":"Welcome","accountDescription":"Sign in or create a user account to submit a request.",
    "signIn":"Sign in","createAccount":"Create account","password":"Password (at least 12 characters)",
    "fullNamePlain":"Full name","emailPlain":"Email","accountPrivacyAccept":"I agree to the privacy policy",
    "readPolicy":"Read policy","ownerSetupCode":"Owner setup code","createOwner":"Create the single owner account",
    "ownerSetupTitle":"Set up the single owner account","ownerSetupDescription":"Enter the secret setup code and create the only account with full control.",
    "privacyKicker":"Important information","privacyTitle":"Privacy and website use",
    "privacyAccountHeading":"Accounts","privacyAccountText":"Your email is used to create your account and link requests to you.",
    "privacyRequestHeading":"Requests and attachments","privacyRequestText":"We ask whether you live or study in Oman. Your information is used to review your request.",
    "privacyStorageHeading":"Storage","privacyStorageText":"When connected, requests and attachments are saved in a private Google Drive folder.",
    "privacyAgeHeading":"Age and consent","privacyAgeText":"Account holders must be at least 10 years old.",
    "privacyContactHeading":"Questions","privacyContactText":"For questions, contact the site administration.",
    "privacyTranslationText":"When another language is selected, fixed interface phrases are sent to an automatic translation service.","closePolicy":"Close",
    "placeholderName":"e.g. Noor Ahmed","placeholderSchoolName":"School name","placeholderUniversityName":"University name",
    "placeholderOrganizationName":"Organization name","placeholderTopic":"Enter the subject and main idea",
    "placeholderObjective":"What should the requested materials achieve?","placeholderFocus":"What points should the presentation cover?",
    "placeholderAudience":"e.g. Grade 5","placeholderNotes":"Add requirements or ideas.",
    "requestDashboard":"Request dashboard","feedbackLabel":"Suggestions and complaints","feedbackSoon":"Coming soon",
    "feedbackInvite":"We value your feedback","feedbackInviteText":"Help us improve the website and service quality.",
    "siteSeries":"This website is part of the Mr. Karkar programs series"
  }
};

const state = {
  language: "ar",
  role: "",
  studentType: "",
  files: [],
  conversationId: "",
  chatMessages: [],
  chatStarted: false,
  chatBusy: false
};

const form = document.getElementById("request-form");
const welcomeScreen = document.getElementById("welcome-screen");
const requestScreen = document.getElementById("request-screen");
const successScreen = document.getElementById("success-screen");

function t(key) {
  return translations[state.language]?.[key]
    ?? window.siteUiTranslation?.(state.language, key)
    ?? translations.en[key]
    ?? key;
}

function setLanguage(language) {
  state.language = language;
  const isArabic = language === "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = ["ar","fa","he","ur","ps"].includes(language) ? "rtl" : "ltr";
  window.setLanguageControls?.(language);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t(el.dataset.i18n);
    if (/<\/?(?:br|em|b|small|u)\b/i.test(v)) el.innerHTML = v; else el.textContent = v;
  });
  document.querySelectorAll("[data-placeholder-ar]").forEach((el) => {
    const key = ({name:"placeholderName",schoolName:"placeholderSchoolName",topic:"placeholderTopic",
      objective:"placeholderObjective",focusDetails:"placeholderFocus",audience:"placeholderAudience",
      notes:"placeholderNotes",country:"countryNamePlaceholder"})[el.name];
    el.placeholder = isArabic ? el.dataset.placeholderAr
      : (key ? t(key) : el.dataset.placeholderEn);
  });
  document.querySelectorAll("option[value='5'], option[value='10'], option[value='15'], option[value='20'], option[value='30']").forEach((opt) => {
    opt.textContent = `${opt.value} ${isArabic ? (["5","10"].includes(opt.value) ? "دقائق" : "دقيقة") : t("minutes")}`;
  });
  if (state.role) {
    const badge = document.getElementById("role-badge");
    if (badge) badge.textContent = state.role === "teacher" ? t("roleTeacher")
      : state.role === "student" ? roleLabel() : t("roleOther");
    updateTopicPrompt();
    updateMethodDescription();
    updateProfessionField();
    updateSchoolNameLabel();
    configureStageOptions();
    const p3 = document.querySelector('.form-page[data-page="3"]');
    if (p3?.classList.contains("active")) renderReview();
  }
  if (state.chatStarted) renderAssistantChat();
  document.getElementById("year").textContent = new Date().getFullYear();
}

function showPage(number) {
  document.querySelectorAll(".form-page").forEach((page) => page.classList.toggle("active", Number(page.dataset.page) === number));
  document.querySelectorAll(".progress-step").forEach((step, i) => {
    step.classList.toggle("active", i + 1 === number);
    step.classList.toggle("complete", i + 1 < number);
  });
  if (number === 3) renderReview();
  requestScreen.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setRole(role, studentType = "") {
  if (!["teacher", "student", "other"].includes(role)) return;
  studentType = role === "student" ? (studentType === "university" ? "university" : "school") : "";
  if (!document.getElementById("age-confirm").checked) {
    const error = document.getElementById("age-error");
    error.textContent = t("ageError");
    error.hidden = false;
    document.getElementById("age-confirm").focus();
    return;
  }
  document.getElementById("age-error").hidden = true;
  if (!window.siteAccount?.account) {
    window.siteAccount?.setPendingRole(role, studentType);
    window.siteAccount?.open("login");
    return;
  }
  state.role = role;
  state.studentType = studentType;
  welcomeScreen.hidden = true;
  successScreen.hidden = true;
  requestScreen.hidden = false;
  document.getElementById("request-type-field").hidden = role !== "student";
  document.getElementById("request-type").required = role === "student";
  document.getElementById("request-type").value = role === "other" ? "professional" : "";
  form.reset();
  window.siteAccount?.fillRequestIdentity();
  configureStageOptions();
  document.getElementById("role-badge").textContent = roleLabel();
  state.conversationId = "";
  state.chatMessages = [];
  state.chatStarted = false;
  state.chatBusy = false;
  document.getElementById("assistant-chat-error").hidden = true;
  document.getElementById("profession").required = role === "other";
  document.getElementById("profession-field").hidden = role !== "other";
  document.getElementById("profession-other-field").hidden = true;
  form.elements.namedItem("professionOther").required = false;
  clearErrors();
  form.elements.namedItem("schoolName").required = false;
  document.getElementById("school-name-field").hidden = true;
  updateTopicPrompt();
  document.getElementById("file-list").replaceChildren();
  document.getElementById("file-error").hidden = true;
  updateDeliverableFields();
  document.getElementById("video-link-wrap").hidden = true;
  document.getElementById("video-review-hint").hidden = true;
  state.files = [];
  updateMethodDescription();
  showPage(1);
}
window.setRequestRole = setRole;
window.getUiText = t;
window.updateUiDictionary = (language, dictionary) => { translations[language] = dictionary; };

function clearErrors() {
  document.querySelectorAll(".field-error").forEach((e) => { e.textContent = ""; });
  document.querySelectorAll(".field[aria-invalid='true']").forEach((f) => f.removeAttribute("aria-invalid"));
  document.querySelector("[data-deliverable-group]")?.removeAttribute("aria-invalid");
}

function markInvalid(name, message) {
  const error = document.querySelector(`[data-error-for="${name}"]`);
  if (error) error.textContent = message;
  const input = form.elements.namedItem(name);
  if (input?.closest(".field")) input.closest(".field").setAttribute("aria-invalid", "true");
}

function updateProfessionField() {
  if (state.role !== "other") return;
  const profession = form.elements.namedItem("profession");
  const isCustom = profession.value === "other";
  document.getElementById("profession-other-field").hidden = !isCustom;
  form.elements.namedItem("professionOther").required = isCustom;
}

function updateSchoolNameLabel() {
  const schoolStatus = form.elements.namedItem("schoolStatus").value;
  const isUni = state.role === "student" && state.studentType === "university";
  const key = schoolStatus === "other" ? "organizationName" : isUni ? "universityName" : "schoolName";
  document.getElementById("school-name-label").innerHTML = t(key);
  form.elements.namedItem("schoolName").placeholder = t(schoolStatus === "other" ? "placeholderOrganizationName" : isUni ? "placeholderUniversityName" : "placeholderSchoolName");
}

function configureStageOptions() {
  const stage = form.elements.namedItem("stage");
  stage.querySelectorAll("option[value]").forEach((opt) => {
    if (!opt.value) return;
    opt.hidden = state.role === "student"
      && (state.studentType === "university" ? opt.value !== "university" : opt.value === "university");
  });
  if (state.role === "student" && state.studentType === "university") stage.value = "university";
  else if (state.role !== "student" || stage.value === "university") stage.value = "";
  updateSchoolNameLabel();
}

function roleLabel() {
  if (state.role === "teacher") return t("roleTeacher");
  if (state.role === "student") return t(state.studentType === "university" ? "roleUniversityStudent" : "roleSchoolStudent");
  if (state.role === "other") {
    const sel = selectedText("profession");
    const v = form.elements.namedItem("profession").value;
    return v && v !== "other" ? sel : form.elements.namedItem("professionOther").value.trim() || t("roleOther");
  }
  return "";
}

function validatePageOne() {
  clearErrors();
  const data = new FormData(form);
  let valid = true;
  if (!String(data.get("name") ?? "").trim()) { markInvalid("name", t("nameError")); valid = false; }
  const email = String(data.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { markInvalid("email", t("emailError")); valid = false; }
  if (!data.get("countryScope")) { markInvalid("countryScope", t("fieldRequired")); valid = false; }
  if (!data.get("schoolStatus")) { markInvalid("schoolStatus", t("fieldRequired")); valid = false; }
  if (["school", "other"].includes(String(data.get("schoolStatus"))) && !String(data.get("schoolName") ?? "").trim()) {
    markInvalid("schoolName", t("schoolError")); valid = false;
  }
  if (!data.get("stage")) { markInvalid("stage", t("fieldRequired")); valid = false; }
  if (state.role === "other" && !data.get("profession")) { markInvalid("profession", t("professionError")); valid = false; }
  if (state.role === "other" && data.get("profession") === "other" && !String(data.get("professionOther") || "").trim()) {
    markInvalid("professionOther", t("professionOtherError")); valid = false;
  }
  if (!String(data.get("topic") ?? "").trim()) { markInvalid("topic", t("fieldRequired")); valid = false; }
  if (state.role === "student" && !data.get("requestType")) { markInvalid("requestType", t("requestTypeError")); valid = false; }
  if (!data.getAll("deliverables").length) {
    document.querySelector("[data-deliverable-group]").setAttribute("aria-invalid", "true");
    document.getElementById("deliverables-error").textContent = t("deliverablesRequired");
    valid = false;
  }
  if (!valid) {
    const first = document.querySelector(".field[aria-invalid='true'] input, .field[aria-invalid='true'] select, .field[aria-invalid='true'] textarea");
    if (document.querySelector("[data-deliverable-group][aria-invalid='true']")) {
      document.querySelector("[name='deliverables']")?.focus();
    } else first?.focus();
  }
  return valid;
}

function validatePageTwo() {
  clearErrors();
  const data = new FormData(form);
  let valid = true;
  if (!data.get("method")) valid = false;
  if (!data.get("presentationLanguage")) { markInvalid("presentationLanguage", t("fieldRequired")); valid = false; }
  if (!data.get("consent")) { markInvalid("consent", t("fieldRequired")); valid = false; }
  if (data.get("method") === "assistant" && !state.conversationId) {
    document.getElementById("assistant-chat-error").textContent = t("chatStartFailed");
    document.getElementById("assistant-chat-error").hidden = false;
    document.getElementById("assistant-chat-start").focus();
    valid = false;
  }
  const vo = data.get("videoOption");
  if (vo === "link") {
    try {
      const url = new URL(String(data.get("videoUrl") || ""));
      if (url.protocol !== "https:") throw new Error("https");
    } catch {
      document.getElementById("video-error").textContent = t("videoUrlError");
      valid = false;
    }
  }
  if (!valid) {
    const first = document.querySelector(".field[aria-invalid='true'] input, .field[aria-invalid='true'] select, .field[aria-invalid='true'] textarea");
    first?.focus();
    if (document.querySelector('[data-error-for="consent"]:not(:empty)')) form.elements.namedItem("consent").focus();
  }
  return valid;
}

function getFilesFromInput(input) {
  const selected = Array.from(input.files ?? []);
  const combined = [...state.files];
  for (const file of selected) {
    if (!combined.some((e) => e.name === file.name && e.size === file.size && e.lastModified === file.lastModified)) combined.push(file);
  }
  if (combined.length > 10) {
    document.getElementById("file-error").textContent = t("filesTooMany");
    document.getElementById("file-error").hidden = false;
    input.value = "";
    return;
  }
  if (combined.some((f) => f.size > 50 * 1024 * 1024)) {
    document.getElementById("file-error").textContent = t("fileTooLarge");
    document.getElementById("file-error").hidden = false;
    input.value = "";
    return;
  }
  const video = combined.find((f) => f.type.startsWith("video/") || /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(f.name));
  if (video) {
    document.getElementById("file-error").textContent = t("videoFileError");
    document.getElementById("file-error").hidden = false;
    input.value = "";
    return;
  }
  state.files = combined;
  document.getElementById("file-error").hidden = true;
  input.value = "";
  renderFiles();
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function renderFiles() {
  const list = document.getElementById("file-list");
  list.replaceChildren();
  state.files.forEach((file, i) => {
    const row = document.createElement("div");
    row.className = "file-item";
    const type = document.createElement("span");
    type.className = "file-type";
    type.textContent = (file.name.split(".").pop() || "FILE").slice(0, 5).toUpperCase();
    const name = document.createElement("span");
    name.className = "file-name";
    name.textContent = file.name;
    const size = document.createElement("span");
    size.className = "file-size";
    size.textContent = formatSize(file.size);
    const remove = document.createElement("button");
    remove.className = "file-remove";
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${file.name}`);
    remove.addEventListener("click", () => { state.files.splice(i, 1); renderFiles(); });
    row.append(type, name, size, remove);
    list.append(row);
  });
}

function selectedText(name) {
  const el = form.elements.namedItem(name);
  if (!el) return "";
  if (el.tagName === "SELECT") return el.selectedOptions[0]?.textContent.trim() ?? "";
  return el.value.trim();
}

function reviewItem(label, value) {
  const item = document.createElement("div");
  item.className = "review-item";
  const h = document.createElement("small");
  h.textContent = label;
  const c = document.createElement("strong");
  c.textContent = value || t("notProvided");
  item.append(h, c);
  return item;
}

function reviewGroup(title, items) {
  const group = document.createElement("section");
  group.className = "review-group";
  const h = document.createElement("h3");
  h.textContent = title;
  const grid = document.createElement("div");
  grid.className = "review-grid";
  items.forEach(([label, value]) => grid.append(reviewItem(label, value)));
  group.append(h, grid);
  return group;
}

function updateDeliverableFields() {
  if (!form) return;
  const sel = new Set(new FormData(form).getAll("deliverables"));
  const needsSlides = sel.has("presentation") || sel.has("slide_deck");
  document.getElementById("slide-count-field").hidden = !needsSlides;
  document.getElementById("format-field").hidden = !needsSlides;
  form.elements.namedItem("slideCount").disabled = !needsSlides;
  form.elements.namedItem("format").disabled = !needsSlides;
}

function renderReview() {
  const data = new FormData(form);
  const school = data.get("schoolStatus") === "independent" ? t("independent") : String(data.get("schoolName") || "").trim();
  const dlKeys = {
    presentation:"deliverablePresentation", audio_summary:"deliverableAudioSummary", slide_deck:"deliverableSlideDeck",
    video_summary:"deliverableVideoSummary", mind_map:"deliverableMindMap", report:"deliverableReport",
    flashcards:"deliverableFlashcards", quiz:"deliverableQuiz", chart:"deliverableChart", spreadsheet:"deliverableSpreadsheet"
  };
  const selected = data.getAll("deliverables");
  const deliverables = selected.map((v) => t(dlKeys[v])).join(", ");
  const hasSlides = selected.some((v) => v === "presentation" || v === "slide_deck");
  const requestType = state.role === "teacher" ? t("teacherLesson") : state.role === "other" ? t("professionalRequest") : ({
    lesson: t("lesson"), oral: t("presentationTitle"), project: t("projectTitle")
  })[data.get("requestType")];
  const method = data.get("method") === "assistant" ? t("methodAssistant") : t("methodGuided");
  const duration = data.get("duration") && data.get("duration") !== "custom" ? `${data.get("duration")} ${t("minutes")}` : t("notProvided");
  const vo = data.get("videoOption");
  const video = vo === "link" ? String(data.get("videoUrl") || "").trim()
    : vo === "review" ? t("reviewVideoReview") : t("noVideo");
  const container = document.getElementById("review-content");
  container.replaceChildren(
    reviewGroup(t("reviewBasics"), [
      [t("reviewName"), String(data.get("name") || "").trim()],
      [t("reviewEmail"), String(data.get("email") || "").trim()],
      [t("reviewPhone"), String(data.get("phone") || "").trim()],
      [t("reviewOmanStatus"), selectedText("countryScope")],
      [t("reviewSchool"), school],
      [t("reviewStage"), selectedText("stage")],
      [t("reviewRole"), roleLabel()]
    ]),
    reviewGroup(t("reviewRequestInfo"), [
      [t("reviewType"), requestType],
      ...(state.role === "other" ? [[t("reviewProfession"), roleLabel()]] : []),
      [t("reviewDeliverables"), deliverables],
      [t("reviewTopic"), String(data.get("topic") || "").trim()],
      [t("reviewObjective"), String(data.get("objective") || "").trim()],
      [t("reviewMethod"), method],
      [t("focusDetailsLabel"), String(data.get("focusDetails") || "").trim()],
      [t("reviewAudience"), String(data.get("audience") || "").trim()],
      [t("reviewDuration"), duration],
      ...(hasSlides ? [[t("reviewSlides"), data.get("slideCount") && data.get("slideCount") !== "custom" ? String(data.get("slideCount")) : t("notProvided")]] : []),
      [t("reviewLanguage"), selectedText("presentationLanguage")],
      ...(hasSlides ? [[t("reviewFormat"), selectedText("format")]] : []),
      [t("reviewNotes"), String(data.get("notes") || "").trim()],
      [t("reviewVideo"), video]
    ]),
    reviewGroup(t("reviewAttachments"), [[t("fileCount"), t("fileCountValue").replace("{{count}}", String(state.files.length))]])
  );
}

function updateBranchDetails() {
  const rt = form.elements.namedItem("requestType").value;
  const key = state.role === "teacher" ? "branchTeacher" : state.role === "other" ? "branchOther" : ({lesson:"branchLesson", oral:"branchOral", project:"branchProject"})[rt];
  document.getElementById("branch-prompt").textContent = key ? t(key) : "";
  document.getElementById("focus-label").innerHTML = t("focusDetails");
  const audienceLabel = form.querySelector("[name='audience']").parentElement.querySelector("span");
  audienceLabel.innerHTML = t(state.role === "teacher" ? "audienceTeacher" : "audienceStudent");
}

function updateTopicPrompt() {
  const type = form.elements.namedItem("requestType").value;
  const key = state.role === "other" ? "topicForStudent" : type === "lesson" ? "topicForStudentLesson" : type === "oral" ? "topicForStudentOral" : type === "project" ? "topicForStudentProject" : "topicForStudent";
  document.getElementById("topic-label").innerHTML = t(state.role === "teacher" ? "topicForTeacher" : key);
  const phKey = state.role === "teacher" ? "topicPlaceholderTeacher" : ({lesson:"topicPlaceholderLesson", oral:"topicPlaceholderOral", project:"topicPlaceholderProject"})[type] ?? "topicPlaceholderStudent";
  form.elements.namedItem("topic").placeholder = t(phKey);
  updateBranchDetails();
}

function updateMethodDescription() {
  const assistantSelected = form.elements.namedItem("method").value === "assistant";
  document.getElementById("assistant-chat").hidden = !assistantSelected;
  document.querySelectorAll(".guided-only").forEach((el) => { el.hidden = assistantSelected; });
  document.getElementById("assistant-chat-start").hidden = state.chatStarted;
  document.getElementById("assistant-chat-log").hidden = !state.chatStarted;
  document.getElementById("assistant-chat-composer").hidden = !state.chatStarted;
  if (!assistantSelected) document.getElementById("assistant-chat-error").hidden = true;
}

function renderAssistantChat() {
  const log = document.getElementById("assistant-chat-log");
  log.replaceChildren();
  state.chatMessages.forEach((m) => {
    const item = document.createElement("article");
    item.className = `assistant-chat-message ${m.sender === "assistant" ? "from-assistant" : "from-user"}`;
    const s = document.createElement("strong");
    s.textContent = t(m.sender === "assistant" ? "chatAssistantLabel" : "chatUserLabel");
    const c = document.createElement("p");
    c.textContent = m.content;
    item.append(s, c);
    log.append(item);
  });
  log.scrollTop = log.scrollHeight;
}

function assistantContext() {
  const data = new FormData(form);
  return {
    role: state.role,
    studentType: state.role === "student" ? state.studentType : undefined,
    stage: data.get("stage"),
    requestType: state.role === "teacher" ? "teacher_lesson" : state.role === "other" ? "professional" : data.get("requestType"),
    profession: state.role === "other" ? data.get("profession") : undefined,
    professionOther: state.role === "other" ? data.get("professionOther") : undefined,
    deliverables: data.getAll("deliverables"),
    topic: data.get("topic"),
    objective: data.get("objective"),
    presentationLanguage: data.get("presentationLanguage"),
  };
}

async function startAssistantChat() {
  const errorBox = document.getElementById("assistant-chat-error");
  errorBox.hidden = true;
  if (!document.getElementById("assistant-consent").checked) {
    errorBox.textContent = t("assistantConsentRequired");
    errorBox.hidden = false;
    document.getElementById("assistant-consent").focus();
    return;
  }
  const startBtn = document.getElementById("assistant-chat-start");
  startBtn.disabled = true;
  startBtn.textContent = t("assistantStarting");
  try {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: { ...(await window.siteAccount.getHeaders()), "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ aiConsent: true, context: assistantContext() }),
    });
    const result = await response.json();
    if (!response.ok) throw Object.assign(new Error(result.error || t("chatStartFailed")), { status: response.status });
    state.conversationId = result.conversationId;
    state.chatMessages = [{ sender: "assistant", content: result.reply }];
    state.chatStarted = true;
    renderAssistantChat();
    document.getElementById("assistant-chat-input").focus();
  } catch (error) {
    errorBox.textContent = error.status === 429 ? t("assistantTooMany")
      : error.status === 503 ? t("assistantUnavailable") : t("chatStartFailed");
    errorBox.hidden = false;
  } finally {
    startBtn.disabled = false;
    startBtn.textContent = t("startAssistantChat");
    updateMethodDescription();
  }
}

async function sendAssistantMessage() {
  const input = document.getElementById("assistant-chat-input");
  const message = input.value.trim();
  if (!message || !state.conversationId || state.chatBusy) return;
  const errorBox = document.getElementById("assistant-chat-error");
  const sendBtn = document.getElementById("assistant-chat-send");
  errorBox.hidden = true;
  state.chatBusy = true;
  sendBtn.disabled = true;
  sendBtn.textContent = t("assistantThinking");
  try {
    const response = await fetch(`/api/conversations/${encodeURIComponent(state.conversationId)}/reply`, {
      method: "POST",
      headers: { ...(await window.siteAccount.getHeaders()), "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ content: message }),
    });
    const result = await response.json();
    if (!response.ok) throw Object.assign(new Error(result.error || t("chatSendFailed")), { status: response.status });
    state.chatMessages.push({ sender: "user", content: message }, { sender: "assistant", content: result.reply });
    input.value = "";
    renderAssistantChat();
  } catch (error) {
    errorBox.textContent = error.status === 429 ? t("assistantTooMany")
      : error.status === 503 ? t("assistantUnavailable") : t("chatSendFailed");
    errorBox.hidden = false;
  } finally {
    state.chatBusy = false;
    sendBtn.disabled = false;
    sendBtn.textContent = t("sendChatMessage");
  }
}

document.querySelectorAll(".role-option").forEach((btn) => btn.addEventListener("click", () => setRole(btn.dataset.role, btn.dataset.studentType)));
document.getElementById("age-confirm").addEventListener("change", () => {
  if (document.getElementById("age-confirm").checked) document.getElementById("age-error").hidden = true;
});
document.getElementById("back-to-welcome").addEventListener("click", () => {
  requestScreen.hidden = true;
  welcomeScreen.hidden = false;
  welcomeScreen.scrollIntoView({ behavior: "smooth", block: "start" });
});
form.addEventListener("change", (event) => {
  if (event.target.name === "schoolStatus") {
    const named = ["school", "other"].includes(event.target.value);
    document.getElementById("school-name-field").hidden = !named;
    form.elements.namedItem("schoolName").required = named;
    updateSchoolNameLabel();
  }
  if (event.target.name === "requestType") updateTopicPrompt();
  if (event.target.name === "profession") {
    updateProfessionField();
    document.querySelector('[data-error-for="profession"]').textContent = "";
    document.querySelector('[data-error-for="professionOther"]').textContent = "";
  }
  if (event.target.name === "deliverables") {
    updateDeliverableFields();
    if (form.querySelector("[name='deliverables']:checked")) {
      document.getElementById("deliverables-error").textContent = "";
      document.querySelector("[data-deliverable-group]").removeAttribute("aria-invalid");
    }
  }
  if (event.target.name === "method") updateMethodDescription();
  if (event.target.name === "videoOption") {
    document.getElementById("video-link-wrap").hidden = event.target.value !== "link";
    document.getElementById("video-review-hint").hidden = event.target.value !== "review";
    if (event.target.value !== "link") document.getElementById("video-error").textContent = "";
  }
});
document.getElementById("to-details").addEventListener("click", () => { if (validatePageOne()) showPage(2); });
document.getElementById("to-review").addEventListener("click", () => { if (validatePageTwo()) showPage(3); });
document.getElementById("assistant-chat-start").addEventListener("click", startAssistantChat);
document.getElementById("assistant-chat-send").addEventListener("click", sendAssistantMessage);
document.getElementById("assistant-chat-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendAssistantMessage(); }
});
document.querySelectorAll("[data-previous]").forEach((btn) => btn.addEventListener("click", () => showPage(2)));
document.getElementById("attachments").addEventListener("change", (event) => getFilesFromInput(event.target));
const dropZone = document.getElementById("drop-zone");
dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragging"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
dropZone.addEventListener("drop", (event) => {
  event.preventDefault();
  dropZone.classList.remove("dragging");
  getFilesFromInput({ files: event.dataTransfer.files, value: "" });
});
document.getElementById("paste-video").addEventListener("click", async () => {
  const inp = document.getElementById("video-url");
  try {
    inp.value = await navigator.clipboard.readText();
    document.getElementById("video-error").textContent = "";
    inp.focus();
  } catch {
    document.getElementById("video-error").textContent = t("pasteDenied");
    inp.focus();
  }
});
document.getElementById("video-url").addEventListener("input", () => { document.getElementById("video-error").textContent = ""; });
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validatePageTwo()) { showPage(2); return; }
  const submitBtn = form.querySelector('[type="submit"]');
  const submitText = submitBtn.querySelector("[data-i18n]");
  const errorBox = document.getElementById("submission-error");
  const previousText = submitText.textContent;
  submitBtn.disabled = true;
  submitText.textContent = t("submitting");
  errorBox.hidden = true;
  try {
    const fd = new FormData(form);
    const values = Object.fromEntries(fd.entries());
    values.deliverables = fd.getAll("deliverables");
    delete values.attachments;
    values.role = state.role;
    if (state.role === "student") values.studentType = state.studentType;
    values.requestType = state.role === "teacher" ? "teacher_lesson" : state.role === "other" ? "professional" : values.requestType;
    if (values.method === "assistant") values.conversationId = state.conversationId;
    else delete values.conversationId;
    values.ageConfirmed = document.getElementById("age-confirm").checked;
    values.consent = form.elements.namedItem("consent").checked;
    const body = new FormData();
    body.append("requestData", JSON.stringify(values));
    state.files.forEach((file) => body.append("attachments", file, file.name));
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: await window.siteAccount.getHeaders(),
      body,
      credentials: "same-origin",
    });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 503) throw new Error(t("serviceUnavailable"));
      const detail = Array.isArray(result.details) ? result.details.join(" ") : result.error;
      throw new Error(detail || t("submissionFailed"));
    }
    document.getElementById("request-number").textContent = result.requestId;
    document.getElementById("request-number").hidden = false;
    const callout = document.querySelector(".demo-callout");
    callout.querySelector("strong").textContent = t("driveSavedTitle");
    callout.querySelector("span").textContent = t("driveSavedText");
    requestScreen.hidden = true;
    successScreen.hidden = false;
    successScreen.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    errorBox.textContent = error.message === t("serviceUnavailable") ? error.message : `${t("submissionFailed")} ${error.message}`;
    errorBox.hidden = false;
    errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = previousText;
  }
});
document.getElementById("go-home").addEventListener("click", () => {
  form.reset();
  state.files = [];
  state.role = "";
  state.studentType = "";
  document.getElementById("file-list").replaceChildren();
  document.getElementById("request-number").hidden = true;
  document.getElementById("submission-error").hidden = true;
  state.conversationId = "";
  state.chatMessages = [];
  state.chatStarted = false;
  state.chatBusy = false;
  document.getElementById("school-name-field").hidden = true;
  document.getElementById("request-type-field").hidden = true;
  successScreen.hidden = true;
  requestScreen.hidden = true;
  welcomeScreen.hidden = false;
  welcomeScreen.scrollIntoView({ behavior: "smooth", block: "start" });
});

setLanguage("ar");
window.configureSiteLanguage?.(translations.en, setLanguage);
const initialAccount = new URLSearchParams(location.search).get("account");
if (initialAccount === "login" || initialAccount === "register") window.siteAccount.open(initialAccount);
