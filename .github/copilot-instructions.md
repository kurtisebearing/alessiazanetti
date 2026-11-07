# Copilot instructions for this repository

This is a static portfolio website for the painter Alessia Zanetti, hosted on GitHub Pages.

- Use plain HTML, CSS and vanilla JavaScript only. Don't add frameworks, npm,
  build tools, jQuery or CSS libraries.
- All painting data lives in `data/paintings.json`. To add or edit a painting, change
  that file and never hard-code painting cards in HTML. `js/gallery.js` renders them.
  Fields: id, title, year, medium, size, series, image, thumb, alt, description,
  available, featured.
- Image paths: full size goes in `images/paintings/<id>.jpg` and the thumbnail in
  `images/thumbs/<id>.jpg`. File names are lowercase and hyphenated.
- `index.html` is a standalone landing page: a full-screen painting and a round menu button
  that washes the image out and reveals the menu. It uses only `css/intro.css` and
  `js/intro.js`, plus the Jost font in `fonts/`. Every other page uses `css/style.css`.
- The header (nav) and footer are duplicated in `home.html`, `gallery.html`,
  `about.html` and `contact.html`. When you change one, change all of them, and set
  `aria-current="page"` on the current page's nav link.
- Styling lives only in `css/style.css`. Reuse the CSS custom properties in `:root`
  (`--bg`, `--text`, `--muted`, `--line`, `--accent`, `--font-display`, `--font-body`)
  instead of new hard-coded colours. Don't use inline styles.
- Keep it accessible: every image needs meaningful `alt` text, use semantic elements
  (header/nav/main/footer/figure), and keep everything keyboard-usable.
- Keep the design minimal so the paintings stay the focus.
