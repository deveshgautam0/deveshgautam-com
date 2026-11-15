import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname, extname, basename } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const srcDir = join(root, 'src');
const publicDir = join(root, 'public');
const docsDir = join(root, 'docs');

const errors = [];
const warns = [];
const fail = (m) => errors.push(`✗ ${m}`);
const ok = (m) => console.log(`  ok: ${m}`);

const distFiles = new Set();
const publicFiles = new Set();

const collect = (dir, set) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) collect(full, set);
    else set.add(relative(root, full));
  }
};

if (existsSync(distDir)) collect(distDir, distFiles);
if (existsSync(publicDir)) collect(publicDir, publicFiles);

// ---------- forbidden strings ----------
const forbidden = [ 'Nemanja', 'Mitic', 'nemanjam' ];
const scanForbidden = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) scanForbidden(full);
    else if (e.isFile()) {
      try {
        const content = readFileSync(full, 'utf8');
        for (const f of forbidden) {
          if (content.includes(f)) fail(`forbidden string "${f}" in ${relative(root, full)}`);
        }
      } catch {}
    }
  }
};
scanForbidden(srcDir);
scanForbidden(publicDir);
scanForbidden(docsDir);
if (existsSync(join(root, 'README.md'))) {
  try {
    const readme = readFileSync(join(root, 'README.md'), 'utf8');
    for (const f of forbidden) {
      if (readme.includes(f)) fail(`forbidden string "${f}" in README.md`);
    }
  } catch {}
}

// ---------- dependencies ----------
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const forbiddenDeps = [ 'react', 'react-dom', '@astrojs/react', '@astrojs/mdx', 'tailwindcss', '@tailwindcss/vite', 'framer-motion', 'gsap', 'shadcn' ];
for (const d of forbiddenDeps) {
  if (pkg.dependencies && pkg.dependencies[d]) fail(`forbidden dependency "${d}" in package.json`);
  if (pkg.devDependencies && pkg.devDependencies[d]) fail(`forbidden dependency "${d}" in devDependencies`);
}
for (const d of Object.keys(pkg.dependencies || {})) {
  if (d.startsWith('@radix-ui/')) fail(`forbidden dependency "${d}" in package.json`);
}
const astroVer = (pkg.dependencies && pkg.dependencies.astro) || '';
const astroMajor = astroVer.replace(/^[\^~>=]+/, '').split('.')[0];
if (astroMajor !== '5') fail(`astro version must be major 5, found "${astroVer}"`);

// no @/ imports, no .tsx/.mdx
const scanImports = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { scanImports(full); continue; }
    if (!e.isFile()) return;
    const name = e.name;
    if (name.endsWith('.tsx') || name.endsWith('.mdx')) fail(`forbidden file type ${relative(root, full)}`);
    if (name.endsWith('.astro') || name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.mjs')) {
      try {
        const c = readFileSync(full, 'utf8');
        if (/from\s+["']@\/|import\s+["']@\//.test(c)) fail(`path alias "@/" used in ${relative(root, full)}`);
      } catch {}
    }
  }
};
scanImports(srcDir);

// astro.config.mjs no vite/alias
try {
  const cfg = readFileSync(join(root, 'astro.config.mjs'), 'utf8');
  if (/vite|alias/.test(cfg)) fail('astro.config.mjs contains "vite" or "alias"');
} catch { fail('astro.config.mjs missing'); }

// ---------- route -> dist path ----------
const routeToDist = (route) => {
  if (route === '/404.html') return '404.html';
  if (route === '/') return 'index.html';
  let p = route.replace(/^\//, '');
  if (p.endsWith('/')) p += 'index.html';
  return p;
};

const distExists = (route) => {
  const p = routeToDist(route);
  return distFiles.has(p) || distFiles.has('dist/' + p) || publicFiles.has(p) || publicFiles.has('public/' + p);
};

// ---------- content: parse frontmatter ----------
const readPosts = (dir) => {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const p = join(dir, f);
    const c = readFileSync(p, 'utf8');
    const m = c.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    const front = m ? m[1] : '';
    const data = {};
    for (const line of front.split('\n')) {
      const km = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (km) data[km[1]] = km[2].trim();
    }
    out.push({ id: f.replace(/\.md$/, ''), draft: data.draft === 'true', path: p });
  }
  return out;
};

const posts = readPosts(join(srcDir, 'content', 'blog'));
const projects = readPosts(join(srcDir, 'content', 'projects'));

const nonDraftPosts = posts.filter((p) => !p.draft);
const nonDraftProjects = projects.filter((p) => !p.draft);

// ---------- required routes ----------
const requiredRoutes = [
  '/', '/blog/', '/blog/explore/', '/projects/', '/about/', '/gallery/', '/links/', '/design/',
  '/design/cards/', '/design/buttons/', '/design/colors/', '/design/images/',
  '/design/embeds/', '/design/components/', '/design/typography/',
  '/404.html', '/api/feed.xml', '/sitemap-index.xml',
];
for (const post of nonDraftPosts) requiredRoutes.push(`/blog/${post.id}/`);
for (const project of nonDraftProjects) requiredRoutes.push(`/projects/${project.id}/`);

