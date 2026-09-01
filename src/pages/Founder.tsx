import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Linkedin, Instagram, Mail } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { SITE, SOCIAL_LINKS, getWhatsAppUrl } from '@/data/content';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const ProfilePhoto = '/lovable-uploads/mohamed-masseye-diop.png';

const TIMELINE = [
  { period: '2014', title: 'Graphique & Motion', desc: 'Fondation du studio créatif et technologique à Dakar.', color: '#00B2AA' },
  { period: 'Design', title: 'Design & Branding', desc: 'Création d\'identités visuelles, logos et supports pour des entreprises au Sénégal et en Afrique.', color: '#F5821F' },
  { period: 'Web', title: 'Développement Web', desc: 'Sites web, applications web et plateformes digitales pour des clients variés.', color: '#378ADD' },
  { period: 'Tech', title: 'Technologie & Systèmes', desc: 'Systèmes digitaux, APIs, automatisation et solutions techniques pour entreprises.', color: '#7F77DD' },
  { period: 'IA', title: 'IA & Innovation', desc: 'Intégration de l\'intelligence artificielle et de l\'automatisation dans les processus métier.', color: '#00B2AA' },
];

const SKILLS = [
  'Branding & Design', 'Web Design', 'React / TypeScript', 'Node.js',
  'Supabase / PostgreSQL', 'AI / Machine Learning', 'API Design', 'Figma',
  'Motion Design', 'SEO', 'Cloudflare', 'UI/UX Design',
];

export default function Founder() {
  const linkedin = SOCIAL_LINKS.find((s) => s.name === 'LinkedIn');
  const instagram = SOCIAL_LINKS.find((s) => s.name === 'Instagram');

  return (
    <>
      <Head
        title={`${SITE.founder} — Ingénieur Digital & Télécom · Technologie · IA`}
        description="Fondateur de Graphique & Motion. Ingénieur digital & télécom, technologie, IA, entrepreneurship. Basé à Dakar, Sénégal."
      />

      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
        <div className="pointer-events-none absolute -top-40 left-1/3 w-[500px] h-[500px] rounded-full bg-brand-teal/5 blur-[120px]" />

        <div className="container mx-auto px-4">
          <Link to="/a-propos" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-brand-teal transition-colors mb-12">
            <ArrowLeft size={14} /> Retour à À propos
          </Link>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-teal/10 blur-[80px] rounded-full scale-[1.4]" />
                <div className="relative w-[300px] h-[380px] sm:w-[360px] sm:h-[460px] rounded-3xl overflow-hidden border-2 border-white/10" style={{ boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                  <img src={ProfilePhoto} alt={SITE.founder} className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Fondateur</p>
              <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-4">
                {SITE.founder}
              </h1>
              <p className="text-[#A0A0A0] text-lg leading-relaxed mb-6 max-w-lg">
                Ingénieur Digital & Télécom · Technologie · IA · Entrepreneurship
              </p>
              <p className="text-[#A0A0A0] text-base leading-relaxed mb-8 max-w-lg">
                Fondateur de {SITE.name}, studio créatif et technologique basé à Dakar. Je conçois et développe des solutions digitales qui allient design, technologie et intelligence artificielle pour des entreprises ambitieuses.
              </p>

              <div className="flex flex-wrap gap-3">
                {linkedin && (
                  <a href={linkedin.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold py-3 px-6 rounded-full text-sm hover:bg-[#0A66C2]/85 transition-all">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {instagram && (
                  <a href={instagram.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E1306C] to-[#F77737] text-white font-bold py-3 px-6 rounded-full text-sm hover:opacity-90 transition-all">
                    <Instagram size={16} /> Instagram
                  </a>
                )}
                <a href={getWhatsAppUrl()}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-3 px-6 rounded-full text-sm hover:bg-white/10 transition-all">
                  <Mail size={14} /> Contact
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-24 overflow-hidden" style={{ background: '#050509' }}>
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-16">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Parcours</p>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight">
              Mon <span className="text-brand-teal">parcours</span>
            </h2>
          </motion.div>

          <div className="relative max-w-2xl">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative flex items-start gap-6 mb-12 last:mb-0"
              >
                {/* Dot */}
                <div
                  className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
                  style={{ borderColor: item.color, background: item.color + '18' }}
                >
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.period}</span>
                </div>

                <div>
                  <h3 className="font-syne text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050509 0%, #0A0C15 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Compétences</p>
            <h2 className="font-syne text-3xl sm:text-4xl font-black text-white leading-[0.95] tracking-tight">
              Technologies & <span className="text-brand-orange">expertise</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {SKILLS.map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.04 }}
                className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.04] text-white/70 text-sm font-medium hover:border-brand-teal/40 hover:text-brand-teal transition-all cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline="Envie de collaborer ?"
        description="Discutons de votre projet et créons quelque chose d'ensemble."
        primaryLabel="Démarrer un projet"
      />
    </>
  );
}
