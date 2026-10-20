// Politique de session de l'administration.
export const IDLE_TIMEOUT_MS = 30 * 60 * 1000;   // déconnexion après 30 min sans activité
export const MAX_SESSION_MS = 12 * 60 * 60 * 1000; // durée maximale d'une session : 12 h
export const IDLE_WARNING_MS = 2 * 60 * 1000;     // avertissement 2 min avant la déconnexion

const KEY = 'gm_admin_login_at';

export const markLogin = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch { /* ignore */ } };
export const clearLogin = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } };

/** true si la session dépasse la durée maximale (ou si l'heure de connexion est inconnue). */
export function sessionExpired(): boolean {
  try {
    const at = Number(localStorage.getItem(KEY));
    if (!at) return true;
    return Date.now() - at > MAX_SESSION_MS;
  } catch {
    return false;
  }
}
