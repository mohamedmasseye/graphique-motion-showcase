import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { SERVICES, getWhatsAppUrl } from '@/data/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const SERVICE_FAQS: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: 'Combien de temps prend un projet ?', a: 'Chaque projet est unique. Un site vitrine prend généralement 5-10 jours. Un projet complexe peut nécessiter plusieurs semaines. On définit un calendrier clair dès le début.' },
    { q: 'Je peux payer en plusieurs fois ?', a: 'Oui, nous proposons des facilités de paiement. Discutons-en selon la nature de votre projet.' },
    { q: 'Vous travaillez avec des clients internationaux ?', a: 'Absolument. Nous sommes basés à Dakar mais travaillons avec des clients partout dans le monde. La communication se fait en français et en anglais.' },
    { q: 'Incluez-vous la maintenance ?', a: 'Nous offrons un support post-lancement. Pour la maintenance continue, nous avons des offres dédiées.' },
  ],
};

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-syne text-3xl font-black text-white mb-4">Service introuvable</h1>
        <Link to="/services" className="text-brand-teal hover:underline">Voir tous nos services</Link>
      </div>
    );
  }

  const faqs = SERVICE_FAQS[service.slug] || SERVICE_FAQS.default;

  return (
    <>
      <Head title={service.seoTitle} description={service.seoDescription} />

      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #050509 0%, #07080F 40%, #0A0610 100%)' }}>
        <div className="pointer-events-none absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]" style={{ background: service.color + '08' }} />

        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Link to="/services" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-brand-teal transition-colors mb-8">
              <ArrowLeft size={14} /> Tous les services
            </Link>
          </motion.div>

          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-semibold uppercase tracking-[0.2em] mb-4"
              style={{ color: service.color }}
            >
              Service
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-syne text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6"
            >
              {service.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[#A0A0A0] text-lg leading-relaxed max-w-2xl"
            >
              {service.longDescription}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#050509' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8"
              style={{ borderLeftColor: '#EF4444', borderLeftWidth: 4 }}
            >
              <h3 className="font-syne text-lg font-bold text-white mb-3">Le problème</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">{service.problem}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8"
              style={{ borderLeftColor: service.color, borderLeftWidth: 4 }}
            >
              <h3 className="font-syne text-lg font-bold text-white mb-3">Notre solution</h3>
              <p className="text-[#A0A0A0] text-sm leading-relaxed">{service.solution}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #050509 0%, #0A0C15 100%)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <SectionHeading eyebrow="Livrables" title="Ce que vous " highlight="obtenez" />
              <motion.ul
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {service.deliverables.map((d) => (
                  <motion.li key={d} variants={staggerItem} className="flex items-start gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: service.color }} />
                    <span className="text-[#A0A0A0] text-sm">{d}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            <div>
              <SectionHeading eyebrow="Bénéfices" title="Pourquoi " highlight="ça marche" />
              <motion.ul
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                {service.benefits.map((b) => (
                  <motion.li key={b} variants={staggerItem} className="flex items-start gap-3">
                    <CheckCircle size={18} className="mt-0.5 shrink-0 text-brand-teal" />
                    <span className="text-[#A0A0A0] text-sm">{b}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#0A0C15' }}>
        <div className="container mx-auto px-4">
          <SectionHeading eyebrow="FAQ" title="Questions " highlight="fréquentes" />

          <div className="max-w-2xl space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-brand-teal mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-syne text-sm font-bold text-white mb-2">{faq.q}</h4>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        headline={`Prêt pour ${service.shortTitle.toLowerCase()} ?`}
        description="Discutons de votre projet et trouvons la meilleure approche."
        primaryLabel="Démarrer un projet"
      />
    </>
  );
}
