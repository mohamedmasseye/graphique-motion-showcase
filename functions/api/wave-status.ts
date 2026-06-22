interface Env {
  WAVE_API_KEY: string;
  WAVE_SIGNING_SECRET?: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

async function hmacSha256(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { orderNumber } = await request.json();
    if (!orderNumber) {
      return new Response(JSON.stringify({ error: 'orderNumber requis' }), { status: 400, headers: corsHeaders });
    }

    // 1. Find the order to get its Wave checkout session id (stored in payment_ref)
    const orderRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?order_number=eq.${orderNumber}&select=id,status,payment_ref,wave_transaction_id`,
      {
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    const orders = await orderRes.json();
    const order = orders?.[0];

    if (!order) {
      return new Response(JSON.stringify({ error: 'Commande introuvable' }), { status: 404, headers: corsHeaders });
    }

    // Already confirmed → return immediately
    if (order.status === 'confirmed' || order.wave_transaction_id) {
      return new Response(JSON.stringify({ payment_status: 'succeeded', status: order.status }), { headers: corsHeaders });
    }

    const sessionId = order.payment_ref;
    if (!sessionId) {
      return new Response(JSON.stringify({ payment_status: 'pending', status: order.status }), { headers: corsHeaders });
    }

    // 2. Query Wave for the checkout session status (GET → empty body for signing)
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${env.WAVE_API_KEY}`,
      'Content-Type': 'application/json',
    };
    if (env.WAVE_SIGNING_SECRET) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await hmacSha256(env.WAVE_SIGNING_SECRET, `${timestamp}`);
      headers['Wave-Signature'] = `t=${timestamp},v1=${signature}`;
    }

    const waveRes = await fetch(`https://api.wave.com/v1/checkout/sessions/${sessionId}`, { headers });
    if (!waveRes.ok) {
      const err = await waveRes.text();
      return new Response(JSON.stringify({ error: `Wave ${waveRes.status}: ${err.substring(0, 200)}` }), { status: 502, headers: corsHeaders });
    }

    const session = await waveRes.json();

    // 3. Update order based on payment status
    if (session.payment_status === 'succeeded' && session.checkout_status === 'complete') {
      await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: 'confirmed',
          payment_status: 'paid',
          wave_transaction_id: session.transaction_id ?? session.id,
        }),
      });
    } else if (session.checkout_status === 'expired' || session.payment_status === 'cancelled') {
      await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ payment_status: 'failed' }),
      });
    }

    return new Response(
      JSON.stringify({
        payment_status: session.payment_status,
        checkout_status: session.checkout_status,
        transaction_id: session.transaction_id,
      }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Erreur interne: ${err?.message ?? 'unknown'}` }), { status: 500, headers: corsHeaders });
  }
};
