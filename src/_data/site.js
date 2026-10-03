// Site-wide metadata. Fields that change with the language are objects keyed
// by language and are read through the `localize` filter; the rest (names,
// URLs, handles) are the same in both.
module.exports = {
  url: "https://pablomagarinos.es",
  name: "Pablo Magariños",
  brand: "PMD",
  author: "Pablo Magariños",
  jobTitle: { en: "AI Researcher", es: "Investigador en IA" },
  ogLocale: { en: "en_US", es: "es_ES" },
  defaultTitle: {
    en: "Pablo Magariños | AI Researcher",
    es: "Pablo Magariños | Investigador en IA",
  },
  defaultDescription: {
    en: "AI researcher with a background in aerospace engineering and industrial mathematics, focused on reinforcement learning, partial observability, world modelling, and meta-learning.",
    es: "Investigador en inteligencia artificial con formación en ingeniería aeroespacial y matemática industrial, centrado en aprendizaje por refuerzo, observabilidad parcial, modelos del mundo y metaaprendizaje.",
  },
  socialImage: "/assets/images/og-default.png",
  socialImageAlt: {
    en: "PMD social preview card with Aerospace Engineer, AI Research, and pablomagarinos.es text.",
    es: "Tarjeta de vista previa de PMD con los textos Aerospace Engineer, AI Research y pablomagarinos.es.",
  },
  favicon: "/assets/images/favicon.svg",
  faviconPng: "/assets/images/favicon.png",
  twitterHandle: "@pablodotmd",
  sameAs: [
    "https://www.linkedin.com/in/pablomagarinos/",
    "https://github.com/Pablomg02",
    "https://medium.com/@pablomagarinos",
    "https://scholar.google.com/citations?user=fxGQeMkAAAAJ",
    "https://www.researchgate.net/profile/Pablo-Magarinos-2",
  ],
};
