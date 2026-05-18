/* NeonFrame bilingual toggle (Mexican Spanish / English).
 *
 * Any element with both data-en and data-es attributes will swap its
 * content when the toggle is clicked. innerHTML is supported so links
 * and emphasis can live inside the strings.
 *
 * For attributes (placeholder, aria-label, title), use data-en-attr-X
 * and data-es-attr-X where X is the target attribute name.
 *
 * Persistence: choice is saved to localStorage.nf_lang. On load, if
 * localStorage is unset, we default to ES (Spanish-primary site).
 * If browser language starts with "en", we default to EN instead.
 */
(function () {
  "use strict";

  const STORAGE_KEY = "nf_lang";
  const SUPPORTED = ["en", "es"];

  function detectInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
    const browser = (navigator.language || "es").slice(0, 2).toLowerCase();
    return browser === "en" ? "en" : "es";
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = "es";
    document.documentElement.lang = lang;
    document.body.dataset.lang = lang;

    document.querySelectorAll("[data-en][data-es]").forEach((el) => {
      const val = el.dataset[lang];
      if (typeof val === "string") el.innerHTML = val;
    });

    // Attribute swaps. Pattern: data-en-attr-placeholder, data-es-attr-placeholder
    document.querySelectorAll("*").forEach((el) => {
      for (const key of Object.keys(el.dataset)) {
        const m = key.match(/^(en|es)Attr([A-Z]\w*)$/);
        if (!m) continue;
        const [_, kLang, attrPascal] = m;
        if (kLang !== lang) continue;
        const attr = attrPascal
          .replace(/([A-Z])/g, (s, c) => "-" + c.toLowerCase())
          .replace(/^-/, "");
        el.setAttribute(attr, el.dataset[key]);
      }
    });

    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.dataset.current = lang;
      btn.setAttribute(
        "aria-label",
        lang === "en" ? "Cambiar a español" : "Switch to English"
      );
      // Update visual pill state
      const pills = btn.querySelectorAll("[data-pill]");
      pills.forEach((p) => {
        p.classList.toggle("active", p.dataset.pill === lang);
      });
    });

    localStorage.setItem(STORAGE_KEY, lang);
  }

  function toggleLang() {
    const cur = localStorage.getItem(STORAGE_KEY) || detectInitialLang();
    applyLang(cur === "en" ? "es" : "en");
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectInitialLang());
    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleLang();
      });
    });
  });

  // Expose for debugging
  window.NFi18n = { applyLang, toggleLang, detect: detectInitialLang };
})();
