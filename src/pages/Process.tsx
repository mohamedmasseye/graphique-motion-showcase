import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { PROCESS_STEPS } from '@/data/content';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const STEP_COLORS = ['#00B2AA', '#378ADD', '#F5821F', '#7F77DD', '#00B2AA', '#378ADD'];

export default function Process() {
  return (
    <>
      <Head title="Notre Processus" description="De l'idée au lancement — notre méthode de travail en 6 étapes pour transformer vos projets en réalités digitales." />

      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-teal/5 blur-[120px]" />

        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Processus</p>
            <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              De l'idée au <span className="text-brand-teal">lancement</span>
            </h1>
            <p className="text-[#A0A0A0] text-lg leading-relaxed max-w-xl">
              Notre méthode en 6 étapes pour transformer vos projets en réalités digitales. Chaque étape est pensée pour minimiser les risques et maximiser les résultats.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="relative py-24 overflow-hidden" style={{ background: '#050509' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="relative flex items-start gap-8 mb-16 last:mb-0"
              >
                {/* Number */}
                <div className="shrink-0">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-syne text-2xl font-black"
                    style={{ background: STEP_COLORS[i] + '12', color: STEP_COLORS[i] }}
                  >
                    {step.number}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] mb-1" style={{ color: STEP_COLORS[i] }}>
                    {step.titleEn}
                  </p>
                  <h3 className="font-syne text-2xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>

                {/* Connecting line */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div
                    className="absolute left-8 top-[68px] w-px h-[calc(100%-68px)]"
                    style={{ background: `linear-gradient(180deg, ${STEP_COLORS[i]}40, ${STEP_COLORS[i + 1]}20)` }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Prêt à démarrer ?"
        description="Suivez notre processus pour donner vie à votre projet."
        primaryLabel="Démarrer un projet"
      />
    </>
  );
}
