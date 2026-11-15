import { mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const srcDir = join(root, 'node_modules', 'lucide-static', 'icons');
const outDir = join(root, 'src', 'assets', 'icons');

const names = [
  'sun', 'moon', 'menu', 'x', 'mail', 'github', 'linkedin', 'youtube',
  'twitter', 'facebook', 'instagram', 'rss', 'arrow-left', 'arrow-right',
  'chevron-left', 'chevron-right', 'copy', 'check', 'link', 'clock',
  'calendar', 'image',
];

mkdirSync(outDir, { recursive: true });

let copied = 0;
let missing = [];
for (const name of names) {
  const from = join(srcDir, `${name}.svg`);
  const to = join(outDir, `${name}.svg`);
  try {
    copyFileSync(from, to);
    copied += 1;
  } catch (err) {
    missing.push(name);
  }
}

console.log(`copied ${copied} icon(s) to ${outDir}`);
if (missing.length) {
  console.log(`missing in lucide-static (text-chip fallback): ${missing.join(', ')}`);
}
