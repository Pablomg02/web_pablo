# web_pablo

Personal website built with Eleventy (11ty). Source in `src/`, output in `_site/`.

## Content model — Markdown vs. templates

Two content models, chosen by the shape of the page, not by habit:

- **Prose → Markdown.** `src/thoughts/*.md`, `src/notebook/*.md`,
  `src/privacy.md`, `src/how-i-made-the-web.md`. Text corrido, footnotes, KaTeX.
- **Structure → data + Nunjucks.** A page that is really a list of records gets
  its content in `src/_data/<name>.js` and its markup in
  `src/_includes/pages/<name>.njk`, included by one thin page file per language
  (`src/<name>.njk`, `src/es/<name>.njk`) that only holds the front matter:
  `/experience/`, `/research/`, `/links/`. The home (`src/index.njk`,
  `src/es/index.njk`) is plain HTML because it is a composition, not prose.

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

## Languages — English at the root, Spanish under /es/

Every page exists in both languages at mirrored paths: `/research/` and
`/es/research/`, `/thoughts/<slug>/` and `/es/thoughts/<slug>/`. URLs and file
names are never translated; the mirror is the only link between translations,
and the `localeUrl` filter (`.eleventy.js`) swaps the prefix. The header's
EN/ES switch, the hreflang alternates and the sitemap all rely on it, so a page
added in one language must be added in the other.

- **Page language** is the `lang` data key: `"en"` globally
  (`addGlobalData`), `"es"` for everything under `src/es/` via `src/es/es.json`.
  `<html lang>`, `og:locale` and every string lookup follow it.
- **Prose and the home**: one file per language. The Spanish file sits at the
  same path under `src/es/`. Markdown under `src/es/thoughts/` and
  `src/es/notebook/` has its own directory data file, same as the English.
- **Data files**: a field whose text changes with the language is
  `{ en, es }` and is printed through `| localize(lang)`; a field that reads the
  same in both (a name, a URL, a published paper's title) stays a plain value.
  `localize` throws on a missing language, so a half-translated record fails
  the build instead of rendering blank.
- **Interface strings** (nav chrome, footer, article meta, list pages) live in
  `src/_data/i18n.js`, read as `i18n[lang].key`. Strings the browser script
  writes (theme toggle label, "Copied") are at the top of `src/js/site.js`.
  Navigation URLs in `_data/navigation.js` are written in English and mapped
  with `localeUrl`.
- **Collections** (`thought`, `notebook`) hold both languages; list them with
  `| inLanguage(lang)`.
- **404**: GitHub Pages serves one `/404.html`, so it carries both languages and
  a small script shows the Spanish block when the missing URL is under `/es/`.
  It is `untranslated: true` (no alternates, no language switch).
- Article images are not translated: `src/notebook/<slug>/` is also copied to
  `/es/notebook/<slug>/`, so the Spanish article references them by bare name
  too.

## Gallery — photos with a story

Each photo is `src/gallery/<slug>.jpeg` plus its story in
`src/gallery/<slug>.md` and `src/es/gallery/<slug>.md` (front matter: `title`,
`year`, optional `place`, `alt`, optional `featured`, optional `order`). The
directory data (`src/gallery/gallery.11tydata.js`, re-exported by the Spanish
folder) derives `image` from the slug, so both languages share the file, and
reads its aspect `ratio`, which sizes the justified rows of the grid and the
home band without cropping. In the grid, a script in `pages/gallery.njk` picks
the row breaks (nearest a target height) and sizes each row to the width; the
flex-wrap CSS is only the fallback without JavaScript. Keep originals around
2400 px on the long side: they are committed to the repo.
Each photo has its own page (`src/_includes/photo.njk`); `/gallery/` shows the
grid and, with JavaScript, opens a photo and its story in a `<dialog>` instead
of navigating. Both render `src/_includes/partials/photo-view.njk`; the grid
keeps the viewer's copy in a `<template>` and needs `eleventyImport` so the
stories are rendered before it reads `templateContent`. Tiles show only the photo; title and year
appear on hover or focus (`.photo-tile`). Photos marked `featured: true` form
the band at the foot of the home (one link to the gallery); the portrait in the
home hero is `src/images/portrait.jpeg`.

Images go through `{% picture src, alt, options %}` (`.eleventy.js`, backed by
`@11ty/eleventy-img`), which writes WebP and JPEG widths into `/img/` at build
time and strips camera metadata; the originals are never published. The
shortcode is async: inside a loop use `{% asyncEach %}`, not `{% for %}`.

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

It is English only: it reads bilingual fields with `localize('en')` and filters
the collections with `inLanguage('en')`. `summary` and `llmsNote` are therefore
plain English strings, not `{ en, es }` objects.

## Notebook articles — PDF generation

Each Notebook article (`src/notebook/<slug>.md`, and its translation `src/es/notebook/<slug>.md`) can have a matching `.pdf` next to it rendered in an academic style (Pandoc + LaTeX: Palatino body/math with TeX Gyre Adventor headings, see `scripts/pdf/preamble.tex`). The article page shows a "Download as PDF" link automatically when the file exists (see `src/_includes/essay.njk`), served via Eleventy passthrough copy (`src/notebook/*.pdf` and `src/es/notebook/*.pdf` in `.eleventy.js`).

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

The script builds both languages; the Spanish PDFs need babel's Spanish support
(`sudo apt install texlive-lang-spanish`). Without it the script skips Spanish,
says so, and exits non-zero. Title-block and footer words come from
`\PaperLabel*` macros in the preamble, which the script overrides per language.

PDFs are generated locally, not in CI — the GitHub Pages build (`npm run build`) does not have Pandoc/LaTeX installed, so the PDF must already exist in the repo before pushing.

Process when adding or editing a Notebook article:

1. Write/edit `src/notebook/<slug>.md` and its translation `src/es/notebook/<slug>.md`.
2. Run `npm run notebook:pdf` to (re)generate PDFs for all articles via `scripts/build-notebook-pdfs.js`.
3. Check the resulting `src/notebook/<slug>.pdf` and `src/es/notebook/<slug>.pdf`.
4. Commit the `.md` and `.pdf` files of both languages together.
5. Push — `npm run build` just copies the committed PDF, no Pandoc/LaTeX needed in CI.

If a `.pdf` is missing or stale relative to its `.md`, regenerate it with `npm run notebook:pdf` before committing.
