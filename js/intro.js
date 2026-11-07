/* Landing page menu: the round button toggles .menu-open on <body>. */
(function () {
  "use strict";

  const body = document.body;
  const button = document.querySelector(".menu-button");
  const label = button.querySelector(".visually-hidden");
  const firstLink = document.querySelector(".intro-nav a");

  function setOpen(open) {
    body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Close menu" : "Open menu";
    if (open) setTimeout(() => firstLink.focus({ preventScroll: true }), 150);
  }

  button.addEventListener("click", () => setOpen(!body.classList.contains("menu-open")));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && body.classList.contains("menu-open")) {
      setOpen(false);
      button.focus();
    }
  });
})();
