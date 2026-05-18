/* Cartoon's Barber Shop -- main.js
   Handles: loader exit, nav hamburger, scroll reveal,
   IntersectionObserver nav underline, gallery lightbox.
*/
"use strict";

/* ── Loader ─────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  const bar = loader.querySelector(".loader-bar-fill");
  let progress = 0;
  const tick = setInterval(() => {
    progress += 8;
    if (bar) bar.style.width = Math.min(progress, 100) + "%";
    if (progress >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add("fade-out");
        setTimeout(() => {
          loader.style.display = "none";
          document.body.classList.remove("loading");
        }, 450);
      }, 150);
    }
  }, 80);
})();

/* ── Nav hamburger ──────────────────────────────────────────── */
(function initNav() {
  const ham = document.querySelector(".nav-hamburger");
  const drawer = document.getElementById("nav-drawer");
  if (!ham || !drawer) return;

  ham.addEventListener("click", () => {
    const open = ham.getAttribute("aria-expanded") === "true";
    ham.setAttribute("aria-expanded", String(!open));
    ham.classList.toggle("open", !open);
    drawer.classList.toggle("open", !open);
  });

  // Close drawer on link click
  drawer.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      ham.setAttribute("aria-expanded", "false");
      ham.classList.remove("open");
      drawer.classList.remove("open");
    });
  });
})();

/* ── Scroll reveal ──────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
})();

/* ── Nav active section underline ───────────────────────────── */
(function initNavActive() {
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        navLinks.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === "#" + id);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => io.observe(s));
})();

/* ── Gallery lightbox ───────────────────────────────────────── */
(function initLightbox() {
  const gallery = document.querySelector(".gallery-grid");
  if (!gallery) return;

  // Build lightbox DOM
  const overlay = document.createElement("div");
  overlay.id = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Imagen ampliada / Full image");
  overlay.innerHTML = `
    <button class="lb-close" aria-label="Cerrar / Close">&#10005;</button>
    <img class="lb-img" src="" alt="" />
    <p class="lb-caption"></p>
  `;
  document.body.appendChild(overlay);

  const lbImg = overlay.querySelector(".lb-img");
  const lbCap = overlay.querySelector(".lb-caption");
  const lbClose = overlay.querySelector(".lb-close");

  function openLb(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lbCap.innerHTML = caption || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLb() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  gallery.querySelectorAll(".gallery-item").forEach((item) => {
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    const img = item.querySelector("img");
    const caption = item.dataset.caption || "";

    const activate = () =>
      openLb(img.src, img.alt, caption);

    item.addEventListener("click", activate);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });
  });

  lbClose.addEventListener("click", closeLb);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });
})();

/* ── Lazy load images ───────────────────────────────────────── */
(function initLazyLoad() {
  if ("loading" in HTMLImageElement.prototype) return; // native lazy supported
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const img = e.target;
        img.src = img.dataset.src || img.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach((img) => io.observe(img));
})();
