# cv-entry reference — exact shapes and templates

Every template below is copied from a real entry. Replace the values; keep the keys and the `{ en, es }` structure. Fields marked *required* are read by the template unconditionally.

Legend: **L** = `{ en, es }` object (both languages mandatory) · **P** = plain string, same in both languages · **E** = English-only plain string (llms.txt).

---

## 1. Role — `src/_data/experience.js`

Path: `module.exports.groups[i].roles[j]`. Group 0 = "Current Experience", group 1 = "Previous Experience". Rendered by `src/_includes/pages/experience.njk`.

| Key | Type | Required | Shown as |
|---|---|---|---|
| `org` | L or P (P for a proper name like `"ATRG"`; L when the name is translated, e.g. "University of Vigo" / "Universidade de Vigo") | yes | Card heading (`.role__title`) |
| `role` | L | yes | Job title after the dash (`.role__role`) |
| `period` | L | yes | Date line (`.role__period`) |
| `summary` | E (plain English, third person) | **yes in group 0**, not used in group 1 | Only in `llms.txt` |
| `body` | `{ en: [html…], es: [html…] }` | yes | One `<p>` per string |
| `bullets` | `{ en: [html…], es: [html…] }` | no (no existing role uses it) | `<ul>` after the paragraphs |
| `links` | array of `{ label, url }`; `label` is P (`"LinkedIn"`) or L (the shared `webpage` constant) | no | Link row; first one also goes to `llms.txt` |

`webpage` is a constant already defined at the top of the file (`{ en: "Webpage", es: "Web" }`). Use `label: webpage` for a website link; use `label: "LinkedIn"` for LinkedIn.

Template (current role, from ATRG; paste inside `groups[0].roles`):

```js
{
  org: "ATRG",
  role: { en: "Researcher", es: "Investigador" },
  period: { en: "November 2024 – Present", es: "Noviembre de 2024 – Actualidad" },
  summary:
    "Research work on AI for aerospace vehicles: onboard computer vision, pose estimation, weakly-labelled self-training pipelines, and a Master's thesis on multi-agent AI.",
  body: {
    en: [
      "First paragraph with <strong>bold text</strong>.",
      "Second paragraph, R&amp;D uses an escaped ampersand.",
    ],
    es: [
      "Primer párrafo con <strong>texto en negrita</strong>.",
      "Segundo párrafo, I+D no necesita escape.",
    ],
  },
  links: [
    { label: webpage, url: "https://aerospacetech.org/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/atrg" },
  ],
},
```

A previous role (`groups[1].roles`) is the same object **without `summary`** (see "Aguia Advanced Analytics" in the file).

---

## 2. Publication — `src/_data/research.js`

Path: `module.exports.publications[i]`. Newest first. Rendered by `src/_includes/pages/research.njk`.

| Key | Type | Required | Shown as |
|---|---|---|---|
| `title` | **P only** (the title as published; never `{ en, es }`) | yes | `<h2>` (`.publication__title`) and `llms.txt` |
| `venue` | L | yes | Line under the title (`.publication__venue`), plain text |
| `summary` | E (plain English, third person) | yes | Only in `llms.txt` |
| `body` | `{ en: [html…], es: [html…] }` | yes | One `<p>` per string |
| `links` | array of `{ label, url }` (label: the shared `paper` constant `{ en: "Paper", es: "Artículo" }`, or P like `"DOI"`); use `[]` when there are none | yes (use `[]`) | Link row (`.publication__links`), also in `llms.txt` |

Template (from the macroalgae paper):

```js
{
  title:
    "Weakly Supervised Segmentation of Macroalgae Through Gradient Analysis in Convolutional Neural Networks and Segment Anything Model",
  venue: {
    en: "August 2026 — Applied Sciences (MDPI), Vol. 16, Issue 17",
    es: "Agosto de 2026, Applied Sciences (MDPI), vol. 16, n.º 17",
  },
  summary:
    "Weakly supervised macroalgae segmentation, analysing CNN gradients across all intermediate layers to guide SAM2 from image-level labels alone.",
  body: {
    en: ["Paragraph in English with <strong>emphasis</strong>."],
    es: ["Párrafo en español con <strong>énfasis</strong>."],
  },
  links: [
    { label: paper, url: "https://www.mdpi.com/2076-3417/16/17/8470" },
    { label: "DOI", url: "https://doi.org/10.3390/app16178470" },
  ],
},
```

An unpublished work uses `links: []` (see the Master's thesis entry). A link to code inside a paragraph is an `<a>` in `body`, with escaped quotes: `<a href=\"https://github.com/Pablomg02/DRLFoil\">GitHub</a>`.

---

## 3. Link — `src/_data/links.js`

The file exports an **array of groups**: `{ title: L, entries: [...] }`. Rendered by `src/_includes/pages/links.njk`. An entry is one of two kinds.

### 3a. Single link (a card)

| Key | Type | Required | Notes |
|---|---|---|---|
| `label` | P | yes | Card title; the service name or an email address, same in both languages |
| `badge` | P (1–2 characters) | yes | Monogram in the card (`"in"`, `"@"`, `"GH"`, `"M"`) |
| `url` | P | yes | `https://…` or `mailto:…` |
| `note` | L, **plain text, no HTML**, first person | recommended | Small text on the card |
| `llmsNote` | E (plain English, third person) | needed when `note` is first person | Only in `llms.txt`; falls back to `note.en` |

```js
{
  label: "Medium",
  badge: "M",
  url: "https://medium.com/@pablomagarinos",
  note: {
    en: "Where I occasionally publish articles.",
    es: "Donde publico artículos de vez en cuando.",
  },
  llmsNote: "Occasional external writing.",
},
```

### 3b. Prefix + several links on one line (used for research profiles)

| Key | Type | Required |
|---|---|---|
| `prefix` | L, plain text | yes |
| `links` | array of `{ label: P, badge: P, url: P }` (no `note`) | yes |

```js
{
  prefix: {
    en: "My academic publications and citations:",
    es: "Mis publicaciones académicas y citas:",
  },
  links: [
    { label: "ORCID", badge: "iD", url: "https://orcid.org/0009-0002-9817-0368" },
  ],
},
```

### 3c. New group

```js
{
  title: { en: "Talks", es: "Charlas" },
  entries: [ /* entries as above */ ],
},
```

Special case: `llms.txt.njk` also prints the entry with `label: "Learn"` under "Main Initiatives". Do not rename that label unless you also change the template (ask the user first).

---

## 4. Other fields in the same files (rarely edited)

- `experience.title`, `experience.lead`, `research.title`, `research.lead`: L. The two `lead`s are HTML (printed with `| safe`); the `title`s are plain.
- `research.orcid`: `{ id, url }`, plain values, no translation.
- `experience.groups[i].title`: L, plain text.
- `research.lead` is also summarised by hand in the intro paragraph of `src/llms.txt.njk`; if you change the research focus in `lead`, tell the user that paragraph is not generated.
