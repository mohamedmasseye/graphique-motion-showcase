import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

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

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // useScroll sans target pour éviter le warning "non-static position"
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
      {/* Vignette coins */}
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
        {/* Headline — mot par mot */}
        <motion.div
          className="max-w-5xl mb-8 perspective-[1000px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="font-syne text-[clamp(2.6rem,7.5vw,6rem)] font-black leading-[1.08] tracking-tight">
            {titleWords.map((w, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`inline-block mr-[0.25em] ${
                  w.gradient
                    ? ''
                    : w.color
                }`}
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
          On aide les business à Dakar à vendre plus en ligne.
          <br />
          <span className="text-white/50 text-base">Sans jargon, sans délai, sans mauvaises surprises.</span>
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
        <div className="mt-20 flex flex-wrap gap-10 md:gap-20">
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
      </motion.div>

      {/* Badge circulaire tournant */}
      <motion.div
        className="absolute bottom-10 right-6 md:bottom-14 md:right-14 w-28 h-28 md:w-36 md:h-36 z-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Texte circulaire qui tourne */}
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
            className="fill-white/60 text-[10px] font-montserrat font-semibold tracking-[0.22em] uppercase"
            style={{ fontSize: '9.5px', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, letterSpacing: '0.22em', fill: 'rgba(255,255,255,0.55)' }}
          >
            <textPath href="#circle-path">
              GRAPHIQUE&MOTION • DAKAR • AGENCE •
            </textPath>
          </text>
        </motion.svg>

        {/* Icône centrale fixe */}
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
