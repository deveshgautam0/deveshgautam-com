import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const width = 1200;
const height = 630;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#0B1220" />
  <rect x="0" y="0" width="${width}" height="10" fill="#60A5FA" />
  <text x="60" y="330" font-family="sans-serif" font-size="76" font-weight="700" fill="#FFFFFF">Devesh Gautam</text>
  <text x="60" y="395" font-family="sans-serif" font-size="34" fill="#93C5FD">deveshgautam.com</text>
</svg>
`.trim();

writeFileSync(join(process.cwd(), 'public', 'og-default.png'), await sharp(Buffer.from(svg)).png().toBuffer());
console.log('generated public/og-default.png');
