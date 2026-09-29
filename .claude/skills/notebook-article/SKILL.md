---
name: notebook-article
description: Write, edit or translate a Notebook (Tech Notes) article in English and Spanish and generate its PDF with Pandoc/LaTeX. Use when the user says "add an article", "new notebook note", "write a tech note", "edit the notebook article", "translate the article", "regenerate the PDF", "the PDF is stale/missing", or touches any file in src/notebook/ or src/es/notebook/.
---

# Notebook article (both languages + PDF)

An article is FOUR things that must be committed together:

| File | Purpose |
|---|---|
| `src/notebook/<slug>.md` | English article |
| `src/es/notebook/<slug>.md` | Spanish translation, same `<slug>` |
| `src/notebook/<slug>.pdf` | English PDF (generated) |
| `src/es/notebook/<slug>.pdf` | Spanish PDF (generated) |

Optional: `src/notebook/<slug>/` folder with the images (shared by both languages).

Language and mirror rules (same path in both languages, URLs never translated) are in `CLAUDE.md`. Do not repeat them here; obey them.

Real example to copy from: `src/notebook/letting-ai-build-an-engineering-tool.md` and `src/es/notebook/letting-ai-build-an-engineering-tool.md`.

## Procedure

1. **Choose the slug.** Lowercase, words separated by `-`, English, no accents. Example: `letting-ai-build-an-engineering-tool`. The slug is the file name and the URL. The Spanish file uses the SAME slug.
2. **Create `src/notebook/<slug>.md`** starting from this front matter (only these fields; `layout`, `tags`, `math`, `pageKey` come from `src/notebook/notebook.json`, never repeat them):

   ```markdown
   ---
   title: "Letting AI Build an Engineering Tool: What to Expect"
   description: One or two neutral sentences. Shown in the article list and in llms.txt.
   date: 2026-09-18
   topics:
     - AI Engineering
     - Aircraft Design
   ---

   > **Summary.** Two or three sentences with the result.

   ## First section
   ```
   - `date` MUST be `YYYY-MM-DD` (the PDF script parses exactly this shape).
   - Optional `updated: YYYY-MM-DD` when you edit a published article. It appears on the page, in the list and in the PDF.
   - `topics` MUST be a block list (`  - item` lines), not `[a, b]` (the PDF script only reads block lists).
   - Body headings start at `##` (the page already prints the title as `<h1>`).
3. **Create `src/es/notebook/<slug>.md`**: same fields, `title`, `description`, `topics` and body translated. `date` (and `updated`) are copied unchanged. Keep the same section structure, images and footnote keys as the English file.
4. **Images** (if any): put files in `src/notebook/<slug>/` (PNG, JPG, JPEG, SVG or WebP only). In BOTH `.md` files reference them by bare name, with alt text, and an italic caption paragraph right after (blank line between):
   ```markdown
   ![IDLEDrones design editor](web1.png)

   *The editor defines the family, the geometry and the main components.*
   ```
   Translate the alt text and caption in the Spanish file; do not copy the image into `src/es/`. If you create a NEW image folder, restart `npm run dev` (copy rules are computed at startup).
5. **Optional elements**: math, footnotes and folded prompts. Syntax and limits are in [reference.md](reference.md) (read it when the article uses any of these).
6. **Build the site to check the pages**: `npm run build`. It must finish without errors.
7. **Generate the PDFs**: first check the tools exist: `which pandoc pdflatex kpsewhich`. If one is missing, STOP and tell the user; do not skip this step and do not hand-write a PDF. Then run `npm run notebook:pdf`.
   - Spanish needs `sudo apt install texlive-lang-spanish`. If the script prints `es: skipped` it exits non-zero: install the package and rerun. Do not commit with the Spanish PDF missing or stale.
   - The script rebuilds the PDFs of ALL articles. Run `git status`; if a PDF of an article you did not touch shows as modified, restore it with `git checkout -- <that pdf>`.
8. **Check the PDFs** (see checklist), then stage the four files together. Only commit if the user asked you to.

## Editing an existing article

1. Edit the English `.md` and apply the same change to the Spanish `.md`.
2. Optionally set `updated: YYYY-MM-DD` in both files.
3. Rerun steps 6-8. ANY change to a `.md` requires regenerating its PDF, because CI does not build PDFs.

## Common mistakes

- Editing only one language. The mirror is mandatory.
- Different slug or translated file name in Spanish. The slug never changes.
- Forgetting `npm run notebook:pdf`: the page shows the OLD PDF (or no download link if none exists). The link appears automatically only when `<slug>.pdf` exists next to the `.md`.
- Writing `{{` or `{%` in the text: Markdown is processed by Nunjucks first, so this breaks the build. Wrap literal braces in `{% raw %}...{% endraw %}`.
- `topics: [A, B]` or a date like `18/09/2026`: the PDF header comes out empty or wrong.
- Copying images into `src/es/notebook/`. Not needed; they are copied automatically.
- Upgrading `@mdit/plugin-katex` to 1.x. Do not touch it (see reference.md).
- Adding `layout:`, `tags:` or `math:` to the article. They are inherited.
- Committing only `.md` files, or only one language's PDF.

## Verification checklist

Run each command; all must pass.

- [ ] `npm run build` ends without errors.
- [ ] Pages exist: `ls _site/notebook/<slug>/index.html _site/es/notebook/<slug>/index.html`
- [ ] PDFs copied: `ls _site/notebook/<slug>.pdf _site/es/notebook/<slug>.pdf`
- [ ] Download link present in both pages: `grep -c pdf-download-link _site/notebook/<slug>/index.html _site/es/notebook/<slug>/index.html` prints `1` for each.
- [ ] Images copied to both languages (if any): `ls _site/notebook/<slug>/ _site/es/notebook/<slug>/` shows the same image files.
- [ ] `npm run notebook:pdf` exits with code 0 (`echo $?` prints `0`) and printed `[pdf] en <slug>` and `[pdf] es <slug>`.
- [ ] `git status --short` lists exactly: the two `.md`, the two `.pdf` (and the image folder if new). Nothing else, except `_site/` which is ignored.
- [ ] Open each PDF (Read tool, `pages: "1-2"`): title, author, date, keywords and body are present; figures sit with their captions; folded prompts appear expanded; the Spanish PDF has Spanish date/labels ("Artículo", "Palabras clave").
