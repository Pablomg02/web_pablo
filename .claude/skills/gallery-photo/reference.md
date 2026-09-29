# Gallery internals (read only if SKILL.md steps fail or you edit a template)

## How one photo flows through the build

1. `src/gallery/<slug>.md` and `src/es/gallery/<slug>.md` are ordinary Eleventy
   pages. Both folders use `gallery.11tydata.js` (the Spanish one only does
   `module.exports = require("../../gallery/gallery.11tydata.js")`), which sets
   `layout: photo.njk`, `tags: "photo"` (this puts the page in `collections.photo`),
   `pageKey: "photo"`, and two computed fields:
   - `image` = `src/gallery/<slug>.<ext>`, trying `jpeg`, `jpg`, `png`, `webp`
     in that order; **throws** `No image for gallery photo "<slug>"` if none exists.
   - `ratio` = width / height of the original, 4 decimals, read with
     `@11ty/eleventy-img` `statsOnly`. It is written inline as `--ratio` on each
     tile and each home-band item; the CSS and the row-layout script use it.
2. URL: `src/gallery/x.md` -> `/gallery/x/`; `src/es/gallery/x.md` -> `/es/gallery/x/`.
   `lang` is `"es"` under `src/es/` (`src/es/es.json`), `"en"` elsewhere.
3. `src/_includes/photo.njk` renders the photo page with the partial
   `src/_includes/partials/photo-view.njk` and a prev/next pager built from
   `collections.photo | inLanguage(lang) | galleryOrder`.
4. `src/_includes/pages/gallery.njk` (included by `src/gallery.njk` and
   `src/es/gallery.njk`) renders the grid from the same collection. For each
   photo it also puts the same partial inside a `<template data-gallery-story>`;
   with JavaScript, clicking a tile opens that copy in a `<dialog>` instead of
   navigating. `item.templateContent` (the rendered story) is only available
   there because the page front matter has `eleventyImport: collections: ["photo"]`.
   Without it the stories can be empty.
5. The home (`src/index.njk`, `src/es/index.njk`) builds the band with
   `collections.photo | inLanguage(lang) | galleryOrder | featuredPhotos`.

## Filters defined in `.eleventy.js`

- `galleryOrder`: sort by `year`, then `order` (default 0), then `page.fileSlug`.
- `featuredPhotos`: keeps items whose `data.featured` is truthy.
- `inLanguage(lang)`: keeps items whose `data.lang` (default `en`) equals `lang`.
- `findIndexByUrl`: position of a page in a list; used by the pager.

## `{% picture %}` details

- Defined with `addAsyncShortcode("picture", ...)` in `.eleventy.js`.
- Writes files into `_site/img/` (path fixed in `IMAGE_OPTIONS`, **even if you
  build with `--output=elsewhere`**), as WebP (quality 72) and progressive
  mozjpeg (quality 76). Default `widths` are `[480, 960, "auto"]`; `"auto"` is the
  original width, so a larger original means a larger biggest variant.
- Camera metadata is not carried into the generated files. The original in `src/`
  is committed as is, hence the metadata strip in `prepare-photo.py`.
- Options: `widths`, `sizes` (default `100vw`), `class`, `loading` (default
  `lazy`), `fetchpriority`.
- Existing calls to copy from: grid tile in `src/_includes/pages/gallery.njk`,
  viewer/page in `src/_includes/partials/photo-view.njk`, home band in
  `src/index.njk`, portrait in `src/index.njk` line 16.

## Interface strings

`src/_data/i18n.js` has `gallery`, `viewFullGallery`, `noPhotos`, `closePhoto`,
`previousPhoto`, `nextPhoto`, `photoViewer` for both `en` and `es`. A new string
must be added in both languages.

## Facts observed in the repo when this skill was written

- 8 photos, all present in both languages; 3 are `featured` (`corvo-2022`,
  `mir-10-2024`, `xtrachallenge-2023`).
- Not every original is 2400 px: `acc-2024`, `f1-2023`, `pontup-2025` are 2400
  wide; `aeae-2024`, `aerotech-2023`, `mir-10-2024`, `xtrachallenge-2023` are 1280;
  `corvo-2022` is 800x800. 2400 is a ceiling, not a minimum: never upscale.
- Photo pages have no `description` field, so their SEO description is the site
  default (`src/_includes/base.njk`).
- Tools present: `file`, `python3` with Pillow, `node`. Not present: `identify`,
  `convert`, `magick`, `exiftool`.
