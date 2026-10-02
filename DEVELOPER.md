# DEVELOPER GUIDE

Maintenance guide for `web_pablo`.

This file explains how the site is organised, which pieces affect SEO, what you have to touch when you change content or structure, and how to validate that everything is in order before publishing.

## Stack and how it works

- The site is built with `Eleventy` (`@11ty/eleventy`).
- The source code lives in `src/`.
- The generated HTML goes out to `_site/`.
- Do not edit `_site/` by hand: it is regenerated on every build.
- Deployment is done by GitHub Pages through `.github/workflows/deploy.yml`.

## Project structure

### Configuration files

- `.eleventy.js`
  - Configures Eleventy.
  - Copies `src/css`, `src/assets`, `src/robots.txt` and `src/CNAME` to the output.
  - Defines filters such as `relativeUrl`, `absoluteUrl` and `json`.
- `package.json`
  - `npm run dev`: starts the local server.
  - `npm run build`: generates `_site/`.
  - `prebuild`: deletes `_site/` before rebuilding.
- `.github/workflows/deploy.yml`
  - Runs `npm ci`, `npm run build` and publishes `_site` to GitHub Pages.

### Main content

Content is divided into two models according to the shape of the page (see README).
The site is bilingual: English lives at the root and Spanish under `src/es/`, at
mirrored paths (`/research/` and `/es/research/`). Every page exists in both
languages and the build fails if one of them is missing (see `CLAUDE.md`).

Prose, in Markdown:

- `src/thoughts/*.md` — essays.
- `src/notebook/*.md` — technical articles.
- `src/privacy.md`, `src/how-i-made-the-web.md`.

Structure, in data + template:

- `src/_data/experience.js` → `/experience/` and `/es/experience/`.
- `src/_data/research.js` → `/research/` and `/es/research/`.
- `src/_data/links.js` → `/links/` and `/es/links/`.
- The markup is in `src/_includes/pages/<name>.njk`; `src/<name>.njk` and
  `src/es/<name>.njk` only hold the front matter.

- `src/index.njk` and `src/es/index.njk`
  - Home. Plain HTML: it is a composition of sections, not prose.
  - It shows as “About” in navigation, but its SEO centres on `Pablo Magariños`.

### Templates

- `src/_includes/base.njk`
  - Main template.
  - Builds the complete `<head>`: `title`, description, canonical, Open Graph, Twitter Cards, favicon, `robots` and JSON-LD.
- `src/_includes/page.njk`
  - Wraps the content of the pages inside `<article class="content">`.

### Global data

- `src/_data/navigation.js`
  - Defines the top menu manually.
  - If a page is not added here, it still exists, but it does not appear in the navigation.
- `src/_data/site.js`
  - Global source of truth for SEO and branding.
  - Holds the domain, site name, author, default title, default description, favicon, social image and public profiles.

### Assets

- `src/css/style.css`
  - Global styles.
- `src/js/site.js`
  - Progressive interactions: theme, dropdown menu and share.
- `src/assets/fonts/space-grotesk-latin.woff2`
  - Local font for headings and interface. The body uses the system font and
    Press Start 2P is reserved for the brand.
- `src/assets/images/favicon.svg`
- `src/assets/images/favicon.png`
  - Site icons.
- `src/assets/images/og-default.svg`
- `src/assets/images/og-default.png`
  - Default social image for Open Graph and Twitter.

### Direct SEO files

- `src/robots.txt`
  - Allows indexing and points to the sitemap.
- `src/sitemap.xml.njk`
  - Generates the sitemap automatically.
- `src/CNAME`
  - Sets the custom domain on GitHub Pages.

## How SEO is built

SEO is organised in three layers.

### 1. Global site data

Defined in `src/_data/site.js`.

Current important fields:

- `url`: canonical site URL.
- `name`: main SEO name.
- `brand`: name visible in the header.
- `defaultTitle`: default home title.
- `defaultDescription`: global description.
- `socialImage`: default image for sharing.
- `favicon` and `faviconPng`: site icons.
- `sameAs`: public profiles for JSON-LD.

If you change the domain, professional name, social networks or SEO branding, this is the first file you should review.

### 2. Per-page metadata

Defined in the front matter of each `.md`.

Available fields:

