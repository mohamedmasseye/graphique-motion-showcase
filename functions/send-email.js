// Rate limiting store (en mémoire, réinitialisé à chaque déploiement)
const rateLimitStore = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 3;

  const record = rateLimitStore.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }

  record.count++;
  rateLimitStore.set(ip, record);

  return record.count > maxRequests;
}

function sanitize(str) {
  return String(str)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export async function onRequestPost(context) {
  const { request, env } = context;

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({ error: 'Trop de requêtes. Réessayez dans une minute.' }),
      { status: 429, headers: corsHeaders }
    );
  }

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Format de données invalide.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { name, email, subject, message } = body;

  // Validation
  if (!name || !email || !subject || !message) {
    return new Response(
      JSON.stringify({ error: 'Tous les champs sont requis.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: 'Adresse email invalide.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  if (name.length > 100 || subject.length > 200 || message.length > 5000) {
    return new Response(
      JSON.stringify({ error: 'Données trop longues.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Sanitize inputs
  const safeName    = sanitize(name);
  const safeEmail   = sanitize(email);
  const safeSubject = sanitize(subject);
  const safeMessage = sanitize(message);

  // Send via Brevo
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Graphique & Motion', email: 'support@graphiquemotion.com' },
        to: [{ email: 'support@graphiquemotion.com' }],
        replyTo: { email: safeEmail, name: safeName },
        subject: `[Contact] ${safeSubject}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;background:#0A0A0F;color:#fff;border-radius:12px">
            <h2 style="color:#00B2AA;margin-bottom:4px">Nouveau message</h2>
            <p style="color:#A0A0A0;margin-top:0;font-size:13px">via graphiquemotion.com</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <table style="width:100%;font-size:14px">
              <tr><td style="color:#A0A0A0;padding:4px 0;width:100px">Nom</td><td style="color:#fff">${safeName}</td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Email</td><td><a href="mailto:${safeEmail}" style="color:#00B2AA">${safeEmail}</a></td></tr>
              <tr><td style="color:#A0A0A0;padding:4px 0">Sujet</td><td style="color:#fff">${safeSubject}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0"/>
            <p style="color:#A0A0A0;font-size:12px;margin-bottom:6px">MESSAGE</p>
            <div style="background:rgba(255,255,255,0.05);border-radius:8px;padding:16px;color:#fff;font-size:14px;line-height:1.6">${safeMessage.replace(/\n/g, '<br>')}</div>
            <p style="color:#A0A0A0;font-size:11px;margin-top:24px">IP: ${ip}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Brevo error:', err);
      return new Response(
        JSON.stringify({ error: "Erreur lors de l'envoi. Réessayez." }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Function error:', err);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: corsHeaders });
}
