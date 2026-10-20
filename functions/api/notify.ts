import { escapeHtml as h, isUuid, svcKey, type SecEnv } from '../_shared';

interface Env extends SecEnv {
  BREVO_API_KEY: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

export const onRequestOptions: PagesFunction = () => new Response(null, { headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const body: any = await request.json().catch(() => null);
  const order_id = body?.order_id;
  if (!isUuid(order_id)) return json({ error: 'order_id invalide' }, 400);

  const headers = { apikey: svcKey(env), Authorization: `Bearer ${svcKey(env)}` };

  // Un seul email par commande, et seulement pour une commande récente (évite le spam de l'administrateur).
  const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const claim = await fetch(
    `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${order_id}&admin_notified=eq.false&created_at=gte.${encodeURIComponent(since)}&select=*,order_items(*)`,
    { method: 'PATCH', headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ admin_notified: true }) },
  );
  const claimed: any[] = claim.ok ? await claim.json() : [];
  const order = claimed[0];
  if (!order) return json({ success: true }); // déjà notifiée, trop ancienne ou inconnue : rien à faire

  const paymentLabel = order.payment_method === 'wave' ? 'Wave' : 'À la livraison';
  const itemsList = (order.order_items ?? [])
    .map((i: any) => `• ${h(i.product_name)}${i.variant_name ? ` (${h(i.variant_name)})` : ''} × ${Number(i.quantity) || 0}`)
    .join('\n');
  const formattedTotal = new Intl.NumberFormat('fr-SN').format(order.total) + ' FCFA';
  const phone = String(order.customer_phone ?? '').replace(/[^\d+]/g, '');

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': env.BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: 'Graphique & Motion', email: 'support@graphiquemotion.com' },
        to: [{ email: 'support@graphiquemotion.com' }],
        subject: `🛒 Nouvelle commande ${h(order.order_number)} — ${formattedTotal}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0A0A0F;color:#fff;border-radius:12px">
            <h2 style="color:#00B2AA;margin-bottom:4px">Nouvelle commande</h2>
            <p style="color:#A0A0A0;margin-top:0;font-size:13px">${h(order.order_number)}</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <table style="width:100%;font-size:14px">
              <tr><td style="color:#A0A0A0;padding:4px 0;width:110px">Client</td><td style="color:#fff">${h(order.customer_name)}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Téléphone</td><td><a href="tel:${h(phone)}" style="color:#00B2AA">${h(order.customer_phone)}</a></td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Adresse</td><td style="color:#fff">${h(order.customer_address ?? '')}, ${h(order.city)}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Paiement</td><td style="color:#fff">${paymentLabel}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Total</td><td style="color:#00B2AA;font-weight:bold;font-size:18px">${formattedTotal}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <p style="color:#A0A0A0;font-size:12px;margin-bottom:6px">ARTICLES</p>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;color:#fff;font-size:14px;line-height:1.8;white-space:pre-line">${itemsList}</div>
            ${order.notes ? `<p style="color:#A0A0A0;font-size:12px;margin-top:16px">Note: ${h(order.notes)}</p>` : ''}
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error('Brevo error:', err);
  }

  return json({ success: true });
};
