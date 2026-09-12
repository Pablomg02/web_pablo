module.exports = [
  {
    title: "About",
    url: "/",
  },
  {
    title: "Experience",
    url: "/experience/",
  },
  {
    title: "Research",
    url: "/research/",
  },
  // Both writing sections are small for now, so they share one dropdown
  // instead of taking two slots in the header. Links is deliberately absent:
  // it lives in the footer only.
  {
    title: "Notes",
    children: [
      {
        title: "Thoughts",
        url: "/thoughts/",
      },
      {
        title: "Tech Notes",
        url: "/notebook/",
      },
    ],
  },
];
