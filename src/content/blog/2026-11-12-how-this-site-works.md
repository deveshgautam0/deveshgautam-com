---
title: 'How this website is built: Astro, Cloudflare and Pages CMS'
description: 'A look at the stack behind deveshgautam.com: static Astro, Markdown content, Pages CMS editing, and Cloudflare hosting.'
date: 2026-11-12
category: showcases
tags: [astro, cloudflare, cms]
heroImage: /images/samples/blog-2.svg
heroAlt: 'Flat illustration showing code and a browser'
draft: false
---

deveshgautam.com is a static site. There is no server, no database, and no admin panel running in the cloud. Here is how the pieces fit together.

**Astro** builds the site from Markdown files and `.astro` components into plain HTML. Every page is pre-rendered at build time, so visitors get fast, lightweight pages with no JavaScript required to read them.

**Markdown** is the content format. Blog posts and projects live as `.md` files in `src/content/`, managed through Astro content collections with a Zod schema. Categories and tags are normalised to kebab-case automatically, so a CMS typo like "Next JS" becomes `next-js` in the URL.

**Pages CMS** is the editor. Devesh opens app.pagescms.org, signs in with GitHub, and writes posts in a friendly form. Saving a post commits the Markdown file straight to the GitHub repository.

**Cloudflare** rebuilds and deploys the site on every push to the main branch. Each CMS save becomes a live post within a minute or two.

One piece of the build looks like this:

```astro
export async function getStaticPaths({ paginate }) {
  const posts = await getPosts();
  return paginate(posts, { pageSize: 3 });
}
```

That is it. Static HTML, version-controlled content, and a zero-maintenance publishing flow.
