const DOWNLOADS_URL = "/downloads.json";

function initTabs() {
  const platformTabs = document.getElementById("platform-tabs");
  if (!platformTabs) return;

  const tabs = [...platformTabs.querySelectorAll(".tab")];
  const panes = [...document.querySelectorAll(".panel-pane[data-product='desktop']")];

  function selectPlatform(platform) {
    tabs.forEach((tab) => {
      const active = tab.dataset.platform === platform;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    panes.forEach((pane) => {
      const active = pane.dataset.platform === platform;
      pane.classList.toggle("active", active);
      pane.hidden = !active;
    });
  }

  platformTabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab?.dataset.platform) return;
    selectPlatform(tab.dataset.platform);
  });
}

function initCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-copy-target");
      const el = document.getElementById(id);
      if (!el) return;
      try {
        await navigator.clipboard.writeText(el.value);
        const original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => {
          btn.textContent = original;
        }, 1500);
      } catch {
        // ignore
      }
    });
  });
}

async function loadDownloads() {
  const macosLink = document.getElementById("download-macos");
  const macosMeta = document.getElementById("macos-meta");
  if (!macosLink) return;

  try {
    const res = await fetch(DOWNLOADS_URL, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const macos = data.products?.desktop?.platforms?.macos;
    if (!macos?.url) return;

    macosLink.href = macos.url;
    if (macos.version && macosMeta) {
      const base = macosMeta.textContent.replace(/ · v[\d.]+$/, "");
      macosMeta.textContent = `${base} · v${macos.version}`;
    }
  } catch {
    // Keep GitHub releases fallback from HTML.
  }
}

function initLang() {
  let lang = window.SiteI18n.readLang();
  window.SiteI18n.applyTranslations(lang);

  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    lang = lang === "zh" ? "en" : "zh";
    localStorage.setItem("rmb.site.lang", lang);
    window.SiteI18n.applyTranslations(lang);
    toggle.textContent = lang === "zh" ? "EN" : "中文";
  });
}

initLang();
initTabs();
initCopyButtons();
loadDownloads();
