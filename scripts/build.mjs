import fs from 'node:fs/promises';
import path from 'node:path';
import { home } from '../src/home.mjs';
import { courses } from '../src/courses.mjs';
await fs.mkdir('dist', { recursive: true });
await fs.writeFile('dist/index.html', home());
for (const dir of ['css', 'js', 'fonts']) await fs.cp(`assets/${dir}`, `dist/assets/${dir}`, {recursive:true});
await fs.copyFile('assets/favicon.svg', 'dist/assets/favicon.svg');
await fs.mkdir('dist/assets/img', {recursive:true});
for (const name of await fs.readdir('assets/img/optimized')) if (/-\d+\.webp$/.test(name)) await fs.copyFile(path.join('assets/img/optimized',name),path.join('dist/assets/img',name));
for (const [slug, html] of Object.entries(courses())) { await fs.mkdir(`dist/${slug}`, { recursive:true }); await fs.writeFile(`dist/${slug}/index.html`, html); }
console.log('Site built in dist/');
