interface Env {
  WAVE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { amount, orderId, orderNumber, customerPhone } = await request.json();

    if (!amount || !orderId) {
      return new Response(
        JSON.stringify({ error: 'amount et orderId requis' }),
        { status: 400, headers: corsHeaders }
      );
    }

    let formattedPhone = customerPhone ?? '';
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      formattedPhone = formattedPhone.startsWith('221')
        ? `+${formattedPhone}`
        : `+221${formattedPhone}`;
    }

    const wavePayload: Record<string, any> = {
      amount,
      currency: 'XOF',
      client_reference: orderId,
      success_url: `https://graphiquemotion.com/boutique?payment=success&order=${orderNumber}`,
      error_url: `https://graphiquemotion.com/boutique?payment=error&order=${orderNumber}`,
    };

    if (formattedPhone) {
      wavePayload.restrict_payer_mobile = formattedPhone;
    }

    const waveRes = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.WAVE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wavePayload),
    });

    if (!waveRes.ok) {
      const err = await waveRes.text();
      console.error('Wave API error:', waveRes.status, err);
      return new Response(
        JSON.stringify({ error: `Wave ${waveRes.status}: ${err.substring(0, 200)}` }),
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
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: corsHeaders }
    );
  }
};
