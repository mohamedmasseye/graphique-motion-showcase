import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useRef, MouseEvent, ReactNode, ElementType } from 'react';
import { Pen, Globe, Printer, Palette, Smartphone, PlayCircle, Package, Image } from 'lucide-react';

/* ── Service illustrations (mini SVG compositions) ─────────────── */

function IlloLogo() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(0,178,170,0.04)" rx="8" />
      {/* Hexagon shape */}
      <polygon points="60,10 82,22 82,46 60,58 38,46 38,22" fill="rgba(0,178,170,0.12)" stroke="rgba(0,178,170,0.4)" strokeWidth="1.5" />
      <polygon points="60,18 74,26 74,42 60,50 46,42 46,26" fill="rgba(0,178,170,0.18)" />
      {/* G letter */}
      <text x="60" y="38" textAnchor="middle" dominantBaseline="middle" fill="#00B2AA" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif">G</text>
      {/* Orbiting dots */}
      <circle cx="60" cy="7" r="2.5" fill="#00B2AA" opacity="0.7" />
      <circle cx="85" cy="22" r="2" fill="#00B2AA" opacity="0.4" />
      <circle cx="85" cy="50" r="2" fill="#F5821F" opacity="0.4" />
      <circle cx="60" cy="65" r="2.5" fill="#F5821F" opacity="0.6" />
      <circle cx="35" cy="50" r="2" fill="#378ADD" opacity="0.4" />
      <circle cx="35" cy="22" r="2" fill="#378ADD" opacity="0.4" />
      {/* Variation logos small */}
      <rect x="8" y="60" width="22" height="14" rx="3" fill="rgba(0,178,170,0.1)" stroke="rgba(0,178,170,0.25)" strokeWidth="1" />
      <rect x="34" y="60" width="22" height="14" rx="3" fill="rgba(245,130,31,0.1)" stroke="rgba(245,130,31,0.25)" strokeWidth="1" />
      <rect x="60" y="60" width="22" height="14" rx="3" fill="rgba(55,138,221,0.1)" stroke="rgba(55,138,221,0.25)" strokeWidth="1" />
      <rect x="90" y="60" width="22" height="14" rx="3" fill="rgba(127,119,221,0.1)" stroke="rgba(127,119,221,0.25)" strokeWidth="1" />
    </svg>
  );
}

