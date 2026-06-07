export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://graphiquemotion.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'Champs manquants' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: 'Graphique & Motion', email: 'support@graphiquemotion.com' },
        to: [{ email: 'support@graphiquemotion.com' }],
        replyTo: { email, name },
        subject: `[Contact] ${subject}`,
        htmlContent: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0A0A0F;color:#fff;padding:32px;border-radius:12px;">
            <h2 style="color:#00B2AA;margin-bottom:24px;">Nouveau message de contact</h2>
            <p><strong style="color:#00B2AA;">Nom :</strong> ${name}</p>
            <p><strong style="color:#00B2AA;">Email :</strong> ${email}</p>
            <p><strong style="color:#00B2AA;">Sujet :</strong> ${subject}</p>
            <div style="background:#1a1a2e;padding:20px;border-radius:8px;margin-top:16px;border-left:4px solid #00B2AA;">
              <p style="margin:0;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
