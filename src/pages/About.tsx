import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeUp, slideInLeft, viewportOnce } from '@/lib/animations';
import { SITE } from '@/data/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const ProfilePhoto = '/lovable-uploads/mohamed-masseye-diop.png';

const VALUES = [
  { title: 'Excellence', desc: 'Chaque pixel compte. On ne livre jamais un projet dont on n\'est pas fiers.', color: '#00B2AA' },
  { title: 'Proximité', desc: 'On parle directement avec vous. Pas d\'intermédiaires, pas de jargon.', color: '#F5821F' },
  { title: 'Innovation', desc: 'On explore les technologies émergentes pour vous garder devant.', color: '#378ADD' },
  { title: 'Résultats', desc: 'Le design seul ne suffit pas. On crée pour convertir, vendre, croître.', color: '#7F77DD' },
];

export default function About() {
  return (
    <>
      <Head
        title={undefined}
        description={undefined}
      />

      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
        <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-teal/5 blur-[120px]" />

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/10 blur-[80px] rounded-full scale-[1.4]" />
                <div className="relative w-[300px] h-[380px] sm:w-[360px] sm:h-[440px] md:w-[400px] md:h-[500px] rounded-3xl overflow-hidden border-2 border-white/10" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                  <img src={ProfilePhoto} alt={SITE.founder} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="text-brand-teal text-xs font-semibold uppercase tracking-[0.2em] mb-1">Fondateur</p>
                    <h3 className="font-syne text-xl sm:text-2xl font-black text-white">{SITE.founder}</h3>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">À propos</p>
              <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
                Le studio qui combine<br />
                <span className="text-brand-teal">créativité</span> et{' '}
                <span className="text-brand-orange">technologie</span>
              </h1>
              <p className="text-[#A0A0A0] text-base sm:text-lg leading-relaxed mb-4 max-w-lg">
                <strong className="text-white">Fondateur de {SITE.name}</strong>, je suis passionné par la création digitale sous toutes ses formes. Depuis plus de 10 ans, je mets ma créativité et mon expertise technique au service de clients variés.
              </p>
              <p className="text-[#A0A0A0] text-base leading-relaxed mb-8 max-w-lg">
                Mon approche allie <strong className="text-white">design</strong>,{' '}
                <strong className="text-white">technologie</strong> et{' '}
                <strong className="text-white">stratégie business</strong> pour donner vie à des projets digitaux qui se démarquent.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/a-propos/mohamed-diop"
                  className="group inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-3 px-6 rounded-full text-sm hover:bg-brand-teal/85 transition-all"
                >
                  Découvrir le fondateur <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-3 px-6 rounded-full text-sm hover:bg-white/10 transition-all"
                >
                  Nos réalisations
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative py-24 overflow-hidden" style={{ background: '#050509' }}>
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="Valeurs" title="Ce qui nous " highlight="anime" />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 hover:bg-white/[0.06] transition-all"
                style={{ borderTopColor: v.color, borderTopWidth: 3 }}
              >
                <h3 className="font-syne text-xl font-bold text-white mb-2">{v.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
