const fs = require("node:fs");
const path = require("node:path");
const { katex } = require("@mdit/plugin-katex");
const markdownItFootnote = require("markdown-it-footnote");

// GitHub Pages serves this page in place of any missing URL. It is declared
// here as well as in src/404.njk's permalink because `relativeUrl` has to
// recognise it: see the comment in that filter.
const NOT_FOUND_URL = "/404.html";

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
    mdLib.renderer.rules.footnote_block_open = () =>
      '<section class="footnotes">\n' +
      '<h2 class="footnotes__title">References</h2>\n' +
      '<ol class="footnotes-list">\n';
    mdLib.renderer.rules.footnote_block_close = () => "</ol>\n</section>\n";
  });
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
