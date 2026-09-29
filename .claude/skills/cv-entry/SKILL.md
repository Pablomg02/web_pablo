---
name: cv-entry
description: Add or edit one record in the data-driven pages of this site — a role in src/_data/experience.js (/experience/), a publication in src/_data/research.js (/research/), or a link in src/_data/links.js (/links/). Use when the user says "add a role", "new job", "update my experience", "add a publication", "add a paper", "new research entry", "add a link", "add my profile/social/project link", or asks to change the text of one of those entries. Covers the exact object shapes, the English/Spanish {en, es} rules, HTML in rich-text fields, and the llms.txt side effects.
---

# cv-entry — add or edit a role, publication or link

These three pages are lists of records. **Everything you need to change is one object inside one array in `src/_data/`.** Never edit the templates (`src/_includes/pages/*.njk`), the page files (`src/experience.njk`, `src/es/experience.njk`, …) or `src/css/style.css` for this task. For the general rules (why data + template, EN/ES mirror) see `CLAUDE.md`.

The same data file feeds three outputs, so one edit changes all of them:
`/<page>/` (English), `/es/<page>/` (Spanish) and `/llms.txt` (English only, plain text).

## Procedure

1. Decide which file: role → `src/_data/experience.js`; publication → `src/_data/research.js`; link → `src/_data/links.js`.
2. Read that file first. Copy an existing entry of the same kind as your template (do not write one from memory). Field lists and copy-paste templates are in [reference.md](reference.md) — read it now if you are adding an entry.
3. Write the object. Rules that apply to every entry:
   - A field whose text differs by language is `{ en: "…", es: "…" }`. **Always give both `en` and `es`.** A missing language stops the build.
   - A field that reads the same in both languages (an organisation name like `"ATRG"`, a URL, a link label like `"LinkedIn"`, a publication `title`) is a plain string.
   - Spanish is a real translation, not a copy of the English. Keep dates in the style the file already uses (`"September 2026 – Present"` / `"septiembre de 2026 – presente"`).
4. Put the object in the right place in the array. The template does **not** sort:
   - `research.publications`: newest first.
   - `experience.groups[0]` is "Current Experience", `groups[1]` is "Previous Experience". Put the role in the right group.
   - `links`: pick the group (Contact & social / Research / Projects) or add a whole new group object.
5. Run the verification below. Do not report the task done before it passes.

## HTML vs plain text (this decides whether `&` and `<a>` work)

| Field | Printed how | What to write |
|---|---|---|
| `body` (roles and publications), `bullets` (roles), `lead` (page intro) | `\| safe` — raw HTML | Inline HTML only: `<strong>`, `<em>`, `<a href="…">`. Write `&amp;` for `&` (e.g. `R&amp;D`). |
| `org`, `role`, `period`, `venue`, `title`, link `label`, `note`, `prefix`, group `title` | escaped by Nunjucks | Plain text. Write a normal `&`. No tags. |
| `summary`, `llmsNote` | printed raw into `llms.txt` (a .txt file) | Plain text, normal `&`, **no HTML, no `&amp;`**. |

`body` and `bullets` are `{ en: [ "paragraph", … ], es: [ "párrafo", … ] }` — one string per paragraph / bullet, and both languages must have the same number of items. Inside a double-quoted JS string, write `<a href=\"https://…\">` with escaped quotes (as `research.js` does) or use single quotes for the string.

## llms.txt rules (English, third person, plain text)

`src/llms.txt.njk` reads these data files directly. Consequences:

- **Roles**: only roles in `experience.groups[0]` (current) are printed, and each one needs a `summary` (plain English string, **not** `{ en, es }`, third person: "Lecturer at …", not "I teach …"). Without `summary` the line silently ends with an empty `- `. Roles in `groups[1]` need no `summary`. It links to `role.links[0]`, so put the main link first.
- **Publications**: every publication needs a `summary` (plain English string, third person). Its `title` **must stay a plain string**: if you make it `{ en, es }`, `llms.txt` prints `[object Object]`. Its `venue` and link labels are read with `localize('en')`.
- **Links**: `note` is first person and is what the Links page shows (`{ en, es }`). If the note is first person ("Where I publish…"), also add `llmsNote`: a plain English third-person string ("Occasional external writing."). If the note already works in the third person, omit `llmsNote`; `llms.txt` falls back to `note.en`. An entry with neither prints an empty `- `. A `prefix` + `links` entry needs neither: it prints "<group title> profile.".
- `llmsNote` and `summary` exist only where listed above; do not add them to fields that do not use them.

## Verification (run all of these)

Use a scratch output folder so you do not disturb `_site/`, or use `npm run build` if you are the only one working. From the repo root:

```bash
npx eleventy --output=/tmp/cv-entry-check 2>&1 | grep -iE "error|missing" ; echo "exit-grep: $?"
```

Success = no lines printed (grep exits 1). `Missing "es" translation in {...}` means an `{ en, es }` object lacks a language; the message shows which object.

Then confirm the entry rendered (replace `Some Unique Text` with a phrase from your entry):

```bash
grep -c "Some Unique Text" /tmp/cv-entry-check/<page>/index.html /tmp/cv-entry-check/es/<page>/index.html /tmp/cv-entry-check/llms.txt
```

`<page>` is `experience`, `research` or `links`. Expected: `>= 1` in the English page and in the Spanish page. In `llms.txt`: `>= 1` for a current role, a publication, or a link; **0 is correct** for a role in the previous-experience group (`llms.txt` does not list those).

Finally open the matching `llms.txt` line and check it has text after the ` - ` and no `&amp;`, `<strong>` or `[object Object]`:

```bash
grep -n "Some Unique Text" /tmp/cv-entry-check/llms.txt
```

## Common mistakes

- Giving only `en` (or only `es`) → build fails with `Missing "es" translation`.
- Making a publication `title` an `{ en, es }` object → page works, `llms.txt` prints `[object Object]`.
- Forgetting `summary` on a current role or a publication, or `note`/`llmsNote` on a link → no error, but `llms.txt` gets an empty description.
- Writing `&amp;` in `org`/`role`/`period`/`venue`/`summary` (shows literally as `&amp;`) or a bare `&` in `body`/`bullets` (invalid HTML). Follow the table above.
- Putting `<strong>` or a link inside `summary`, `llmsNote`, `period` or `venue` → tags appear as literal text.
- Writing `summary` in first person ("I work on…") — `llms.txt` is third person.
- Adding a current role in `groups[1]`, or reordering so a non-current group is first → `llms.txt` reads `groups[0]` by position.
- Editing a template or the CSS to make one entry look different. Change the data instead; if you truly need new markup, stop and ask the user.
- Adding only one language's copy of a page. These pages already exist in both languages via the same data file, so no new page file is needed.
