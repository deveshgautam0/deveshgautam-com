# PLAN — deveshgautam.com

## Route table (section 4)
| Page | Route | Output | Notes |
|------|-------|--------|-------|
| Home | src/pages/index.astro | / | hero + 2 buttons |
| About | src/pages/about.astro | /about/ | markdown from src/data/pages/about.md |
| Links | src/pages/links.astro | /links/ | markdown from src/data/pages/links.md + TOC |
| Gallery | src/pages/gallery.astro | /gallery/ | GalleryGrid from src/data/gallery.json |
| 404 | src/pages/404.astro | /404.html | not found |
| Blog list | src/pages/blog/[...page].astro | /blog/, /blog/2/ | 3 per page |
| Blog post | src/pages/blog/[id].astro | /blog/<id>/ | single post |
| Blog category | src/pages/blog/categories/[category]/[...page].astro | /blog/categories/<c>/ | 3 per page |
| Blog tag | src/pages/blog/tags/[tag]/[...page].astro | /blog/tags/<t>/ | 3 per page |
| Explore | src/pages/blog/explore/[...page].astro | /blog/explore/, /blog/explore/2/ | 6 per page |
| Explore category | src/pages/blog/explore/categories/[category]/[...page].astro | /blog/explore/categories/<c>/ | 6 per page |
| Explore tag | src/pages/blog/explore/tags/[tag]/[...page].astro | /blog/explore/tags/<t>/ | 6 per page |
| Projects list | src/pages/projects/[...page].astro | /projects/, /projects/2/ | 6 per page |
| Project | src/pages/projects/[id].astro | /projects/<id>/ | single project |
| Design index | src/pages/design/index.astro | /design/ | noindex, subpage links |
| Design cards | src/pages/design/cards.astro | /design/cards/ | |
| Design buttons | src/pages/design/buttons.astro | /design/buttons/ | |
| Design colors | src/pages/design/colors.astro | /design/colors/ | |
| Design images | src/pages/design/images.astro | /design/images/ | |
| Design embeds | src/pages/design/embeds.astro | /design/embeds/ | |
| Design components | src/pages/design/components.astro | /design/components/ | |
| Design typography | src/pages/design/typography.astro | /design/typography/ | |
| Feed | src/pages/api/feed.xml.ts | /api/feed.xml | |

Nav: Blog /blog/ · Explore /blog/explore/ · Projects /projects/ · About /about/ · Gallery /gallery/ · Links /links/

## Component list (src/components, all .astro)
Header, Footer, Icon, PostCard, PostListItem, ProjectCard, Pagination, TableOfContents, ShareLinks, Chip, PageTitle, GalleryGrid

## Data files
- src/data/site.json — name Devesh Gautam, social links (empty OK)
- src/data/gallery.json — 6 sample image objects
- src/data/pages/about.md — about markdown
- src/data/pages/links.md — bookmarks markdown
- src/content/blog/*.md — 3 sample posts
- src/content/projects/*.md — 3 sample projects

## Content model (section 5)
src/content.config.ts with blog + projects collections (glob loader, zod schema). src/lib/content.ts with getPosts, getProjects, readingTime, formatDate, countBy, pageHref, groupByYear.

## Scripts
- scripts/copy-icons.mjs — copy lucide-static icons into src/assets/icons/
- scripts/make-og.mjs — generate public/og-default.png (1200x630)
- scripts/check.mjs — build-time verifier
- scripts/contrast-pairs.json — contrast pairs for check.mjs

## Public files
- public/favicon.svg (exists), public/robots.txt, public/_headers, public/og-default.png, public/images/uploads/.gitkeep, public/images/samples/*.svg

## Brand
- Owner: Devesh Gautam, domain deveshgautam.com
- FORBIDDEN strings: the reference author's name and handle (nowhere in src/, public/, docs/, dist/)

## Stack (locked)
Astro 5 static, @astrojs/sitemap 3, @astrojs/rss 4, @fontsource-variable/inter + jetbrains-mono, lucide-static (dev), plain .astro + .ts + .css, vanilla JS, no React/Tailwind/MDX/aliases/vite config.
