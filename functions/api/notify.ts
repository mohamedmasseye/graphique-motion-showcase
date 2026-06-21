interface Env {
  BREVO_API_KEY: string;
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
  let body: any;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: corsHeaders });
  }

  const { order_id } = body;
  if (!order_id) {
    return new Response(JSON.stringify({ error: 'order_id required' }), { status: 400, headers: corsHeaders });
  }

  const orderRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&select=*,order_items(*)`,
    {
      headers: {
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    }
  );

  if (!orderRes.ok) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: corsHeaders });
  }

  const orders = await orderRes.json();
  const order = orders[0];
  if (!order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404, headers: corsHeaders });
  }

  const paymentLabel = order.payment_method === 'wave' ? 'Wave' : 'À la livraison';
  const itemsList = (order.order_items ?? [])
    .map((i: any) => `• ${i.product_name}${i.variant_name ? ` (${i.variant_name})` : ''} × ${i.quantity}`)
    .join('\n');

  const formattedTotal = new Intl.NumberFormat('fr-SN').format(order.total) + ' FCFA';

  // Email notification to admin via Brevo
  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Graphique & Motion', email: 'support@graphiquemotion.com' },
        to: [{ email: 'support@graphiquemotion.com' }],
        subject: `🛒 Nouvelle commande ${order.order_number} — ${formattedTotal}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0A0A0F;color:#fff;border-radius:12px">
            <h2 style="color:#00B2AA;margin-bottom:4px">Nouvelle commande</h2>
            <p style="color:#A0A0A0;margin-top:0;font-size:13px">${order.order_number}</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <table style="width:100%;font-size:14px">
              <tr><td style="color:#A0A0A0;padding:4px 0;width:110px">Client</td><td style="color:#fff">${order.customer_name}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Téléphone</td><td><a href="tel:${order.customer_phone}" style="color:#00B2AA">${order.customer_phone}</a></td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Adresse</td><td style="color:#fff">${order.customer_address ?? ''}, ${order.city}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Paiement</td><td style="color:#fff">${paymentLabel}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Total</td><td style="color:#00B2AA;font-weight:bold;font-size:18px">${formattedTotal}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <p style="color:#A0A0A0;font-size:12px;margin-bottom:6px">ARTICLES</p>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;color:#fff;font-size:14px;line-height:1.8;white-space:pre-line">${itemsList}</div>
            ${order.notes ? `<p style="color:#A0A0A0;font-size:12px;margin-top:16px">Note: ${order.notes}</p>` : ''}
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error('Brevo error:', err);
  }

  return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
};
