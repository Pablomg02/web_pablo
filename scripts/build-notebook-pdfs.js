const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const notebookDir = path.join(__dirname, "..", "src", "notebook");
const outputDir = notebookDir;
const preamble = path.join(__dirname, "pdf", "preamble.tex");

const articles = fs
  .readdirSync(notebookDir)
  .filter((file) => file.endsWith(".md"));

for (const file of articles) {
  const slug = file.replace(/\.md$/, "");
  const input = path.join(notebookDir, file);
  const output = path.join(outputDir, `${slug}.pdf`);

  console.log(`[pdf] ${slug}`);

  execFileSync(
    "pandoc",
    [
      input,
      "-o",
      output,
      "--pdf-engine=pdflatex",
      "-H",
      preamble,
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
}
