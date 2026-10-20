import { svcKey, type SecEnv } from '../_shared';

// Connexion administrateur avec limitation de débit côté serveur.
// 5 échecs par IP ou 8 échecs par email en 15 minutes => blocage (429).
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_IP = 5;
const MAX_PER_EMAIL = 8;

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extra } });

export const onRequestPost: PagesFunction<SecEnv> = async ({ request, env, waitUntil }) => {
  const body: any = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!email || email.length > 200 || !password || password.length > 200) return json({ error: 'invalid' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const key = svcKey(env);
  const rest = (path: string, init: RequestInit = {}) =>
    fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } });

  const since = encodeURIComponent(new Date(Date.now() - WINDOW_MS).toISOString());
  const count = async (col: 'ip' | 'email', val: string) => {
    const r = await rest(`admin_login_attempts?${col}=eq.${encodeURIComponent(val)}&success=eq.false&created_at=gte.${since}&select=id`, { headers: { Prefer: 'count=exact', Range: '0-0' } });
    const range = r.headers.get('content-range') ?? '';
    return Number(range.split('/')[1]) || 0;
  };
  const [byIp, byEmail] = await Promise.all([count('ip', ip), count('email', email)]);
  if (byIp >= MAX_PER_IP || byEmail >= MAX_PER_EMAIL) {
    return json({ error: 'too_many_attempts', retry_after: WINDOW_MS / 1000 }, 429, { 'Retry-After': String(WINDOW_MS / 1000) });
  }

  // La clé publique (anon) est celle du site ; on la relaie telle quelle vers l'API d'authentification.
  const anon = request.headers.get('apikey') ?? '';
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anon, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    await rest('admin_login_attempts', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ip, email, success: false }) });
    await new Promise((r) => setTimeout(r, 400)); // ralentit les essais automatisés
    return json({ error: 'invalid_credentials' }, 401);
  }

  const session: any = await res.json();
  // Succès : on efface les échecs de cet email, et on purge l'historique ancien.
  waitUntil(Promise.all([
    rest(`admin_login_attempts?email=eq.${encodeURIComponent(email)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }),
    rest(`admin_login_attempts?created_at=lt.${encodeURIComponent(new Date(Date.now() - 2 * 86400000).toISOString())}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }),
  ]));
  return json({ access_token: session.access_token, refresh_token: session.refresh_token, expires_in: session.expires_in });
};
