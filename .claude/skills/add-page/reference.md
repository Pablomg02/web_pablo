# add-page — reference

Read a section here only when SKILL.md points to it or the task needs it. Facts below were checked against the code (`.eleventy.js`, `src/_includes/base.njk`, `src/js/site.js`, `src/sitemap.xml.njk`).

## How the two languages are wired

- `.eleventy.js` sets global data `lang = "en"` and `languages = ["en", "es"]`.
- `src/es/es.json` is `{ "lang": "es" }`; Eleventy applies it to every file under `src/es/`. So a Spanish page needs no `lang` in its front matter.
- Filter `localeUrl(url, lang)` strips a leading `/es` and, for `es`, prepends `/es`. `base.njk` uses it for the header links, the EN/ES switch, and the hreflang alternates. That is why the two files must sit at the same path apart from the `/es/` prefix.
- Filter `localize(value, lang)` returns `value[lang]` for an object, passes through strings and arrays, and THROWS if the language key is missing. Result: a half-translated data record fails the build.
- Filter `relativeUrl(url, page.url)` turns a site-root path into a relative link. Use it (`{{ '/x/' | relativeUrl(page.url) }}`) for any internal link you write in a template. In Markdown, write ordinary links.
- `page.url` for a page with `permalink: /x/` is `/x/`.

## Sitemap and hreflang

`src/sitemap.xml.njk` loops over `collections.all` and keeps entries that have both a `url` and a `layout`. For each one it prints the URL and alternates for every language using `localeUrl`. So:

- A page appears in the sitemap automatically, in both languages, if it has `layout` and is not excluded.
- `eleventyExcludeFromCollections: true` removes a page from the sitemap (used by `src/404.njk`).
- There is nothing to register by hand.

`base.njk` prints `<link rel="alternate" hreflang=...>` (en, es, x-default) for every page unless `untranslated: true` is set.

## `pageKey`

`base.njk` writes `<body class="page-{{ pageKey or 'doc' }}">`. A page without `pageKey` renders as `page-doc`. Set `pageKey` in the front matter of every page that needs its own CSS. Existing values: `index`, `experience`, `research`, `links`, `privacy`, `how-i-made-the-web`, `gallery`, `photo`, `notebook`, `notebook-article`, `thoughts`, `thought`, `not-found`. Do not reuse one of these for a different page. Do not derive it from the file name (an article called `research.md` would inherit the CV styling).

## Scroll hooks (`src/js/site.js`, section "Scroll story")

The script does nothing unless the page has at least one `[data-scroll-step]`.

- `data-scroll-step` on a section / role / publication / card. Adds a square to the rail on the left and lights it when reached. Value optional: `data-scroll-step="Name"` names it for screen readers; empty, the script uses the element's `aria-labelledby` heading, then the first `h1-h3`. Give each step an `aria-labelledby` pointing to its heading id.
- Inside a step, each direct child rises into view one after another. A child that has `data-reveal-each` passes that on to ITS children (used for lists and grids).
- `data-reveal` on a block that is not inside a step (for example a group heading, as in `src/_includes/pages/experience.njk`) makes that one block rise.
- Reduced-motion users keep only the rail.
- Rail position CSS: `.scroll-rail` uses `--rail-page` (default `--max-width`, 1080px). `src/css/style.css` sets `--rail-page: calc(900px + 3rem)` for `.page-experience, .page-research`, matching their `main { max-width: calc(900px + 3rem) }`. If your page uses a different `main` width AND the scroll hooks, set `.page-<name> { --rail-page: <same width as main max-width>; }` so the rail sits in the middle of the margin.
- Currently used on: home, `/experience/`, `/research/`. Not on `/links/` or prose pages.

## Interface strings vs page copy vs data

- Page copy of a prose page: in its own `.md` (one file per language).
- Records: `src/_data/<name>.js` with `{ en, es }` fields.
- Words of the site chrome (menu, footer, "Share", "No photos yet."): `src/_data/i18n.js`, read as `i18n[lang].key`. `.eleventy.js` also reads `references` from it for footnotes. Both languages must carry the same keys (nothing checks this at build; keep them equal by hand).
- Strings the browser script prints: top of `src/js/site.js` (`siteStringsByLang`).
- `title` and `description` in front matter are plain strings, one per language file (they are not `localize`d).

## Footer-only pages

Links, Privacy and How I Made the Web are not in `navigation.js`. Their footer links are written by hand in `src/_includes/base.njk` (`<footer class="site-footer">`), using `'/x/' | localeUrl(lang) | relativeUrl(page.url)` and a key from `i18n`. To add another footer page: create the page as usual, add its label to both blocks of `src/_data/i18n.js`, add a link plus a `<span class="site-footer__separator" aria-hidden="true">|</span>` in `base.njk`. Ask the user before changing the footer.

## Untranslated pages (404-style)

`src/404.njk` shows the pattern: `untranslated: true` (no hreflang, no language switch, no `og:locale:alternate`), `eleventyExcludeFromCollections: true` (out of the sitemap), `robots: noindex, follow`, and it holds both languages in one file. Use it only for a page that must exist once. A normal new page must NOT be `untranslated`.

## Menu highlighting

`base.njk` marks a menu entry active when `page.url` equals the entry URL, or when `page.url` starts with the entry URL (except for `/`). A page at `/research/extra/` therefore lights "Research". Pick URLs with that in mind.

## Hidden Thoughts

`site.showThoughts` (`src/_data/site.js`) is `false`. Thoughts sources are ignored by Eleventy (`.eleventy.js`), and the nav entry is filtered out in `navigation.js`. Any link you add to `/thoughts/` or a thought must be inside `{% if site.showThoughts %}`. The same applies to text in `llms.txt.njk`.

## Discrepancies found while writing this skill

- `README.md` "Anadir una pagina nueva" says to add the nav entry with `{ title: { en, es }, url }` — correct — but its menu example shows a `children` dropdown that no current entry uses.
- `README.md` says `pageKey` is "opcional"; it is optional for the build, but every existing page sets it, so always set it.
- `DEVELOPER.md` still describes `src/experience.njk` etc. as holding the content and does not mention `/es/`; follow this skill and `CLAUDE.md` instead.
