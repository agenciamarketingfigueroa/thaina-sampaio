import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
const require = createRequire(import.meta.url);
let sharp;
try { sharp = require('sharp'); } catch { sharp = require('C:/Users/Felipe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'); }
const root = path.resolve('assets/img');
const output = path.join(root, 'optimized');
await fs.mkdir(output, { recursive: true });
const manifest = [];
for (const folder of ['beauty-edit', 'boss-4p', 'luz-em-foco']) {
  for (const filename of await fs.readdir(path.join(root, folder))) {
    if (!/\.jpe?g$/i.test(filename)) continue;
    const original = path.join(root, folder, filename);
    const slug = `${folder}-${path.parse(filename).name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
    const master = path.join(output, `${slug}-master.webp`);
    await sharp(original).rotate().keepIccProfile().webp({ lossless: true, effort: 4 }).toFile(master);
    const hash = async input => createHash('sha256').update(await sharp(input).rotate().toColourspace('srgb').removeAlpha().raw().toBuffer()).digest('hex');
    if (await hash(original) !== await hash(master)) throw new Error(`Pixel mismatch: ${filename}. Original retained.`);
    const meta = await sharp(master).metadata();
    const sizes = [];
    for (const width of [640, 1200, 2000]) {
      const result = await sharp(master).resize({ width, withoutEnlargement: true }).webp({ quality: 94, effort: 5, smartSubsample: true }).toFile(path.join(output, `${slug}-${width}.webp`));
      sizes.push({ width: result.width, height: result.height, bytes: result.size });
    }
    manifest.push({ original: `${folder}/${filename}`, slug, width: meta.width, height: meta.height, originalBytes: (await fs.stat(original)).size, masterBytes: (await fs.stat(master)).size, losslessVerified: true, sizes });
    console.log(`${filename}: lossless verified; responsive versions ready`);
  }
}
await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Complete: ${manifest.length} images. Originals have not yet been removed.`);
