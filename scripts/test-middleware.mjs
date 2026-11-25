// Test local du middleware : node scripts/test-middleware.mjs
import { buildSync } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.resolve('node_modules/.cache/mw.mjs');
buildSync({ entryPoints: ['functions/_middleware.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { onRequest } = await import(pathToFileURL(out).href);

const SHELL = '<html><head><title>x</title><meta name="description" content="x" /><link rel="canonical" href="https://graphiquemotion.com/" /><meta property="og:url" content="https://graphiquemotion.com/" /><meta property="og:image" content="https://graphiquemotion.com/og-image.png" /></head><body><div id="root"></div></body></html>';
const env = { SUPABASE_URL: 'https://fake.supabase.co', SUPABASE_SERVICE_KEY: 'k', ASSETS: { fetch: async () => new Response(SHELL, { status: 200, headers: { 'content-type': 'text/html' } }) } };

let supabase = 'ok'; // ok | vide | panne
globalThis.fetch = async (u) => {
  if (supabase === 'panne') return new Response('err', { status: 500 });
  const rows = supabase === 'vide' ? [] : [{ title: 'Projet Test', seo_title: null, short_description: 'Un projet de test.', image: '/img/a.jpg', category: 'Web' }];
  return new Response(JSON.stringify(rows), { status: 200 });
};

const run = async (p, host = 'graphiquemotion.com') => {
  let passed = false;
  const r = await onRequest({ request: new Request(`https://${host}${p}`), env, next: async () => { passed = true; return new Response('NEXT'); } });
  return { passed, r };
};

let bad = 0;
const check = (name, ok) => { if (!ok) { bad++; console.log('KO', name); } };

const tests = [
  ['/', 'pass'], ['/concours', 'pass'], ['/concours/', 'pass'], ['/concours/reglement', 'pass'],
  ['/services', 'pass'], ['/services/ecommerce', 'pass'], ['/services/nimporte', '404'],
  ['/blog', 'pass'], ['/blog/automatiser-entreprise', 'pass'], ['/blog/nimporte', '404'],
  ['/boutique', 'pass'], ['/boutique/produit-x', 'shell'], ['/portfolio/projet-x', 'shell'],
  ['/checkout', 'shell'], ['/paiement', 'shell'], ['/admin', 'shell'], ['/admin/login', 'shell'], ['/reglement', 'shell'],
  ['/gm-studio-x7k9/', 'pass'], ['/gm-studio-x7k9', 'pass'],
  ['/favicon.ico', 'pass'], ['/assets/x.js', 'pass'], ['/robots.txt', 'pass'], ['/sitemap.xml', 'pass'], ['/api/notify', 'pass'],
  ['/page-inexistante', '404'], ['/a/b/c', '404'],
];
for (const [p, exp] of tests) {
  const { passed, r } = await run(p);
  const got = passed ? 'pass' : r.status === 404 ? '404' : 'shell';
  check(`${p} attendu ${exp} obtenu ${got}`, got === exp);
}

// www -> sans www (301, chemin et paramètres conservés)
{ const { r } = await run('/concours?x=1', 'www.graphiquemotion.com');
  check('www redirige en 301', r.status === 301 && r.headers.get('location') === 'https://graphiquemotion.com/concours?x=1'); }

// page projet : meta injectées
{ supabase = 'ok'; const { r } = await run('/portfolio/projet-test'); const h = await r.text();
  check('projet 200', r.status === 200);
  check('projet titre', h.includes('<title>Projet Test | Graphique &amp; Motion</title>'));
  check('projet canonical', h.includes('href="https://graphiquemotion.com/portfolio/projet-test"'));
  check('projet h1', h.includes('<h1') && h.includes('Projet Test'));
  check('projet image absolue', h.includes('https://graphiquemotion.com/img/a.jpg')); }
// projet absent -> 404 ; Supabase en panne -> gabarit normal 200
{ supabase = 'vide'; const { r } = await run('/portfolio/inexistant'); check('projet absent -> 404', r.status === 404 && r.headers.get('x-robots-tag') === 'noindex'); }
{ supabase = 'panne'; const { r } = await run('/portfolio/x'); check('Supabase en panne -> 200', r.status === 200); }
// boutique : canonical propre
{ const { r } = await run('/boutique/produit-x'); const h = await r.text(); check('boutique canonical', h.includes('href="https://graphiquemotion.com/boutique/produit-x"')); }
// fichier compilé absent (le serveur renvoie du HTML) -> 404 non mise en cache ; fichier JS normal -> intact
{ let r = await onRequest({ request: new Request('https://graphiquemotion.com/assets/x.js'), env, next: async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } }) });
  check('asset HTML -> 404 no-store', r.status === 404 && r.headers.get('cache-control') === 'no-store');
  r = await onRequest({ request: new Request('https://graphiquemotion.com/assets/x.js'), env, next: async () => new Response('export{}', { headers: { 'content-type': 'application/javascript' } }) });
  check('asset JS intact', r.status === 200 && (await r.text()) === 'export{}'); }
// POST jamais touché
{ let passed = false; await onRequest({ request: new Request('https://graphiquemotion.com/api/x', { method: 'POST' }), env, next: async () => { passed = true; return new Response('NEXT'); } }); check('POST passe', passed); }

console.log(`middleware : ${tests.length + 12} contrôles, ${bad} écart(s)`);
process.exit(bad ? 1 : 0);