function IlloWeb() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(55,138,221,0.04)" rx="8" />
      {/* Browser window */}
      <rect x="8" y="8" width="104" height="64" rx="6" fill="rgba(55,138,221,0.08)" stroke="rgba(55,138,221,0.2)" strokeWidth="1.2" />
      {/* Top bar */}
      <rect x="8" y="8" width="104" height="14" rx="6" fill="rgba(55,138,221,0.15)" />
      <rect x="10" y="8" width="104" height="8" fill="rgba(55,138,221,0.15)" />
      <circle cx="16" cy="15" r="2.5" fill="rgba(255,95,87,0.7)" />
      <circle cx="23" cy="15" r="2.5" fill="rgba(254,188,46,0.7)" />
      <circle cx="30" cy="15" r="2.5" fill="rgba(40,200,64,0.7)" />
      <rect x="38" y="12" width="52" height="6" rx="3" fill="rgba(255,255,255,0.07)" />
      {/* URL text */}
      <rect x="40" y="13" width="35" height="4" rx="2" fill="rgba(55,138,221,0.3)" />
      {/* Content */}
      <rect x="16" y="28" width="55" height="7" rx="2" fill="rgba(255,255,255,0.18)" />
      <rect x="16" y="38" width="40" height="4" rx="2" fill="rgba(55,138,221,0.4)" />
      <rect x="16" y="45" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
      <rect x="16" y="50" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
      <rect x="16" y="57" width="22" height="8" rx="4" fill="rgba(55,138,221,0.5)" />
      {/* Image placeholder right */}
      <rect x="76" y="28" width="30" height="38" rx="4" fill="rgba(55,138,221,0.1)" stroke="rgba(55,138,221,0.2)" strokeWidth="1" />
      <circle cx="91" cy="42" r="7" fill="rgba(55,138,221,0.2)" />
      <path d="M85 52 L91 47 L97 52" stroke="rgba(55,138,221,0.5)" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function IlloApp() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(245,130,31,0.04)" rx="8" />
      {/* Phone 1 */}
      <rect x="22" y="5" width="30" height="55" rx="6" fill="rgba(245,130,31,0.08)" stroke="rgba(245,130,31,0.25)" strokeWidth="1.2" />
      <rect x="24" y="12" width="26" height="41" rx="3" fill="rgba(245,130,31,0.1)" />
      {/* Screen content */}
      <rect x="27" y="16" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.2)" />
      <rect x="27" y="22" width="20" height="10" rx="2" fill="rgba(245,130,31,0.25)" />
      <rect x="27" y="35" width="9" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="38" y="35" width="9" height="9" rx="2" fill="rgba(255,255,255,0.08)" />
      <rect x="27" y="47" width="20" height="3" rx="1.5" fill="rgba(245,130,31,0.4)" />
      {/* Home indicator */}
      <rect x="32" y="56" width="10" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* Phone 2 */}
      <rect x="68" y="12" width="30" height="55" rx="6" fill="rgba(0,178,170,0.08)" stroke="rgba(0,178,170,0.25)" strokeWidth="1.2" />
      <rect x="70" y="19" width="26" height="41" rx="3" fill="rgba(0,178,170,0.1)" />
      <rect x="73" y="23" width="20" height="4" rx="2" fill="rgba(0,178,170,0.4)" />
      <rect x="73" y="30" width="20" height="12" rx="2" fill="rgba(0,178,170,0.18)" />
      <rect x="73" y="45" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.08)" />
      <rect x="73" y="50" width="14" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
      <rect x="73" y="56" width="20" height="5" rx="2.5" fill="rgba(0,178,170,0.4)" />
      <rect x="78" y="63" width="10" height="2" rx="1" fill="rgba(255,255,255,0.2)" />

      {/* PWA badge */}
      <rect x="47" y="28" width="20" height="10" rx="3" fill="rgba(55,138,221,0.2)" stroke="rgba(55,138,221,0.4)" strokeWidth="1" />
      <text x="57" y="36" textAnchor="middle" fill="#378ADD" fontSize="5" fontWeight="700" fontFamily="Montserrat, sans-serif">PWA</text>

      {/* Signal dots */}
      <circle cx="57" cy="50" r="2" fill="#F5821F" opacity="0.6" />
      <circle cx="57" cy="57" r="2" fill="#F5821F" opacity="0.3" />
      <circle cx="57" cy="64" r="2" fill="#F5821F" opacity="0.15" />
    </svg>
  );
}

function IlloIdentite() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(127,119,221,0.04)" rx="8" />
      {/* Color palette */}
      <circle cx="22" cy="25" r="13" fill="#00B2AA" opacity="0.8" />
      <circle cx="40" cy="25" r="13" fill="#F5821F" opacity="0.8" />
      <circle cx="31" cy="40" r="13" fill="#378ADD" opacity="0.7" />
      {/* Blend indication */}
      <circle cx="31" cy="25" r="8" fill="rgba(127,119,221,0.3)" />
      {/* Typography samples */}
      <rect x="62" y="10" width="50" height="8" rx="2" fill="rgba(127,119,221,0.12)" />
      <rect x="62" y="10" width="30" height="8" rx="2" fill="rgba(127,119,221,0.3)" />
      <text x="63" y="16.5" fill="rgba(127,119,221,0.9)" fontSize="6" fontWeight="900" fontFamily="Montserrat, sans-serif">Aa</text>
      <rect x="62" y="22" width="50" height="5" rx="1.5" fill="rgba(255,255,255,0.07)" />
      <rect x="62" y="22" width="20" height="5" rx="1.5" fill="rgba(127,119,221,0.2)" />
      <rect x="62" y="30" width="50" height="4" rx="1.5" fill="rgba(255,255,255,0.05)" />
      <rect x="62" y="37" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.04)" />
      {/* Grid / brand guide lines */}
      <rect x="8" y="58" width="104" height="16" rx="4" fill="rgba(127,119,221,0.06)" stroke="rgba(127,119,221,0.15)" strokeWidth="1" />
      {['#00B2AA', '#F5821F', '#378ADD', '#7F77DD', '#FFFFFF', '#0A0A0F'].map((c, i) => (
        <circle key={i} cx={18 + i * 18} cy="66" r="5" fill={c} opacity="0.75" />
      ))}
    </svg>
  );
}

