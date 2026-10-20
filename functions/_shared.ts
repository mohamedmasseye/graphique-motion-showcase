// Utilitaires de sécurité partagés par les fonctions Pages (ce fichier n'expose aucune route).
export interface SecEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

export const svcKey = (env: SecEnv) => env.SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string => typeof v === 'string' && UUID_RE.test(v);
export const isOrderNumber = (v: unknown): v is string => typeof v === 'string' && /^GM-\d{8}-\d{3,6}$/.test(v);

export const escapeHtml = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

/** Vérifie que l'appelant est un administrateur (jeton Supabase valide ET présent dans public.admins). */
export async function requireAdmin(request: Request, env: SecEnv): Promise<{ ok: true; userId: string } | { ok: false; status: number }> {
  const token = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false, status: 401 };
  const key = svcKey(env);
  const who = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, { headers: { apikey: key, Authorization: `Bearer ${token}` } });
  if (!who.ok) return { ok: false, status: 401 };
  const user: any = await who.json();
  if (!isUuid(user?.id)) return { ok: false, status: 401 };
  const adm = await fetch(`${env.SUPABASE_URL}/rest/v1/admins?user_id=eq.${user.id}&select=user_id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const rows: any = adm.ok ? await adm.json() : [];
  if (!Array.isArray(rows) || rows.length === 0) return { ok: false, status: 403 };
  return { ok: true, userId: user.id };
}
