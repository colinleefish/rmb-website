const RELEASES_BASE = "https://releases.re-mem-ber.me";

function preferredMacArch() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("arm") || ua.includes("aarch64")) return "aarch64";
  if (ua.includes("intel") || ua.includes("x86_64")) return "x86_64";
  return "aarch64";
}

function pickMacArtifact(platforms) {
  const macos = platforms?.macos;
  if (!macos) return null;
  const arch = preferredMacArch();
  return macos[arch] || macos.aarch64 || macos.x86_64 || Object.values(macos)[0];
}

async function loadDownloads() {
  const link = document.getElementById("download-macos");
  const versionEl = document.getElementById("download-version");
  if (!link) return;

  try {
    const res = await fetch(`${RELEASES_BASE}/latest.json`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const artifact = pickMacArtifact(data.platforms);
    if (artifact?.url) link.href = artifact.url;

    if (versionEl && data.version) {
      const lang = window.SiteI18n?.readLang?.() || "en";
      versionEl.textContent =
        lang === "zh" ? `最新版本 v${data.version}` : `Latest v${data.version}`;
      versionEl.hidden = false;
    }
  } catch {
    // Keep GitHub releases fallback from HTML.
  }
}

function initLang() {
  if (!window.SiteI18n) return;

  let lang = window.SiteI18n.readLang();
  window.SiteI18n.applyTranslations(lang);

  const picker = document.getElementById("lang-picker");
  const toggle = document.getElementById("lang-toggle");
  const menu = document.getElementById("lang-picker-menu");
  if (!picker || !toggle || !menu) return;

  let open = false;

  function setOpen(next) {
    open = next;
    toggle.setAttribute("aria-expanded", String(open));
    menu.toggleAttribute("hidden", !open);
  }

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!open);
  });

  menu.addEventListener("click", (event) => {
    const option = event.target.closest(".lang-picker-option");
    if (!option?.dataset.lang) return;

    event.stopPropagation();
    lang = option.dataset.lang;
    localStorage.setItem("rmb.site.lang", lang);
    window.SiteI18n.applyTranslations(lang);
    loadDownloads();
    setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!open) return;
    if (picker.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) setOpen(false);
  });
}

function boot() {
  initLang();
  loadDownloads();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