for (const route of requiredRoutes) {
  if (!distExists(route)) fail(`missing route in dist: ${route} (${routeToDist(route)})`);
}

// ---------- read contrast pairs ----------
let contrastPairs = [];
try {
  contrastPairs = JSON.parse(readFileSync(join(root, 'scripts', 'contrast-pairs.json'), 'utf8'));
} catch { fail('scripts/contrast-pairs.json missing or invalid JSON'); }

// ---------- token parsing ----------
const readTokens = () => {
  const blocks = { ':root': {}, 'html.dark': {} };
  try {
    const css = readFileSync(join(srcDir, 'styles', 'tokens.css'), 'utf8');
    let current = null;
    for (const raw of css.split('\n')) {
      const line = raw.trim();
      if (line === ':root {') { current = ':root'; continue; }
      if (line === 'html.dark {') { current = 'html.dark'; continue; }
      if (line === '}' && current) { current = null; continue; }
      if (current) {
        const m = line.match(/^--([a-zA-Z0-9_-]+):\s*(#?[^;]+);/);
        if (m) blocks[current][m[1]] = m[2].trim();
      }
    }
  } catch {}
  return blocks;
};

const tokens = readTokens();
const resolveToken = (name, mode) => {
  const block = mode === 'dark' ? tokens['html.dark'] : tokens[':root'];
  return block[name] || null;
};

const hexRgb = (hex) => {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
};
const luminance = (hex) => {
  const { r, g, b } = hexRgb(hex);
  const lin = (c) => { c = c / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrastRatio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
};

for (const [fg, bg, min, mode, label] of contrastPairs) {
  const fgColor = resolveToken(fg, mode);
  const bgColor = resolveToken(bg, mode);
  if (!fgColor || !bgColor) { fail(`contrast token missing: ${fg} or ${bg} (${mode})`); continue; }
  const ratio = contrastRatio(fgColor, bgColor);
  if (ratio < min) fail(`contrast ${label} (${mode}): ${fgColor} on ${bgColor} = ${ratio.toFixed(2)} < ${min}`);
}

// button hover background must differ from text and from surface background
const buttonChecks = [
  ['btn-primary', 'on-accent', 'accent-hover', 'bg'],
  ['btn-outline', 'text', 'accent-soft', 'bg'],
  ['btn-ghost', 'text', 'bg-soft', 'bg'],
  ['icon-btn', 'text', 'accent-soft', 'bg'],
];
for (const [variant, textToken, hoverBgToken, surfaceToken] of buttonChecks) {
  for (const mode of ['light', 'dark']) {
    const textColor = resolveToken(textToken, mode);
    const hoverBg = resolveToken(hoverBgToken, mode);
    const surface = resolveToken(surfaceToken, mode);
    if (!textColor || !hoverBg || !surface) continue;
    if (hoverBg === textColor) fail(`button ${variant} hover background equals text color (${mode})`);
    if (hoverBg === surface) fail(`button ${variant} hover background equals surface background (${mode})`);
  }
}

// ---------- components.css state check ----------
const variants = [ 'btn-primary', 'btn-outline', 'btn-ghost', 'icon-btn' ];
const states = [ ':hover', ':focus-visible', ':active' ];
let componentsCss = '';
try { componentsCss = readFileSync(join(srcDir, 'styles', 'components.css'), 'utf8'); } catch {}
for (const variant of variants) {
  for (const state of states) {
    // match .variant state or .btn-variant state or icon-btn state
    const regex = new RegExp(`\\.${variant.replace('.', '\\.')}${state}\\s*\\{([\\s\\S]*?)\\}`, 'g');
    let found = false;
    for (const m of componentsCss.matchAll(regex)) {
      found = true;
      const body = m[1];
      if (!/color\s*:/.test(body)) fail(`components.css: .${variant}${state} missing explicit color`);
      if (!/background-color\s*:/.test(body)) fail(`components.css: .${variant}${state} missing explicit background-color`);
    }
    if (!found) fail(`components.css: rule .${variant}${state} not found`);
  }
}

// ---------- HTML checks ----------
const htmlFiles = Array.from(distFiles).filter((f) => f.endsWith('.html')).sort();
const seenTitles = new Set();

const stripTags = (s) => s.replace(/<[^>]+>/g, '').trim();

const readDist = (relPath) => {
  try { return readFileSync(join(root, relPath), 'utf8'); } catch { return null; }
};

const resolveTarget = (href, pageRel) => {
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) return 'external';
  if (href.startsWith('#')) return 'fragment:' + href.slice(1);
  // page link: no extension
  const ext = extname(href);
  if (!ext) {
    if (!href.endsWith('/')) return 'no-trailing-slash:' + href;
    let p = href.replace(/^\//, '');
    if (p === '' || p.endsWith('/')) p += 'index.html';
    return { kind: 'file', path: p };
  }
  // asset with extension
  let p = href.replace(/^\//, '');
  return { kind: 'file', path: p };
};

for (const file of htmlFiles) {
  const html = readDist(file);
  if (!html) { fail(`cannot read ${file}`); continue; }

  // title
  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? stripTags(titleM[1]) : '';
  if (!title) fail(`${file}: missing <title>`);
  else {
    if (seenTitles.has(title)) fail(`${file}: duplicate title "${title}"`);
    seenTitles.add(title);
  }

  // meta description
  if (!/<meta[^>]+name=["']description["'][^>]*>/i.test(html)) fail(`${file}: missing meta description`);

  // canonical
  if (!/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)) fail(`${file}: missing canonical`);

  // exactly one h1
  const h1s = html.match(/<h1\b[^>]*>/gi);
  if (!h1s || h1s.length !== 1) fail(`${file}: expected exactly 1 <h1>, found ${h1s ? h1s.length : 0}`);

  // images have alt
  const imgs = html.match(/<img\b[^>]*>/gi);
  for (const img of imgs || []) {
    if (!/alt\s*=/i.test(img)) fail(`${file}:  missing alt: ${img.slice(0, 80)}`);
  }

  // links and srcs
  const attrRegex = /(?:href|src)=["']([^"']+)["']/gi;
  let m;
  while ((m = attrRegex.exec(html)) !== null) {
    const href = m[1];
    const resolved = resolveTarget(href, file);
    if (resolved === 'external') continue;
    if (resolved && typeof resolved === 'string' && resolved.startsWith('fragment:')) {
      const id = resolved.slice(9);
      if (!new RegExp('id=["\']' + id + '["\']').test(html)) fail(`${file}: fragment #${id} not found on page`);
      continue;
    }
    if (resolved && typeof resolved === 'string' && resolved.startsWith('no-trailing-slash:')) {
      fail(`${file}: internal page link lacks trailing slash: ${href}`);
      continue;
    }
    if (resolved && resolved.kind === 'file') {
      const p = resolved.path;
      const inDist = distFiles.has(p) || distFiles.has('dist/' + p);
      const inPublic = publicFiles.has(p) || publicFiles.has('public/' + p);
      if (!inDist && !inPublic) fail(`${file}: link/src points to missing file: ${href}`);
    }
  }
}

// ---------- drafts not in dist or feed ----------
const allDraftIds = [...posts, ...projects].filter((p) => p.draft).map((p) => p.id);
for (const d of allDraftIds) {
  if (distExists(`/blog/${d}/`)) fail(`draft post "${d}" published to dist`);
  if (distExists(`/projects/${d}/`)) fail(`draft project "${d}" published to dist`);
}
try {
  const feed = readFileSync(join(root, 'dist', 'api', 'feed.xml'), 'utf8');
  for (const d of allDraftIds) {
    if (feed.includes(`/blog/${d}/`)) fail(`draft post "${d}" in RSS feed`);
  }
} catch {}

// ---------- SYNC files ----------
const requiredFiles = [
  '.pages.yml', 'wrangler.jsonc', join('public', '_headers'),
  join('docs', 'WRITING.md'), join('docs', 'DEPLOY_CLOUDFLARE.md'),
  join('docs', 'LAUNCH_CHECKLIST.md'), 'README.md'
];
for (const f of requiredFiles) {
  if (!existsSync(join(root, f))) fail(`missing required file: ${f}`);
}

// schema <-> .pages.yml sync
let pagesYml = '';
try { pagesYml = readFileSync(join(root, '.pages.yml'), 'utf8'); } catch {}
const blogKeys = [ 'title', 'description', 'date', 'category', 'tags', 'heroImage', 'heroAlt', 'draft' ];
const projectKeys = [ 'title', 'description', 'date', 'heroImage', 'heroAlt', 'demoUrl', 'repoUrl', 'draft' ];
for (const k of blogKeys) {
  if (!pagesYml.includes(`name: ${k}`)) fail(`.pages.yml missing blog field "name: ${k}"`);
}
for (const k of projectKeys) {
  if (!pagesYml.includes(`name: ${k}`)) fail(`.pages.yml missing projects field "name: ${k}"`);
}

// ---------- raw hex outside tokens.css / icons ----------
const hexRe = /#([0-9a-fA-F]{3})(?![0-9a-fA-F])|#([0-9a-fA-F]{6})(?![0-9a-fA-F])/g;
const scanRawHex = (dir) => {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) { scanRawHex(full); continue; }
    if (!e.isFile()) continue;
    const rel = relative(root, full);
    if (rel === 'src/styles/tokens.css') continue;
    if (rel.startsWith('src/assets/icons/') && rel.endsWith('.svg')) continue;
    if (!rel.startsWith('src/')) continue;
    try {
      const c = readFileSync(full, 'utf8');
      for (const mm of c.matchAll(hexRe)) {
        fail(`raw hex colour "${mm[0]}" in ${rel} (only tokens.css and icons may use raw hex)`);
      }
    } catch {}
  }
};
scanRawHex(srcDir);

// ---------- report ----------
console.log('\n' + '='.repeat(60));
if (errors.length === 0) {
  console.log('PASS: all checks passed');
  process.exit(0);
} else {
  console.log(`FAIL: ${errors.length} error(s)`);
  for (const e of errors) console.log(e);
  process.exit(1);
}
