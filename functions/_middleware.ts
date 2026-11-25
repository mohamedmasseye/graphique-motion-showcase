/* Vraies erreurs 404 + gabarit neutre pour les routes dynamiques.
   - Page pré-rendue ou fichier statique  -> servi tel quel (next)
   - Route dynamique de l'app (fiche produit, paiement, admin…) -> app-shell.html (200)
   - Tout le reste -> app-shell.html avec statut 404 + noindex (l'app affiche sa page « introuvable »)
   En cas d'erreur, on laisse passer la requête : le site ne doit jamais tomber à cause de ce fichier. */
import { SERVICE_SLUGS, ARTICLE_SLUGS } from '../src/data/seoRoutes';

interface Env { ASSETS: { fetch: (r: Request | string) => Promise<Response> } }

const STATIC_PAGES = new Set([
  '/', '/services', '/portfolio', '/tarifs', '/a-propos', '/a-propos/mohamed-diop', '/processus', '/blog', '/contact',
  '/concours', '/concours/reglement', '/boutique',
]);
const REDIRECT_ONLY = new Set(['/reglement', '/realisations']);
const SLUGGED = /^\/(boutique|portfolio|realisations)\/[^/]+$/;
const APP_ONLY = /^\/(checkout|paiement|admin(\/.*)?|oauth(\/.*)?)$/;
const PASS_THROUGH = /^\/gm-studio-x7k9(\/.*)?$/; // CMS statique (public/gm-studio-x7k9)

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    const url = new URL(request.url);
    const p = url.pathname.replace(/\/+$/, '') || '/';

    // fichiers (assets, images, favicon, sitemap…) et API : on ne touche à rien
    if (PASS_THROUGH.test(p) || p.startsWith('/api/') || /\.[a-z0-9]{1,8}$/i.test(p)) return next();

    const serviceDetail = p.startsWith('/services/') && SERVICE_SLUGS.includes(p.slice('/services/'.length));
    const blogDetail = p.startsWith('/blog/') && ARTICLE_SLUGS.includes(p.slice('/blog/'.length));
    if (STATIC_PAGES.has(p) || serviceDetail || blogDetail) return next(); // fichier pré-rendu

    const shell = async () => env.ASSETS.fetch(new URL('/app-shell.html', url.origin).toString());
    if (REDIRECT_ONLY.has(p) || SLUGGED.test(p) || APP_ONLY.test(p)) {
      const r = await shell();
      return r.ok ? new Response(r.body, { status: 200, headers: r.headers }) : next();
    }

    const r = await shell();
    if (!r.ok) return next();
    const headers = new Headers(r.headers);
    headers.set('X-Robots-Tag', 'noindex');
    headers.set('Cache-Control', 'no-store');
    return new Response(r.body, { status: 404, headers });
  } catch {
    return next();
  }
};
