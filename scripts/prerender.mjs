// Pré-rendu SEO : après `vite build`, écrit un HTML par page publique dans dist/
// avec son propre <title>, description, canonical, Open Graph, un <h1>, du texte et des liens internes.
// React remplace ce contenu au chargement : les visiteurs voient le site normal,
// les robots (Google, Bing, WhatsApp, Facebook, assistants IA) lisent le vrai contenu de chaque page.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const tmp = path.join(root, 'node_modules', '.cache', 'seo-routes.mjs');

await build({ entryPoints: [path.join(root, 'src/data/seoRoutes.ts')], bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error' });
const { SEO_ROUTES } = await import(pathToUrl(tmp));
function pathToUrl(p) { return 'file:///' + p.replace(/\\/g, '/'); }

const SITE = 'https://graphiquemotion.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const set = (html, re, value) => (re.test(html) ? html.replace(re, value) : html);
const meta = (html, attr, key, content) =>
  set(html, new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`), `<meta ${attr}="${key}" content="${esc(content)}" />`);

const NAV = [['/', 'Accueil'], ['/services', 'Services'], ['/portfolio', 'Réalisations'], ['/tarifs', 'Tarifs'], ['/concours', 'Jeu concours'], ['/blog', 'Blog'], ['/contact', 'Contact']];

function body(r) {
  const nav = NAV.map(([h, t]) => `<a href="${h}" style="color:#00B2AA;margin:0 10px">${t}</a>`).join('');
  const pts = r.points?.length ? `<ul style="text-align:left;max-width:640px;margin:20px auto;line-height:1.7">${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : '';
  return `<div id="seo-static" style="min-height:100vh;background:#0A0A0F;color:#fff;font-family:Montserrat,system-ui,sans-serif;text-align:center;padding:96px 20px">` +
    `<nav aria-label="Navigation principale" style="margin-bottom:48px">${nav}</nav>` +
    `<main><h1 style="font-size:34px;line-height:1.15;margin:0 auto 16px;max-width:760px">${esc(r.h1)}</h1>` +
    (r.intro ? `<p style="color:#A0A0A0;max-width:680px;margin:0 auto;line-height:1.7">${esc(r.intro)}</p>` : '') + pts +
    `<p style="margin-top:32px;color:#A0A0A0">Graphique &amp; Motion · Dakar, Sénégal · <a href="tel:+221775644478" style="color:#00B2AA">+221 77 564 44 78</a></p></main></div>`;
}

let count = 0;
for (const r of SEO_ROUTES) {
  const url = SITE + (r.path === '/' ? '/' : r.path);
  const img = r.ogImage || `${SITE}/og-image.png`;
  let html = template;
  html = set(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`);
  html = meta(html, 'name', 'description', r.description);
  html = set(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`);
  html = set(html, /<link rel="alternate" hreflang="(fr|x-default)" href="[^"]*"\s*\/?>/g, (m, l) => `<link rel="alternate" hreflang="${l}" href="${url}" />`);
  html = meta(html, 'property', 'og:title', r.title);
  html = meta(html, 'property', 'og:description', r.description);
  html = meta(html, 'property', 'og:url', url);
  html = meta(html, 'property', 'og:type', r.type || 'website');
  html = meta(html, 'property', 'og:image', img);
  html = meta(html, 'name', 'twitter:title', r.title);
  html = meta(html, 'name', 'twitter:description', r.description);
  html = meta(html, 'name', 'twitter:image', img);
  html = html.replace('<div id="root"></div>', `<div id="root">${body(r)}</div>`);
  if (!html.includes('id="seo-static"')) throw new Error('injection impossible pour ' + r.path);
  const out = r.path === '/' ? path.join(dist, 'index.html') : path.join(dist, r.path, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  count++;
}
// Le gabarit sans contenu statique reste disponible pour les routes dynamiques (fiches, paiement, admin…)
fs.writeFileSync(path.join(dist, 'app-shell.html'), template);
console.log(`prerender : ${count} pages écrites dans dist/`);
