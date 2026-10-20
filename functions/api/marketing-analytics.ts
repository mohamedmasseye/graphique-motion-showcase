// Proxy lecture seule vers l'API AdaptlyPost. La clé reste côté serveur (variable Cloudflare).
import { requireAdmin } from '../_shared';

interface Env {
  ADAPTLYPOST_API_KEY?: string;
  ADAPTLYPOST_API_BASE?: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const DAY = 86400000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  // L'appelant doit être un utilisateur connecté (même règle que la sécurité de la base).
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return json({ error: 'Non autorisé' }, auth.status);

  const key = env.ADAPTLYPOST_API_KEY;
  if (!key) return json({ configured: false });

  const url = new URL(request.url);
  const days = url.searchParams.get('days') === '30' ? 30 : 7;
  const now = new Date();
  // `to` = demain, pour inclure toute la journée d'aujourd'hui.
  const to = iso(new Date(now.getTime() + DAY));
  const from = iso(new Date(now.getTime() - days * DAY));
  const base = (env.ADAPTLYPOST_API_BASE || 'https://post.adaptlypost.com/post/api/v1').replace(/\/$/, '');

  const call = async (path: string) => {
    const res = await fetch(`${base}${path}`, { headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' } });
    if (res.status === 401 || res.status === 403) throw new Error('Clé refusée : vérifier ADAPTLYPOST_API_KEY et la permission analytics.read');
    if (res.status === 429) throw new Error('Trop de requêtes, réessayer dans quelques minutes');
    if (!res.ok) throw new Error(`AdaptlyPost a répondu ${res.status}`);
    const data: any = await res.json();
    return data?.result ?? data;
  };

  const settle = async (p: Promise<unknown>) => { try { return { data: await p }; } catch (e: any) { return { error: e.message as string }; } };
  const [overview, breakdown, top, sync] = await Promise.all([
    settle(call(`/analytics/overview?from=${from}&to=${to}`)),
    settle(call(`/analytics/platform-breakdown?from=${from}&to=${to}`)),
    settle(call(`/analytics/top-posts?from=${from}&to=${to}&sortBy=views&limit=5`)),
    settle(call(`/analytics/sync-status`)),
  ]);
  return json({ configured: true, days, from, to, overview, breakdown, top, sync });
};
