# Notebook article: syntax reference

Read this when an article uses math, footnotes, folded prompts, or when the PDF/KaTeX build misbehaves.

## Math (KaTeX)

- Inline: `$E = mc^2$`. Block: `$$ ... $$` on its own lines.
- Rendered at build time by `@mdit/plugin-katex` (`.eleventy.js`). The KaTeX stylesheet loads because `src/notebook/notebook.json` and `src/es/notebook/notebook.json` set `math: true`. Do not add `math:` to an article.
- The same `$...$` is typeset by LaTeX in the PDF, so use only commands both KaTeX and LaTeX understand.
- **Pin:** `@mdit/plugin-katex` stays at `^0.25.2` in `package.json`. Version 1.x needs markdown-it 15 and Eleventy 3 ships markdown-it 14. Do not bump it (or run `npm update` blindly) until Eleventy moves to markdown-it 15. `katex` itself may be updated freely: its CSS and fonts are copied from `node_modules` at build time.

## Footnotes / References

- Write `[^key]` in the text and `[^key]: Reference text.` anywhere (usually at the end).
- The site prints them as a "References" (EN) / "Referencias" (ES) section automatically; do not write that heading yourself.
- Use the same keys in both languages.

## Folded prompts or long quotes

Copy this exact shape (from `src/notebook/letting-ai-build-an-engineering-tool.md`, lines 42-59). Keep the blank lines: without them Markdown inside `<details>` is not rendered.

```markdown
<details class="prompt">
<summary class="prompt__label">Prompt: <code>idea_inicial.md</code></summary>

> First paragraph of the quoted prompt.
>
> Second paragraph.

</details>
```

- Add the attribute `open` (`<details class="prompt" open>`) to show it unfolded by default on the web.
- Translate the summary text in the Spanish file (e.g. "Prompt: petición de documentación").
- The PDF prints these blocks expanded, whether or not `open` is set.

## Images and captions

- Files: `src/notebook/<slug>/name.png`. Allowed types: png, jpg, jpeg, svg, webp (`.eleventy.js` copies only these).
- Reference by bare name: `![alt text](name.png)`. The site copies the folder next to both the English and the Spanish page; the PDF script gives Pandoc `src/notebook/<slug>/` as `--resource-path`. The folder is always the ENGLISH slug folder.
- Caption = the italic paragraph directly after the image. In the PDF, figures are pinned in place, so the caption stays with its image.
- Images are not processed by the `{% picture %}` shortcode in articles (that is for the gallery). Keep files reasonably small.

## What the PDF script does (`scripts/build-notebook-pdfs.js`)

- Loops over `src/notebook/*.md` (lang `en`) and `src/es/notebook/*.md` (lang `es`), writes `<slug>.pdf` next to each `.md`.
- Reads only flat `key: value` fields and a block-list `topics:` from the front matter. Uses `date`, `updated`, `topics` for the title block and `site.author` / `site.url` from `src/_data/site.js` for author and footer links.
- Calls `pandoc ... --pdf-engine=pdflatex -H scripts/pdf/preamble.tex` with `--metadata lang=<en|es>`.
- Spanish is skipped (and the script exits with code 1) when `kpsewhich spanish.ldf` finds nothing. Fix: `sudo apt install texlive-lang-spanish`.
- Typography lives in `scripts/pdf/preamble.tex` (Palatino body/math, TeX Gyre Adventor headings). Title-block words (`\PaperLabel*`) are overridden per language inside the script. Edit those two files, not the articles, to change the PDF look.

## Page mechanics you get for free

- URL: `/notebook/<slug>/` and `/es/notebook/<slug>/` (from the file name).
- The article appears in the lists at `/notebook/` and `/es/notebook/`, newest `date` first, and in `/llms.txt` (English only; it prints `title` and `description`).
- Language comes from the folder (`src/es/es.json` sets `lang: "es"`). Never set `lang` in the article.
- "Download as PDF" link: `src/_includes/essay.njk`, shown only if the `.pdf` exists.
