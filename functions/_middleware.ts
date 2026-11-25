/* Vraies erreurs 404, redirection www, et pages dynamiques lisibles par les robots.
   - www.graphiquemotion.com                 -> 301 vers graphiquemotion.com
   - Page pré-rendue ou fichier statique     -> servi tel quel (next)
   - /portfolio/:slug                        -> gabarit + titre, description, image, canonical et h1 du projet (Supabase) ;
                                                projet inexistant ou non publié -> vrai 404
   - /boutique/:slug                         -> gabarit avec son propre canonical
   - Autres routes de l'app (paiement, admin…) -> gabarit neutre (200)
   - Tout le reste                           -> gabarit avec statut 404 + noindex
   En cas d'erreur, on laisse passer la requête : le site ne doit jamais tomber à cause de ce fichier. */
import { SERVICE_SLUGS, ARTICLE_SLUGS } from '../src/data/seoRoutes';

interface Env {
  ASSETS: { fetch: (r: Request | string) => Promise<Response> };
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const SITE = 'https://graphiquemotion.com';
const NAME = 'Graphique & Motion';
const STATIC_PAGES = new Set([
  '/', '/services', '/portfolio', '/tarifs', '/a-propos', '/a-propos/mohamed-diop', '/processus', '/blog', '/contact',
  '/concours', '/concours/reglement', '/boutique',
]);
const REDIRECT_ONLY = new Set(['/reglement', '/realisations']);
const SLUGGED = /^\/(boutique|portfolio|realisations)\/[^/]+$/;
const APP_ONLY = /^\/(checkout|paiement|admin(\/.*)?|oauth(\/.*)?)$/;
const PASS_THROUGH = /^\/gm-studio-x7k9(\/.*)?$/; // CMS statique (public/gm-studio-x7k9)

const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const setTag = (html: string, re: RegExp, value: string) => (re.test(html) ? html.replace(re, value) : html);
const meta = (html: string, attr: string, key: string, content: string) =>
  setTag(html, new RegExp(`<meta ${attr}="${key}" content="[^"]*"\\s*/?>`), `<meta ${attr}="${key}" content="${esc(content)}" />`);

function withCanonical(html: string, canonical: string): string {
  let h = setTag(html, /<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);
  h = meta(h, 'property', 'og:url', canonical);
  return h;
}

interface Project {
  title: string; seo_title?: string | null; seo_description?: string | null; short_description?: string | null;
  description?: string | null; image?: string | null; og_image?: string | null; category?: string | null;
}

/** 'error' = Supabase injoignable (on sert le gabarit normal) ; null = projet absent/non publié ; sinon le projet */
async function loadProject(env: Env, slug: string): Promise<Project | null | 'error'> {
  const key = env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!env.SUPABASE_URL || !key) return 'error';
  try {
    const q = `slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=title,seo_title,seo_description,short_description,description,image,og_image,category&limit=1`;
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/portfolio?${q}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return 'error';
    const rows = (await r.json()) as Project[];
    return rows.length ? rows[0] : null;
  } catch { return 'error'; }
}

function projectHtml(shell: string, pr: Project, url: string): string {
  const t = pr.seo_title || pr.title;
  const title = t.includes(NAME) ? t : `${t} | ${NAME}`;
  const desc = (pr.seo_description || pr.short_description || pr.description || `${pr.title} — ${NAME}`).slice(0, 300);
  let img = pr.og_image || pr.image || `${SITE}/og-image.png`;
  if (img.startsWith('/')) img = SITE + img;
  let h = withCanonical(shell, url);
  h = setTag(h, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  h = meta(h, 'name', 'description', desc);
  h = meta(h, 'property', 'og:title', title);
  h = meta(h, 'property', 'og:description', desc);
  h = meta(h, 'property', 'og:type', 'article');
  h = meta(h, 'property', 'og:image', img);
  h = meta(h, 'name', 'twitter:title', title);
  h = meta(h, 'name', 'twitter:description', desc);
  h = meta(h, 'name', 'twitter:image', img);
  const body = `<div id="seo-static" style="min-height:100vh;background:#0A0A0F;color:#fff;font-family:Montserrat,system-ui,sans-serif;text-align:center;padding:96px 20px">` +
    `<nav style="margin-bottom:48px"><a href="/" style="color:#00B2AA;margin:0 10px">Accueil</a><a href="/portfolio" style="color:#00B2AA;margin:0 10px">Réalisations</a><a href="/services" style="color:#00B2AA;margin:0 10px">Services</a><a href="/contact" style="color:#00B2AA;margin:0 10px">Contact</a></nav>` +
    `<main><h1 style="font-size:34px;line-height:1.15;margin:0 auto 16px;max-width:760px">${esc(pr.title)}</h1>` +
    (pr.category ? `<p style="color:#00B2AA;margin:0 0 16px">${esc(pr.category)}</p>` : '') +
    `<p style="color:#A0A0A0;max-width:680px;margin:0 auto;line-height:1.7">${esc(desc)}</p></main></div>`;
  return h.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

export const onRequest: PagesFunction<Env> = async ({ request, next, env }) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') return next();
    const url = new URL(request.url);

    // une seule adresse pour le site : www -> sans www
    if (url.hostname.startsWith('www.')) {
      return Response.redirect(`https://${url.hostname.slice(4)}${url.pathname}${url.search}`, 301);
    }

    const p = url.pathname.replace(/\/+$/, '') || '/';

    // Fichiers compilés : si le serveur répond par une page HTML (fichier pas encore propagé après un déploiement,
    // ou ancien nom disparu), on renvoie une vraie 404 non mise en cache. Sans ça le navigateur garderait
    // cette page HTML pendant un an à la place du fichier JavaScript.
    if (p.startsWith('/assets/')) {
      const res = await next();
      if ((res.headers.get('content-type') || '').includes('text/html')) {
        return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      return res;
    }

    // fichiers (assets, images, favicon, sitemap…) et API : on ne touche à rien
    if (PASS_THROUGH.test(p) || p.startsWith('/api/') || /\.[a-z0-9]{1,8}$/i.test(p)) return next();

    const serviceDetail = p.startsWith('/services/') && SERVICE_SLUGS.includes(p.slice('/services/'.length));
    const blogDetail = p.startsWith('/blog/') && ARTICLE_SLUGS.includes(p.slice('/blog/'.length));
    if (STATIC_PAGES.has(p) || serviceDetail || blogDetail) return next(); // fichier pré-rendu

    const shell = async () => env.ASSETS.fetch(new URL('/app-shell.html', url.origin).toString());
    const send = (html: string, status: number, base: Response, extra: Record<string, string> = {}) => {
      const headers = new Headers(base.headers);
      headers.delete('content-length');
      Object.entries(extra).forEach(([k, v]) => headers.set(k, v));
      return new Response(html, { status, headers });
    };

    if (REDIRECT_ONLY.has(p) || SLUGGED.test(p) || APP_ONLY.test(p)) {
      const r = await shell();
      if (!r.ok) return next();
      let html = await r.text();
      const canonical = `${SITE}${p}`;
      if (p.startsWith('/portfolio/')) {
        const pr = await loadProject(env, decodeURIComponent(p.slice('/portfolio/'.length)));
        if (pr === null) return send(html, 404, r, { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' });
        if (pr !== 'error') html = projectHtml(html, pr, canonical);
      } else if (p.startsWith('/boutique/')) {
        html = withCanonical(html, canonical);
      }
      return send(html, 200, r);
    }

    const r = await shell();
    if (!r.ok) return next();
    return send(await r.text(), 404, r, { 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store' });
  } catch {
    return next();
  }
};
