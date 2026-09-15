import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve('dist');
const routes = ['/', '/beauty-edit/', '/boss-4p/', '/luz-em-foco/'];
const docs = new Map();
let checked = 0;
for (const route of routes) {
  const file = path.join(root, route, 'index.html');
  const html = await fs.readFile(file, 'utf8');
  if ((html.match(/<h1[ >]/g)||[]).length !== 1) throw new Error(`${route}: expected one H1`);
  if (!html.includes('lang="pt-BR"') || !html.includes('name="description"')) throw new Error(`${route}: missing metadata`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  if (new Set(ids).size !== ids.length) throw new Error(`${route}: duplicate IDs`);
  docs.set(route, { html, ids });
}
for (const [route,{html}] of docs) {
  for (const [,attr,value] of html.matchAll(/\b(href|src|srcset)="([^"]+)"/g)) {
    const urls = attr === 'srcset' ? value.split(',').map(v=>v.trim().split(' ')[0]) : [value];
    for (const url of urls) {
      if (/^https?:/.test(url)) continue;
      const parsed = new URL(url, `https://local.test${route}`);
      if (docs.has(parsed.pathname)) {
        if (parsed.hash && !docs.get(parsed.pathname).ids.includes(parsed.hash.slice(1))) throw new Error(`Broken anchor: ${route} -> ${url}`);
      } else await fs.access(path.join(root, parsed.pathname));
      checked++;
    }
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(tag)) throw new Error(`${route}: image without alt`);
}
for (const folder of ['scripts','src','assets/js']) {
  for (const file of await fs.readdir(folder)) if (/\.m?js$/.test(file)) execFileSync(process.execPath,['--check',path.join(folder,file)]);
}
for (const font of ['cormorant-regular','cormorant-italic','manrope-regular','manrope-semibold']) {
  const bytes = await fs.readFile(`dist/assets/fonts/${font}.ttf`);
  if (bytes.readUInt32BE(0) !== 0x00010000) throw new Error(`Invalid font: ${font}`);
}
const manifest = JSON.parse(await fs.readFile('assets/img/optimized/manifest.json','utf8'));
if (manifest.length !== 32 || manifest.some(i=>!i.losslessVerified)) throw new Error('Image preservation check incomplete');
console.log(`OK: ${routes.length} pages, ${checked} local links/assets, JavaScript syntax, fonts, and 32 lossless masters verified.`);
const config = await fs.readFile('assets/js/config.js','utf8');
if (/whatsapp:\s*''/.test(config)) console.log('PENDING: recipient WhatsApp number. Form correctly reports that no message was sent.');
