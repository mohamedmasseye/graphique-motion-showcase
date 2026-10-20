import { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Loader2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { IDLE_TIMEOUT_MS, MAX_SESSION_MS } from '@/lib/adminSession';

interface Enroll { id: string; qr: string; secret: string }

export default function AdminSecurity() {
  const [loading, setLoading] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null); // facteur TOTP vérifié
  const [enroll, setEnroll] = useState<Enroll | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.auth.mfa.listFactors();
    setFactorId(data?.totp?.[0]?.id ?? null); // listFactors ne renvoie que les facteurs vérifiés dans `totp`
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const start = async () => {
    setBusy(true);
    // Nettoie d'éventuels facteurs jamais validés
    const { data: all } = await supabase.auth.mfa.listFactors();
    for (const f of (all?.all ?? []).filter((x: any) => x.status === 'unverified')) await supabase.auth.mfa.unenroll({ factorId: f.id });
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Admin G&M ${new Date().toISOString().slice(0, 10)}` });
    setBusy(false);
    if (error || !data) { toast.error('Impossible de démarrer l’activation'); return; }
    setEnroll({ id: data.id, qr: data.totp.qr_code, secret: data.totp.secret });
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enroll) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enroll.id, code: code.trim() });
    setBusy(false);
    if (error) { toast.error('Code incorrect'); setCode(''); return; }
    toast.success('Double authentification activée');
    setEnroll(null); setCode('');
    load();
  };

  const disable = async () => {
    if (!factorId || !window.confirm('Désactiver la double authentification ? Le compte ne sera plus protégé que par le mot de passe.')) return;
    setBusy(true);
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    if (error) { toast.error('Désactivation impossible (reconnectez-vous avec votre code puis réessayez)'); return; }
    toast.success('Double authentification désactivée');
    load();
  };

  if (loading) return <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-xl">
      <h1 className="text-white font-black text-2xl">Sécurité</h1>
      <p className="text-white/40 text-sm mt-1 mb-6">Protection de l’accès à l’administration</p>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-3">
          {factorId ? <ShieldCheck className="text-[#28C840] mt-0.5" size={20} /> : <ShieldAlert className="text-[#F5821F] mt-0.5" size={20} />}
          <div>
            <div className="text-white font-bold">Double authentification (TOTP)</div>
            <p className="text-white/50 text-sm mt-1">
              {factorId
                ? 'Activée. Un mot de passe volé ne suffit plus : l’accès aux données exige aussi le code de votre application.'
                : 'Non activée. Activez-la : sans elle, le mot de passe seul donne accès à toute l’administration.'}
            </p>
          </div>
        </div>

        {!factorId && !enroll && (
          <button onClick={start} disabled={busy} className="flex items-center gap-2 bg-brand-teal text-white font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-60">
            <Smartphone size={16} /> Activer
          </button>
        )}

        {enroll && (
          <form onSubmit={confirm} className="space-y-3 border-t border-white/10 pt-4">
            <p className="text-white/70 text-sm">1. Scannez ce code avec Google Authenticator, Microsoft Authenticator ou 1Password.</p>
            <img src={enroll.qr} alt="QR code d’activation" className="w-44 h-44 bg-white p-2 rounded-xl" />
            <p className="text-white/40 text-xs break-all">Saisie manuelle : <span className="text-white/70 font-mono">{enroll.secret}</span></p>
            <p className="text-white/70 text-sm">2. Entrez le code à 6 chiffres affiché.</p>
            <input
              inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" autoFocus
              className="w-40 text-center tracking-[0.4em] text-lg py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
            />
            <div className="flex gap-2">
              <button type="submit" disabled={busy || code.length !== 6} className="flex items-center gap-2 bg-brand-teal text-white font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-60">
                {busy && <Loader2 size={14} className="animate-spin" />} Confirmer
              </button>
              <button type="button" onClick={() => { setEnroll(null); setCode(''); }} className="text-white/50 text-sm px-3">Annuler</button>
            </div>
            <p className="text-[#F5821F] text-xs">Gardez bien votre application : si vous perdez l’appareil, la réinitialisation se fait depuis le tableau de bord Supabase.</p>
          </form>
        )}

        {factorId && (
          <button onClick={disable} disabled={busy} className="text-white/40 hover:text-white/70 text-xs underline">Désactiver</button>
        )}
      </div>

      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 mt-4 text-sm text-white/60 space-y-1.5">
        <div className="text-white font-bold mb-1">Règles de session</div>
        <p>Déconnexion automatique après {IDLE_TIMEOUT_MS / 60000} minutes d’inactivité.</p>
        <p>Durée maximale d’une session : {MAX_SESSION_MS / 3600000} heures.</p>
        <p>Connexion bloquée 15 minutes après 5 échecs depuis la même adresse (8 pour un même email).</p>
      </div>
    </div>
  );
}
