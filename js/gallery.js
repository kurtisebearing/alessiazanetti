/*
 * Site script: menu, series links, gallery and lightbox.
 *
 * Paintings come from data/paintings.json. They are rendered into any element
 * with data-gallery:
 *   data-gallery="featured"  → only paintings with "featured": true
 *   data-gallery="all"       → everything; gallery.html#<series> shows one series
 *   data-limit="4"           → cap the number shown
 *
 * Each "series" in the JSON automatically gets a link under "works" in the menu.
 *
 * NOTE: fetch() doesn't work when opening files directly (file://).
 * Preview with a local server — e.g. the VS Code "Live Server" extension,
 * or `python3 -m http.server` — or on GitHub Pages.
 */
(function () {
  "use strict";

  const DATA_URL = "data/paintings.json";

  // ---- mobile menu ----
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector(".nav-toggle");
  if (sidebar && toggle) {
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "close" : "menu";
    });
  }

  // ---- footer year ----
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const seriesNav = document.querySelector("[data-series-nav]");
  const container = document.querySelector("[data-gallery]");
  if (!seriesNav && !container) return;

  const slug = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  function escapeHTML(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function captionHTML(p) {
    const line1 = `<em>${escapeHTML(p.title)}</em>${p.year ? ", " + escapeHTML(p.year) : ""}`;
    const line2 = [p.medium, p.size].filter(Boolean).map(escapeHTML).join(", ");
    const sold = p.available === false ? `<br><span class="status">sold</span>` : "";
    return line1 + (line2 ? "<br>" + line2 : "") + sold;
  }

  let all = [];
  let visible = [];
  let current = 0;

  fetch(DATA_URL)
    .then((r) => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then((paintings) => {
      all = paintings.sort((a, b) => (b.year || 0) - (a.year || 0)); // newest first
      if (seriesNav) buildSeriesNav();
      if (container) {
        render();
        window.addEventListener("hashchange", render);
      }
    })
    .catch((err) => {
      if (container) {
        container.innerHTML =
          "<p>Could not load paintings. If you opened this file directly, " +
          "preview it through a local server instead (see README).</p>";
      }
      console.error("Gallery load failed:", err);
    });

  function currentSeries() {
    return decodeURIComponent(location.hash.slice(1));
  }

  function buildSeriesNav() {
    const series = [...new Set(all.map((p) => p.series).filter(Boolean))];
    if (series.length < 2) return;
    seriesNav.innerHTML = series
      .map((s) => `<li><a href="gallery.html#${slug(s)}" data-series="${slug(s)}">${escapeHTML(s)}</a></li>`)
      .join("");
    seriesNav.hidden = false;
    markActiveSeries();
    window.addEventListener("hashchange", markActiveSeries);
    // close the mobile menu after choosing a series on the gallery page
    seriesNav.addEventListener("click", () => {
      if (sidebar && sidebar.classList.contains("open")) toggle.click();
    });
  }

  function markActiveSeries() {
    const onGallery = container && container.dataset.gallery === "all";
    seriesNav.querySelectorAll("a").forEach((a) => {
      a.classList.toggle("active", onGallery && a.dataset.series === currentSeries());
    });
  }

  function render() {
    const mode = container.dataset.gallery;
    const limit = parseInt(container.dataset.limit, 10) || Infinity;
    let list = all;

    if (mode === "featured") {
      list = all.filter((p) => p.featured);
    } else {
      const wanted = currentSeries();
      const match = wanted && all.filter((p) => slug(p.series || "") === wanted);
      if (match && match.length) list = match;
      const title = document.querySelector("[data-gallery-title]");
      if (title) {
        title.textContent = match && match.length ? match[0].series : "works";
      }
    }

    visible = list.slice(0, limit);
    container.innerHTML = visible
      .map(
        (p, i) => `
      <figure class="work">
        <button type="button" data-index="${i}" aria-label="View ${escapeHTML(p.title)} larger">
          <img src="${escapeHTML(p.thumb || p.image)}" alt="${escapeHTML(p.alt || p.title)}"
               loading="lazy" decoding="async">
        </button>
        <figcaption class="caption">${captionHTML(p)}</figcaption>
      </figure>`
      )
      .join("");
  }

  if (!container) return;

  // ---- lightbox (native <dialog>) ----
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Painting viewer");
  dialog.innerHTML = `
    <div class="lightbox-inner">
      <img alt="">
      <div class="lightbox-caption" aria-live="polite"></div>
    </div>
    <button type="button" class="lb-close">close</button>
    <button type="button" class="lb-prev" aria-label="Previous painting">prev</button>
    <button type="button" class="lb-next" aria-label="Next painting">next</button>`;
  document.body.appendChild(dialog);

  const lbImg = dialog.querySelector("img");
  const lbCap = dialog.querySelector(".lightbox-caption");

  function show(i) {
    current = (i + visible.length) % visible.length;
    const p = visible[current];
    lbImg.src = p.image;
    lbImg.alt = p.alt || p.title;
    lbCap.innerHTML = captionHTML(p) + (p.description ? `<p>${escapeHTML(p.description)}</p>` : "");
    [current + 1, current - 1].forEach((n) => {   // preload neighbours
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

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog || e.target.classList.contains("lightbox-inner")) dialog.close();
  });

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  let startX = null;
  dialog.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
