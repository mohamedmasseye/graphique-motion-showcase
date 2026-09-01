import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Linkedin, Instagram, Mail } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { SITE, SOCIAL_LINKS, getWhatsAppUrl } from '@/data/content';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const ProfilePhoto = '/lovable-uploads/mohamed-masseye-diop.png';

const TIMELINE = [
  { period: 'Télécom', title: 'Ingénierie Télécom & Billing', desc: 'Expérience dans les systèmes BSS, Billing, CBS, VAS et support technique pour opérateurs télécom. Gestion des incidents techniques, conception de services, analyse de données et facturation.', color: '#F5821F' },
  { period: 'BSS', title: 'Systèmes BSS / Billing / CBS', desc: 'Conception et gestion des systèmes de facturation (Billing), systèmes de support client (CBS — Customer Billing System), et BSS (Business Support Systems). Analyse de CDR, données et processus métier.', color: '#378ADD' },
  { period: 'Data', title: 'Données & SQL', desc: 'Expertise en SQL, PL/SQL, Oracle, MySQL. Analyse de données, requêtes complexes, optimisation de bases de données et reporting.', color: '#7F77DD' },
  { period: '2014', title: 'Fondation de Graphique & Motion', desc: 'Création du studio digital à Dakar — design, branding, développement web et solutions digitales pour entreprises au Sénégal et en Afrique.', color: '#00B2AA' },
  { period: 'Web', title: 'Développement Web & Applications', desc: 'Sites web, applications web, plateformes e-commerce, PWA et SaaS. React, TypeScript, Node.js, Supabase, WordPress.', color: '#378ADD' },
  { period: 'Tech', title: 'Technologie & Systèmes Digitaux', desc: 'APIs, automatisation, intégration de services, solutions digitales sur mesure pour entreprises.', color: '#7F77DD' },
  { period: 'IA', title: 'IA & Innovation', desc: 'Intégration de l\'intelligence artificielle et de l\'automatisation dans les processus métier. Chatbots, assistants intelligents, génération de contenu.', color: '#00B2AA' },
];

const SKILLS_TELECOM = [
  'BSS', 'Billing', 'CBS', 'VAS', 'SMPP', 'CDR', 'NGBSS', 'CRM',
  'SQL / PL/SQL', 'Oracle', 'MySQL', 'Incidents Techniques',
];

const SKILLS_DIGITAL = [
  'React / TypeScript', 'Node.js', 'Supabase / PostgreSQL', 'WordPress / WooCommerce',
  'API Design', 'Cloudflare', 'Tailwind CSS', 'Framer Motion',
];

const SKILLS_DESIGN = [
  'Branding & Design', 'UI/UX Design', 'Figma', 'Motion Design',
  'Design Graphique', 'SEO', 'Social Media Design', 'Packaging',
];

const SKILLS_AI = [
  'IA Générative', 'Automatisation', 'Chatbots', 'Intégration API IA',
  'Analyse de Données', 'Machine Learning', 'Python', 'Génération de Contenu',
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
                Ingénieur Télécom & Digital · BSS/Billing · IA · Entrepreneurship
              </p>
              <p className="text-[#A0A0A0] text-base leading-relaxed mb-8 max-w-lg">
                Fondateur de {SITE.name}, studio créatif et technologique basé à Dakar. Mon parcours en ingénierie télécom (BSS, Billing, CBS, VAS) m'a donné une compréhension profonde des systèmes complexes, du traitement de données et des processus métier — une expertise que je mets aujourd'hui au service de la création de solutions digitales qui combinent design, technologie et stratégie.
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

      {/* Telecom & Systems — section dédiée */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0A0810 0%, #0D0A18 50%, #080612 100%)' }}>
        <div className="pointer-events-none absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-orange/5 blur-[130px]" />

        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
            <p className="text-brand-orange text-sm font-semibold uppercase tracking-[0.2em] mb-4">Parcours Télécom</p>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Expertise <span className="text-brand-orange">Télécom & Billing</span>
            </h2>
            <p className="text-[#A0A0A0] text-base leading-relaxed max-w-2xl">
              Mon parcours en ingénierie télécom m'a donné une compréhension profonde des systèmes complexes — de la facturation aux données, en passant par le support client et la gestion de services. Cette expertise me permet de comprendre non seulement la technologie, mais aussi les processus métier et les contraintes opérationnelles des entreprises.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'BSS / Billing', desc: 'Business Support Systems, systèmes de facturation, gestion de la facturation et des paiements clients.', color: '#F5821F' },
              { title: 'CBS', desc: 'Customer Billing System — gestion des comptes clients, facturation, débits et crédits.', color: '#378ADD' },
              { title: 'VAS', desc: 'Value Added Services — conception et déploiement de services à valeur ajoutée pour opérateurs.', color: '#00B2AA' },
              { title: 'SMPP', desc: 'Short Message Peer-to-Peer — protocole d\'envoi de SMS en masse, passerelles SMS et routage.', color: '#7F77DD' },
              { title: 'CDR', desc: 'Call Detail Records — analyse des données d\'appels, traitement et reporting opérationnel.', color: '#F5821F' },
              { title: 'NGBSS / CRM', desc: 'Next Generation BSS, gestion de la relation client, support technique et processus métier.', color: '#378ADD' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300"
                style={{ borderLeftColor: item.color, borderLeftWidth: 3 }}
              >
                <h3 className="font-syne text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 max-w-2xl"
          >
            <p className="text-[#A0A0A0] text-sm leading-relaxed">
              <strong className="text-white">En résumé :</strong> Cette expérience dans les télécoms me permet de concevoir des solutions digitales qui ne sont pas seulement belles, mais qui comprennent la complexité des systèmes d'entreprise — de la base de données à l'interface utilisateur, en passant par les processus métier et les contraintes opérationnelles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compétences techniques par catégorie */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050509 0%, #0A0C15 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Compétences</p>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight">
              Technologies & <span className="text-brand-orange">expertise</span>
            </h2>
          </motion.div>

          {/* Télécom & Data */}
          <div className="mb-10">
            <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-orange" /> Télécom & Data
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS_TELECOM.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-2 rounded-full border text-sm font-medium cursor-default transition-all duration-200"
                  style={{ borderColor: '#F5821F30', color: '#F5821F', background: '#F5821F08' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Digital & Développement */}
          <div className="mb-10">
            <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-blue" /> Développement & Digital
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS_DIGITAL.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-2 rounded-full border text-sm font-medium cursor-default transition-all duration-200"
                  style={{ borderColor: '#378ADD30', color: '#378ADD', background: '#378ADD08' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Design */}
          <div className="mb-10">
            <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-teal" /> Design & Créatif
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS_DESIGN.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-2 rounded-full border text-sm font-medium cursor-default transition-all duration-200"
                  style={{ borderColor: '#00B2AA30', color: '#00B2AA', background: '#00B2AA08' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          {/* IA */}
          <div>
            <h3 className="font-syne text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-purple" /> Intelligence Artificielle
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SKILLS_AI.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={viewportOnce}
                  transition={{ delay: i * 0.03 }}
                  className="px-4 py-2 rounded-full border text-sm font-medium cursor-default transition-all duration-200"
                  style={{ borderColor: '#7F77DD30', color: '#7F77DD', background: '#7F77DD08' }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
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
