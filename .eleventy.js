const path = require("node:path");

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

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/CNAME");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy("src/humans.txt");
  eleventyConfig.addFilter("absoluteUrl", (targetUrl = "/", baseUrl = "") => {
    if (!baseUrl) {
      return targetUrl;
    }

    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

    return new URL(targetUrl, normalizedBaseUrl).toString();
  });
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("urlEncode", (value = "") => encodeURIComponent(value));
  eleventyConfig.addFilter("dateToFormat", (date, format = "yyyy-MM-dd") => {
    if (!(date instanceof Date)) return "";

    const [year, month, day] = date.toISOString().slice(0, 10).split("-");

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

  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "/";

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
