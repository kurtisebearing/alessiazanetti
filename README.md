# Alessia Zanetti — Artist Portfolio

A plain HTML/CSS/JS portfolio site: no build step and no framework. You can host it
for free on GitHub Pages.

```
index.html          landing page: full-screen painting, round menu button (top left)
home.html           home: hero + featured works
gallery.html        all paintings, filterable by series, with a lightbox
about.html          biography, artist statement, CV
contact.html        email link + contact form
css/intro.css       landing page styling only
css/style.css       all other styling (colours/fonts are variables at the top)
js/gallery.js       loads the paintings data, builds the grid + lightbox, mobile menu
data/paintings.json the list of paintings (the only file you edit to add work)
images/paintings/   large web-optimised images (shown in the lightbox)
images/thumbs/      small versions for the grid
```

The images in `images/` are coloured **placeholders**. Replace them with real photos.

---

## 1. Preview locally

The gallery loads `data/paintings.json` with `fetch()`, and browsers block that
when you double-click an `.html` file. Use a tiny local server instead:

- **VS Code:** install the **Live Server** extension, right-click `index.html`, then
  choose **Open with Live Server**.
- **Terminal:** run `python3 -m http.server`, then open http://localhost:8000.

## 2. Add a painting

1. Export two JPEGs with the same file name (lowercase, hyphens, no spaces):
   - `images/paintings/my-painting.jpg`: **long edge 1600–2000 px**, quality ~80,
     ideally **under 400 KB**
   - `images/thumbs/my-painting.jpg`: **long edge ~600 px**, ideally **under 80 KB**

   You can use [Squoosh](https://squoosh.app) (free, in the browser) or any photo editor.
   Photograph the work straight-on in even daylight and crop out the wall.
2. Add an entry to `data/paintings.json`:

```json
{
  "id": "my-painting",
  "title": "My Painting",
  "year": 2026,
  "medium": "Oil on canvas",
  "size": "50 × 70 cm",
  "series": "Interiors",
  "image": "images/paintings/my-painting.jpg",
  "thumb": "images/thumbs/my-painting.jpg",
  "alt": "Short description of what the painting shows, for screen readers",
  "description": "Optional sentence shown in the lightbox.",
  "available": true,
  "price": "$1,200",
  "featured": false
}
```

- Separate each entry from the next with a comma, but don't put a comma after the
  last one. A missing or extra comma is the most common reason the gallery stops loading.
- `"featured": true` puts the painting on the home page (the first 3 are shown).
- `"available": false` shows **Not for sale** under the caption, with a small red dot.
- `"price": "$1,700"` shows a price under available works. Leave it as `""` to show no price.
- `"series"` creates the filter buttons on the gallery page automatically.
- Paintings are sorted newest first by `year`.

## 3. Edit the text

- **Bio and CV:** edit `about.html`. To change the portrait, replace
  `images/portrait.jpg` (portrait format, 2:3, about 1066 × 1600 px).
- **Email and Instagram:** the footer of every page and `contact.html` link to
  `alessia_zanetti@yahoo.it` and `instagram.com/alessia_zanetti`. To change them,
  search all four HTML files and replace every occurrence.
- **Contact form:** submissions are sent through [Formspree](https://formspree.io)
  (form `xgaabarr`), which forwards them by email. To use a different form, change the
  `action` URL on the `<form>` in `contact.html`.
- **Colours and fonts:** change the variables in `:root` at the top of `css/style.css`.
- **Landing page painting:** in `index.html`, change the `src` of `<img class="intro-bg">`
  and the matching `preload` link. The painting fills the screen and keeps its proportions.
  `object-position` in `css/intro.css` controls which part stays in view. When the menu is
  open, the painting is softened by a white wash: `--intro-wash` in `css/intro.css` sets how
  strong it is, and `--intro-ink` sets the colour of the name and menu.
  Use a large image (2000 px or more on the long edge) so it stays sharp on big screens.
- **Page backgrounds:** each page's `<body>` tag has a background class. The options are
  `bg-marble-light`, `bg-plaster`, `bg-marble-taupe` and `bg-stone`. Change the class to switch
  backgrounds, or remove it for a plain background. Images live in `images/backgrounds/`.
  They always fill the screen and keep their proportions, so only the edges get cropped.

The header and footer are repeated in all four HTML files. If you change the
navigation or footer, make the same change in each file.

## 4. Publish on GitHub Pages

1. Push to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment** and set
   **Source: Deploy from a branch**, **Branch: `main` / root**.
3. After a minute or so the site is live at `https://<username>.github.io/<repo>/`.
4. Optional: to use a custom domain such as `alessiazanetti.com`, enter it under
   **Settings → Pages → Custom domain** and follow GitHub's DNS instructions.

## 5. Working with GitHub Copilot

`.github/copilot-instructions.md` tells Copilot how this site is structured, so its
suggestions follow the same conventions. Some useful prompts:

- "Add a painting called *X* to paintings.json using images/paintings/x.jpg"
- "Add a 'Press' section to about.html in the same style as the CV lists"
- "Change the accent colour to a deep green and the headings font to Cormorant Garamond from Google Fonts"
- "Add an 'Exhibitions' page and link it in the nav on every page"
