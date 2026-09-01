import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Palette, Globe, Code, Smartphone, Brain, ShoppingBag } from 'lucide-react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { SERVICES } from '@/data/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const serviceIcons: Record<string, React.ElementType> = {
  Palette, Globe, Code, Smartphone, Brain, ShoppingBag,
};

export default function Services() {
  return (
    <>
      <Head
        title="Nos Services"
        description="Branding, design graphique, création de sites web, développement d'applications, e-commerce, solutions IA. Services digitaux complets à Dakar."
      />

      {/* Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #050509 0%, #07080F 40%, #0A0610 100%)' }}>
        <div className="pointer-events-none absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-brand-orange/5 blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-brand-teal/5 blur-[110px]" />

        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Services"
            title="Nos "
            highlight="expertises"
            description="Du branding à l'IA — une gamme complète de services pour construire et développer votre présence digitale."
          />
        </div>
      </section>

      {/* Services grid */}
      <section className="relative pb-24 overflow-hidden" style={{ background: '#050509' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                    className="group relative block bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 sm:p-10 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 h-full"
                    style={{ borderLeftColor: service.color, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-start gap-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: service.color + '12' }}
                      >
                        <Icon size={24} style={{ color: service.color }} />
                      </div>
                      <div>
                        <h3 className="font-syne text-xl font-bold text-white mb-2 group-hover:text-brand-teal transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                          {service.description}
                        </p>
                        <span
                          className="inline-flex items-center gap-2 text-xs font-semibold"
                          style={{ color: service.color }}
                        >
                          En savoir plus <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <CTASection
        headline="Un projet en tête ?"
        description="Discutons de vos objectifs et trouvons la meilleure solution digitale."
      />
    </>
  );
}
