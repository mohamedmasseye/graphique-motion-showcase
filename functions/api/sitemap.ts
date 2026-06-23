interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const svcKey = (env: Env) => env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [productsRes, portfolioRes] = await Promise.all([
    fetch(`${env.SUPABASE_URL}/rest/v1/products?status=eq.active&select=slug,updated_at`, {
      headers: { 'apikey': svcKey(env), 'Authorization': `Bearer ${svcKey(env)}` },
    }),
    fetch(`${env.SUPABASE_URL}/rest/v1/portfolio?select=slug,updated_at`, {
      headers: { 'apikey': svcKey(env), 'Authorization': `Bearer ${svcKey(env)}` },
    }),
  ]);

  const products: any[] = productsRes.ok ? await productsRes.json() : [];
  const portfolio: any[] = portfolioRes.ok ? await portfolioRes.json() : [];

  const base = 'https://graphiquemotion.com';
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    `<url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `<url><loc>${base}/boutique</loc><changefreq>daily</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`,
    `<url><loc>${base}/#services</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${base}/#portfolio</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${base}/#pricing</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`,
    `<url><loc>${base}/#contact</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`,
    ...products.map((p) => {
      const lastmod = p.updated_at ? new Date(p.updated_at).toISOString().split('T')[0] : today;
      return `<url><loc>${base}/boutique/${p.slug}</loc><changefreq>weekly</changefreq><priority>0.7</priority><lastmod>${lastmod}</lastmod></url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
};
