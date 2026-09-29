# web_pablo

Personal website built with Eleventy (11ty). Source in `src/`, output in `_site/`.

Commands: `npm run dev` (serve), `npm run build` (writes `_site/`, which is
gitignored; `prebuild` deletes it first), `npm run notebook:pdf` (see below).

## Skills — read the one that matches the task

Step-by-step procedures live in `.claude/skills/`. Use them instead of working
from memory; they carry templates, common mistakes and verification commands.

| Task | Skill |
|---|---|
| Write / edit / translate a Notebook article, generate its PDF | `notebook-article` |
| Add / edit / feature / remove a Gallery photo, change the portrait | `gallery-photo` |
| Add or edit a role, publication or link (`_data/experience.js`, `research.js`, `links.js`) | `cv-entry` |
| Add a new page (prose or data-driven) or a nav entry | `add-page` |

The rules below are the invariants the skills assume. They apply to every change.

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
`bullets`) carry inline HTML (`<strong>`, `<em>`, `<a>`) and are printed with
`| safe`; everything else is escaped by Nunjucks.

Do not style a templated page through the shape of its markup. These pages
previously lived in Markdown and the CSS had to infer meaning from position
(`.page-experience .content > h3 + p` was a role's date). That was invisible
from the source, broke when a paragraph was inserted, and leaked into prose
pages. Every element carries an explicit class (`.role__period`,
`.role__role`, `.publication__venue`, …).

The home, `/experience/` and `/research/` carry the scroll animation (the rail
on the left and the rise-into-view) through markup hooks read by
`src/js/site.js`: `data-scroll-step` on each section / role / publication,
`data-reveal-each` on a container whose children rise one by one, and
`data-reveal` on a lone block. Another page opts in with the same hooks.

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
added in one language must be added in the other. The build enforces it (the
`mirrorCheck` collection in `.eleventy.js`): a page with a layout and no twin at
the mirrored path fails with the list of orphans, unless it sets
`untranslated: true`.

- **Page language** is the `lang` data key: `"en"` globally
  (`addGlobalData`), `"es"` for everything under `src/es/` via `src/es/es.json`.
  `<html lang>`, `og:locale` and every string lookup follow it.
- **Prose and the home**: one file per language, the Spanish one at the same
  path under `src/es/`. Markdown under `src/es/thoughts/`, `src/es/notebook/`
  and `src/es/gallery/` has its own directory data file, same as the English.
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
  `/es/notebook/<slug>/`, so the Spanish article references them by bare name.

## Thoughts is hidden

`site.showThoughts` (`src/_data/site.js`) is `false`: the essays under
`src/thoughts/` and `src/es/thoughts/` stay in the repo, but their pages, the
`/thoughts/` lists, the `/notes/` redirects, the nav entry, the home / 404
links and the llms.txt section are not built. Setting it to `true` restores
all of it; a new link to Thoughts must be wrapped in `{% if site.showThoughts %}`.

## Images

All site images go through `{% picture src, alt, options %}` (`.eleventy.js`,
backed by `@11ty/eleventy-img`): it writes WebP and JPEG widths into `/img/` at
build time and strips camera metadata from those outputs. The shortcode is
async: inside a loop use `{% asyncEach %}`, not `{% for %}`. The original file
in `src/` is committed as-is, so a camera or phone photo must be stripped of
its metadata (GPS included) before it is added — see `gallery-photo`. The
photos already in the repo are clean.

## llms.txt is generated, not hand-written

`src/llms.txt.njk` builds `/llms.txt` from `_data/research.js`,
`_data/experience.js`, `_data/links.js` and the `thought` / `notebook`
collections. Publishing a paper or an article updates it on the next build.
Edit the prose in the template; never hand-maintain the lists. The one
exception is the "Canonical Pages" list, which is hand-written: a new top-level
page needs a line there.

It is plain text, so every interpolation takes `| safe` (an escaped `&#39;` in
a .txt file is a bug), it is written in the third person, and it is English
only (`localize('en')`, `inLanguage('en')`), so `summary` and `llmsNote` are
plain English strings, not `{ en, es }`. Which records need which of those
fields is in `cv-entry`.

## Notebook PDFs are committed, not built in CI

Each Notebook article has a `.pdf` per language next to its `.md`, rendered
locally with Pandoc + LaTeX (`npm run notebook:pdf`). The GitHub Pages build
does not have Pandoc/LaTeX, so it only copies the committed PDF: any change to
an article's `.md` requires regenerating and committing its PDFs, in both
languages, in the same commit. If a `.pdf` is missing or stale relative to its
`.md`, regenerate it before committing. Full procedure: `notebook-article`.

`@mdit/plugin-katex` is held at `^0.25.2` on purpose: 1.x requires
markdown-it 15, and Eleventy 3 pins markdown-it `^14.1.1`, which is the
instance `amendLibrary("md", ...)` in `.eleventy.js` hands the plugin. Bump it
only once Eleventy moves to markdown-it 15. `katex` itself is free to track
latest: the stylesheet and fonts are copied out of `node_modules` by
`.eleventy.js`, so the CSS can never drift from the rendering version.
