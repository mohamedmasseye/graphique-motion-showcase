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
    if (!env.WAVE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'WAVE_API_KEY non configurée' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const { amount, orderId, orderNumber, customerPhone } = await request.json();

    if (!amount || !orderId) {
      return new Response(
        JSON.stringify({ error: 'amount et orderId requis' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Wave exige amount en STRING, sans décimales pour XOF
    const amountStr = String(Math.round(Number(amount)));

    let formattedPhone = customerPhone ?? '';
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.startsWith('221')
        ? `+${formattedPhone}`
        : `+221${formattedPhone}`;
    }

    const wavePayload: Record<string, string> = {
      amount: amountStr,
      currency: 'XOF',
      client_reference: String(orderId),
      success_url: `https://graphiquemotion.com/boutique?payment=success&order=${orderNumber}`,
      error_url: `https://graphiquemotion.com/boutique?payment=error&order=${orderNumber}`,
    };

    if (formattedPhone) {
      wavePayload.restrict_payer_mobile = formattedPhone;
    }

    const body = JSON.stringify(wavePayload);

    // Build headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${env.WAVE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Request signing if WAVE_SIGNING_SECRET is configured
    if (env.WAVE_SIGNING_SECRET) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await hmacSha256(env.WAVE_SIGNING_SECRET, `${timestamp}${body}`);
      headers['Wave-Signature'] = `t=${timestamp},v1=${signature}`;
    }

    const waveRes = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers,
      body,
    });

    if (!waveRes.ok) {
      const err = await waveRes.text();
      console.error('Wave API error:', waveRes.status, err);
      return new Response(
        JSON.stringify({ error: `Wave ${waveRes.status}: ${err.substring(0, 300)}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    const session = await waveRes.json();

    // Stocker l'ID de session Wave dans la commande
    await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ payment_ref: session.id }),
      }
    );

    return new Response(
      JSON.stringify({
        success: true,
        wave_launch_url: session.wave_launch_url,
        checkout_id: session.id,
      }),
      { headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('Wave checkout error:', err);
    return new Response(
      JSON.stringify({ error: `Erreur interne: ${err?.message ?? 'unknown'}` }),
      { status: 500, headers: corsHeaders }
    );
  }
};
