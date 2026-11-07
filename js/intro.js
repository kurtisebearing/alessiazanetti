/* Landing page menu: the menu button toggles .menu-open on <body>;
   clicking the artist's name (or the area around it) opens it too. */
(function () {
  "use strict";

  const body = document.body;
  const button = document.querySelector(".menu-button");
  const label = button.querySelector(".visually-hidden");
  const nameTrigger = document.querySelector(".name-trigger");
  const firstLink = document.querySelector(".intro-nav a");

  function setOpen(open) {
    body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close menu" : "Open menu";
    nameTrigger.setAttribute("aria-expanded", String(open));
    nameTrigger.disabled = open;   // only opens; use the ✕ or Esc to close
    if (open) setTimeout(() => firstLink.focus({ preventScroll: true }), 150);
  }

  button.addEventListener("click", () => setOpen(!body.classList.contains("menu-open")));
  nameTrigger.addEventListener("click", () => setOpen(true));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      setOpen(false);
      button.focus();
    }
  });
})();
