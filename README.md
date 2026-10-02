# pablomagarinos.es

Source of my personal website. Built from scratch with a small set of simple
tools, so the result stays understandable and clean.

[Eleventy](https://www.11ty.dev/) turns Markdown and a few data files into plain
HTML, CSS and JavaScript. GitHub Actions builds `_site/` and deploys it to
GitHub Pages.

**Live:** https://pablomagarinos.es

## Development

```bash
npm install
npm run dev            # local server at http://localhost:8080
npm run build          # writes _site/
npm run notebook:pdf   # regenerates the Tech Notes PDFs (Pandoc + LaTeX)
```

## Content

Two models, chosen by the shape of the page:

- **Prose** in Markdown: `src/notebook/*.md`, `src/privacy.md`, `src/how-i-made-the-web.md`.
- **Structured pages** in data plus template: `src/_data/{experience,research,links}.js`
  rendered by `src/_includes/pages/`.

The site exists in English (root) and Spanish (`src/es/`) at mirrored paths:
`/research/` and `/es/research/` are the same page. The build fails if a
translation is missing.

The conventions and the step-by-step procedures live in `CLAUDE.md` and
`.claude/skills/`.

## License

MIT
