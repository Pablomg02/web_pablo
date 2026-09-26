const fs = require("node:fs");
const Image = require("@11ty/eleventy-img").default;

// A photo sits next to its English story: src/gallery/<slug>.jpeg for
// src/gallery/<slug>.md. The Spanish story shares the slug, so both find it.
function galleryImagePath(slug) {
  for (const extension of ["jpeg", "jpg", "png", "webp"]) {
    const candidate = `src/gallery/${slug}.${extension}`;

    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`No image for gallery photo "${slug}" in src/gallery/`);
}

// Every photo's story shares this setup; src/es/gallery/ re-exports it. The
// image's aspect ratio sizes its tile in the gallery and in the home's band.
module.exports = {
  layout: "photo.njk",
  tags: "photo",
  pageKey: "photo",
  eleventyComputed: {
    image: (data) => galleryImagePath(data.page.fileSlug),
    ratio: async (data) => {
      const stats = await Image(galleryImagePath(data.page.fileSlug), {
        statsOnly: true,
        formats: ["jpeg"],
        widths: ["auto"],
      });
      const [original] = stats.jpeg;
      return Number((original.width / original.height).toFixed(4));
    },
  },
};
