import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const chips = ['Sites Web', 'Apps Mobiles', 'Branding', 'Motion Design'];

const titleWords = [
  { text: 'Votre', color: 'text-white' },
  { text: 'présence', color: 'text-white' },
  { text: 'digitale,', gradient: true },
  { text: 'livrée', color: 'text-white' },
  { text: 'en', color: 'text-white' },
  { text: '7 jours.', color: 'text-brand-orange' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.75 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 1 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Browser + Phone mockup ─────────────────────────────────────── */
function HeroMockup() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient glow behind */}
      <div className="absolute inset-0 bg-brand-teal/8 blur-[100px] rounded-full scale-[1.6] pointer-events-none" />
      <div className="absolute inset-0 bg-brand-orange/5 blur-[80px] rounded-full scale-[1.2] pointer-events-none translate-x-12" />

      {/* ── Browser mockup ── */}
      <motion.div
        className="relative w-full max-w-[420px] bg-[#0C1018] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 50, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: 1200, transformStyle: 'preserve-3d', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#13181F] border-b border-white/[0.07]">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex-1 bg-white/[0.06] rounded-full h-5 flex items-center px-3 gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-teal/60" />
            <span className="text-white/30 text-[9px] font-mono tracking-wide">graphiquemotion.com</span>
          </div>
        </div>

        {/* Page content simulation */}
        <div className="p-5">
          {/* Nav */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded bg-brand-teal/80" />
              <div className="w-20 h-2.5 bg-brand-teal/40 rounded-full" />
            </div>
            <div className="flex gap-2.5">
              {[40, 32, 24].map((w, i) => (
                <div key={i} className="h-1.5 bg-white/[0.12] rounded-full" style={{ width: w }} />
              ))}
              <div className="w-16 h-5 bg-brand-teal/30 rounded-full" />
            </div>
          </div>

          {/* Hero zone */}
          <div
            className="rounded-xl p-5 mb-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,178,170,0.08) 0%, rgba(55,138,221,0.05) 100%)', border: '1px solid rgba(0,178,170,0.12)' }}
          >
            <div className="space-y-2 mb-4">
              <div className="w-4/5 h-4 bg-white/25 rounded-full" />
              <div className="w-3/5 h-4 bg-brand-teal/50 rounded-full" />
              <div className="w-2/3 h-2.5 bg-white/[0.1] rounded-full mt-3" />
              <div className="w-1/2 h-2.5 bg-white/[0.07] rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-7 bg-brand-teal/70 rounded-full" />
              <div className="w-20 h-7 bg-white/[0.08] border border-white/10 rounded-full" />
            </div>
            {/* Decorative dot grid */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,178,170,0.25) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { color: '#00B2AA', val: '10+', label: 'Années' },
              { color: '#F5821F', val: '50+', label: 'Projets' },
              { color: '#378ADD', val: '7j', label: 'Livraison' },
            ].map(({ color, val, label }) => (
              <div
                key={val}
                className="rounded-xl p-3 flex flex-col"
                style={{ background: color + '12', border: `1px solid ${color}25` }}
              >
                <span className="text-xs font-black font-montserrat" style={{ color }}>{val}</span>
                <span className="text-[9px] text-white/30 mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Service cards row */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { color: '#00B2AA', icon: '🌐', title: 'Sites Web' },
              { color: '#F5821F', icon: '📱', title: 'Apps Mobiles' },
            ].map(({ color, icon, title }) => (
              <div
                key={title}
                className="rounded-xl p-3 flex items-center gap-2"
                style={{ background: color + '0D', border: `1px solid ${color}20` }}
              >
                <span className="text-sm">{icon}</span>
                <span className="text-[9px] font-semibold text-white/60">{title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="px-5 py-2.5 bg-[#13181F] border-t border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#28C840]" />
            <span className="text-[9px] text-white/30">En ligne</span>
          </div>
          <span className="text-[9px] text-white/20">PageSpeed 98/100</span>
        </div>
      </motion.div>

      {/* ── Floating phone mockup ── */}
      <motion.div
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-[72px] bg-[#0C1018] border border-white/10 rounded-[18px] overflow-hidden shadow-xl hidden xl:block"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0, y: ['-52%', '-58%', '-52%'] }}
        transition={{
          opacity: { delay: 0.9, duration: 0.6 },
          x: { delay: 0.9, duration: 0.6 },
          y: { delay: 1.5, duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        {/* Phone status bar */}
        <div className="h-3 bg-[#13181F] flex items-center justify-center">
          <div className="w-6 h-1 bg-white/20 rounded-full" />
        </div>
        {/* Phone screen */}
        <div className="p-2 space-y-1.5">
          <div className="w-full h-10 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(0,178,170,0.2), rgba(55,138,221,0.1))' }} />
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full h-2 bg-white/10 rounded-full" style={{ width: `${80 - i * 10}%` }} />
          ))}
          <div className="w-full h-5 bg-brand-teal/30 rounded-lg mt-2" />
        </div>
        {/* Home indicator */}
        <div className="h-3 bg-[#13181F] flex items-center justify-center">
          <div className="w-5 h-1 bg-white/20 rounded-full" />
        </div>
      </motion.div>

      {/* ── Floating badge: Livraison ── */}
      <motion.div
        className="absolute -top-5 right-8 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border backdrop-blur-md"
        style={{
          background: 'rgba(0,178,170,0.1)',
          borderColor: 'rgba(0,178,170,0.3)',
          boxShadow: '0 8px 32px rgba(0,178,170,0.15)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-brand-teal"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <span className="text-white text-xs font-semibold">Livré en 7 jours</span>
      </motion.div>

      {/* ── Floating badge: Projets ── */}
      <motion.div
        className="absolute -bottom-5 left-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl border backdrop-blur-md"
        style={{
          background: 'rgba(245,130,31,0.09)',
          borderColor: 'rgba(245,130,31,0.28)',
          boxShadow: '0 8px 32px rgba(245,130,31,0.12)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex -space-x-1.5">
          {['#00B2AA', '#F5821F', '#378ADD'].map((c, i) => (
            <div key={i} className="w-5 h-5 rounded-full border border-black/60 flex items-center justify-center text-[7px] font-bold text-white" style={{ background: c }}>
              {['MD', 'AB', 'CK'][i]}
            </div>
          ))}
        </div>
        <div>
          <div className="text-white text-xs font-bold">50+ projets</div>
          <div className="text-white/40 text-[10px]">Clients satisfaits</div>
        </div>
      </motion.div>

      {/* ── Floating badge: Note ── */}
      <motion.div
        className="absolute top-1/3 -left-12 flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md hidden xl:flex"
        style={{
          background: 'rgba(127,119,221,0.1)',
          borderColor: 'rgba(127,119,221,0.25)',
          boxShadow: '0 8px 24px rgba(127,119,221,0.12)',
        }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
      >
        <CheckCircle size={13} className="text-[#7F77DD]" />
        <div>
          <div className="text-white text-[10px] font-bold">Qualité garantie</div>
          <div className="flex gap-0.5 mt-0.5">
            {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= 5 ? '#F5821F' : 'rgba(255,255,255,0.15)' }} />)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const glowY1 = useTransform(scrollY, [0, 600], [0, 80]);
  const glowY2 = useTransform(scrollY, [0, 600], [0, -60]);
  const contentY = useTransform(scrollY, [0, 600], [0, 50]);
  const smoothContentY = useSpring(contentY, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,178,170,0.18) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,178,170,0.07)_0%,transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,130,31,0.06)_0%,transparent_50%)]" />

      {/* Parallax teal glow */}
      <motion.div
        style={{ y: glowY1 }}
        className="pointer-events-none absolute -left-40 top-1/4 w-[600px] h-[600px] rounded-full bg-brand-teal/8 blur-[130px]"
      >
        <motion.div
          className="w-full h-full rounded-full bg-brand-teal/8"
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Parallax orange glow */}
      <motion.div
        style={{ y: glowY2 }}
        className="pointer-events-none absolute -right-40 bottom-1/3 w-[500px] h-[500px] rounded-full bg-brand-orange/6 blur-[130px]"
      >
        <motion.div
          className="w-full h-full rounded-full bg-brand-orange/6"
          animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </motion.div>

      <motion.div
        style={{ y: smoothContentY }}
        className="container mx-auto px-4 relative z-10 pt-16 pb-24"
      >
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          {/* ── Left column ── */}
          <div>
            {/* Headline — mot par mot */}
            <motion.div
              className="mb-8 perspective-[1000px]"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="font-syne text-[clamp(2.6rem,6vw,5rem)] font-black leading-[1.08] tracking-tight">
                {titleWords.map((w, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants}
                    className={`inline-block mr-[0.25em] ${w.gradient ? '' : w.color}`}
                    style={
                      w.gradient
                        ? {
                            background: 'linear-gradient(90deg, #00B2AA 0%, #378ADD 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }
                        : undefined
                    }
                  >
                    {w.text}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-[#A0A0A0] text-lg md:text-xl max-w-lg mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
            >
              On crée des sites qui vendent, des apps qui convertissent.
              <br />
              <span className="text-white/50 text-base">Livré en 7 jours. Sans jargon, sans mauvaises surprises.</span>
            </motion.p>

            {/* Service chips */}
            <div className="flex flex-wrap gap-2 mb-10">
              {chips.map((chip, i) => (
                <motion.span
                  key={chip}
                  custom={i}
                  variants={chipVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-xs font-semibold px-4 py-2 rounded-full border border-brand-teal/30 text-brand-teal bg-brand-teal/8 cursor-default"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,178,170,0.15)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {chip}
                </motion.span>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.88, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.a
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 bg-brand-teal text-white font-bold py-4 px-8 rounded-full text-sm cursor-pointer"
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(0,178,170,0.85)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Voir nos offres
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </motion.a>

              <motion.a
                href="#contact"
                className="inline-flex items-center justify-center bg-white/5 border border-white/15 text-white font-semibold py-4 px-8 rounded-full text-sm cursor-pointer"
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                Nous contacter
              </motion.a>
            </motion.div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap gap-10 md:gap-16">
              {[
                { value: '10+', label: "Ans d'expérience", color: '#00B2AA' },
                { value: '50+', label: 'Projets livrés', color: '#F5821F' },
                { value: '7j', label: 'Délai de livraison', color: '#378ADD' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col"
                >
                  <motion.span
                    className="font-syne text-4xl md:text-5xl font-black leading-none"
                    style={{ color: s.color }}
                    whileInView={{ opacity: [0, 1] }}
                    viewport={{ once: true }}
                  >
                    {s.value}
                  </motion.span>
                  <span className="text-[#A0A0A0] text-sm mt-1.5">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right column: Mockup ── */}
          <div className="hidden lg:block relative py-12 px-8">
            <HeroMockup />
          </div>
        </div>
      </motion.div>

      {/* Badge circulaire tournant */}
      <motion.div
        className="absolute bottom-10 right-6 md:bottom-14 md:right-14 w-28 h-28 md:w-36 md:h-36 z-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.svg
          viewBox="0 0 120 120"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            <path
              id="circle-path"
              d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
            />
          </defs>
          <text
            style={{ fontSize: '9.5px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, letterSpacing: '0.22em', fill: 'rgba(255,255,255,0.55)' }}
          >
            <textPath href="#circle-path">
              GRAPHIQUE&MOTION • PREMIUM • DIGITAL •
            </textPath>
          </text>
        </motion.svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-teal/15 border border-brand-teal/40 flex items-center justify-center backdrop-blur-sm"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-brand-teal" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
