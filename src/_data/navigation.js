// Header navigation. URLs are the English ones; the header maps each to the
// current language with the `localeUrl` filter, so a Spanish page links to
// /es/research/ without this file knowing about it.
// `group: "personal"` marks the entries that are Pablo's own writing and
// photos rather than his professional profile; the header sets them in a
// second tone, after a divider, so the two halves read apart.
module.exports = [
  {
    title: { en: "About", es: "Sobre mí" },
    url: "/",
  },
  {
    title: { en: "Experience", es: "Experiencia" },
    url: "/experience/",
  },
  {
    title: { en: "Research", es: "Investigación" },
    url: "/research/",
  },
  // Links is deliberately absent: it lives in the footer only.
  {
    title: { en: "Tech Notes", es: "Notas técnicas" },
    url: "/notebook/",
    group: "personal",
  },
  {
    title: { en: "Thoughts", es: "Reflexiones" },
    url: "/thoughts/",
    group: "personal",
  },
  {
    title: { en: "Gallery", es: "Galería" },
    url: "/gallery/",
    group: "personal",
  },
];
