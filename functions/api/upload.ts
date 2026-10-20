import { requireAdmin, type SecEnv } from '../_shared';

interface Env extends SecEnv {
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

async function sha1(message: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(message));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Seul un administrateur connecté peut obtenir une signature d'envoi Cloudinary.
  const auth = await requireAdmin(request, env);
  if (!auth.ok) return new Response(JSON.stringify({ error: 'Non autorisé' }), { status: auth.status, headers: corsHeaders });

  const body: any = await request.json().catch(() => ({}));
  // Le dossier est signé tel quel : on n'accepte qu'un nom simple (sinon on pourrait faire signer d'autres paramètres).
  const folder = typeof body.folder === 'string' && /^[a-z0-9_-]{1,40}$/.test(body.folder) ? body.folder : 'products';

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await sha1(`folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`);

  return new Response(JSON.stringify({
    signature, timestamp, cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, folder,
  }), { headers: corsHeaders });
};