function IlloPrint() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(0,178,170,0.04)" rx="8" />
      {/* Business card */}
      <rect x="8" y="15" width="62" height="38" rx="4" fill="rgba(0,178,170,0.1)" stroke="rgba(0,178,170,0.25)" strokeWidth="1.2" />
      <rect x="8" y="15" width="62" height="15" rx="4" fill="rgba(0,178,170,0.2)" />
      <rect x="10" y="17" width="62" height="11" fill="rgba(0,178,170,0.2)" />
      <circle cx="18" cy="23" r="5" fill="rgba(0,178,170,0.5)" />
      <rect x="28" y="20" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <rect x="28" y="25" width="20" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <rect x="14" y="36" width="40" height="2.5" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="14" y="41" width="30" height="2" rx="1" fill="rgba(255,255,255,0.07)" />
      <rect x="14" y="46" width="25" height="2" rx="1" fill="rgba(255,255,255,0.07)" />
      {/* Flyer */}
      <rect x="78" y="8" width="36" height="50" rx="4" fill="rgba(245,130,31,0.08)" stroke="rgba(245,130,31,0.2)" strokeWidth="1" />
      <rect x="80" y="10" width="32" height="16" rx="2" fill="rgba(245,130,31,0.2)" />
      <rect x="81" y="30" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
      <rect x="81" y="36" width="20" height="2.5" rx="1" fill="rgba(255,255,255,0.08)" />
      <rect x="81" y="41" width="24" height="2.5" rx="1" fill="rgba(255,255,255,0.06)" />
      <rect x="81" y="48" width="28" height="7" rx="3" fill="rgba(245,130,31,0.35)" />
      {/* Print marks */}
      <path d="M8 68 L14 68 M8 68 L8 74" stroke="rgba(0,178,170,0.4)" strokeWidth="1" />
      <path d="M112 68 L106 68 M112 68 L112 74" stroke="rgba(0,178,170,0.4)" strokeWidth="1" />
    </svg>
  );
}

function IlloPackaging() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(245,130,31,0.04)" rx="8" />
      {/* Box 3D perspective */}
      {/* Top face */}
      <polygon points="60,8 95,22 60,36 25,22" fill="rgba(245,130,31,0.25)" stroke="rgba(245,130,31,0.4)" strokeWidth="1" />
      {/* Left face */}
      <polygon points="25,22 60,36 60,68 25,54" fill="rgba(245,130,31,0.12)" stroke="rgba(245,130,31,0.25)" strokeWidth="1" />
      {/* Right face */}
      <polygon points="60,36 95,22 95,54 60,68" fill="rgba(245,130,31,0.18)" stroke="rgba(245,130,31,0.3)" strokeWidth="1" />
      {/* Logo on top */}
      <text x="60" y="24" textAnchor="middle" fill="rgba(245,130,31,0.9)" fontSize="7" fontWeight="900" fontFamily="Montserrat, sans-serif">G&M</text>
      {/* Label on front right */}
      <rect x="64" y="38" width="24" height="14" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(245,130,31,0.2)" strokeWidth="0.8" />
      <rect x="66" y="40" width="14" height="3" rx="1" fill="rgba(245,130,31,0.3)" />
      <rect x="66" y="45" width="18" height="2" rx="1" fill="rgba(255,255,255,0.1)" />
      <rect x="66" y="49" width="12" height="1.5" rx="0.75" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

