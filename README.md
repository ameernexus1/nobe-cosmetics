# Nobe Cosmetics — Website

A static, mobile-first marketing & catalog website for **Nobe Cosmetics**, a small
skincare brand in Lahore, Pakistan. It showcases products and takes orders through
**WhatsApp click-to-chat** and a **contact form** — there is no cart, checkout, or
payment gateway.

Built with **plain HTML5 + CSS3 + vanilla JavaScript**. No frameworks, no build
step, no `npm install`. It runs by opening the files directly and deploys to
**GitHub Pages** with zero configuration.

---

## 📁 Project structure

```
/
├── index.html                  Homepage
├── shop.html                   All products + category filter + search
├── product-obtan-soap.html     Product detail (content from js/products.js)
├── product-face-mask.html      Product detail (content from js/products.js)
├── about.html                  Brand story
├── contact.html                Contact form + WhatsApp + map
├── privacy.html / terms.html   Simple placeholder legal pages
├── css/
│   └── style.css               All styles + :root design tokens
├── js/
│   ├── products.js             ⭐ SITE config + product data (edit this most)
│   ├── partials.js             Shared header/footer (edit navbar/footer once)
│   └── main.js                 Menu, carousels, filters, modal, wishlist
├── assets/
│   ├── logo.svg                Placeholder logo (swap for real one)
│   └── images/                 Placeholder product/brand images (SVG)
├── .nojekyll                   Tells GitHub Pages to serve files as-is
└── README.md
```

---

## 🖥️ Preview locally

**Option A — just open it.** Double-click `index.html` (or drag it into a browser).
Everything works from the `file://` protocol, including the shared header/footer.

**Option B — local server** (nice for realistic URLs; optional). From the project
folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

> **Why a “server” isn’t required:** the shared header and footer are rendered by a
> small JavaScript module (`js/partials.js`) using template strings, **not**
> `fetch()`. `fetch()` of local partial files is blocked by browsers under
> `file://` (CORS), which would leave pages header-less when opened directly. The
> JS-injection approach keeps a **single source of truth** for the navbar/footer
> *and* works both when opening files directly and on GitHub Pages. Edit the
> header or footer once in `js/partials.js` and every page updates.

---

## 🚀 Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to the **`main`** branch
   (keep them at the repository **root**, not inside a subfolder):

   ```bash
   git init
   git add .
   git commit -m "Nobe Cosmetics website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Set **Branch** to `main` and folder to **`/ (root)`**, then **Save**.
5. Wait ~1 minute. Your site will be live at
   `https://<your-username>.github.io/<your-repo>/`.

The included `.nojekyll` file ensures GitHub Pages serves everything as plain static
files. No other configuration is needed.

---

## ✅ Pre-launch placeholder checklist

Search the project for `TODO` and `PLACEHOLDER` to find every spot. The important
ones, grouped by file:

### `js/products.js` — most edits happen here
- [ ] **WhatsApp number** — `SITE.whatsappNumber` (international format, digits only, e.g. `923001234567`)
- [ ] **Email** — `SITE.email`
- [ ] **Phone (display)** — `SITE.phoneDisplay`
- [ ] **Address** — `SITE.address.line1` / `line2`
- [ ] **Instagram / Facebook** — `SITE.social.*`
- [ ] **Announcement bar text** — `SITE.announcements[]`
- [ ] **Google Maps embed URL** (optional) — `SITE.mapEmbedSrc`
- [ ] **Product prices** — each `price` (in PKR; shows “Price on request” while `0`)
- [ ] **Product descriptions** — `shortDescription`, `fullDescription`
- [ ] **Ingredients / How to use** — `ingredients`, `howToUse`
- [ ] **Product images** — `image` (swap the SVGs for real photos; see below)
- [ ] **Image alt text** — `imageAlt`
- [ ] **Badges** — optional `badge` labels (e.g. “Bestseller”), or `""` to hide

### Images — `assets/`
All placeholders are soft, photo-like SVGs (no “placeholder” captions) so the
site looks complete out of the box — swap them for real photos before launch.
- [ ] **Logo** — replace `assets/logo.svg` with the real logo (SVG or PNG). If you use a different filename, update the `<img src>` in `js/partials.js`.
- [ ] **Hero** — `assets/images/hero.svg` → real ~1920×1200 photo
- [ ] **Product photos** — `assets/images/obtan-soap.svg`, `face-mask.svg` → real photos (rendered at a 4:5 ratio, so shoot/crop ~1000×1250)
- [ ] **Category tiles** — `assets/images/cat-soaps.svg`, `cat-masks.svg`, `cat-soon.svg` → real collection photos
- [ ] **About photo** — `assets/images/about.svg` → real brand/founder photo

> Real photos can be `.jpg`, `.png`, or `.webp`. Either keep the placeholder
> filenames (just replace the file) **or** update the `image:` paths in
> `js/products.js` and the hero/about/category `<img src>` in the HTML.

### Contact form — `contact.html`
- [ ] **Formspree endpoint** — paste your form URL into the `<form action="…">`
      (free at [formspree.io](https://formspree.io)). Until you do, the form
      **falls back to opening the visitor’s email app** via `mailto:`, so nothing
      is lost. Search for `TODO: insert Formspree endpoint`.

### Newsletter (optional — currently removed)
The footer newsletter was removed to keep the footer compact on a 2-product site.
If you want it back, add a `<form id="newsletterForm">` block to `footerHTML()` in
`js/partials.js` — the client-side submit handler still lives in `js/main.js`
(`initChrome` → newsletter handler), and from there you can POST emails to a
service (Formspree / Mailchimp).

### Copy — page content
- [ ] **About page** — `about.html` brand story + values (marked `PLACEHOLDER`)
- [ ] **Testimonials** — `index.html` quotes (marked `PLACEHOLDER`)
- [ ] **Privacy / Terms** — `privacy.html`, `terms.html` (placeholder legal copy)

---

## ➕ Adding a new product later

It’s a copy-paste job — no page restructuring needed:

1. In `js/products.js`, copy one `{ … }` block inside the `products` array, paste
   it, and edit the fields. Give it a unique `id` (e.g. `"rose-toner"`).
2. If it’s a new category, add it to the `CATEGORIES` array too — the shop filter
   buttons build themselves from that list.
3. Add its image to `assets/images/` and point `image:` at it.
4. Create a detail page by copying `product-obtan-soap.html` to
   `product-<id>.html` and changing the single attribute
   `data-product-id="<id>"` on `<main>`. Everything else fills in automatically.
5. (Optional) add a footer “Shop” link in `js/partials.js`.

The homepage featured grid and the shop grid both render from the array, so new
products appear on both automatically.

---

## 🎨 Re-theming

All colors, fonts, radii, and shadows are CSS variables at the top of
`css/style.css` (`:root`). Change them once to restyle the whole site:

```css
--color-primary: #C98A9E;   /* dusty rose  */
--color-accent:  #C9A574;   /* rose gold   */
--color-bg:      #FFF8F3;   /* warm cream  */
--color-dark:    #2E2A27;   /* charcoal    */
```

Fonts load from Google Fonts (Playfair Display + Poppins) and fall back to system
fonts gracefully if offline.

---

## ♿ Accessibility & performance notes

- Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- All images have `alt` text (placeholder alt is marked TODO where relevant).
- Images use `loading="lazy"` (except the hero, which loads eagerly).
- Explicit image `width`/`height` to reduce layout shift.
- Keyboard-friendly: focus styles, `Esc` closes the menu/modal, ARIA labels on icons.
- Respects `prefers-reduced-motion` (animations are disabled for those users).
- Tested down to a **375px** mobile viewport.
