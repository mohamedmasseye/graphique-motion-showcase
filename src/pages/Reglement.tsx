import { Fragment, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, ArrowRight } from 'lucide-react';
import Head from '@/components/Head';
import { REGLEMENT, type Bloc } from '@/data/reglement';
import { CONCOURS } from '@/data/concours';

/** Rend la syntaxe **gras** du texte du règlement. */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') ? <strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

function BlocView({ bloc }: { bloc: Bloc }) {
  if (typeof bloc === 'string') return <p className="text-[#B4B4B4] text-[15.5px] leading-[1.8]"><Rich text={bloc} /></p>;
  return (
    <ul className="space-y-3">
      {bloc.list.map((li, i) => (
        <li key={i} className="flex gap-3.5 text-[#B4B4B4] text-[15.5px] leading-[1.75]">
          <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0" />
          <span><Rich text={li} /></span>
        </li>
      ))}
    </ul>
  );
}

export default function Reglement() {
  const [actif, setActif] = useState(REGLEMENT[0].slug);

  // Article courant dans le sommaire
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActif(vis[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    REGLEMENT.forEach((a) => { const el = document.getElementById(a.slug); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <Head
        title="Règlement du jeu concours · Gagnez votre site web"
        description="Règlement complet du jeu concours « Gagnez votre site web » organisé par Graphique & Motion, du 30 novembre au 17 décembre 2026."
      />

      <section className="relative bg-black overflow-hidden print:bg-white">
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-brand-teal/[0.08] blur-[130px] print:hidden" />

        <div className="container mx-auto px-4 relative pt-10 md:pt-16 pb-24">
          {/* En-tête */}
          <div className="max-w-5xl mx-auto">
            <Link to={CONCOURS.path} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-brand-teal transition-colors print:hidden">
              <ArrowLeft size={15} /> Retour au concours
            </Link>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-10 pb-10 border-b border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-teal">Jeu concours · Graphique & Motion</p>
              <h1 className="mt-4 font-syne font-black tracking-tight text-white text-4xl sm:text-5xl md:text-6xl leading-[1]">
                Règlement du jeu concours
              </h1>
              <p className="mt-4 font-syne text-xl sm:text-2xl font-bold text-white/70">« Gagnez votre site web »</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="text-xs text-white/45 px-3 py-1.5 rounded-full border border-white/10">Du 30 novembre au 17 décembre 2026</span>
                <span className="text-xs text-white/45 px-3 py-1.5 rounded-full border border-white/10">Version du {CONCOURS.reglementVersion}</span>
                <button
                  onClick={() => window.print()}
                  className="ml-auto inline-flex items-center gap-2 text-xs font-semibold text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/15 hover:border-white/30 transition-colors print:hidden"
                >
                  <Printer size={14} /> Imprimer / PDF
                </button>
              </div>
            </motion.div>
          </div>

          {/* Corps */}
          <div className="max-w-5xl mx-auto mt-12 grid lg:grid-cols-[220px_1fr] gap-12">
            {/* Sommaire */}
            <nav className="hidden lg:block print:hidden">
              <div className="sticky top-36">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60 mb-4">Sommaire</p>
                <ol className="space-y-1 border-l border-white/10">
                  {REGLEMENT.map((a) => (
                    <li key={a.slug}>
                      <a
                        href={`#${a.slug}`}
                        className={`block -ml-px pl-4 py-1.5 text-[13px] border-l transition-colors ${
                          actif === a.slug ? 'border-brand-teal text-white font-semibold' : 'border-transparent text-white/45 hover:text-white/80'
                        }`}
                      >
                        <span className="tabular-nums text-white/55 mr-2">{String(a.n).padStart(2, '0')}</span>
                        {a.titre}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* Articles */}
            <div className="space-y-12">
              {REGLEMENT.map((a) => (
                <article key={a.slug} id={a.slug} className="scroll-mt-36">
                  <div className="flex items-baseline gap-4 mb-5">
                    <span className="font-syne font-black text-brand-teal/70 text-sm tabular-nums tracking-wider">Article {a.n}</span>
                    <span className="flex-1 h-px bg-white/[0.07]" />
                  </div>
                  <h2 className="font-syne text-2xl sm:text-[28px] font-black text-white tracking-tight mb-5">{a.titre}</h2>
                  <div className="space-y-4">
                    {a.blocs.map((b, i) => <BlocView key={i} bloc={b} />)}
                  </div>
                </article>
              ))}

              <p className="pt-6 border-t border-white/10 text-white/60 text-sm">Fait à Dakar, le {CONCOURS.reglementVersion}.</p>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                  <p className="text-white font-semibold">Une question sur le concours ?</p>
                  <p className="text-white/50 text-sm mt-1">Écrivez-nous à support@graphiquemotion.com ou en message privé sur Instagram.</p>
                </div>
                <Link to={CONCOURS.path} className="group shrink-0 inline-flex items-center gap-2 bg-brand-teal text-black font-bold py-3 px-6 rounded-full text-sm">
                  Voir le concours <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
