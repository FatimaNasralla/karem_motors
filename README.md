# Kareem Tractor Parts — Parts Catalog

A static website that lists the tractor spare parts available at Kareem Tractor Parts
(214 parts, taken from the Ceylan order PRC-20071).

No build step. Plain HTML, CSS and JavaScript.

## Run locally

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Project layout

| Path | What it is |
|------|------------|
| `index.html` | The page |
| `css/style.css` | Styles |
| `js/app.js` | Search, filters, sorting, product popup. Settings (`showPrices`, `showStock`, `currency`) are at the top. |
| `data/products.js` | Product data |
| `images/` | Product photos, named by item number (`1.jpg` … `214.jpg`) |
| `assets/logo.png` | Store logo (optional; a "KM" badge shows if missing) |

## Deploy for free on GitHub Pages

1. Create a free account at https://github.com and a new **public** repository named `karem-motors`.
2. In this folder, run:

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/karem-motors.git
   git push -u origin main
   ```

3. On GitHub, open the repository → **Settings** → **Pages**.
   Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   **Branch** to `main` and folder `/ (root)`, then **Save**.
4. After about a minute the site is live at
   `https://YOUR-USERNAME.github.io/karem-motors/`.

To update the site later, edit the files and run:

```bash
git add -A
git commit -m "Update products"
git push
```

GitHub Pages redeploys automatically after each push.
