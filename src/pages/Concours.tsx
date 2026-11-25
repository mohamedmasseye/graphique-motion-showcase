import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Globe, Server, ShieldCheck, Instagram, Sparkles, FileText, Radio } from 'lucide-react';
import Head from '@/components/Head';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { CONCOURS, LOTS, INCLUS, ETAPES, CALENDRIER, FAQ, getPhase, useNow } from '@/data/concours';
import { Countdown, BrowserFrame, phaseLabel, MENTION_META } from '@/components/concours/ConcoursUI';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const INCLUS_ICONS = [Globe, Server, ShieldCheck];
const EASE = [0.22, 1, 0.36, 1] as const;

function Eyebrow({ children, color = '#00B2AA' }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] mb-4" style={{ color }}>
      {children}
    </p>
  );
}

/* ═══ Hero ═════════════════════════════════════════════════════════ */
function Hero() {
  const now = useNow(30000);
  const phase = getPhase(now);
  const { badge, court } = phaseLabel(phase);
  const ouvert = phase === 'ouvert';

  return (
    <section className="relative overflow-hidden bg-black">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '36px 36px', maskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 75%)' }}
      />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[520px] rounded-full bg-brand-teal/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-40 -right-40 w-[420px] h-[420px] rounded-full bg-brand-orange/10 blur-[130px]" />

      <div className="container mx-auto px-4 relative z-10 pt-14 md:pt-20 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="mb-8 flex justify-center">
            <span className="inline-flex items-center gap-2.5 pl-2 pr-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs">
              <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-[0.14em] text-[10px] ${ouvert ? 'bg-brand-teal text-black' : 'bg-brand-orange/15 text-brand-orange'}`}>
                {badge}
              </span>
              <span className="text-white/70 font-medium">Jeu concours · {court}</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="font-syne font-black tracking-tight leading-[0.95] text-[clamp(2.8rem,8vw,6.5rem)] text-white"
          >
            Gagnez votre
            <br />
            <span style={{ background: 'linear-gradient(90deg, #00B2AA 0%, #378ADD 55%, #7F77DD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              site web.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            className="mt-8 text-[#A0A0A0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            J’offre <span className="text-white font-semibold">deux sites web</span> à deux entrepreneurs. Un site neuf pour celui qui n’en a pas encore, une refonte complète pour celui dont le site ne le sert plus. Domaine, hébergement et maintenance compris pendant un an.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease: EASE }} className="mt-10 flex justify-center">
            <Countdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.a
              href={CONCOURS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 bg-brand-teal text-black font-bold py-4 px-8 rounded-full text-sm"
              whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(0,178,170,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Instagram size={17} />
              {ouvert ? 'Participer sur Instagram' : 'Suivre @graphiquemotion'}
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <Link
              to={CONCOURS.reglementPath}
              className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-4 px-7 rounded-full text-sm hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <FileText size={15} />
              Lire le règlement
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Les deux lots ═══════════════════════════════════════════════ */
function Lots() {
  return (
    <section className="relative py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #000 0%, #06070E 50%, #000 100%)' }}>
      <div className="container mx-auto px-4">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center mb-14">
          <Eyebrow>Les lots</Eyebrow>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Deux sites. Deux gagnants.</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {LOTS.map((lot, i) => (
            <motion.article
              key={lot.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              className="relative rounded-[28px] p-px"
              style={{ background: `linear-gradient(160deg, ${lot.couleur}66 0%, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.03) 100%)` }}
            >
              <div className="relative h-full rounded-[27px] bg-[#0A0A0F] p-7 sm:p-9 overflow-hidden">
                <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[100px]" style={{ background: lot.couleur + '22' }} />
                <span className="pointer-events-none absolute top-4 right-6 font-syne font-black text-[7rem] leading-none text-white/[0.035] select-none">{lot.numero}</span>

                <div className="relative">
                  <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full" style={{ color: lot.couleur, background: lot.couleur + '14', border: `1px solid ${lot.couleur}33` }}>
                    Lot {lot.numero.replace('0', '')}
                  </span>
                  <h3 className="mt-5 font-syne text-4xl sm:text-5xl font-black text-white tracking-tight">{lot.nom}</h3>
                  <p className="mt-2 text-white/50 text-sm">{lot.pour}</p>
                  <p className="mt-5 text-lg text-white font-semibold">{lot.accroche}</p>

                  <ul className="mt-5 space-y-3">
                    {lot.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[#B5B5B5] text-[15px] leading-relaxed">
                        <span className="mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: lot.couleur + '1F' }}>
                          <Check size={12} style={{ color: lot.couleur }} strokeWidth={3} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    {lot.images.length > 1 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {lot.images.map((im) => (
                          <div key={im.src}>
                            <BrowserFrame src={im.src} alt={`Exemple de site ${im.label} réalisé par Graphique & Motion`} className="rounded-xl" />
                            <p className="mt-2 text-center text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.06em] sm:tracking-[0.14em] text-white/45 whitespace-nowrap">{im.label}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <BrowserFrame src={lot.images[0].src} alt="Refonte réalisée par Graphique & Motion pour BlackieFit" label={lot.images[0].label} />
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/[0.07] flex items-center justify-between gap-4">
                    <span className="text-white/45 text-sm">Pour tenter ce lot, commentez</span>
                    <span className="font-syne font-black tracking-[0.12em] text-sm px-4 py-2 rounded-lg" style={{ color: lot.couleur, background: lot.couleur + '12', border: `1px dashed ${lot.couleur}55` }}>
                      {lot.motCle}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Inclus dans les deux lots */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="max-w-6xl mx-auto mt-8">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="md:w-56 shrink-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">Dans les deux cas</p>
              <p className="mt-2 font-syne text-2xl font-black text-white leading-tight">Tout est compris pendant un an.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3 flex-1">
              {INCLUS.map((it, i) => {
                const Icon = INCLUS_ICONS[i];
                return (
                  <div key={it.titre} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-black/40 px-5 py-4">
                    <span className="w-10 h-10 rounded-xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                      <Icon size={18} className="text-brand-teal" />
                    </span>
                    <div>
                      <p className="text-white font-semibold text-sm">{it.titre}</p>
                      <p className="text-white/45 text-xs mt-0.5">{it.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ Comment participer ══════════════════════════════════════════ */
function Participer() {
  return (
    <section className="relative py-20 md:py-28 bg-black overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-brand-blue/[0.07] blur-[130px]" />
      <div className="container mx-auto px-4 relative">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center mb-14">
          <Eyebrow>Comment participer</Eyebrow>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Trois gestes, sur Instagram.</h2>
          <p className="mt-4 text-[#A0A0A0] max-w-xl mx-auto">Seules les participations sur Instagram sont prises en compte. Une participation par personne.</p>
        </motion.div>

        <motion.ol variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {ETAPES.map((e) => (
            <motion.li key={e.n} variants={staggerItem} className="relative rounded-[24px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-7">
              <span className="font-syne font-black text-6xl leading-none" style={{ background: 'linear-gradient(180deg, #00B2AA, rgba(0,178,170,0.15))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {e.n}
              </span>
              <h3 className="mt-5 font-syne text-xl font-bold text-white">{e.titre}</h3>
              <p className="mt-2 text-[#A0A0A0] text-[15px] leading-relaxed">{e.texte}</p>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="max-w-6xl mx-auto mt-5">
          <div className="relative rounded-[24px] p-px" style={{ background: 'linear-gradient(90deg, rgba(245,130,31,0.55), rgba(245,130,31,0.08))' }}>
            <div className="rounded-[23px] bg-[#0B0907] px-7 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <span className="shrink-0 inline-flex items-center gap-2 font-syne font-black text-brand-orange text-lg">
                <Sparkles size={18} /> Bonus ×2
              </span>
              <p className="text-white/75 text-[15px] leading-relaxed">
                Partagez la publication du concours en story Instagram en identifiant <span className="text-white font-semibold">@graphiquemotion</span> : votre participation compte double au tirage. Facultatif.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ Calendrier ══════════════════════════════════════════════════ */
function Calendrier() {
  return (
    <section className="relative py-20 md:py-28" style={{ background: 'linear-gradient(180deg, #000 0%, #05060F 100%)' }}>
      <div className="container mx-auto px-4">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center mb-14">
          <Eyebrow>Calendrier</Eyebrow>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Les dates à retenir.</h2>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="hidden md:block absolute top-[42px] left-[12%] right-[12%] h-px bg-gradient-to-r from-brand-teal/0 via-brand-teal/40 to-brand-orange/0" />
          <motion.ol variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {CALENDRIER.map((c, i) => (
              <motion.li key={c.titre} variants={staggerItem} className="relative text-center">
                <div className="relative mx-auto w-[84px] h-[84px] rounded-full border border-white/10 bg-[#0A0A0F] flex flex-col items-center justify-center">
                  {i === 2 && <span className="absolute -top-1 -right-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-[#FF3B5C] text-white px-1.5 py-0.5 rounded-full"><Radio size={9} />Live</span>}
                  <span className="font-syne font-black text-white text-lg leading-none">{c.date.split(' ')[0]}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/45 mt-1">{c.date.split(' ')[1]}</span>
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-teal">{c.heure}</p>
                <h3 className="mt-1.5 font-syne text-lg font-bold text-white">{c.titre}</h3>
                <p className="mt-1.5 text-[#9A9A9A] text-sm leading-relaxed max-w-[240px] mx-auto">{c.texte}</p>
              </motion.li>
            ))}
          </motion.ol>
          <p className="mt-10 text-center text-white/60 text-xs">Heure de Dakar (GMT).</p>
        </div>
      </div>
    </section>
  );
}

/* ═══ FAQ ═════════════════════════════════════════════════════════ */
function Questions() {
  return (
    <section className="relative py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center mb-12">
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="font-syne text-3xl sm:text-4xl font-black text-white tracking-tight">Tout ce qu’il faut savoir.</h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`} className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 data-[state=open]:border-brand-teal/30 data-[state=open]:bg-brand-teal/[0.03] transition-colors">
              <AccordionTrigger className="text-left font-semibold text-white hover:no-underline py-5 text-[15px]">{f.q}</AccordionTrigger>
              <AccordionContent className="text-[#A0A0A0] text-[15px] leading-relaxed pb-5">{f.r}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ═══ Appel final ═════════════════════════════════════════════════ */
