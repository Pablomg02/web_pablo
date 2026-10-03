---
name: add-page
description: Add a new page to the website in both languages (English at /x/, Spanish at /es/x/). Use when asked to "add a page", "create a /foo/ page", "new section", "add to the nav menu / navigation", "new CV-style page", or "new Markdown page". Covers the prose (Markdown) flavour and the structured (data file + Nunjucks include) flavour. Do NOT use to add a role, publication or link to an existing page (edit the data file), an article, or a gallery photo.
---

# Add a page (English + Spanish)

Invariants (mirrored paths, `lang`, Markdown-vs-data rule) are in `CLAUDE.md`. Read it first. This file is the procedure.

Every page exists twice: `/x/` and `/es/x/`. Never add only one. URLs and file names are never translated.

## Step 1 — Decide the flavour

Ask: "Is this page a list of similar records (roles, papers, cards) or is it running text?"

- Running text, headings, footnotes → **Flavour A: prose, Markdown.**
- A list of records with the same fields, repeated → **Flavour B: data file + template.**
- A composition of hand-laid-out blocks (like the home) → plain `.njk` HTML with front matter, one file per language. Copy `src/index.njk` and `src/es/index.njk`. Rare; ask the user first.

If unsure, choose A.

## Step 2A — Prose page

1. Create `src/<name>.md` (copy of `src/privacy.md` structure):

```md
---
layout: page.njk
title: Colophon
description: One sentence for search results and link previews.
permalink: /colophon/
pageKey: colophon
---

# Colophon

Text here.
```

2. Create `src/es/<name>.md` with the same file name. Translate `title`, `description` and the text. Set `permalink: /es/colophon/` and the SAME `pageKey`.
3. Do NOT add `lang`. `src/es/es.json` already sets `lang: "es"` for everything under `src/es/`.
4. Go to Step 3.

## Step 2B — Structured page

Use `<name>` for the same word in every file below. Real example to copy: `links`/`research`/`experience`.

1. Data: create `src/_data/<name>.js`. It is exposed to templates as the variable `<name>`, so do NOT name it `site`, `i18n`, `navigation`, `lang`, `languages`, `page`, `collections`, `content`, `title` or `layout`.
   - Text that changes with the language is `{ en: "...", es: "..." }`. Text that reads the same (a name, a URL, a published title) is a plain value.
   - Rich text (`lead`, `body`, `bullets`) may contain `<strong>` and `<a>`. Nothing else may contain HTML.
2. Template: create `src/_includes/pages/<name>.njk`. Skeleton (pattern from `src/_includes/pages/research.njk`):

```njk
{#- Body of /<name>/ and /es/<name>/, from src/_data/<name>.js. #}
<h1>{{ <name>.title | localize(lang) }}</h1>
<p class="page-lead">{{ <name>.lead | localize(lang) | safe }}</p>

{% for item in <name>.items %}
  {% set itemId = '<name>-item-' + loop.index %}
  <article class="<name>-item" data-scroll-step aria-labelledby="{{ itemId }}">
    <h2 class="<name>-item__title" id="{{ itemId }}">{{ item.name }}</h2>
    <p class="<name>-item__period">{{ item.period | localize(lang) }}</p>
    {% for paragraph in item.body | localize(lang) %}
      <p>{{ paragraph | safe }}</p>
    {% endfor %}
  </article>
{% endfor %}
```

   - Give EVERY meaningful element its own class named `block__element` (like `.role__period`, `.publication__venue`). Never rely on position (`h3 + p`, `.content > h3 em`).
   - Print `| safe` ONLY for rich-text fields. Everything else is escaped.
   - If the page should have the scroll rail and rise-in animation, keep the hooks; otherwise delete `data-scroll-step`. See `reference.md` ("Scroll hooks").
3. Page files. Both hold ONLY front matter plus the include line.

`src/<name>.njk`:
```njk
---
layout: page.njk
title: Demo
description: One sentence for search results and link previews.
permalink: /<name>/
pageKey: <name>
---
{% include "pages/<name>.njk" %}
```
`src/es/<name>.njk`: identical, but translated `title` and `description`, and `permalink: /es/<name>/`.

