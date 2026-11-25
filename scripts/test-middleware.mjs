// Test local du middleware 404 : node scripts/test-middleware.mjs
import { buildSync } from 'esbuild';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const out = path.resolve('node_modules/.cache/mw.mjs');
buildSync({ entryPoints: ['functions/_middleware.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const { onRequest } = await import(pathToFileURL(out).href);

const env = { ASSETS: { fetch: async () => new Response('<html>shell</html>', { status: 200, headers: { 'content-type': 'text/html' } }) } };
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
let bad = 0;
for (const [p, exp] of tests) {
  let passed = false;
  const r = await onRequest({ request: new Request('https://graphiquemotion.com' + p), env, next: async () => { passed = true; return new Response('NEXT'); } });
  const got = passed ? 'pass' : r.status === 404 ? '404' : 'shell';
  if (got !== exp) { bad++; console.log('KO', p, 'attendu', exp, 'obtenu', got); }
}
const post = await onRequest({ request: new Request('https://graphiquemotion.com/api/x', { method: 'POST' }), env, next: async () => new Response('NEXT') });
const postOk = (await post.text()) === 'NEXT';
console.log(`middleware : ${tests.length + 1} cas, ${bad + (postOk ? 0 : 1)} écart(s)`);
process.exit(bad || !postOk ? 1 : 0);
