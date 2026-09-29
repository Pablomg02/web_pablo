---
name: gallery-photo
description: Add, edit, replace, feature or remove a photo in this site's Gallery (a photo plus its story, in English and Spanish), or replace the home portrait. Use when the user says "add a photo to the gallery", "new picture", "new photo with a story", "feature a photo on the home", "change the portrait", "fix the alt text of a photo" or "remove a photo".
---

# Gallery photo

A gallery photo is exactly **three files sharing one slug**. Everything else
(page URL, image path, aspect ratio, sort order, home band) is derived from them.

| File | Holds |
|---|---|
| `src/gallery/<slug>.jpeg` | the picture (shared by both languages) |
| `src/gallery/<slug>.md` | English story |
| `src/es/gallery/<slug>.md` | Spanish story, **same slug** |

Read `CLAUDE.md` sections "Languages" and "Gallery" for the rules that stay
global (EN/ES mirror, URLs and file names are never translated).
Read `reference.md` (next to this file) only if a step below fails or you must
touch a template.

## Add a photo

1. **Pick the slug**: lowercase, hyphens, event + year, e.g. `xtrachallenge-2023`,
   `pontup-2025`. It becomes the URL (`/gallery/<slug>/` and `/es/gallery/<slug>/`).
   Check it is free: `ls src/gallery/<slug>.*` must print nothing.
2. **Prepare the image** (resizes to 2400 px on the long side, fixes rotation,
   removes GPS/camera metadata; the original file is committed to the repo):
   ```
   python3 .claude/skills/gallery-photo/prepare-photo.py <path-to-original> src/gallery/<slug>.jpeg
   ```
   It prints `WIDTHxHEIGHT`. The extension must be lowercase `.jpeg`
   (`.JPG` is NOT found). `identify`/`convert` are not installed; use this script.
   Do not commit an untouched camera file.
3. **Create the English story** `src/gallery/<slug>.md`. Copy this real one
   (`src/gallery/f1-2023.md`) and replace the values:
   ```md
   ---
   title: Drivers' parade in Barcelona
   year: 2023
   place: Circuit de Barcelona-Catalunya
   alt: Formula 1 drivers wave to the crowd from the back of a truck during the drivers' parade.
   ---

   Two short paragraphs in the first person: what the photo is, why it matters to me.
   ```
4. **Create the Spanish story** `src/es/gallery/<slug>.md` with the **same field
   names and same `year`, `order`, `featured` values**. Translate `title`, `place`
   (if it has a Spanish name: `Aachen, Germany` -> `Aquisgrán, Alemania`;
   `Valencia, Spain` -> `Valencia`), `alt` and the text. Real pair:
   `src/es/gallery/f1-2023.md`. Keep the first-person voice and the same facts.
5. **Ask before featuring**: only set `featured: true` if the user asked for the
   photo on the home. Set it in BOTH files. The home band should keep **three**
   photos; see "Feature / unfeature".
6. **Verify** with the checklist at the bottom.

## Front matter fields

| Field | Required | Rule |
|---|---|---|
| `title` | yes | Short string. Translate in ES. |
| `year` | yes | A bare number (`2024`, no quotes). Sorting subtracts years; a missing or text year breaks the order. |
| `alt` | yes | One sentence that describes what is visible, for someone who cannot see it. The build fails without it. Translate in ES. |
| `place` | no | Omit the line if unknown. Translate in ES when the place has a Spanish name. |
| `featured` | no | `true` puts it in the home band. Same value in both languages. |
| `order` | no | Integer tie-break between photos of the same year (lower first; default 0). Same value in both languages. |

**Never add** `layout`, `tags`, `pageKey`, `image`, `ratio`, `permalink`, `lang`
or `title`-derived slugs. `src/gallery/gallery.11tydata.js` (re-exported by
`src/es/gallery/gallery.11tydata.js`) sets them; `lang` comes from `src/es/es.json`.

Ordering: oldest `year` first, then `order`, then slug alphabetically.

