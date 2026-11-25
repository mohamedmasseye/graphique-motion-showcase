/* Sitemap complet : pages publiques + fiches boutique + réalisations (Supabase). Servi sur /sitemap.xml */
import { SEO_ROUTES } from '../src/data/seoRoutes';

interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const BASE = 'https://graphiquemotion.com';
const key = (env: Env) => env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';
const day = (d?: string) => (d ? new Date(d) : new Date()).toISOString().split('T')[0];

async function rows(env: Env, table: string, filter = ''): Promise<{ slug: string; updated_at?: string }[]> {
  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/${table}?${filter}select=slug,updated_at`, {
      headers: { apikey: key(env), Authorization: `Bearer ${key(env)}` },
    });
    return r.ok ? await r.json() : [];
  } catch { return []; }
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [products, portfolio] = await Promise.all([rows(env, 'products', 'status=eq.active&'), rows(env, 'portfolio', 'published=eq.true&')]);
  const today = day();
  const url = (loc: string, freq: string, prio: number, last = today) =>
    `<url><loc>${BASE}${loc === '/' ? '/' : loc}</loc><lastmod>${last}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`;

  const seen = new Set<string>();
  const urls: string[] = [];
  const add = (loc: string, freq: string, prio: number, last?: string) => { if (!seen.has(loc)) { seen.add(loc); urls.push(url(loc, freq, prio, last)); } };

  SEO_ROUTES.forEach((r) => add(r.path, r.changefreq, r.priority));
  products.forEach((p) => add(`/boutique/${p.slug}`, 'weekly', 0.7, day(p.updated_at)));
  portfolio.forEach((p) => add(`/portfolio/${p.slug}`, 'monthly', 0.7, day(p.updated_at)));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=3600' } });
};
