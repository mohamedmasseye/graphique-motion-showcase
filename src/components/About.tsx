import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { Zap, Shield, Clock, TrendingUp, Palette, Globe, PenTool, Eye, Package, Type, Film, Image } from 'lucide-react';

const ProfilePhoto = '/lovable-uploads/mohamed-masseye-diop.png';

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
const expertise = [
  { icon: Palette, title: 'Création de Logo', desc: 'Identités visuelles distinctives et mémorables qui représentent parfaitement votre marque.', color: '#00B2AA' },
  { icon: Globe, title: 'Design Web', desc: 'Sites web modernes, responsifs et optimisés pour une expérience utilisateur exceptionnelle.', color: '#378ADD' },
  { icon: Image, title: 'Supports Imprimés', desc: 'Cartes de visite, flyers, affiches et tous types de supports imprimés de qualité professionnelle.', color: '#F5821F' },
  { icon: PenTool, title: 'Identité Visuelle', desc: "Développement complet de l'identité de votre marque, de la couleur à la typographie.", color: '#7F77DD' },
  { icon: Package, title: 'Packaging', desc: "Design d'emballages créatifs qui attirent l'attention et augmentent la valeur perçue.", color: '#00B2AA' },
  { icon: Type, title: 'Typographie', desc: 'Sélection et création de typographies personnalisées pour renforcer votre message.', color: '#378ADD' },
  { icon: Film, title: 'Vidéos Institutionnelles', desc: 'Montages vidéo professionnels pour présenter votre entreprise ou vos produits.', color: '#F5821F' },
  { icon: Eye, title: 'Retouche Photo', desc: "Traitement d'image de haute qualité pour sublimer vos visuels et photos.", color: '#7F77DD' },
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
        {/* ═══ SECTION 1 — PERSONAL HERO (Photo + Bio) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-16 sm:mb-24">
          {/* Left — Photo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Ambient glow behind photo */}
              <div className="absolute inset-0 bg-brand-teal/10 blur-[60px] rounded-full scale-[1.3] pointer-events-none" />
              <div className="absolute inset-0 bg-brand-orange/5 blur-[40px] rounded-full scale-[1.1] pointer-events-none translate-x-6" />

              {/* Photo frame */}
              <motion.div
                className="relative w-[280px] h-[340px] md:w-[320px] md:h-[400px] rounded-3xl overflow-hidden border-2 border-white/10"
                style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                <img
                  src={ProfilePhoto}
                  alt="Mohamed Masseye DIOP"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <p className="text-brand-teal text-xs font-semibold uppercase tracking-[0.2em] mb-1">Fondateur</p>
                  <h3 className="font-syne text-base sm:text-xl font-black text-white leading-tight">Mohamed Masseye<br/>DIOP</h3>
                </div>
              </motion.div>

              {/* Floating badge — Year */}
              <motion.div
                className="absolute -top-3 -right-3 md:-top-4 md:-right-4 flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-md"
                style={{
                  background: 'rgba(0,178,170,0.1)',
                  borderColor: 'rgba(0,178,170,0.3)',
                  boxShadow: '0 8px 32px rgba(0,178,170,0.15)',
                }}
                initial={{ opacity: 0, y: -15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-brand-teal"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="text-white text-xs font-semibold">Depuis 2014</span>
              </motion.div>

              {/* Floating badge — Passion */}
              <motion.div
                className="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 flex items-center gap-2 px-3.5 py-2 rounded-xl border backdrop-blur-md"
                style={{
                  background: 'rgba(245,130,31,0.09)',
                  borderColor: 'rgba(245,130,31,0.28)',
                  boxShadow: '0 8px 32px rgba(245,130,31,0.12)',
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.65, duration: 0.5 }}
              >
                <span className="text-sm">🎨</span>
                <span className="text-white text-xs font-semibold">Passionné du design</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Bio text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              À propos
            </p>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              La passion du<br />
              <span className="text-brand-teal">design visuel</span><br />
              depuis 2014.
            </h2>

            <p className="text-[#A0A0A0] text-base sm:text-lg leading-relaxed mb-4">
              <strong className="text-white">Fondateur de GRAPHIQUE&MOTION</strong>, je suis passionné par la
              création visuelle sous toutes ses formes. Depuis plus de 10 ans, je mets ma créativité et mon expertise
              technique au service de clients variés, des startups aux grandes entreprises.
            </p>
            <p className="text-[#A0A0A0] text-base leading-relaxed mb-8">
              Mon approche allie <strong className="text-white">créativité</strong>,{' '}
              <strong className="text-white">stratégie</strong> et{' '}
              <strong className="text-white">précision technique</strong> pour donner vie à des projets visuels
              qui se démarquent et atteignent leurs objectifs.
            </p>

            {/* Quick expertise pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {[
                { label: 'Design Graphique', color: '#00B2AA' },
                { label: 'Design Web', color: '#378ADD' },
                { label: 'Identité Visuelle', color: '#F5821F' },
                { label: "10+ ans d'expérience", color: '#7F77DD' },
              ].map((pill) => (
                <motion.span
                  key={pill.label}
                  className="text-xs font-semibold px-4 py-2 rounded-full border cursor-default"
                  style={{ borderColor: pill.color + '40', color: pill.color, background: pill.color + '0D' }}
                  whileHover={{ scale: 1.05, backgroundColor: pill.color + '1A' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {pill.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ═══ SECTION 2 — STATS ═══ */}
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
              className="bg-[#070D1A] px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span
                className="font-syne text-3xl sm:text-4xl md:text-5xl font-black leading-none mb-2"
                style={{ color: s.color }}
              >
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[#A0A0A0] text-sm">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ SECTION 3 — SERVICES / EXPERTISE ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Mes Expertises</p>
          <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight">
            Une gamme complète de <span className="text-brand-orange">services créatifs</span>.
          </h2>
          <p className="mt-4 text-[#A0A0A0] text-lg max-w-2xl">
            Pour répondre à tous vos besoins en communication visuelle.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {expertise.map((e) => (
            <motion.div
              key={e.title}
              variants={cardVariant}
              className="relative bg-white/[0.05] border border-white/10 rounded-2xl p-4 sm:p-6 group overflow-hidden"
              style={{ borderTopColor: e.color, borderTopWidth: 2 }}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.055)',
                y: -4,
                transition: { duration: 0.25, ease: 'easeOut' },
              }}
            >
              {/* Icon */}
              <motion.div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: e.color + '18' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              >
                <e.icon size={18} style={{ color: e.color }} />
              </motion.div>

              <h3 className="font-syne text-base font-bold text-white mb-2">{e.title}</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">{e.desc}</p>

              {/* Animated corner glow on hover */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle, ${e.color}20, transparent 70%)` }}
                transition={{ duration: 0.4 }}
              />

              {/* Bottom line reveal */}
              <motion.div
                className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                style={{ background: e.color }}
                initial={{ width: 0 }}
                whileInView={{ width: '30%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ SECTION 4 — PILARS / WHY US ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Pourquoi nous</p>
          <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[0.95] tracking-tight">
            Ce qui nous <span className="text-brand-teal">distingue</span>.
          </h2>
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

        {/* ═══ SECTION 5 — CTA ═══ */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#A0A0A0] mb-4 text-sm">Prêt à donner vie à votre projet ?</p>
          <a
            href="#contact"
            className="inline-block bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-200 text-sm cursor-pointer"
          >
            Discutons de votre projet
          </a>
        </motion.div>

      </div>
    </section>
  );
}
