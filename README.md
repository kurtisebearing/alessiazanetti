# Alessia Zanetti — Artist Portfolio

A plain HTML/CSS/JS portfolio site: no build step and no framework. You can host it
for free on GitHub Pages.

```
index.html          home: full-screen painting with the name over it, then selected works
gallery.html        "works": all paintings uncropped with captions, lightbox on click
about.html          portrait, biography, CV
contact.html        email, Instagram, contact form
css/style.css       all styling (colours are variables at the top)
fonts/              Jost typeface, self-hosted (free, SIL Open Font License)
js/gallery.js       builds the works pages, the series links in the menu, the lightbox
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
   - `images/thumbs/my-painting.jpg`: **long edge ~900 px**, ideally **under 150 KB**

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
  "featured": false
}
```

- Separate each entry from the next with a comma, but don't put a comma after the
  last one. A missing or extra comma is the most common reason the gallery stops loading.
- `"featured": true` puts the painting on the home page (up to 6 are shown).
- `"available": false` adds "sold" under its caption.
- `"series"` automatically adds a link for that series under **works** in the menu
  (for example `gallery.html#lagoon`).
- Paintings are sorted newest first by `year`.

## 3. Edit the text

- **Bio and CV:** edit `about.html`. To change the portrait, replace `images/portrait.jpg`
  (portrait format, about 1200 × 1600 px).
- **Home page image:** the full-screen painting is the `<img>` inside `<header class="hero">`
  in `index.html`. Point it at any file in `images/paintings/` and update the caption
  beneath it. A landscape-format work looks best.
- **Email and Instagram:** the footer of every page and `contact.html` link to
  `alessia_zanetti@yahoo.it` and `instagram.com/alessia_zanetti`. To change them,
  search all four HTML files and replace every occurrence.
- **Contact form:** create a free form at [formspree.io](https://formspree.io), then
  replace `YOUR_FORM_ID` in `contact.html`. If you don't want a form, delete it and
  keep only the email link.
- **Colours:** change the variables in `:root` at the top of `css/style.css`.

The sidebar menu is repeated in `gallery.html`, `about.html` and `contact.html`. The
home page has its own menu over the hero image. If you add or rename a page, update all four.

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
