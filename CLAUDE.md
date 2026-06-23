# web_pablo

Personal website built with Eleventy (11ty). Source in `src/`, output in `_site/`.

## Notebook articles — PDF generation

Each Notebook article (`src/notebook/<slug>.md`) can have a matching `src/notebook/<slug>.pdf` rendered in an academic style (Pandoc + LaTeX: Palatino body/math with TeX Gyre Adventor headings, see `scripts/pdf/preamble.tex`). The article page shows a "Download as PDF" link automatically when the file exists (see `src/_includes/essay.njk`), served via Eleventy passthrough copy (`src/notebook/*.pdf` in `.eleventy.js`).

PDFs are generated locally, not in CI — the GitHub Pages build (`npm run build`) does not have Pandoc/LaTeX installed, so the PDF must already exist in the repo before pushing.

Process when adding or editing a Notebook article:

1. Write/edit `src/notebook/<slug>.md`.
2. Run `npm run notebook:pdf` to (re)generate PDFs for all articles via `scripts/build-notebook-pdfs.js`.
3. Check the resulting `src/notebook/<slug>.pdf`.
4. Commit the `.md` and `.pdf` together.
5. Push — `npm run build` just copies the committed PDF, no Pandoc/LaTeX needed in CI.

If a `.pdf` is missing or stale relative to its `.md`, regenerate it with `npm run notebook:pdf` before committing.
