// Structured source for the /links/ and /es/links/ pages, rendered by
// src/_includes/pages/links.njk.
//
// Each group is a heading plus a list of entries. An entry is either a single
// link (`label` + `url`) with an optional `note`, or a `prefix` followed by
// several `links` on one line (used for the research profiles). Notes hold
// plain text; nothing here is HTML. Labels are the names of the services, the
// same in both languages; titles, prefixes and notes are objects keyed by
// language ({ en, es }) read through the `localize` filter.
//
// `note` is what the Links page prints, in first person. `llmsNote` is the
// third-person variant llms.txt prints (English only, like llms.txt); it
// falls back to `note.en` when the wording works in both voices.
module.exports = [
  {
    title: { en: "Contact", es: "Contacto" },
    entries: [
      {
        label: "hi@pablomagarinos.es",
        url: "mailto:hi@pablomagarinos.es",
        note: { en: "Email me directly.", es: "Escríbeme directamente." },
        llmsNote: "Direct contact: hi@pablomagarinos.es",
      },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/pablomagarinos/",
        note: {
          en: "The best place to learn more about my background and reach out.",
          es: "El mejor sitio para conocer mejor mi trayectoria y contactar conmigo.",
        },
        llmsNote: "Best external profile for background and contact.",
      },
    ],
  },
  {
    title: { en: "Research", es: "Investigación" },
    entries: [
      {
        prefix: {
          en: "My academic publications and citations:",
          es: "Mis publicaciones académicas y citas:",
        },
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
    title: { en: "Projects", es: "Proyectos" },
    entries: [
      {
        label: "GitHub",
        url: "https://github.com/Pablomg02",
        note: {
          en: "A selection of the projects I have worked on.",
          es: "Una selección de los proyectos en los que he trabajado.",
        },
        llmsNote: "Code and technical projects.",
      },
      {
        label: "Learn",
        url: "https://learn.pablomagarinos.es",
        note: {
          en: "My personal academic platform: self-contained notes and exercises, alongside other teaching tools I am building.",
          es: "Mi plataforma académica personal: apuntes y ejercicios autocontenidos, junto a otras herramientas docentes que estoy construyendo.",
        },
        llmsNote:
          "Pablo's personal academic platform: self-contained notes, exercises, and teaching tools.",
      },
    ],
  },
  {
    title: { en: "Social", es: "Redes" },
    entries: [
      {
        label: "Medium",
        url: "https://medium.com/@pablomagarinos",
        note: {
          en: "Where I occasionally publish articles.",
          es: "Donde publico artículos de vez en cuando.",
        },
        llmsNote: "Occasional external writing.",
      },
    ],
  },
];
