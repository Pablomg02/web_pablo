---
layout: page.njk
title: How I Made the Web
description: A short note on how the website is built, generated, and published.
permalink: /how-i-made-the-web/
---

# How I Made the Web

The website was not made with WordPress, a visual editor, or a website builder. It was made from scratch.

That does not mean every line is complicated. In fact, the point is almost the opposite: the website is built with a small set of simple tools, so I can understand what is happening and keep the final result as clean as possible.

## Node.js

The site is built with Node.js. More specifically, Node.js runs the build process that turns the source files into the final website.

The tool that converts Markdown into HTML is **Eleventy**, a static site generator that runs on Node.js. In practical terms, Eleventy reads the Markdown files, applies the Nunjucks templates that define the layout, copies the assets, and writes the final static website into the *_site* folder.

The basic idea is that I can write pages and notes in **Markdown**, a plain-text format that is comfortable for writing and easy to keep under version control. A template then wraps that content, so each page keeps the same structure without me having to repeat the same layout by hand.

Writing in Markdown is useful for me because it is simple, but it is also useful for the people and systems reading the site. The visitor receives mostly plain HTML, CSS, and JavaScript. The browser does not have to build the page from a complex application, and search engines can read the content without needing to understand a large client-side framework.

## Static Files

The result of the build is a **static website**. The published site is made of files: HTML documents, stylesheets, scripts, images, and metadata.

There is no private server generating each page when someone visits it. Once the site has been built, the files are already there, ready to be served. For a personal website like mine, that is enough, and it keeps the whole system lighter.

Static websites do have limits. They cannot easily do things that require server-side logic, user accounts, databases, or private API calls. But for essays, notes, research pages, links, and basic navigation, static files are not a limitation. They are the most direct solution.

## GitHub Pages

The website is hosted on **GitHub Pages**. For anyone unfamiliar with it, GitHub Pages lets you publish a website directly from a GitHub repository, for free.

The main condition is that the website has to be static. It can respond to normal GET requests, because visitors need to request pages, styles, and assets, but it is not a place for custom backend logic. For my project, that trade-off is completely fine.

The default GitHub Pages domain is not especially elegant, but if you own a domain you can connect it to the site. Domains for personal names are often quite cheap, especially if you do not need a *.com*, so the final result can still feel like a normal independent website.

## GitHub Actions

The publication process is automated with GitHub Actions. When I push changes to the main branch, GitHub starts a workflow.

That workflow checks out the repository, installs the Node.js dependencies, runs the build command, and uploads the generated *_site* folder as the Pages artifact. After that, GitHub deploys those generated files to GitHub Pages.

In practice, the workflow lets me edit the source files, write new notes, commit the changes, and push them. The rest happens automatically.

## AI Programming

Of course, I used AI to help me program the website.

I do not know advanced JavaScript, and I am not an expert in Node.js frameworks. But building the site and others that I've made before has taught me a lot about how websites are put together: how they are hosted, what the server actually does, what tools exist, and how much can be achieved by keeping things simple.

AI did not replace the decisions behind the website. The choice to write in Markdown, the design, the colours, the privacy policy, the content, and the way the site is hosted are mine. What AI gave me was a way to understand what I was doing and translate my intentions into code without having to stop at every implementation detail.

Still, using AI does not remove the need for **purpose**. The direction has to be yours, and so does the curiosity to understand, at least broadly, what you are making. The trade-off between speed and control has followed humans for a very long time, and I do not think we should surrender **control** over the things that matter to us.

For me, advanced JavaScript is not one of those things, honestly. But discovering new architectures, understanding a little more about software and computer science, and making something that reflects my own values definitely is.

Without that help, the website probably would not exist in its current form. Making websites is not my main activity, but the many hours and the love I am spending on it are teaching me about a field I might never have explored otherwise.

## Why I Chose It

I like the approach because it keeps the website close to the material it is made of. The source is readable, the published output is simple, and the deployment is automatic.

I also think more people should try setups like mine, especially now that AI makes it easier to work through the technical parts. You can make pages that stay on the internet, host them for free, and keep them portable. If GitHub Pages ever stopped being free, or stopped existing, a static website like mine would still be simple to host somewhere else.

Most importantly, the approach gives you more control over what your website is. Not only its design, but also its values. In my case, for example, I liked being able to choose a setup that does not sell user information to third parties.

It is not the only way to make a website, but for mine it feels right: **simple files, simple publishing, and very little machinery between the writing and the reader**.
