const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const site = require("../src/_data/site.js");

const notebookDir = path.join(__dirname, "..", "src", "notebook");
const outputDir = notebookDir;
const preamble = path.join(__dirname, "pdf", "preamble.tex");

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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(value) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return escapeLatex(value);
  const [, year, month, day] = m;
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
}

// URLs are passed verbatim (no LaTeX escaping) so hyperref receives them
// unmangled; the footer renders them behind "Web" / "Article" labels.
function metaFileContents(meta, slug) {
  const def = (name, value) => `\\gdef\\${name}{${value}}\n`;
  const articleUrl = `${site.url.replace(/\/$/, "")}/notebook/${slug}/`;

  let out = "";
  out += def("PaperAuthor", escapeLatex(site.author));
  out += def("PaperDate", formatDate(meta.date));
  out += def("PaperUpdated", formatDate(meta.updated));
  out += def("PaperAbstract", meta.description ? escapeLatex(meta.description) : "");
  const topics = Array.isArray(meta.topics) ? meta.topics : [];
  out += def(
    "PaperKeywords",
    topics.map((t) => escapeLatex(t)).join(", "),
  );
  out += def("PaperUrl", articleUrl);
  out += def("PaperSite", site.url);
  return out;
}

// --- Build ------------------------------------------------------------------
const articles = fs
  .readdirSync(notebookDir)
  .filter((file) => file.endsWith(".md"));

for (const file of articles) {
  const slug = file.replace(/\.md$/, "");
  const input = path.join(notebookDir, file);
  const output = path.join(outputDir, `${slug}.pdf`);

  console.log(`[pdf] ${slug}`);

  const frontmatter = parseFrontmatter(fs.readFileSync(input, "utf8"));
  const metaFile = path.join(os.tmpdir(), `notebook-${slug}-meta.tex`);
  fs.writeFileSync(metaFile, metaFileContents(frontmatter, slug));

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
        "lang=en",
      ],
      { stdio: "inherit" },
    );
  } finally {
    fs.rmSync(metaFile, { force: true });
  }
}
