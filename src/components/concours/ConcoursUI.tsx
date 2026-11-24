import { CONCOURS, getPhase, splitDuration, useNow, type Phase } from '@/data/concours';

/* ── Libellés selon la phase ───────────────────────────────────── */
export function phaseLabel(p: Phase) {
  switch (p) {
    case 'avant': return { badge: 'Bientôt', court: 'Ouverture le 30 novembre à 18h', compteur: 'Ouverture dans' };
    case 'ouvert': return { badge: 'En cours', court: 'Participations ouvertes jusqu’au 17 décembre', compteur: 'Clôture dans' };
    case 'clos': return { badge: 'Clos', court: 'Participations closes · tirage en direct le 19 décembre', compteur: '' };
    default: return { badge: 'Terminé', court: 'Tirage effectué · les gagnants sont annoncés sur Instagram', compteur: '' };
  }
}

/* ── Compte à rebours ──────────────────────────────────────────── */
export function Countdown({ compact = false }: { compact?: boolean }) {
  const now = useNow(1000);
  const phase = getPhase(now);
  const target = phase === 'avant' ? CONCOURS.start : phase === 'ouvert' ? CONCOURS.end : null;
  if (!target) return null;
  const d = splitDuration(target.getTime() - now.getTime());
  const cells: [number, string][] = [[d.jours, 'jours'], [d.heures, 'heures'], [d.minutes, 'min'], [d.secondes, 'sec']];
  return (
    <div>
      <p className={`uppercase tracking-[0.22em] font-semibold text-white/45 ${compact ? 'text-[10px] mb-2' : 'text-[11px] mb-3'}`}>
        {phaseLabel(phase).compteur}
      </p>
      <div className="flex gap-2 sm:gap-3">
        {cells.map(([v, l]) => (
          <div
            key={l}
            className={`relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur text-center ${compact ? 'w-14 py-2' : 'w-[4.25rem] sm:w-20 py-3'}`}
          >
            <div className={`font-syne font-black tabular-nums text-white leading-none ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>
              {String(v).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/40">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Cadre navigateur pour les captures de sites ───────────────── */
export function BrowserFrame({ src, alt, label, className = '' }: { src: string; alt: string; label?: string; className?: string }) {
  return (
    <figure className={`relative rounded-2xl overflow-hidden border border-white/10 bg-[#0D0D14] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-white/[0.07] bg-white/[0.03]">
        <span className="w-2 h-2 rounded-full bg-[#FF5F57]/80" />
        <span className="w-2 h-2 rounded-full bg-[#FEBC2E]/80" />
        <span className="w-2 h-2 rounded-full bg-[#28C840]/80" />
        {label && <span className="ml-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">{label}</span>}
      </div>
      <img src={src} alt={alt} loading="lazy" className="block w-full h-auto" />
    </figure>
  );
}

/* ── Mention légale réseaux sociaux ────────────────────────────── */
export const MENTION_META =
  'Ce concours n’est ni sponsorisé, ni géré, ni associé à Instagram, Facebook, TikTok, LinkedIn ou Meta.';
