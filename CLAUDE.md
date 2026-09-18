# web_pablo

Personal website built with Eleventy (11ty). Source in `src/`, output in `_site/`.

## Content model — Markdown vs. templates

Two content models, chosen by the shape of the page, not by habit:

- **Prose → Markdown.** `src/thoughts/*.md`, `src/notebook/*.md`,
  `src/privacy.md`, `src/how-i-made-the-web.md`. Text corrido, footnotes, KaTeX.
- **Structure → data + Nunjucks.** A page that is really a list of records gets
  its content in `src/_data/<name>.js` and its markup in `src/<name>.njk`:
  `/experience/`, `/research/`, `/links/`. The home (`src/index.njk`) is plain
  HTML because it is a composition, not prose.

To add a role or a publication, append an object to the array in the data file —
do not touch the template or the stylesheet. Rich-text fields (`lead`, `body`,
`bullets`) carry inline HTML (`<strong>`, `<a>`) and are printed with `| safe`;
everything else is escaped by Nunjucks.

Do not style a templated page through the shape of its markup. These pages
previously lived in Markdown and the CSS had to infer meaning from position
(`.page-experience .content > h3 + p` was a role's date, `.content > h3 em` its
job title). That was invisible from the source, broke when a paragraph was
inserted, and leaked into prose pages. Every element now carries an explicit
class (`.role__period`, `.role__role`, `.publication__venue`, …).

The `<body>` hook comes from a `pageKey` front-matter field (or a directory data
file), not from `page.fileSlug` — a slug-derived class would let an article
named `research.md` inherit the CV styling. Pages without a `pageKey` render as
`page-doc`.

## llms.txt is generated, not hand-written

`src/llms.txt.njk` builds `/llms.txt` from the same sources as the pages:
`_data/research.js`, `_data/experience.js`, `_data/links.js` and the `thought` /
`notebook` collections. Publishing a paper or an article updates it on the next
build. Edit the prose in the template; never hand-maintain the lists, which is
how it came to claim a single publication while the site listed three.

Two things to respect there: it is plain text, so every interpolation takes
`| safe` (an escaped `&#39;` in a .txt file is a bug), and it is written in the
third person, so entries whose page copy is first person carry an `llmsNote`
alongside `note` / `summary`.

## Notebook articles — PDF generation

Each Notebook article (`src/notebook/<slug>.md`) can have a matching `src/notebook/<slug>.pdf` rendered in an academic style (Pandoc + LaTeX: Palatino body/math with TeX Gyre Adventor headings, see `scripts/pdf/preamble.tex`). The article page shows a "Download as PDF" link automatically when the file exists (see `src/_includes/essay.njk`), served via Eleventy passthrough copy (`src/notebook/*.pdf` in `.eleventy.js`).

An article's images go in `src/notebook/<slug>/` and are referenced by bare
file name (`![alt](figure.png)`): they are copied next to the page, and the PDF
script passes that folder to Pandoc as `--resource-path`. Figures are pinned in
place in the PDF (`float` / `H` in the preamble) so the italic caption paragraph
that follows an image stays with it. Prompts or long quotes can be folded in a
`<details class="prompt">` with a `<summary class="prompt__label">`; the PDF
prints them expanded.

Notebook articles inherit `math: true` from `src/notebook/notebook.json`, so
their pages load KaTeX CSS. Other pages intentionally omit that stylesheet.

`@mdit/plugin-katex` is held at `^0.25.2` on purpose: 1.x requires
markdown-it 15, and Eleventy 3 pins markdown-it `^14.1.1`, which is the
instance `amendLibrary("md", ...)` in `.eleventy.js` hands the plugin. Bump it
only once Eleventy moves to markdown-it 15. `katex` itself is free to track
latest — the stylesheet and fonts are copied out of `node_modules` by
`.eleventy.js`, so the CSS can never drift from the rendering version.

PDFs are generated locally, not in CI — the GitHub Pages build (`npm run build`) does not have Pandoc/LaTeX installed, so the PDF must already exist in the repo before pushing.

Process when adding or editing a Notebook article:

1. Write/edit `src/notebook/<slug>.md`.
2. Run `npm run notebook:pdf` to (re)generate PDFs for all articles via `scripts/build-notebook-pdfs.js`.
3. Check the resulting `src/notebook/<slug>.pdf`.
4. Commit the `.md` and `.pdf` together.
5. Push — `npm run build` just copies the committed PDF, no Pandoc/LaTeX needed in CI.

If a `.pdf` is missing or stale relative to its `.md`, regenerate it with `npm run notebook:pdf` before committing.