function IlloVideo() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(55,138,221,0.04)" rx="8" />
      {/* Film strip left */}
      <rect x="6" y="8" width="30" height="64" rx="4" fill="rgba(55,138,221,0.08)" stroke="rgba(55,138,221,0.2)" strokeWidth="1" />
      {[10, 22, 34, 46, 58].map(y => (
        <rect key={y} x="10" y={y} width="22" height="10" rx="2" fill="rgba(55,138,221,0.15)" />
      ))}
      <rect x="8" y="8" width="4" height="64" rx="2" fill="rgba(55,138,221,0.25)" />
      <rect x="30" y="8" width="4" height="64" rx="2" fill="rgba(55,138,221,0.25)" />
      {/* Play button central */}
      <circle cx="75" cy="38" r="22" fill="rgba(55,138,221,0.1)" stroke="rgba(55,138,221,0.25)" strokeWidth="1.5" />
      <circle cx="75" cy="38" r="15" fill="rgba(55,138,221,0.18)" />
      <polygon points="71,31 71,45 83,38" fill="rgba(55,138,221,0.9)" />
      {/* Waveform */}
      {[0,3,6,9,12,15,18,21].map((x, i) => (
        <rect key={i} x={44 + x} y={72 - [4,8,12,6,10,14,8,5][i]} width="2" height={[4,8,12,6,10,14,8,5][i]} rx="1" fill="rgba(55,138,221,0.4)" />
      ))}
      {/* Timeline bar */}
      <rect x="42" y="68" width="66" height="2" rx="1" fill="rgba(55,138,221,0.15)" />
      <rect x="42" y="68" width="30" height="2" rx="1" fill="rgba(55,138,221,0.6)" />
      <circle cx="72" cy="69" r="3" fill="#378ADD" />
    </svg>
  );
}

function IlloPhoto() {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" fill="none">
      <rect width="120" height="80" fill="rgba(127,119,221,0.04)" rx="8" />
      {/* Camera body */}
      <rect x="20" y="22" width="70" height="46" rx="8" fill="rgba(127,119,221,0.1)" stroke="rgba(127,119,221,0.25)" strokeWidth="1.2" />
      {/* Lens */}
      <circle cx="55" cy="45" r="18" fill="rgba(127,119,221,0.08)" stroke="rgba(127,119,221,0.3)" strokeWidth="1.5" />
      <circle cx="55" cy="45" r="13" fill="rgba(127,119,221,0.12)" stroke="rgba(127,119,221,0.2)" strokeWidth="1" />
      <circle cx="55" cy="45" r="8" fill="rgba(127,119,221,0.25)" />
      <circle cx="55" cy="45" r="4" fill="rgba(127,119,221,0.6)" />
      {/* Viewfinder */}
      <rect x="78" y="14" width="16" height="10" rx="3" fill="rgba(127,119,221,0.2)" stroke="rgba(127,119,221,0.3)" strokeWidth="1" />
      {/* Flash */}
      <circle cx="85" cy="27" r="3" fill="rgba(255,255,200,0.3)" stroke="rgba(127,119,221,0.3)" strokeWidth="0.8" />
      {/* Lens shine */}
      <circle cx="50" cy="40" r="3" fill="rgba(255,255,255,0.15)" />
      {/* Shutter button */}
      <circle cx="84" cy="22" r="4" fill="rgba(127,119,221,0.4)" />
      {/* Before/after split */}
      <line x1="92" y1="22" x2="92" y2="68" stroke="rgba(127,119,221,0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
      <rect x="93" y="28" width="20" height="32" rx="3" fill="rgba(127,119,221,0.08)" />
      <rect x="95" y="30" width="16" height="14" rx="2" fill="rgba(127,119,221,0.12)" />
      <rect x="95" y="47" width="10" height="2" rx="1" fill="rgba(127,119,221,0.3)" />
      <rect x="95" y="51" width="14" height="2" rx="1" fill="rgba(127,119,221,0.2)" />
    </svg>
  );
}