4. Styles: add rules for `.page-<name>` and your new classes in `src/css/style.css` (the file is one stylesheet; put your block next to a similar page such as `.page-links` / `.page-research`). If the page is not a plain reading column, set the width with `.page-<name> main { max-width: ... }`. Use the existing custom properties (`--reading-width`, `--max-width`); do not hard-code colours, reuse variables defined in `:root`.

## Step 3 — Navigation (only if the page belongs in the header menu)

Edit `src/_data/navigation.js`. Add an object; the URL is the ENGLISH one (the header adds `/es` itself with `localeUrl`):

```js
{
  title: { en: "Colophon", es: "Colofón" },
  url: "/colophon/",
},
```

- Add `group: "personal"` only for personal writing/photos (Tech Notes, Gallery). Omit it for professional pages.
- Order in the array is the order in the menu.
- No entry = the page exists but is not in the menu. That is valid (Links, Privacy, How I Made the Web are footer-only; they are hard-coded in `src/_includes/base.njk`, footer section, with strings in `src/_data/i18n.js`).
- Do not add `children` unless asked; the dropdown markup exists but no page uses it.

## Step 4 — Interface strings (only if the template prints chrome text)

If your include prints a word that is not page copy (a button label, "No items yet"), add the key to BOTH `en` and `es` blocks in `src/_data/i18n.js` and print it as `{{ i18n[lang].key }}`. Both blocks must have the same keys. Text written by the browser script goes at the top of `src/js/site.js`, in both languages.

## Step 5 — llms.txt

`src/llms.txt.njk` has a hand-written "Canonical Pages" list. For a page in the header menu, add one line in the same style: `- [Name]({{ '/<name>/' | absoluteUrl(site.url) }}) - one-line description.` English only, third person, plain text.

## Verify (all must pass)

Run: `npm run build` (do not run it while another build is running; it deletes `_site/`).

1. The build ends without an error. `Missing "es" translation` means a `{ en, es }` field lacks `es`.
2. `ls _site/<name>/index.html _site/es/<name>/index.html` — both exist.
3. `grep -c "<name>" _site/sitemap.xml` — at least 2 `<loc>` lines, each with hreflang `en` and `es`.
4. `grep hreflang _site/es/<name>/index.html` — three lines: `en`, `es`, `x-default`.
5. `grep '<body' _site/<name>/index.html` prints `class="page-<name>"`.
6. `grep '<html lang' _site/es/<name>/index.html` prints `lang="es"`.
7. Menu entry (links are relative): `grep -c 'href="<name>/"' _site/index.html` and the same command on `_site/es/index.html` must each print at least 1.
8. Read `_site/es/<name>/index.html`: the body is Spanish, not English copy.
9. Optional: `npm run dev`, open both URLs, click the EN/ES switch on each; it must land on the other language's same page.

## Common mistakes

- Creating only the English file (or only the Spanish one). The build fails with `Pages without a translation at the mirrored path: /x/`. Create the twin; only a page that must exist once (like the 404) may set `untranslated: true`.
- Forgetting `permalink: /es/<name>/` in the Spanish file, or writing `/es/` in the English one.
- Different `pageKey` in the two languages. Keep them identical.
- Translating the URL or file name (`/es/investigacion/`). Never.
- Missing `layout: page.njk`. Without `layout` the page is absent from the sitemap and has no chrome.
- A data file named like an existing global (see Step 2B.1).
- Putting `{ en, es }` on a URL or a name, or a plain string on text that needs translating.
- Styling by position or by tag (`.content > h3 + p`). Add a class.
- Editing `_site/`. It is regenerated; edit `src/`.
- Adding `lang: "es"` by hand to Spanish files. `es.json` does it.
- For an error page needing both languages in one file (like `src/404.njk`), see `reference.md` ("untranslated pages").

More detail: `reference.md`.
