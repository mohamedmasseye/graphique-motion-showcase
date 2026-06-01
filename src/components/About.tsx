import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Zap, Shield, Clock, TrendingUp } from 'lucide-react';

/* ── Animated counter ────────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => `${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [inView, to, motionVal]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

const stats = [
  { value: 10, suffix: '+', label: "Ans d'expérience", color: '#00B2AA' },
  { value: 50, suffix: '+', label: 'Projets livrés', color: '#F5821F' },
  { value: 7, suffix: 'j', label: 'Délai moyen', color: '#378ADD' },
  { value: 100, suffix: '%', label: 'Clients satisfaits', color: '#7F77DD' },
];

const pillars = [
  {
    icon: Zap,
    title: 'Livraison rapide',
    desc: 'Votre site en ligne en 7 jours. Pas de délais interminables, pas de mauvaises surprises.',
    color: '#00B2AA',
    span: 'lg:col-span-2',
  },
  {
    icon: Shield,
    title: 'Qualité garantie',
    desc: 'Chaque projet est livré avec un support post-lancement inclus.',
    color: '#F5821F',
    span: 'lg:col-span-1',
  },
  {
    icon: TrendingUp,
    title: 'Orienté résultats',
    desc: 'On conçoit pour vendre. Chaque décision design sert votre conversion.',
    color: '#7F77DD',
    span: 'lg:col-span-1',
  },
  {
    icon: Clock,
    title: 'Disponibilité locale',
    desc: 'Disponibles 7j/7, on s\'adapte à votre marché, votre secteur et vos clients.',
    color: '#378ADD',
    span: 'lg:col-span-2',
  },
];

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
      {/* Atmospheric lighting */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-teal/6 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-orange/4 blur-[120px]" />
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(0,178,170,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,178,170,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="container mx-auto px-4">
        {/* Header asymétrique */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Qui sommes-nous
            </p>
            <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
              L'agence qui<br />
              <span className="text-brand-teal">concrétise</span><br />
              vos idées.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pb-2"
          >
            <p className="text-[#A0A0A0] text-lg leading-relaxed max-w-md">
              <strong className="text-white">GRAPHIQUE & MOTION</strong> est une agence digitale
              spécialisée en design et développement. Depuis plus de 10 ans, on accompagne les entrepreneurs et PME
              dans leur présence en ligne — du logo au site web, de l'app mobile à la stratégie de marque.
            </p>
            <p className="text-[#A0A0A0] mt-4 text-base leading-relaxed max-w-md">
              Notre mission : vous donner les outils digitaux des grandes entreprises,
              au prix accessible pour votre business.
            </p>
          </motion.div>
        </div>

        {/* Stats avec compteurs */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-[#070D1A] px-6 py-8 flex flex-col items-center text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span
                className="font-syne text-4xl md:text-5xl font-black leading-none mb-2"
                style={{ color: s.color }}
              >
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[#A0A0A0] text-sm">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bento grid pillars */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={cardVariant}
              className={`relative bg-white/[0.05] border border-white/10 rounded-2xl p-8 group overflow-hidden ${p.span}`}
              style={{ borderLeftColor: p.color, borderLeftWidth: 3 }}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.055)',
                y: -4,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: p.color + '18' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <p.icon size={20} style={{ color: p.color }} />
              </motion.div>

              <h3 className="font-syne text-xl font-bold text-white mb-2">{p.title}</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">{p.desc}</p>

              {/* Animated corner glow on hover */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${p.color}20, transparent 70%)` }}
                transition={{ duration: 0.4 }}
              />

              {/* Bottom line reveal */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                style={{ background: p.color }}
                initial={{ width: 0 }}
                whileInView={{ width: '30%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