function Final() {
  const phase = getPhase(useNow(30000));
  return (
    <section className="relative py-20 md:py-28 bg-black overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative max-w-5xl mx-auto rounded-[32px] p-px" style={{ background: 'linear-gradient(135deg, rgba(0,178,170,0.6), rgba(55,138,221,0.2) 40%, rgba(245,130,31,0.5))' }}>
          <div className="relative rounded-[31px] bg-[#07080D] px-6 py-14 sm:px-14 text-center overflow-hidden">
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-teal/10 blur-[110px]" />
            <h2 className="relative font-syne text-3xl sm:text-5xl font-black text-white tracking-tight">
              {phase === 'avant' ? 'Rendez-vous le 30 novembre à 18h.' : phase === 'ouvert' ? 'À vous de jouer.' : 'Merci pour votre participation.'}
            </h2>
            <p className="relative mt-4 text-[#A0A0A0] max-w-xl mx-auto">
              {phase === 'avant'
                ? 'Abonnez-vous dès maintenant à @graphiquemotion pour être prévenu de l’ouverture.'
                : phase === 'ouvert'
                ? 'Participations ouvertes jusqu’au 17 décembre à 23h59, sur Instagram.'
                : 'Le tirage a lieu en direct sur TikTok @graphiquemotion. Les gagnants sont annoncés sur Instagram.'}
            </p>
            <div className="relative mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={CONCOURS.instagram} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2.5 bg-white text-black font-bold py-4 px-8 rounded-full text-sm hover:bg-white/90 transition-colors">
                <Instagram size={17} />
                {phase === 'ouvert' ? 'Participer sur Instagram' : 'Suivre sur Instagram'}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href={CONCOURS.tiktok} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/15 text-white font-semibold py-4 px-7 rounded-full text-sm hover:bg-white/5 transition-colors">
                Suivre le tirage sur TikTok
              </a>
            </div>
            <p className="relative mt-10 text-white/60 text-xs leading-relaxed max-w-2xl mx-auto">
              Participation gratuite, sans obligation d’achat. Une participation par personne. {MENTION_META}{' '}
              <Link to={CONCOURS.reglementPath} className="underline underline-offset-2 hover:text-white/70">Règlement complet</Link>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Concours() {
  return (
    <>
      <Head
        title="Jeu concours · Gagnez votre site web"
        description="Graphique & Motion offre deux sites web à deux entrepreneurs : un site neuf (e-commerce, vitrine ou portfolio) et une refonte complète. Domaine, hébergement et maintenance compris pendant un an. Du 30 novembre au 17 décembre 2026 sur Instagram."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'Jeu concours « Gagnez votre site web »',
          startDate: CONCOURS.start.toISOString(),
          endDate: CONCOURS.end.toISOString(),
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: { '@type': 'VirtualLocation', url: CONCOURS.instagram },
          organizer: { '@type': 'Organization', name: 'Graphique & Motion', url: 'https://graphiquemotion.com' },
          isAccessibleForFree: true,
        }}
      />
      <Hero />
      <Lots />
      <Participer />
      <Calendrier />
      <Questions />
      <Final />
    </>
  );
}
