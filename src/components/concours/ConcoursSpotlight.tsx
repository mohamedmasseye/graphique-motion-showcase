import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Globe, Server, ShieldCheck } from 'lucide-react';
import { CONCOURS, LOTS, getPhase, isConcoursVisible, useNow } from '@/data/concours';
import { Countdown, phaseLabel } from './ConcoursUI';

/** Encart d'accueil du jeu concours, juste sous le hero. */
export default function ConcoursSpotlight() {
  const now = useNow(60000);
  if (!isConcoursVisible(now)) return null;
  const phase = getPhase(now);
  const { badge, court } = phaseLabel(phase);

  return (
    <section className="relative bg-black py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-6xl mx-auto rounded-[32px] p-px"
          style={{ background: 'linear-gradient(135deg, rgba(0,178,170,0.65) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.04) 65%, rgba(245,130,31,0.55) 100%)' }}
        >
          <div className="relative rounded-[31px] bg-[#07080D] overflow-hidden">
            <div className="pointer-events-none absolute -top-40 -left-24 w-[520px] h-[420px] rounded-full bg-brand-teal/[0.12] blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-40 -right-24 w-[480px] h-[380px] rounded-full bg-brand-orange/[0.10] blur-[120px]" />

            <div className="relative grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-6 p-7 sm:p-10 lg:p-14 items-center">
              {/* Texte */}
              <div>
                <span className="inline-flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-orange text-black font-bold uppercase tracking-[0.12em] text-[10px]">
                    <Gift size={11} /> Jeu concours
                  </span>
                  <span className="text-white/65 font-medium">{badge} · {court}</span>
                </span>

                <h2 className="mt-7 font-syne font-black tracking-tight leading-[0.95] text-white text-[clamp(2.4rem,5.5vw,4.25rem)]">
                  Gagnez votre{' '}
                  <span style={{ background: 'linear-gradient(90deg, #00B2AA 0%, #378ADD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    site web.
                  </span>
                </h2>
                <p className="mt-5 text-[#A0A0A0] text-base sm:text-lg leading-relaxed max-w-lg">
                  Nous offrons deux sites web à deux entrepreneurs : un <span className="text-white font-semibold">site neuf</span> et une{' '}
                  <span className="text-white font-semibold">refonte complète</span>.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    [Globe, 'Domaine 1 an'],
                    [Server, 'Hébergement 1 an'],
                    [ShieldCheck, 'Maintenance 1 an'],
                  ].map(([Icon, t]) => {
                    const I = Icon as typeof Globe;
                    return (
                      <span key={t as string} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/75 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
                        <I size={13} className="text-brand-teal" /> {t as string}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-8"><Countdown compact /></div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link
                    to={CONCOURS.path}
                    className="group inline-flex items-center justify-center gap-2 bg-brand-teal text-black font-bold py-3.5 px-7 rounded-full text-sm hover:shadow-[0_0_30px_rgba(0,178,170,0.45)] transition-shadow"
                  >
                    Découvrir le concours
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to={CONCOURS.reglementPath}
                    className="inline-flex items-center justify-center gap-2 text-white/80 hover:text-white font-semibold py-3.5 px-6 rounded-full text-sm border border-white/15 hover:border-white/30 transition-colors"
                  >
                    Règlement
                  </Link>
                </div>
              </div>

              {/* Les deux lots */}
              <div className="grid grid-cols-2 gap-4">
                {LOTS.map((lot, i) => (
                  <Link
                    to={CONCOURS.path}
                    key={lot.id}
                    className={`group relative rounded-[22px] border border-white/10 bg-[#0C0D14] overflow-hidden ${i === 1 ? 'mt-10' : ''}`}
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={lot.image}
                        alt={`Lot ${lot.nom}`}
                        loading="lazy"
                        className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07080D] via-[#07080D]/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: lot.couleur }}>Lot {i + 1}</p>
                      <p className="mt-1 font-syne text-2xl sm:text-3xl font-black text-white">{lot.nom}</p>
                      <p className="mt-1 text-white/55 text-xs leading-snug">{lot.accroche}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
