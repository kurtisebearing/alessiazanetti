/*
 * Gallery + lightbox.
 *
 * Reads data/paintings.json and renders it into any element with
 * data-gallery. Options (as attributes on that element):
 *   data-gallery="featured"  → only paintings with "featured": true
 *   data-gallery="all"       → everything, with series filter buttons
 *   data-limit="3"           → cap the number shown
 *
 * NOTE: fetch() doesn't work when opening files directly (file://).
 * Preview with a local server — e.g. the VS Code "Live Server" extension,
 * or `python3 -m http.server` — or on GitHub Pages.
 */
(function () {
  "use strict";

  const DATA_URL = "data/paintings.json";

  // ---- mobile nav toggle (shared by every page) ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- footer year ----
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const container = document.querySelector("[data-gallery]");
  if (!container) return;

  const mode = container.dataset.gallery;
  const limit = parseInt(container.dataset.limit, 10) || Infinity;
  const filtersEl = document.querySelector("[data-filters]");

  let all = [];
  let visible = [];
  let current = 0;

  fetch(DATA_URL)
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((paintings) => {
      // newest first
      all = paintings.sort((a, b) => (b.year || 0) - (a.year || 0));
      if (mode === "featured") all = all.filter((p) => p.featured);
      if (filtersEl) buildFilters();
      render("All");
    })
    .catch((err) => {
      container.innerHTML =
        '<p class="meta">Could not load paintings. If you opened this file directly, ' +
        "preview it through a local server instead (see README).</p>";
      console.error("Gallery load failed:", err);
    });

  function meta(p) {
    return [p.year, p.medium, p.size].filter(Boolean).join(" · ");
  }

  // Price for works that are for sale. Works with "available": false show no
  // price (just the small dot next to the title).
  function status(p) {
    if (p.available === false) return "";
    return p.price || "";
  }

  function escapeHTML(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function buildFilters() {
    const series = ["All", ...new Set(all.map((p) => p.series).filter(Boolean))];
    if (series.length <= 2) return; // nothing worth filtering
    filtersEl.innerHTML = series
      .map((s, i) => `<button type="button" aria-pressed="${i === 0}">${escapeHTML(s)}</button>`)
      .join("");
    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      filtersEl.querySelectorAll("button").forEach((b) =>
        b.setAttribute("aria-pressed", String(b === btn))
      );
      render(btn.textContent);
    });
  }

  function render(series) {
    visible = all
      .filter((p) => series === "All" || p.series === series)
      .slice(0, limit);

    container.innerHTML = visible
      .map(
        (p, i) => `
      <figure class="card">
        <button type="button" data-index="${i}" aria-label="View ${escapeHTML(p.title)} larger">
          <div class="frame">
            <img src="${escapeHTML(p.thumb || p.image)}" alt="${escapeHTML(p.alt || p.title)}"
                 loading="lazy" decoding="async">
          </div>
          <figcaption>
            <div class="title${p.available === false ? " sold" : ""}">${escapeHTML(p.title)}</div>
            <div class="meta">${escapeHTML(meta(p))}</div>
            ${status(p) ? `<div class="price">${escapeHTML(status(p))}</div>` : ""}
          </figcaption>
        </button>
      </figure>`
      )
      .join("");
  }

  // ---- lightbox (native <dialog>) ----
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Painting viewer");
  dialog.innerHTML = `
    <div class="lightbox-inner">
      <img alt="">
      <div class="lightbox-caption" aria-live="polite"></div>
    </div>
    <button type="button" class="lb-close" aria-label="Close">&times;</button>
    <button type="button" class="lb-prev" aria-label="Previous painting">&#8249;</button>
    <button type="button" class="lb-next" aria-label="Next painting">&#8250;</button>`;
  document.body.appendChild(dialog);

  const lbImg = dialog.querySelector("img");
  const lbCap = dialog.querySelector(".lightbox-caption");

  function show(i) {
    current = (i + visible.length) % visible.length;
    const p = visible[current];
    lbImg.src = p.image;
    lbImg.alt = p.alt || p.title;
    lbCap.innerHTML = `
      <div class="title">${escapeHTML(p.title)}</div>
      <div class="meta">${escapeHTML([meta(p), status(p)].filter(Boolean).join(" · "))}</div>
      ${p.description ? `<p>${escapeHTML(p.description)}</p>` : ""}`;
    // preload neighbours
    [current + 1, current - 1].forEach((n) => {
      const q = visible[(n + visible.length) % visible.length];
      if (q) new Image().src = q.image;
    });
  }

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-index]");
    if (!btn) return;
    show(Number(btn.dataset.index));
    dialog.showModal();
  });

  dialog.querySelector(".lb-close").addEventListener("click", () => dialog.close());
  dialog.querySelector(".lb-prev").addEventListener("click", () => show(current - 1));
  dialog.querySelector(".lb-next").addEventListener("click", () => show(current + 1));

  // click on dark background closes
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.classList.contains("lightbox-inner")) dialog.close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  // basic swipe on touch screens
  let startX = null;
  dialog.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
