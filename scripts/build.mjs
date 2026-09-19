import fs from 'node:fs/promises';
import path from 'node:path';
import { home } from '../src/home.mjs';
import { courses } from '../src/courses.mjs';
await fs.mkdir('dist', { recursive: true });
const pages = new Map([['', home()], ...Object.entries(courses())]);
for (const [slug, html] of pages) {
  const output = slug ? `dist/${slug}` : 'dist';
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(`${output}/index.html`, html);

  // GitHub Pages publishes the repository root. Its images live in dist/,
  // while the Sites deployment serves dist/ as its own root.
  const pagesOutput = slug || '.';
  await fs.mkdir(pagesOutput, { recursive: true });
  await fs.writeFile(`${pagesOutput}/index.html`, html.replaceAll('/assets/img/', '/dist/assets/img/'));
}
for (const dir of ['css', 'js', 'fonts']) await fs.cp(`assets/${dir}`, `dist/assets/${dir}`, {recursive:true});
await fs.copyFile('assets/favicon.svg', 'dist/assets/favicon.svg');
await fs.copyFile('assets/logo.svg', 'dist/assets/logo.svg');
await fs.mkdir('dist/assets/img', {recursive:true});
await fs.copyFile('assets/img/guia-de-poses-card.jpg', 'dist/assets/img/guia-de-poses-card.jpg');
for (const name of await fs.readdir('assets/img/optimized')) if (/-\d+\.webp$/.test(name)) await fs.copyFile(path.join('assets/img/optimized',name),path.join('dist/assets/img',name));
console.log('Site built in dist/');
