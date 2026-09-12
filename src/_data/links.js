// Structured source for the /links/ page, rendered by src/links.njk.
//
// Each group is a heading plus a list of entries. An entry is either a single
// link (`label` + `url`) with an optional `note`, or a `prefix` followed by
// several `links` on one line (used for the research profiles). Notes hold
// plain text; nothing here is HTML.
module.exports = [
  {
    title: "Contact",
    entries: [
      {
        label: "hi@pablomagarinos.es",
        url: "mailto:hi@pablomagarinos.es",
        note: "Email me directly.",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/pablomagarinos/",
        note: "The best place to learn more about my background and reach out.",
      },
    ],
  },
  {
    title: "Research",
    entries: [
      {
        prefix: "My academic publications and citations:",
        links: [
          { label: "ORCID", url: "https://orcid.org/0009-0002-9817-0368" },
          {
            label: "Google Scholar",
            url: "https://scholar.google.com/citations?user=fxGQeMkAAAAJ",
          },
          {
            label: "ResearchGate",
            url: "https://www.researchgate.net/profile/Pablo-Magarinos-2",
          },
        ],
      },
    ],
  },
  {
    title: "Projects",
    entries: [
      {
        label: "GitHub",
        url: "https://github.com/Pablomg02",
        note: "A selection of the projects I have worked on.",
      },
      {
        label: "Learn",
        url: "https://learn.pablomagarinos.es",
        note: "My personal academic platform: self-contained notes and exercises, alongside other teaching tools I am building.",
      },
    ],
  },
  {
    title: "Social",
    entries: [
      {
        label: "Medium",
        url: "https://medium.com/@pablomagarinos",
        note: "Where I occasionally publish articles.",
      },
    ],
  },
];
