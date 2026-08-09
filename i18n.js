const translations = {
  en: {
    "nav.download": "Download",
    "hero.badge": "Preview",
    "hero.announcement": "RMB Desktop for macOS. Linux and Windows coming soon.",
    "hero.title": "Local-first memory for AI coding agents",
    "hero.lead":
      "Capture sessions, distill them into structured memories, and recall what matters — all on your machine. No server required.",
    "download.product.desktop": "Desktop",
    "download.tab.source": "Source",
    "download.macos.title": "RMB Desktop for macOS",
    "download.macos.lead": "Drag to Applications, run the setup wizard, and connect your agents.",
    "download.macos.detail": "Apple Silicon & Intel · .dmg",
    "download.linux.title": "RMB Desktop for Linux",
    "download.linux.lead": "AppImage and .deb packages are on the roadmap.",
    "download.windows.title": "RMB Desktop for Windows",
    "download.windows.lead": "Installer (.msi) is on the roadmap.",
    "download.action": "Download",
    "download.soon": "Coming soon",
    "download.source.title": "Build from source",
    "download.source.lead": "Requires Go 1.23+, Node.js, and Rust for the Tauri app.",
    "preview.response":
      'Recalled 3 memories from session cursor-hook-setup — JWT in httpOnly cookies, refresh rotation, no localStorage tokens.',
    "preview.tag.profile": "profile",
    "preview.tag.scene": "scene",
    "preview.result1": "Prefers httpOnly cookies over localStorage for tokens",
    "preview.result2": "Discussed refresh token rotation in session on Aug 2",
    "features.title": "How it works",
    "features.capture.title": "Capture",
    "features.capture.body":
      "Hooks record conversation turns from your coding agents in the background.",
    "features.distill.title": "Distill",
    "features.distill.body":
      "A local daemon turns raw chats into atoms, scenes, and durable memories.",
    "features.recall.title": "Recall",
    "features.recall.body":
      "Hybrid full-text and vector search brings the right context back into your sessions.",
  },
  zh: {
    "nav.download": "下载",
    "hero.badge": "预览版",
    "hero.announcement": "RMB Desktop 已支持 macOS，Linux 与 Windows 即将推出。",
    "hero.title": "面向 AI 编程 Agent 的本地优先记忆",
    "hero.lead":
      "捕获会话、提炼结构化记忆、按需召回——全部在你的电脑上完成，无需自建服务器。",
    "download.product.desktop": "桌面版",
    "download.tab.source": "源码",
    "download.macos.title": "RMB Desktop · macOS",
    "download.macos.lead": "拖入应用程序文件夹，运行安装向导并连接 Agent。",
    "download.macos.detail": "Apple Silicon 与 Intel · .dmg",
    "download.linux.title": "RMB Desktop · Linux",
    "download.linux.lead": "AppImage 与 .deb 安装包正在开发中。",
    "download.windows.title": "RMB Desktop · Windows",
    "download.windows.lead": "安装包 (.msi) 正在开发中。",
    "download.action": "下载",
    "download.soon": "即将推出",
    "download.source.title": "从源码构建",
    "download.source.lead": "需要 Go 1.23+、Node.js 和 Rust（Tauri 应用）。",
    "preview.response":
      "从会话 cursor-hook-setup 召回 3 条记忆——JWT 使用 httpOnly cookie、刷新轮换、不用 localStorage 存 token。",
    "preview.tag.profile": "profile",
    "preview.tag.scene": "scene",
    "preview.result1": "偏好用 httpOnly cookie 而非 localStorage 存储 token",
    "preview.result2": "8 月 2 日的会话中讨论过 refresh token 轮换",
    "features.title": "工作原理",
    "features.capture.title": "捕获",
    "features.capture.body": "通过 Hook 在后台记录编程 Agent 的对话内容。",
    "features.distill.title": "提炼",
    "features.distill.body": "本地守护进程将原始对话转化为原子、场景和持久记忆。",
    "features.recall.title": "召回",
    "features.recall.body": "全文 + 向量混合搜索，把合适的上下文带回你的会话。",
  },
};

function readLang() {
  const stored = localStorage.getItem("rmb.site.lang");
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function applyTranslations(lang) {
  const dict = translations[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!dict[key]) return;
    if (key === "preview.response") {
      el.innerHTML = dict[key].replace(
        /cursor-hook-setup/,
        "<em>cursor-hook-setup</em>",
      );
      return;
    }
    el.textContent = dict[key];
  });
  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "zh" ? "EN" : "中文";
}

window.SiteI18n = { readLang, applyTranslations };
