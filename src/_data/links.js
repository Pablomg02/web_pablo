// Structured source for the /links/ and /es/links/ pages, rendered by
// src/_includes/pages/links.njk.
//
// Each group is a heading plus a list of entries. An entry is either a single
// link (`label` + `url`) with an optional `note`, or a `prefix` followed by
// several `links` on one line (used for the research profiles). Notes hold
// plain text; nothing here is HTML. Labels are the names of the services, the
// same in both languages; titles, prefixes and notes are objects keyed by
// language ({ en, es }) read through the `localize` filter. `badge` is the
// two-character monogram the card shows in the pixel face, in place of a logo.
//
// `note` is what the Links page prints, in first person. `llmsNote` is the
// third-person variant llms.txt prints (English only, like llms.txt); it
// falls back to `note.en` when the wording works in both voices.
module.exports = [
  {
    title: { en: "Contact & social", es: "Contacto y redes" },
    entries: [
      {
        label: "LinkedIn",
        badge: "in",
        url: "https://www.linkedin.com/in/pablomagarinos/",
        note: {
          en: "The best place to learn more about my background and reach out.",
          es: "El mejor sitio para conocer mejor mi trayectoria y contactar conmigo.",
        },
        llmsNote: "Best external profile for background and contact.",
      },
      {
        label: "X",
        badge: "X",
        url: "https://x.com/pablodotmd",
        note: {
          en: "Where I share shorter thoughts and follow the field.",
          es: "Donde comparto ideas más breves y sigo la actualidad del sector.",
        },
        llmsNote: "Short-form posts about research and technology.",
      },
      {
        label: "hi@pablomagarinos.es",
        badge: "@",
        url: "mailto:hi@pablomagarinos.es",
        note: { en: "Email me directly.", es: "Escríbeme directamente." },
        llmsNote: "Direct contact: hi@pablomagarinos.es",
      },
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
          { label: "ORCID", badge: "iD", url: "https://orcid.org/0009-0002-9817-0368" },
          {
            label: "Google Scholar",
            badge: "GS",
            url: "https://scholar.google.com/citations?user=fxGQeMkAAAAJ",
          },
          {
            label: "ResearchGate",
            badge: "RG",
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
        badge: "GH",
        url: "https://github.com/Pablomg02",
        note: {
          en: "A selection of the projects I have worked on.",
          es: "Una selección de los proyectos en los que he trabajado.",
        },
        llmsNote: "Code and technical projects.",
      },
      {
        label: "Learn",
        badge: "Le",
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
];
