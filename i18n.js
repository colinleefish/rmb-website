const LANG_LABELS = {
  en: "English",
  zh: "简体中文",
};

const translations = {
  en: {
    "footer.langPicker": "Select language",
    "hero.tagline": "Agent memory tool",
    "hero.lead": "One memory layer for all your agents.",
    "download.macos": "Download for macOS",
    "agents.label": "Works with",
  },
  zh: {
    "footer.langPicker": "选择语言",
    "hero.tagline": "Agent 记忆工具",
    "hero.lead": "一个记忆层，服务所有 Agent。",
    "download.macos": "下载 macOS 版",
    "agents.label": "支持",
  },
};

function readLang() {
  const stored = localStorage.getItem("rmb.site.lang");
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!dict[key]) return;
    el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (!dict[key]) return;
    el.setAttribute("aria-label", dict[key]);
  });

  const label = document.getElementById("lang-picker-label");
  if (label) label.textContent = LANG_LABELS[lang];

  document.querySelectorAll(".lang-picker-option").forEach((option) => {
    const selected = option.dataset.lang === lang;
    option.setAttribute("aria-selected", String(selected));
  });
}

window.SiteI18n = { readLang, applyTranslations, LANG_LABELS };
