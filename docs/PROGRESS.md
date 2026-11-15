# PROGRESS

## Phase 0 — Environment, project setup, docs, copy-icons, empty build
- [x] .nvmrc (24) created
- [x] Astro minimal project created in workspace root
- [x] package.json + astro.config.mjs written per section 3
- [x] Dependencies installed (astro@5, sitemap@3, rss@4, fonts, lucide-static)
- [x] .gitignore present (node_modules, dist, .astro, .DS_Store, .env)
- [x] docs/PLAN.md written
- [x] docs/PROGRESS.md written
- [x] scripts/copy-icons.mjs written and run (16 icons, 6 text-chip fallbacks)
- [x] `npm run build` passes on empty project

## Phase A — Design system foundation
- [x] src/styles/tokens.css (light + dark blocks)
- [x] src/styles/base.css, src/styles/components.css (all 7.3 variant states, prose, code, cards)
- [x] src/layouts/BaseLayout.astro
- [x] src/components/Header.astro, Footer.astro, Icon.astro
- [x] src/scripts/ui.js (theme, mobile menu, copy, anchors, lightbox)
- [x] src/content.config.ts, src/lib/content.ts
- [x] Sample content: 3 blog posts, 3 projects, gallery.json, site.json, about.md, links.md
- [x] Sample SVGs (hero, gallery 6, post 3, project 3, avatar)
- [x] scripts/make-og.mjs run → public/og-default.png committed
- [x] scripts/check.mjs + scripts/contrast-pairs.json written
- [x] `npm run check` passes
- [x] First commit

## Phase B — Static pages
- [x] Home / (hero + 2 buttons)
- [x] About /about/
- [x] Links /links/
- [x] Gallery /gallery/
- [x] 404 /404.html

## Phase C — Blog
- [x] Blog list /blog/ + pagination (3 per page)
- [x] Post /blog/<id>/ (hero, TOC, share, more posts, JSON-LD)
- [x] Categories /blog/categories/<c>/
- [x] Tags /blog/tags/<t>/
- [x] Explore /blog/explore/ + variants (6 per page)
- [x] /api/feed.xml

## Phase D — Projects
- [x] Projects list /projects/ (6 per page)
- [x] Project /projects/<id>/

## Phase E — Design system (noindex)
- [x] /design/ index + 7 subpages (cards, buttons, colors, images, embeds, components, typography)

## Phase F — CMS + hosting + docs
- [x] .pages.yml
- [x] wrangle.jsonc, public/_headers, public/robots.txt
- [x] docs/WRITING.md, docs/DEPLOY_CLOUDFLARE.md, docs/LAUNCH_CHECKLIST.md, README.md

## Phase G — Final audit
- [ ] `npm run check` passes zero errors
- [ ] Responsive check at 360, 768, 1280, 1920
- [ ] Hover/focus/active audit both themes
- [ ] Dark mode on every page
- [ ] Draft hidden / new post appears everywhere
- [ ] Final report
