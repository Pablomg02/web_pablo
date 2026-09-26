const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const site = require("../src/_data/site.js");

const srcDir = path.join(__dirname, "..", "src");
// The English articles live in src/notebook/, their Spanish translations in
// src/es/notebook/ under the same file name. Each PDF is written next to its
// source. Images are not translated: both languages read them from the
// English article's folder, src/notebook/<slug>/.
const notebookDir = path.join(srcDir, "notebook");
const preamble = path.join(__dirname, "pdf", "preamble.tex");

const LANGUAGES = {
  en: {
    dir: notebookDir,
    urlPrefix: "",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    formatDate: (day, month, year) => `${day} ${month} ${year}`,
    labels: null,
  },
  es: {
    dir: path.join(srcDir, "es", "notebook"),
    urlPrefix: "/es",
    months: [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ],
    formatDate: (day, month, year) => `${day} de ${month} de ${year}`,
    // Pandoc loads babel's Spanish support (hyphenation, quotes) for
    // lang=es, which TeX Live ships separately.
    requires: { file: "spanish.ldf", install: "sudo apt install texlive-lang-spanish" },
    // Overrides for the words the preamble prints (\PaperLabel*).
    labels: {
      PaperLabelSite: "Web",
      PaperLabelArticle: "Artículo",
      PaperLabelUpdated: "última edición:",
      PaperLabelKeywords: "Palabras clave",
    },
  },
};

// --- Frontmatter parsing ----------------------------------------------------
// Minimal YAML reader for the flat `key: value` fields and the `topics:` list
// the Notebook articles use. Avoids pulling in a dependency.
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data = {};
  const lines = match[1].split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1];
    let value = kv[2].trim();

    if (value === "") {
      // Possibly a block list: gather following `  - item` lines.
      const items = [];
      while (i + 1 < lines.length && /^\s*-\s+/.test(lines[i + 1])) {
        items.push(lines[++i].replace(/^\s*-\s+/, "").trim());
      }
      data[key] = items.length ? items : "";
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return data;
}

// --- LaTeX helpers ----------------------------------------------------------
function escapeLatex(input) {
  return String(input)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (c) => `\\${c}`)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/—/g, "---")
    .replace(/–/g, "--")
    .replace(/‘/g, "`")
    .replace(/’/g, "'")
    .replace(/“/g, "``")
    .replace(/”/g, "''")
    .replace(/…/g, "\\ldots{}")
    .replace(/&mdash;/g, "---")
    .replace(/&ndash;/g, "--");
}

function formatDate(value, language) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return escapeLatex(value);
  const [, year, month, day] = m;
  return language.formatDate(Number(day), language.months[Number(month) - 1], year);
}

// URLs are passed verbatim (no LaTeX escaping) so hyperref receives them
// unmangled; the footer renders them behind "Web" / "Article" labels.
function metaFileContents(meta, slug, language) {
  const def = (name, value) => `\\gdef\\${name}{${value}}\n`;
  const siteUrl = `${site.url.replace(/\/$/, "")}${language.urlPrefix}/`;
  const articleUrl = `${siteUrl}notebook/${slug}/`;

  let out = "";
  out += def("PaperAuthor", escapeLatex(site.author));
  out += def("PaperDate", formatDate(meta.date, language));
  out += def("PaperUpdated", formatDate(meta.updated, language));
  const topics = Array.isArray(meta.topics) ? meta.topics : [];
  out += def(
    "PaperKeywords",
    topics.map((t) => escapeLatex(t)).join(", "),
  );
  out += def("PaperUrl", articleUrl);
  out += def("PaperSite", siteUrl);
  for (const [name, value] of Object.entries(language.labels || {})) {
    out += def(name, escapeLatex(value));
  }
  return out;
}

// --- Build ------------------------------------------------------------------
function texFileExists(name) {
  try {
    return execFileSync("kpsewhich", [name], { encoding: "utf8" }).trim() !== "";
  } catch {
    return false;
  }
}

const skipped = [];

for (const [lang, language] of Object.entries(LANGUAGES)) {
  if (!fs.existsSync(language.dir)) continue;

  if (language.requires && !texFileExists(language.requires.file)) {
    console.error(
      `[pdf] ${lang}: skipped, ${language.requires.file} is not installed. ` +
        `Install it with: ${language.requires.install}`,
    );
    skipped.push(lang);
    continue;
  }

  const articles = fs
    .readdirSync(language.dir)
    .filter((file) => file.endsWith(".md"));

  for (const file of articles) {
    const slug = file.replace(/\.md$/, "");
    const input = path.join(language.dir, file);
    const output = path.join(language.dir, `${slug}.pdf`);

    console.log(`[pdf] ${lang} ${slug}`);

    const frontmatter = parseFrontmatter(fs.readFileSync(input, "utf8"));
    const metaFile = path.join(os.tmpdir(), `notebook-${lang}-${slug}-meta.tex`);
    fs.writeFileSync(metaFile, metaFileContents(frontmatter, slug, language));

    try {
      execFileSync(
        "pandoc",
        [
          input,
          "-o",
          output,
          "--pdf-engine=pdflatex",
          "-H",
          preamble,
          "-H",
          metaFile,
          "-V",
          "fontsize=11pt",
          "-V",
          "linestretch=1.15",
          "-V",
          "colorlinks=true",
          "-V",
          "linkcolor=NavyBlue",
          "-V",
          "urlcolor=NavyBlue",
          "-V",
          "citecolor=NavyBlue",
          "--metadata",
          `lang=${lang}`,
          "--resource-path",
          [path.join(notebookDir, slug), notebookDir].join(path.delimiter),
        ],
        { stdio: "inherit" },
      );
    } finally {
      fs.rmSync(metaFile, { force: true });
    }
  }
}

// The PDFs that could be built are written; a skipped language still fails
// the run so a stale or missing PDF is not committed unnoticed.
if (skipped.length) {
  process.exitCode = 1;
}
