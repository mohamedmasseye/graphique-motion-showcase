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

async function fetchOrder(env: Env, orderNumber: string) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?order_number=eq.${orderNumber}&select=id,status,payment_ref,payment_status,wave_transaction_id`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  const rows = await res.json();
  return rows?.[0] ?? null;
}

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { orderNumber } = await request.json();
    if (!orderNumber) {
      return new Response(JSON.stringify({ error: 'orderNumber requis' }), { status: 400, headers: corsHeaders });
    }

    const order = await fetchOrder(env, orderNumber);
    if (!order) {
      return new Response(JSON.stringify({ error: 'Commande introuvable' }), { status: 404, headers: corsHeaders });
    }

    // Already confirmed by webhook → return immediately
    if (order.status === 'confirmed' || order.payment_status === 'paid' || order.wave_transaction_id) {
      return new Response(JSON.stringify({
        payment_status: 'succeeded',
        status: order.status,
        transaction_id: order.wave_transaction_id,
      }), { headers: corsHeaders });
    }

    const sessionId = order.payment_ref;
    if (!sessionId) {
      return new Response(JSON.stringify({ payment_status: 'pending', status: order.status }), { headers: corsHeaders });
    }

    // Try Wave API to check session status
    try {
      const hdrs: Record<string, string> = {
        'Authorization': `Bearer ${env.WAVE_API_KEY}`,
      };
      if (env.WAVE_SIGNING_SECRET) {
        const timestamp = Math.floor(Date.now() / 1000);
        const signature = await hmacSha256(env.WAVE_SIGNING_SECRET, `${timestamp}`);
        hdrs['Wave-Signature'] = `t=${timestamp},v1=${signature}`;
      }

      const waveRes = await fetch(`https://api.wave.com/v1/checkout/sessions/${sessionId}`, { headers: hdrs });

      if (waveRes.ok) {
        const session = await waveRes.json();

        if (session.payment_status === 'succeeded' && session.checkout_status === 'complete') {
          // Update order in DB
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

          return new Response(JSON.stringify({
            payment_status: 'succeeded',
            transaction_id: session.transaction_id,
          }), { headers: corsHeaders });
        }

        if (session.checkout_status === 'expired' || session.payment_status === 'cancelled') {
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
          return new Response(JSON.stringify({ payment_status: 'failed' }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          payment_status: session.payment_status ?? 'processing',
        }), { headers: corsHeaders });
      }
    } catch {
      // Wave API unreachable — fall through to DB polling
    }

    // Fallback: re-check DB (webhook may have updated it while we tried Wave)
    const freshOrder = await fetchOrder(env, orderNumber);
    if (freshOrder && (freshOrder.status === 'confirmed' || freshOrder.payment_status === 'paid')) {
      return new Response(JSON.stringify({
        payment_status: 'succeeded',
        status: freshOrder.status,
        transaction_id: freshOrder.wave_transaction_id,
      }), { headers: corsHeaders });
    }

    return new Response(JSON.stringify({ payment_status: 'processing' }), { headers: corsHeaders });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Erreur: ${err?.message ?? 'unknown'}` }), { status: 500, headers: corsHeaders });
  }
};
