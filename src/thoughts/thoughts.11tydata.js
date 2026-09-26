const site = require("../_data/site.js");

module.exports = {
  layout: "essay.njk",
  tags: "thought",
  pageKey: "thought",
  // Hidden essays are neither written out nor listed (see site.showThoughts).
  ...(site.showThoughts
    ? {}
    : { permalink: false, eleventyExcludeFromCollections: true }),
};
