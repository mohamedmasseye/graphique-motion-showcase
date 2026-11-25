import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';
import { CONCOURS, getPhase, isConcoursVisible } from '@/data/concours';
import { phaseLabel } from './ConcoursUI';

/** Bandeau fin au-dessus de la navigation, visible sur tout le site pendant le concours. */
export function useRibbonVisible() {
  const { pathname } = useLocation();
  return isConcoursVisible() && !pathname.startsWith(CONCOURS.path);
}

export default function ConcoursRibbon() {
  const phase = getPhase();
  const { court } = phaseLabel(phase);
  return (
    <Link
      to={CONCOURS.path}
      className="group relative block overflow-hidden border-b border-white/10"
      style={{ background: 'linear-gradient(90deg, #04302E 0%, #0A0A0F 35%, #0A0A0F 65%, #3A1F07 100%)' }}
    >
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-brand-teal/10 via-transparent to-brand-orange/10" />
      <div className="relative max-w-7xl mx-auto px-4 h-9 flex items-center justify-center gap-2.5 text-[11.5px] sm:text-xs">
        <Gift size={13} className="text-brand-orange shrink-0" />
        <span className="font-syne font-bold uppercase tracking-[0.14em] text-white">Jeu concours</span>
        <span className="hidden sm:inline text-white/55">·</span>
        <span className="hidden sm:inline font-semibold text-white">Gagnez votre site web</span>
        <span className="hidden md:inline text-white/55">·</span>
        <span className="hidden md:inline text-white/60">{court}</span>
        <span className="inline-flex items-center gap-1 font-semibold text-brand-teal">
          Découvrir
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
