// Header navigation. URLs are the English ones; the header maps each to the
// current language with the `localeUrl` filter, so a Spanish page links to
// /es/research/ without this file knowing about it.
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
    title: { en: "Thoughts", es: "Reflexiones" },
    url: "/thoughts/",
  },
  {
    title: { en: "Tech Notes", es: "Notas técnicas" },
    url: "/notebook/",
  },
];
