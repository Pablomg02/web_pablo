const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { katex } = require("@mdit/plugin-katex");
const markdownItFootnote = require("markdown-it-footnote");
const Image = require("@11ty/eleventy-img").default;
const i18n = require("./src/_data/i18n.js");

// GitHub Pages serves this page in place of any missing URL. It is declared
// here as well as in src/404.njk's permalink because `relativeUrl` has to
// recognise it: see the comment in that filter.
const NOT_FOUND_URL = "/404.html";

// English lives at the site root and Spanish under /es/, with the same path
// after the prefix: /research/ and /es/research/ are one page in two
// languages. That mirror is the only link between translations.
const LANGUAGES = ["en", "es"];
const DEFAULT_LANGUAGE = "en";

function splitUrl(url = "") {
  const match = url.match(/^([^?#]*)([?#].*)?$/);

  return {
    pathname: match?.[1] || "",
    suffix: match?.[2] || "",
  };
}

function ensureDirectoryUrl(url = "/") {
  if (!url.startsWith("/")) {
    return url;
  }

  if (url.endsWith("/")) {
    return url;
  }

  return `${path.posix.dirname(url)}/`;
}

// Photos are resized at build time into /img/, in WebP and JPEG at a few
// widths (never wider than the original). Re-encoding also drops the camera
// metadata. The originals stay in src/ and are never published as-is.
const IMAGE_OPTIONS = {
  formats: ["webp", "jpeg"],
  // A touch below the defaults (80): invisible at these sizes, and it takes a
  // fifth or so off every photo.
  sharpWebpOptions: { quality: 72 },
  sharpJpegOptions: { quality: 76, progressive: true, mozjpeg: true },
  outputDir: "_site/img/",
  urlPath: "/img/",
};

function normalizeDate(date) {
  if (date instanceof Date) {
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof date === "string" || typeof date === "number") {
    const parsed = new Date(date);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

module.exports = function (eleventyConfig) {
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/assets");
  // PDFs are generated locally (npm run notebook:pdf) and committed
  // alongside the article source, not rebuilt in CI.
  eleventyConfig.addPassthroughCopy("src/notebook/*.pdf");
  // An article's images live in src/notebook/<slug>/ so they are served next
  // to the page and Pandoc finds them through --resource-path.
  const articleImages = "*.{png,jpg,jpeg,svg,webp}";
  eleventyConfig.addPassthroughCopy(`src/notebook/*/${articleImages}`);
  // The Spanish translation of an article references the same images by bare
  // file name, so each image folder is copied next to it as well, with the
  // same file types. The images themselves are not translated.
  eleventyConfig.addPassthroughCopy("src/es/notebook/*.pdf");
  for (const entry of fs.readdirSync("src/notebook", { withFileTypes: true })) {
    if (entry.isDirectory()) {
      eleventyConfig.addPassthroughCopy({
        [`src/notebook/${entry.name}/${articleImages}`]: `es/notebook/${entry.name}`,
      });
    }
  }
  eleventyConfig.addPassthroughCopy({
    "node_modules/katex/dist/katex.min.css": "assets/katex/katex.min.css",
    "node_modules/katex/dist/fonts": "assets/katex/fonts",
  });

  // Render LaTeX math ($inline$ and $$block$$) to HTML at build time with KaTeX,
  // so equations work without any client-side JavaScript.
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(katex));

  // Footnotes: write [^key] inline and `[^key]: text` anywhere; numbering,
  // linking and back-references are generated at build time. Used as the
  // "References" section at the foot of an article.
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItFootnote);
    // Eleventy passes the page data as the render env, so the heading
    // follows the article's language.
    mdLib.renderer.rules.footnote_block_open = (tokens, idx, options, env = {}) =>
      '<section class="footnotes">\n' +
      `<h2 class="footnotes__title">${i18n[env.lang || DEFAULT_LANGUAGE].references}</h2>\n` +
      '<ol class="footnotes-list">\n';
    mdLib.renderer.rules.footnote_block_close = () => "</ol>\n</section>\n";
  });
  // `{% picture src, alt, options %}` prints a responsive <picture>. It is
  // asynchronous, so inside a loop it needs `{% asyncEach %}`, not `{% for %}`.
  const relativeUrl = (...args) => eleventyConfig.getFilter("relativeUrl")(...args);

  eleventyConfig.addAsyncShortcode("picture", async function (src, alt, options = {}) {
    if (alt === undefined) {
      throw new Error(`Missing alt text for ${src}`);
    }

    const metadata = await Image(src, {
      ...IMAGE_OPTIONS,
      widths: options.widths || [480, 960, "auto"],
    });
    const pageUrl = this.page.url;
    const srcset = (format) =>
      metadata[format].map((entry) => `${relativeUrl(entry.url, pageUrl)} ${entry.width}w`).join(", ");
    const fallback = metadata.jpeg[metadata.jpeg.length - 1];
    const sizes = options.sizes || "100vw";
    const attributes = [
      `src="${relativeUrl(fallback.url, pageUrl)}"`,
      `srcset="${srcset("jpeg")}"`,
      `sizes="${sizes}"`,
      `alt="${String(alt).replace(/"/g, "&quot;")}"`,
      `width="${fallback.width}"`,
      `height="${fallback.height}"`,
      `loading="${options.loading || "lazy"}"`,
      `decoding="async"`,
    ];

    if (options.class) {
      attributes.push(`class="${options.class}"`);
    }

    if (options.fetchpriority) {
      attributes.push(`fetchpriority="${options.fetchpriority}"`);
    }

    return (
      `<picture><source type="image/webp" srcset="${srcset("webp")}" sizes="${sizes}">` +
      `<img ${attributes.join(" ")}></picture>`
    );
  });
  // Oldest first, so the gallery reads as a story. Photos from the same year
  // keep their file-name order; set `order` in the front matter to override.
  eleventyConfig.addFilter("galleryOrder", (items = []) =>
    [...items].sort(
      (a, b) =>
        (a.data.year - b.data.year) ||
        ((a.data.order ?? 0) - (b.data.order ?? 0)) ||
        a.page.fileSlug.localeCompare(b.page.fileSlug),
    ),
  );
  // The photos marked `featured: true` are the strip at the foot of the home.
  eleventyConfig.addFilter("featuredPhotos", (items = []) =>
    items.filter((item) => item.data.featured),
  );
  eleventyConfig.addFilter("findIndexByUrl", (items = [], url = "") =>
    items.findIndex((item) => item.url === url),
  );
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addFilter("absoluteUrl", (targetUrl = "/", baseUrl = "") => {
    if (!baseUrl) {
      return targetUrl;
    }

    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    return new URL(targetUrl, normalizedBaseUrl).toString();
  });
  // A bilingual field is an object keyed by language ({ en, es }); a field
  // that reads the same in both (a name, a URL) stays a plain value and passes
  // through. A missing translation fails the build instead of rendering blank.
  eleventyConfig.addFilter("localize", (value, lang = DEFAULT_LANGUAGE) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return value;
    }

    if (!(lang in value)) {
      throw new Error(`Missing "${lang}" translation in ${JSON.stringify(value).slice(0, 120)}`);
    }

    return value[lang];
  });
  // The same page in another language: swap the /es/ prefix. Only for
  // site-root paths; everything else is returned untouched.
  const localeUrl = (url = "/", lang = DEFAULT_LANGUAGE) => {
    if (!url.startsWith("/")) {
      return url;
    }

    const bare = url.replace(/^\/es(?=\/|$)/, "") || "/";
    return lang === DEFAULT_LANGUAGE ? bare : `/${lang}${bare}`;
  };
  eleventyConfig.addFilter("localeUrl", localeUrl);
  // The language switch, hreflang and the sitemap all assume every page has a
  // twin at the mirrored path. Nothing else notices a missing one (the switch
  // would just link to a 404), so fail the build. Pages that opt out with
  // `untranslated: true` (the error page) are exempt. Only pages with a layout
  // count, as in the sitemap.
  eleventyConfig.addCollection("mirrorCheck", (collectionApi) => {
    const pages = collectionApi
      .getAll()
      .filter((item) => typeof item.url === "string" && item.data.layout && !item.data.untranslated);
    const urls = new Set(pages.map((item) => item.url));
    const orphans = pages
      .filter((item) => {
        const otherLang = item.url.startsWith("/es/") ? DEFAULT_LANGUAGE : "es";
        return !urls.has(localeUrl(item.url, otherLang));
      })
      .map((item) => item.url);

    if (orphans.length) {
      throw new Error(
        `Pages without a translation at the mirrored path: ${orphans.join(", ")}. ` +
          "Add the other language, or set `untranslated: true` on the page.",
      );
    }

    return [];
  });
  eleventyConfig.addFilter("inLanguage", (items = [], lang = DEFAULT_LANGUAGE) =>
    items.filter((item) => (item.data.lang || DEFAULT_LANGUAGE) === lang),
  );
  // Every page is English unless its folder says otherwise: src/es/es.json
  // sets `lang: "es"` for everything under src/es/.
  eleventyConfig.addGlobalData("lang", DEFAULT_LANGUAGE);
  eleventyConfig.addGlobalData("languages", LANGUAGES);

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("uniqueTopics", (items = []) => {
    const topics = new Set();

    for (const item of items) {
      const itemTopics = item?.data?.topics;

      if (Array.isArray(itemTopics)) {
        for (const topic of itemTopics) {
          if (topic) {
            topics.add(String(topic));
          }
        }
      }
    }

    return Array.from(topics).sort((a, b) => a.localeCompare(b));
  });
  eleventyConfig.addFilter("urlEncode", (value = "") => encodeURIComponent(value));
  eleventyConfig.addFilter("stripTrailingSlash", (url = "") =>
    url.endsWith("/") ? url.slice(0, -1) : url,
  );
  eleventyConfig.addFilter("inputPdfExists", (inputPath = "") => {
    if (!inputPath.endsWith(".md")) {
      return false;
    }

    return fs.existsSync(inputPath.replace(/\.md$/, ".pdf"));
  });
  // The stylesheet and the script keep their URL from one deploy to the next,
  // so a browser still holding the old copy pairs it with the new markup (a
  // phone once showed the new research tree under the previous stylesheet,
  // unstyled). Their URL carries a hash of the file instead, which changes
  // exactly when the file does. Apply it before `relativeUrl`, which keeps the
  // query. Read on every call, not cached, so `npm run dev` follows edits.
  eleventyConfig.addFilter("versioned", (url = "") => {
    const source = path.join("src", url.split(/[?#]/)[0]);
    const hash = crypto.createHash("sha256").update(fs.readFileSync(source)).digest("hex").slice(0, 10);
    return `${url}${url.includes("?") ? "&" : "?"}v=${hash}`;
  });
  eleventyConfig.addFilter("dateToFormat", (date, format = "yyyy-MM-dd") => {
    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) return "";

    const [year, month, day] = normalizedDate.toISOString().slice(0, 10).split("-");

    if (format === "dd-MM-yyyy") {
      return `${day}-${month}-${year}`;
    }

    return `${year}-${month}-${day}`;
  });
  eleventyConfig.addFilter("relativeUrl", (targetUrl, currentPageUrl = "/") => {
    if (!targetUrl) {
      return "./";
    }

    if (/^(?:[a-z]+:|\/\/|#)/i.test(targetUrl)) {
      return targetUrl;
    }

    const { pathname, suffix } = splitUrl(targetUrl);

    if (!pathname.startsWith("/")) {
      return targetUrl;
    }

    // The error page is built at one address and served from another: GitHub
    // Pages returns it for any missing URL, at any depth. A relative link from
    // it would resolve against whatever the visitor typed, so /foo/bar/ would
    // ask for /foo/bar/css/style.css and arrive unstyled, with a navigation of
    // dead links. Its links are therefore resolved from the site root, which
    // makes it the one page that has to apply the path prefix itself.
    if (splitUrl(currentPageUrl).pathname === NOT_FOUND_URL) {
      return `${pathPrefix.replace(/\/+$/, "")}${pathname}${suffix}`;
    }

    const fromDirectory = ensureDirectoryUrl(splitUrl(currentPageUrl).pathname || "/");
    let relativePath = path.posix.relative(fromDirectory, pathname);

    if (pathname.endsWith("/") && relativePath && !relativePath.endsWith("/")) {
      relativePath = `${relativePath}/`;
    }

    if (!relativePath) {
      relativePath = "./";
    }

    return `${relativePath}${suffix}`;
  });

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
