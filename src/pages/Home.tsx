import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Globe, Code, Smartphone, Brain, ShoppingBag } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { SITE, SERVICES, PROCESS_STEPS, getWhatsAppUrl } from '@/data/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';
import ProjectCard from '@/components/ProjectCard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/types/database';

const serviceIcons: Record<string, React.ElementType> = {
  Palette, Globe, Code, Smartphone, Brain, ShoppingBag,
};

const titleWords = [
  { text: 'On construit', color: 'text-white' },
  { text: 'des expériences', color: 'text-white' },
  { text: 'digitales', gradient: true },
  { text: 'qui', color: 'text-white' },
  { text: 'comptent.', color: 'text-white' },
];

/* ═══ Hero Section ══════════════════════════════════════════════ */
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const glowY = useTransform(scrollY, [0, 600], [0, 60]);
  const smoothY = useSpring(glowY, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black"
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,178,170,0.15) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      {/* Parallax glows */}
      <motion.div
        style={{ y: smoothY }}
        className="pointer-events-none absolute -left-40 top-1/4 w-[500px] h-[500px] rounded-full bg-brand-teal/6 blur-[130px]"
      />
      <div className="pointer-events-none absolute -right-40 bottom-1/3 w-[400px] h-[400px] rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-teal/20 bg-brand-teal/5 text-brand-teal text-xs font-semibold uppercase tracking-[0.15em]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
              Studio Créatif & Technologie — Dakar, Sénégal
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-syne text-[clamp(2.4rem,5.5vw,4.5rem)] font-black leading-[1.05] tracking-tight mb-8"
          >
            {titleWords.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
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
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#A0A0A0] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Branding, design, sites web, applications et solutions digitales pour les entreprises ambitieuses.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-4 px-8 rounded-full text-sm"
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(0,178,170,0.85)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Démarrer un projet
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <Link
              to="/portfolio"
              className="group inline-flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-4 px-8 rounded-full text-sm hover:bg-white/10 hover:border-white/30 transition-all"
            >
              Explorer nos projets
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Service chips */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {SERVICES.map((s, i) => (
              <motion.span
                key={s.slug}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.95 + i * 0.06 }}
                className="text-xs font-semibold px-4 py-2 rounded-full border cursor-default"
                style={{
                  borderColor: s.color + '30',
                  color: s.color,
                  background: s.color + '08',
                }}
              >
                {s.shortTitle}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating tech elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        {/* Floating code tags */}
        {[
          { text: '<React />', x: '8%', delay: 0, color: '#378ADD' },
          { text: 'TypeScript', x: '22%', delay: 1.5, color: '#00B2AA' },
          { text: 'BSS/Billing', x: '38%', delay: 0.8, color: '#F5821F' },
          { text: 'Supabase', x: '55%', delay: 2.2, color: '#7F77DD' },
          { text: 'API', x: '70%', delay: 0.3, color: '#00B2AA' },
          { text: 'AI/ML', x: '85%', delay: 1.8, color: '#7F77DD' },
          { text: 'CDR', x: '15%', delay: 2.5, color: '#F5821F' },
          { text: 'Tailwind', x: '45%', delay: 1.0, color: '#378ADD' },
          { text: 'Node.js', x: '75%', delay: 0.6, color: '#00B2AA' },
        ].map((tag, i) => (
          <motion.div
            key={i}
            className="absolute text-[10px] font-mono font-medium px-2.5 py-1 rounded-md border"
            style={{
              left: tag.x,
              bottom: '40%',
              borderColor: tag.color + '25',
              color: tag.color + '60',
              background: tag.color + '06',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.6, 0.4, 0.6, 0],
              y: [20, -30, -50, -70, -100],
            }}
            transition={{
              duration: 6,
              delay: tag.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {tag.text}
          </motion.div>
        ))}

        {/* Glowing horizontal line */}
        <motion.div
          className="absolute bottom-[45%] left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,178,170,0.3) 30%, rgba(55,138,221,0.3) 70%, transparent 100%)' }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Dot pulse on the line */}
        <motion.div
          className="absolute bottom-[calc(45%-2px)] w-1 h-1 rounded-full bg-brand-teal"
          animate={{
            left: ['10%', '90%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </section>
  );
}

/* ═══ Selected Work Section (Editorial Layout) ═════════════════ */
function SelectedWork() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);

  useEffect(() => {
    supabase
      .from('portfolio')
      .select('*')
      .eq('featured', true)
      .eq('published', true)
      .order('featured_order')
      .limit(6)
      .then(({ data }) => {
        if (data) setProjects(data as PortfolioProject[]);
      });
  }, []);

  if (projects.length === 0) return null;

  // Editorial layout: first project large, then alternating
  const [first, ...rest] = projects;
  const leftCol = rest.filter((_, i) => i % 2 === 0).slice(0, 2);
  const rightCol = rest.filter((_, i) => i % 2 === 1).slice(0, 2);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #05060F 50%, #000000 100%)' }}>
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-blue/4 blur-[120px]" />

      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            eyebrow="Réalisations"
            title="Quelques projets dont nous "
            highlight="sommes fiers"
          />
          <Link
            to="/portfolio"
            className="hidden sm:inline-flex items-center gap-2 text-brand-teal text-sm font-semibold hover:underline"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>

        {/* Editorial grid */}
        <div className="space-y-5">
          {/* First project — full width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6 }}
          >
            <ProjectCard project={first} variant="featured" className="w-full" />
          </motion.div>

          {/* Two columns */}
          {leftCol.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {leftCol.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.5 }}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
              {rightCol.map((p) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.5 }}>
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center sm:text-right">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-brand-teal text-sm font-semibold hover:underline"
          >
            Voir toutes les réalisations <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══ Services Preview ══════════════════════════════════════════ */
function ServicesPreview() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #050509 0%, #07080F 40%, #0A0610 100%)' }}>
      <div className="pointer-events-none absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-brand-teal/4 blur-[110px]" />

      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Services"
          title="Ce qu'on "
          highlight="fait"
          description="Du branding à l'IA — on couvre l'ensemble de votre présence digitale."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {SERVICES.map((service) => {
            const Icon = serviceIcons[service.icon] || Globe;
            return (
              <motion.div key={service.slug} variants={staggerItem}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative block bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 sm:p-8 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 h-full"
                  style={{ borderLeftColor: service.color, borderLeftWidth: 3 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: service.color + '15' }}
                  >
                    <Icon size={20} style={{ color: service.color }} />
                  </div>
                  <h3 className="font-syne text-lg font-bold text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                    style={{ color: service.color }}
                  >
                    En savoir plus <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ Why Graphique & Motion ════════════════════════════════════ */
const PILLARS = [
  {
    letter: 'C',
    title: 'Créativité',
    desc: 'Design qui impressionne et communique efficacement votre marque.',
    color: '#00B2AA',
  },
  {
    letter: 'T',
    title: 'Technologie',
    desc: 'Solutions techniques robustes, modernes et performantes.',
    color: '#378ADD',
  },
  {
    letter: 'B',
    title: 'Business',
    desc: 'Chaque décision sert vos objectifs commerciaux et votre croissance.',
    color: '#F5821F',
  },
  {
    letter: 'A',
    title: 'IA',
    desc: 'Intelligence artificielle et automatisation au service de votre productivité.',
    color: '#7F77DD',
  },
];

function WhyUs() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
      <div className="pointer-events-none absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-orange/4 blur-[120px]" />

      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Pourquoi nous"
          title="Pas juste du design. "
          highlight="On comprend la technologie."
          description="Graphique & Motion combine design créatif, développement logiciel, systèmes digitaux et réflexion business pour créer des solutions à la fois belles et utiles."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {PILLARS.map((pillar) => (
            <motion.div
              key={pillar.title}
              variants={staggerItem}
              className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 group hover:bg-white/[0.06] transition-all duration-300"
              style={{ borderTopColor: pillar.color, borderTopWidth: 3 }}
            >
              <span
                className="font-syne text-5xl font-black leading-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ color: pillar.color }}
              >
                {pillar.letter}
              </span>
              <h3 className="font-syne text-xl font-bold text-white mt-3 mb-2">
                {pillar.title}
              </h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ Process Preview ═══════════════════════════════════════════ */
function ProcessPreview() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #05060F 100%)' }}>
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Processus"
          title="De l'idée au "
          highlight="lancement"
          description="Notre méthode en 6 étapes pour transformer vos projets en réalités digitales."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center group hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
            >
              <span className="font-syne text-3xl font-black text-brand-teal/30 group-hover:text-brand-teal/60 transition-colors">
                {step.number}
              </span>
              <h4 className="font-syne text-base font-bold text-white mt-2 mb-1">
                {step.title}
              </h4>
              <p className="text-[#A0A0A0] text-xs leading-relaxed hidden sm:block">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/processus"
            className="inline-flex items-center gap-2 text-brand-teal text-sm font-semibold hover:underline"
          >
            Découvrir notre processus <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ Home Page ═════════════════════════════════════════════════ */
export default function Home() {
  return (
    <>
      <Head
        title={undefined}
        description={undefined}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE.name,
            url: SITE.url,
            description: SITE.description,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE.url}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE.name,
            url: SITE.url,
            logo: `${SITE.url}/logo.png`,
            sameAs: ['https://www.instagram.com/graphiquemotion', 'https://www.facebook.com/share/18ZbMPjH39/'],
          },
        ]}
      />
      <Hero />
      <SelectedWork />
      <ServicesPreview />
      <WhyUs />
      <ProcessPreview />
      <CTASection />
    </>
  );
}
