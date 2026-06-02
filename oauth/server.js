/**
 * OAuth proxy pour Decap CMS + GitHub
 * Hetzner — tourne en arrière-plan sur le port 3001
 * Nginx proxy /oauth -> http://localhost:3001
 *
 * Variables d'environnement requises (dans .env ou export) :
 *   GITHUB_CLIENT_ID      → depuis GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  → depuis GitHub OAuth App
 *   OAUTH_REDIRECT_URL    → https://graphiquemotion.com/oauth/callback
 */

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app  = express();
const PORT = process.env.OAUTH_PORT || 3001;

const CLIENT_ID     = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URL  = process.env.OAUTH_REDIRECT_URL || 'https://graphiquemotion.com/oauth/callback';
const ALLOWED_ORIGIN = 'https://graphiquemotion.com';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Étape 1 — Redirige vers GitHub OAuth
app.get('/oauth/authorize', (req, res) => {
  const params = new URLSearchParams({
    client_id:    CLIENT_ID,
    redirect_uri: REDIRECT_URL,
    scope:        'repo,user',
    state:        req.query.state || '',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

// Étape 2 — GitHub redirige ici avec le code → on échange contre un token
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send('Code OAuth manquant');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code, state }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      return res.status(400).send(`Erreur GitHub: ${data.error_description}`);
    }

    // Renvoie le token à Decap CMS via postMessage
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>Authentification réussie</title></head>
        <body>
          <p>Connexion réussie, fermeture...</p>
          <script>
            const token = ${JSON.stringify(data.access_token)};
            const provider = 'github';
            if (window.opener) {
              window.opener.postMessage(
                'authorization:' + provider + ':success:' + JSON.stringify({ token, provider }),
                ${JSON.stringify(ALLOWED_ORIGIN)}
              );
            }
            window.close();
          </script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).send('Erreur serveur OAuth');
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'oauth-proxy' }));

app.listen(PORT, '127.0.0.1', () => {
  console.log(`OAuth proxy démarré sur http://127.0.0.1:${PORT}`);
});
