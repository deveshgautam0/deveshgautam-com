# Deploying deveshgautam.com on Cloudflare

This is a static Astro site. Cloudflare Pages rebuilds and deploys on every push to the main branch (including every Pages CMS save). Dashboard labels can change slightly; the steps below are the current flow.

1. Put the code on GitHub (see docs/WRITING.md).
2. Cloudflare dashboard → Workers & Pages → Create → connect/import the GitHub repository `deveshgautam-com`.
3. Build settings: Build command `npm run build`. Workers flow: deploy command `npx wrangler deploy`. Classic Pages flow: output directory `dist`.
4. Environment variable: `NODE_VERSION = 24` (use 22 if the build image rejects 24).
5. Deploy and open the provided `*.workers.dev` or `*.pages.dev` address to check it.
6. Domain: add `deveshgautam.com` to Cloudflare (Add a site, change nameservers at the registrar, or buy the domain at Cloudflare Registrar). Then in the project's Domains/Custom domains add `deveshgautam.com` and `www.deveshgautam.com`.
7. Make `www` redirect to the apex: Rules → Redirect Rules → `www.deveshgautam.com` → `https://deveshgautam.com` (301).
8. SSL/TLS mode: Full.
9. Email: Cloudflare → Email → Email Routing → create `hello@deveshgautam.com` forwarding to your personal inbox (free).
10. Analytics: Cloudflare → Web Analytics → enable for the site (free, no code).

Every push to the main branch rebuilds and deploys automatically. Pages CMS actions and the build need no secrets.