## Feature / unfeature on the home

The home strip lists photos with `featured: true` (`src/index.njk`,
`src/es/index.njk`, filter `featuredPhotos` in `.eleventy.js`). Current featured
photos: `grep -l '^featured: true' src/gallery/*.md`. To swap one, remove the
`featured: true` line from the old photo's **two** files and add it to the new
photo's **two** files. If it would make more than three, ask the user which to drop.

## Edit or replace

- **Change a story or alt text**: edit both `.md` files; keep them in sync.
- **Replace the picture**: run step 2 again with the same output path. Keep the
  slug. The aspect ratio and all sizes are recomputed at build time.
- **Remove a photo**: delete all three files, then run the verification. Remove
  `featured: true` first only if you need to replace it in the band.
- **Rename a slug**: rename all three files together. The old URL stops existing.

## Home portrait

`src/images/portrait.jpeg` is a square 400x400 picture, printed by
`{% picture "src/images/portrait.jpeg", "<alt>", {...} %}` in `src/index.njk`
and `src/es/index.njk`. To change it: crop it square first, run
`python3 .claude/skills/gallery-photo/prepare-photo.py <in> src/images/portrait.jpeg 800`,
keep the file name. Its alt text is written in the two index files, not in the
image; change it in both if the person changes.

## The `{% picture %}` shortcode (only if you write a template)

`{% picture src, alt, { widths: [...], sizes: "...", class: "...", loading: "eager" } %}`
prints a responsive `<picture>` (WebP + JPEG). It is **async**:

- inside a loop use `{% asyncEach item in list %} ... {% endeach %}`, **never** `{% for %}`;
- `alt` is mandatory (use `""` only for purely decorative images, as the home band does);
- `src` is a path from the repo root, e.g. `item.data.image` (`src/gallery/<slug>.jpeg`).

## Common mistakes

1. Creating only one language. The build still passes, but the other language's
   gallery, pager and home band silently lose the photo.
2. Using a different slug (or translated name) in `src/es/gallery/`. Same slug.
3. Putting the image in `src/es/gallery/`. The image lives only in `src/gallery/`.
4. Naming the image `.JPG` or `.jpg` when `.jpeg` is the convention. Only
   lowercase `jpeg`, `jpg`, `png`, `webp` are looked up, and the name must equal the slug.
5. Copying the original from a camera or phone. It carries GPS data and weighs
   several MB. Always go through `prepare-photo.py`.
6. Quoting or omitting `year`; forgetting `alt` (build error `Missing alt text`).
7. Setting `featured: true` in only one language, or featuring more than three.
8. Writing a relative link inside the story text. The story is also shown in a
   pop-up viewer; use full `https://` links or none.
9. Deleting `eleventyImport` from `src/gallery.njk` / `src/es/gallery.njk` or
   editing the `<script>` in `src/_includes/pages/gallery.njk` "to tidy up". The
   first makes the stories render before the grid reads them; the script lays out
   the rows and the viewer. Do not touch them for a normal photo.
10. Running `npm run notebook:pdf`. Not related to the gallery.

## Verify (run all; every line must match)

```
npm run build
ls _site/gallery/<slug>/index.html _site/es/gallery/<slug>/index.html   # both exist
ls src/gallery/*.md | wc -l; ls src/es/gallery/*.md | wc -l              # same number
grep -o 'class="photo-tile"' _site/gallery/index.html | wc -l            # = EN count
grep -o 'class="photo-tile"' _site/es/gallery/index.html | wc -l         # = ES count
grep -o 'class="photo-band__item"' _site/index.html | wc -l              # 3 (featured count)
grep -o 'class="photo-band__item"' _site/es/index.html | wc -l           # same as EN
file src/gallery/<slug>.jpeg                                             # JPEG, long side <= 2400
git status --short                                                       # only your 3 files (+ .claude/ if new)
```

The build must end without `Error`. Do not commit unless the user asks.
