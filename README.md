# deveshgautam.com

Personal blog and portfolio of Devesh Gautam. Static Astro site, Markdown content edited via Pages CMS, hosted on Cloudflare.

## Commands (use Node 24)

```
export PATH="$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"

# dev server
npm run dev

# production build
npm run build

# build + run verifier
npm run check

# preview production build locally
npm run preview
```

## Folder map

- `src/pages/` — pages and routes
- `src/layouts/` — BaseLayout
- `src/components/` — Astro components
- `src/styles/` — tokens, base, components CSS
- `src/scripts/ui.js` — vanilla JS (theme, menu, copy, anchors, lightbox)
- `src/lib/content.ts` — content helpers
- `src/content/blog/` — blog posts (Markdown)
- `src/content/projects/` — projects (Markdown)
- `src/data/` — site.json, gallery.json, pages markdown
- `public/images/uploads/` — CMS image uploads (`.gitkeep` kept)
- `public/images/samples/` — sample illustrations (replace before launch)
- `scripts/` — copy-icons, make-og, check
- `docs/` — PLAN, PROGRESS, WRITING, DEPLOY_CLOUDFLARE, LAUNCH_CHECKLIST

## Adding a post by hand

Create `src/content/blog/<date>-<slug>.md` with YAML frontmatter (title, description, date, category, tags, heroImage, heroAlt, draft, body), then `git push`. Cloudflare rebuilds.

## CMS mapping

Pages CMS → files:
- Blog posts → `src/content/blog/*.md`
- Projects → `src/content/projects/*.md`
- Gallery → `src/data/gallery.json`
- About page → `src/data/pages/about.md`
- Links page → `src/data/pages/links.md`
- Site settings → `src/data/site.json`

## Delete or replace before launch

All sample posts, projects, and sample SVGs listed in docs/LAUNCH_CHECKLIST.md are placeholders. Replace them with your own content, avatar, hero image, and social links.

## Deploy

See docs/DEPLOY_CLOUDFLARE.md for the Cloudflare Pages deploy steps.