- `layout`
- `title`
- `metaTitle`
- `description`
- `socialImage`
- `robots`
- `permalink`
- `pageKey`
- `untranslated`

Current rules:

- The home uses an explicit `metaTitle`: `Pablo Magariños | AI Researcher`.
- Internal pages, if they do not define `metaTitle`, use the convention:
  - `{{ title }} | Pablo Magariños`
- If you do not define `description`, it falls back to `site.defaultDescription`.
- If you do not define `socialImage`, it uses `site.socialImage`.
- If you do not define `robots`, it uses `index, follow`.

### 3. Rendering of the `<head>`

Everything comes out of `src/_includes/base.njk`.

That file generates:

- `<title>`
- `<meta name="description">`
- `<meta name="author">`
- `<meta name="robots">`
- `<link rel="canonical">`
- favicon
- Open Graph:
  - `og:site_name`
  - `og:title`
  - `og:description`
  - `og:url`
  - `og:image`
- Twitter Cards:
  - `twitter:card`
  - `twitter:title`
  - `twitter:description`
  - `twitter:image`
- JSON-LD of type `Person`

## What to touch depending on the change

### If you only change the text of a page

If the page is prose, edit its `.md`. If it is a structured page
(`/experience/`, `/research/`, `/links/`), edit its data file:

- `src/index.njk` and `src/es/index.njk` — home
- `src/_data/experience.js`
- `src/_data/research.js`
- `src/_data/links.js`
- `src/privacy.md`, `src/how-i-made-the-web.md`

Also review:

- The `title`
- The `description`
- The first paragraph, especially on the home

The first block of text on the home is important to reinforce the positioning of the name and the professional profile.

### If you want to change how a page appears in Google or in the tab

Edit the front matter of that page:

- `metaTitle` to control the exact title
- `description` for the description
- `socialImage` if you want a specific image
- `robots` if you want it indexable or not

Remember:

- The browser mainly shows `title` and `favicon`.
- Google and social networks use above all `title`, `description`, `canonical` and the social image.

### If you want to change the main name of the site

Edit `src/_data/site.js`:

- `name`
- `brand`
- `author`
- `defaultTitle`
- `defaultDescription`
- `jobTitle`

Usually:

- `name` is the SEO identity.
- `brand` is what you see at the top of the header.

Right now:

- SEO: `Pablo Magariños`
- Visible branding: `Pablo.dev`

### If you change the domain

You must update these three pieces:

1. `src/_data/site.js`
   - `url`
2. `src/robots.txt`
   - sitemap line
3. `src/CNAME`
   - exact domain

Afterwards it is worth checking that the build generates canonicals and the sitemap with the new domain.

### If you want to change the menu

Edit `src/_data/navigation.js`.

Example:

```js
module.exports = [
  { title: { en: "About", es: "Sobre mí" }, url: "/" },
  { title: { en: "Experience", es: "Experiencia" }, url: "/experience/" },
  { title: { en: "Research", es: "Investigación" }, url: "/research/" },
];
```

The title goes in both languages and the URL in English; the header translates it on its own.

### If you want to add a new page

1. Create the markdown in `src/` and its translation in `src/es/`, same name.
2. Add front matter to both (with `pageKey`).
3. If you want it to appear in the menu, add it in `src/_data/navigation.js`.

The complete procedure, with the templates and the checks, is in
`.claude/skills/add-page/SKILL.md`.

Example:

```md
---
layout: page.njk
title: Blog
metaTitle: Blog | Pablo Magariños
description: Notes on AI research, mathematics, and engineering.
permalink: /blog/
pageKey: blog
---

# Blog

Page content here.
```

Notes:

- If the page uses `layout`, it will enter the sitemap automatically, with its `hreflang` alternates.
- If you do not want it indexed, add `robots: noindex, nofollow`.

### If you add a Notebook article

Articles under `src/notebook/` automatically load the KaTeX CSS. The
rest of the pages do not load it, to avoid that resource when there are no formulas.

### If you want to change the favicon or the social image

Files to review:

- `src/assets/images/favicon.svg`
- `src/assets/images/favicon.png`
- `src/assets/images/og-default.svg`
- `src/assets/images/og-default.png`
- `src/_data/site.js`

