import { isUuid, svcKey, type SecEnv } from '../_shared';

interface Env extends SecEnv {
  WAVE_API_KEY: string;
  WAVE_SIGNING_SECRET?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

async function hmacSha256(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.WAVE_API_KEY) return json({ error: 'Paiement indisponible' }, 500);

    const { orderId } = await request.json().catch(() => ({} as any));
    if (!isUuid(orderId)) return json({ error: 'orderId invalide' }, 400);

    // Le montant, le numéro et le téléphone viennent de la base, jamais du navigateur.
    const orderRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=id,order_number,total,customer_phone,payment_method,status,payment_status`,
      { headers: { apikey: svcKey(env), Authorization: `Bearer ${svcKey(env)}` } },
    );
    const order: any = orderRes.ok ? (await orderRes.json())?.[0] : null;
    if (!order) return json({ error: 'Commande introuvable' }, 404);
    if (order.payment_method !== 'wave' || order.status !== 'pending' || order.payment_status === 'paid') {
      return json({ error: 'Commande non payable' }, 409);
    }
    if (!Number.isInteger(order.total) || order.total <= 0) return json({ error: 'Montant invalide' }, 409);

    let phone = String(order.customer_phone ?? '').replace(/[^\d+]/g, '');
    if (phone && !phone.startsWith('+')) phone = phone.startsWith('221') ? `+${phone}` : `+221${phone}`;

    const num = encodeURIComponent(order.order_number);
    const wavePayload: Record<string, string> = {
      amount: String(order.total),
      currency: 'XOF',
      client_reference: order.id,
      success_url: `https://graphiquemotion.com/paiement?order=${num}`,
      error_url: `https://graphiquemotion.com/paiement?order=${num}&error=1`,
    };
    if (/^\+\d{8,15}$/.test(phone)) wavePayload.restrict_payer_mobile = phone;

    const body = JSON.stringify(wavePayload);
    const headers: Record<string, string> = { Authorization: `Bearer ${env.WAVE_API_KEY}`, 'Content-Type': 'application/json' };
    if (env.WAVE_SIGNING_SECRET) {
      const timestamp = Math.floor(Date.now() / 1000);
      headers['Wave-Signature'] = `t=${timestamp},v1=${await hmacSha256(env.WAVE_SIGNING_SECRET, `${timestamp}${body}`)}`;
    }

    const waveRes = await fetch('https://api.wave.com/v1/checkout/sessions', { method: 'POST', headers, body });
    if (!waveRes.ok) {
      console.error('Wave API error:', waveRes.status, await waveRes.text());
      return json({ error: `Wave indisponible (${waveRes.status})` }, 502);
    }
    const session: any = await waveRes.json();

    const patchRes = await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
      method: 'PATCH',
      headers: { apikey: svcKey(env), Authorization: `Bearer ${svcKey(env)}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ payment_ref: session.id }),
    });
    if (!patchRes.ok) console.error('Failed to store payment_ref:', patchRes.status);

    return json({ success: true, wave_launch_url: session.wave_launch_url, checkout_id: session.id, order_number: order.order_number });
  } catch (err: any) {
    console.error('Wave checkout error:', err);
    return json({ error: 'Erreur interne' }, 500);
  }
};
