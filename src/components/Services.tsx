import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef, MouseEvent } from 'react';
import { Pen, Globe, Printer, Palette, Smartphone, PlayCircle, Package, Image } from 'lucide-react';

const services = [
  { icon: Pen, title: 'Création de Logo', desc: "Identités visuelles distinctives et mémorables — votre marque reconnaissable au premier coup d'œil.", color: '#00B2AA', span: 'lg:col-span-2' },
  { icon: Globe, title: 'Sites Web', desc: 'Sites modernes, rapides, mobiles-first. Conçus pour convertir vos visiteurs en clients.', color: '#378ADD', span: 'lg:col-span-1 lg:row-span-2' },
  { icon: Smartphone, title: 'Applications Mobiles', desc: 'PWA & apps natives Android / iOS. Vos clients dans la poche.', color: '#F5821F', span: 'lg:col-span-1' },
  { icon: Palette, title: 'Identité Visuelle', desc: 'Charte complète : couleurs, typos, kit réseaux sociaux — cohérence sur tous vos supports.', color: '#7F77DD', span: 'lg:col-span-1' },
  { icon: Printer, title: 'Supports Imprimés', desc: 'Cartes de visite, flyers, affiches — print pro, prêt à imprimer.', color: '#00B2AA', span: 'lg:col-span-1' },
  { icon: Package, title: 'Packaging', desc: 'Emballages créatifs qui valorisent vos produits sur les rayons et en ligne.', color: '#F5821F', span: 'lg:col-span-1' },
  { icon: PlayCircle, title: 'Vidéos & Motion', desc: 'Montages pro, motion design et contenus vidéo pour vos réseaux sociaux.', color: '#378ADD', span: 'lg:col-span-1' },
  { icon: Image, title: 'Retouche Photo', desc: 'Traitement haute qualité pour sublimer vos visuels produits et portraits.', color: '#7F77DD', span: 'lg:col-span-1' },
];

/* ── Tilt card ─────────────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #050509 0%, #07080F 40%, #0A0610 100%)' }}>
      {/* Atmospheric lighting */}
      <div className="pointer-events-none absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-orange/5 blur-[130px]" />
      <motion.div
        className="pointer-events-none absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-brand-teal/5 blur-[110px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Diagonal texture lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,1) 0px, rgba(255,255,255,1) 1px, transparent 0px, transparent 50%)', backgroundSize: '30px 30px' }} />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Ce qu'on fait</p>
            <h2 className="font-syne text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
              Nos<br />
              <span className="text-brand-orange">expertises</span>.
            </h2>
          </motion.div>

          <motion.p
            className="text-[#A0A0A0] text-base max-w-sm leading-relaxed md:text-right"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            Du branding à l'app mobile — on couvre l'ensemble de votre présence digitale.
          </motion.p>
        </div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((s, i) => (
            <motion.div key={s.title} variants={cardVariant} className={s.span}>
              <TiltCard className="h-full">
                <div
                  className="relative h-full bg-white/[0.05] border border-white/10 rounded-2xl p-7 flex flex-col overflow-hidden cursor-default group"
                  style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}
                >
                  {/* Icon + number row */}
                  <div className="flex items-start justify-between mb-auto">
                    <motion.div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: s.color + '18' }}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                    >
                      <s.icon size={20} style={{ color: s.color }} />
                    </motion.div>
                    <span
                      className="font-syne text-5xl font-black leading-none opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-300"
                      style={{ color: s.color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-10">
                    <h3 className="font-syne text-lg font-bold text-white mb-2">{s.title}</h3>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed">{s.desc}</p>
                  </div>

                  {/* Bottom line reveal */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
                    style={{ background: s.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: '40%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  />

                  {/* Corner glow */}
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${s.color}20, transparent 70%)` }}
                  />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-bold py-3.5 px-8 rounded-full text-sm cursor-pointer"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(245,130,31,0.85)' }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            Discutons de votre projet
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