Tips:

- Keep the favicon in SVG and PNG for compatibility.
- Use PNG for Open Graph and Twitter.
- If you change the name or main role of the site, also update the text inside the social image.

## Sitemap, robots and indexable pages

### Sitemap

`src/sitemap.xml.njk` walks `collections.all` and puts into the sitemap the pages that have `layout`.

In practice all pages with `layout` enter, in both languages: the
home, `/experience/`, `/research/`, `/gallery/`, every article and every photo, and
their equivalents under `/es/`. The 404 stays out.

If you create a new page with `layout`, it will appear automatically.

### Robots

`src/robots.txt` allows full indexing and exposes the sitemap:

```txt
User-agent: *
Allow: /

Sitemap: https://pablomagarinos.es/sitemap.xml
```

If in the future you want to block a specific page, it is not done here; it is better done with `robots: noindex, nofollow` in the front matter of that page.

## Recommended flow when you update the site

### Normal content changes

1. Edit the corresponding markdown.
2. If the focus of the page changed, also adjust `description`.
3. Run the build.
4. Check the generated HTML.
5. Commit and push.

### SEO changes

1. Review `src/_data/site.js`.
2. Review `src/_includes/base.njk`.
3. If the domain changed, review `src/robots.txt` and `src/CNAME`.
4. If the social image or favicon changed, update the assets.
5. Run the build.
6. Validate `_site/index.html`, `_site/experience/index.html`, `_site/es/index.html`, `_site/sitemap.xml`, `_site/robots.txt` and `_site/CNAME`.

### Structure changes

1. Create or move the page.
2. Review `permalink`.
3. Review `navigation.js`.
4. Run the build.
5. Verify relative links, sitemap and canonical.

## Useful commands

### Local development

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
```

### On PowerShell if `npm.ps1` is blocked

On some Windows machines PowerShell blocks `npm.ps1`. If that happens, use:

```bash
cmd /c npm run build
```

or:

```bash
cmd /c npm run dev
```

## Quick checklist before publishing

- The page opens and there are no build errors.
- The home has a correct `<title>`.
- Every page has a useful `description`.
- The canonicals point to `https://pablomagarinos.es/...`.
- `_site/sitemap.xml` contains the expected URLs.
- `_site/robots.txt` references the correct sitemap.
- `_site/CNAME` contains `pablomagarinos.es`.
- The favicon loads.
- The social image exists and is accessible.

## Recommended manual validation

After building, review:

- `_site/index.html`
- `_site/experience/index.html`
- `_site/es/index.html`
- `_site/sitemap.xml`
- `_site/robots.txt`
- `_site/CNAME`

Search in the HTML for:

- `<title>`
- `meta name="description"`
- `rel="canonical"`
- `og:title`
- `og:image`
- `twitter:card`
- `application/ld+json`

## Important notes

### UTF-8 encoding

Use UTF-8 when editing files with accents such as `Magariños`.

It can happen that PowerShell shows some strange characters when running `Get-Content`, but that does not necessarily mean the file is wrong. The important thing is that the generated HTML and the browser render the text well.

### `_site` is not source

Do not make manual changes in `_site`.

Always change the files in `src/` or the configuration and then rebuild.

### Where the content of each page lives

Not all pages are a `.md`. The structured pages (`/experience/`,
`/research/`, `/links/`) have their text in `src/_data/*.js` and their markup in their
`.njk`; the home is `src/index.njk`. Only prose (thoughts, notebook, privacy,
how-i-made-the-web) is edited in Markdown.

## Summary of the files you will touch most

- Content (prose): `src/notebook/*.md`, `src/privacy.md` (and its translation in `src/es/`)
- Content (structured): `src/_data/experience.js`, `src/_data/research.js`, `src/_data/links.js`
- Home: `src/index.njk` and `src/es/index.njk`
- Menu: `src/_data/navigation.js`
- Global SEO: `src/_data/site.js`
- Head and metadata: `src/_includes/base.njk`
- Sitemap: `src/sitemap.xml.njk`
- Robots: `src/robots.txt`
- Domain: `src/CNAME`
- Social image and favicon: `src/assets/images/`
- Build and routes: `.eleventy.js`
- Deployment: `.github/workflows/deploy.yml`