const services: {
  icon: ElementType;
  title: string;
  desc: string;
  color: string;
  span: string;
  Illustration: () => JSX.Element;
}[] = [
  { icon: Pen, title: 'Création de Logo', desc: "Identités visuelles distinctives et mémorables — votre marque reconnaissable au premier coup d'œil.", color: '#00B2AA', span: 'lg:col-span-2', Illustration: IlloLogo },
  { icon: Globe, title: 'Sites Web', desc: 'Sites modernes, rapides, mobiles-first. Conçus pour convertir vos visiteurs en clients.', color: '#378ADD', span: 'lg:col-span-1 lg:row-span-2', Illustration: IlloWeb },
  { icon: Smartphone, title: 'Applications Mobiles', desc: 'PWA & apps natives Android / iOS. Vos clients dans la poche.', color: '#F5821F', span: 'lg:col-span-1', Illustration: IlloApp },
  { icon: Palette, title: 'Identité Visuelle', desc: 'Charte complète : couleurs, typos, kit réseaux sociaux — cohérence sur tous vos supports.', color: '#7F77DD', span: 'lg:col-span-1', Illustration: IlloIdentite },
  { icon: Printer, title: 'Supports Imprimés', desc: 'Cartes de visite, flyers, affiches — print pro, prêt à imprimer.', color: '#00B2AA', span: 'lg:col-span-1', Illustration: IlloPrint },
  { icon: Package, title: 'Packaging', desc: 'Emballages créatifs qui valorisent vos produits sur les rayons et en ligne.', color: '#F5821F', span: 'lg:col-span-1', Illustration: IlloPackaging },
  { icon: PlayCircle, title: 'Vidéos & Motion', desc: 'Montages pro, motion design et contenus vidéo pour vos réseaux sociaux.', color: '#378ADD', span: 'lg:col-span-1', Illustration: IlloVideo },
  { icon: Image, title: 'Retouche Photo', desc: 'Traitement haute qualité pour sublimer vos visuels produits et portraits.', color: '#7F77DD', span: 'lg:col-span-1', Illustration: IlloPhoto },
];

/* ── Tilt card ─────────────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
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
                  className="relative h-full bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden cursor-default group flex flex-col"
                  style={{ borderLeftColor: s.color, borderLeftWidth: 3 }}
                >
                  {/* ── Illustration zone ── */}
                  <div
                    className="relative overflow-hidden flex-shrink-0"
                    style={{
                      height: s.span.includes('row-span-2') ? 180 : 120,
                      background: `linear-gradient(135deg, ${s.color}08 0%, transparent 100%)`,
                      borderBottom: `1px solid ${s.color}15`,
                    }}
                  >
                    <div className="absolute inset-0 p-4">
                      <s.Illustration />
                    </div>
                    {/* Shimmer overlay on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${s.color}0A 0%, transparent 60%)` }}
                    />
                    {/* Top-right number watermark */}
                    <span
                      className="absolute top-3 right-4 font-syne text-4xl font-black leading-none opacity-[0.1] group-hover:opacity-[0.2] transition-opacity duration-300"
                      style={{ color: s.color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* ── Text content ── */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Icon + title row */}
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: s.color + '18' }}
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                      >
                        <s.icon size={17} style={{ color: s.color }} />
                      </motion.div>
                      <h3 className="font-syne text-base font-bold text-white leading-tight">{s.title}</h3>
                    </div>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed flex-1">{s.desc}</p>

                    {/* Bottom accent line */}
                    <motion.div
                      className="mt-5 h-[1px] rounded-full"
                      style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>

                  {/* Corner glow */}
                  <motion.div
                    className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${s.color}18, transparent 70%)` }}
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
            style={{ backgroundColor: '#F5821F', boxShadow: '0 0 0px rgba(245,130,31,0)' }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245,130,31,0.35)' }}
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
