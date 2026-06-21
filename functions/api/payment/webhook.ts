interface Env {
  WAVE_SIGNING_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

const WAVE_ALLOWED_IPS = [
  '104.155.43.220', '34.140.23.175', '34.22.138.147', '34.76.157.22',
  '34.78.253.137', '34.79.119.200', '35.189.207.30', '35.195.255.192',
  '35.205.122.113', '35.205.190.121', '35.233.61.130', '35.240.61.196',
  '35.240.75.65', '35.241.190.127', '35.241.219.1',
];

async function verifyWaveSignature(body: string, header: string | null, secret: string): Promise<boolean> {
  if (!header || !secret) return false;

  const parts = header.split(',');
  let timestamp = '';
  const signatures: string[] = [];

  for (const part of parts) {
    const [prefix, value] = part.split('=');
    if (prefix === 't') timestamp = value;
    else if (prefix === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  if (age > 300) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(timestamp + body));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');

  return signatures.includes(expected);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 1. IP whitelist
  const clientIP = request.headers.get('cf-connecting-ip') ?? '';
  if (!WAVE_ALLOWED_IPS.includes(clientIP)) {
    console.error('Wave webhook: blocked IP', clientIP);
    return new Response('Forbidden', { status: 403 });
  }

  // 2. Read body
  const body = await request.text();
  if (!body) return new Response('Empty body', { status: 400 });

  // 3. Signature verification
  if (env.WAVE_SIGNING_SECRET) {
    const sig = request.headers.get('wave-signature');
    const valid = await verifyWaveSignature(body, sig, env.WAVE_SIGNING_SECRET);
    if (!valid) {
      console.error('Wave webhook: invalid signature');
      return new Response('Invalid signature', { status: 401 });
    }
  }

  // 4. Parse event
  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  // 5. Process checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const data = event.data;
    const orderId = data.client_reference;
    const transactionId = data.transaction_id;
    const checkoutId = data.id;

    if (!orderId) {
      console.error('Wave webhook: no client_reference');
      return new Response('OK', { status: 200 });
    }

    // Update order → confirmed + store transaction ID
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          status: 'confirmed',
          payment_ref: transactionId ?? checkoutId,
        }),
      }
    );

    if (!res.ok) {
      console.error('Wave webhook: failed to update order', await res.text());
    }
  }

  return new Response('OK', { status: 200 });
};
