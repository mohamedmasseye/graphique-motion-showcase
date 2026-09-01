import { motion } from 'framer-motion';
import { Check, MessageCircle, ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { getWhatsAppUrl } from '@/data/content';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';
import pricingData from '@/data/pricing.json';

const plans = pricingData.plans;
const refonte = pricingData.refonte;

export default function PricingPage() {
  return (
    <>
      <Head
        title="Nos Offres & Tarifs"
        description="Offres de création web, branding et solutions digitales au Sénégal. Packs clairs, prix transparents, livraison rapide."
      />

      {/* Hero */}
      <section className="relative pt-16 pb-16 overflow-hidden" style={{ background: 'linear-gradient(160deg, #020610 0%, #050A18 40%, #040810 100%)' }}>
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand-teal/6 blur-[140px]" />

        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Offres"
            title="Des packs "
            highlight="clairs"
            description="Votre projet livré dans les délais, au prix annoncé. Aucune surprise."
          />
        </div>
      </section>

      {/* Plans */}
      <section className="relative pb-20 overflow-hidden" style={{ background: '#020610' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={staggerItem}
                className="relative flex flex-col bg-white/[0.05] rounded-2xl border border-white/10 overflow-hidden"
                style={{ borderLeftColor: plan.border, borderLeftWidth: 3 }}
                whileHover={{ y: -8, backgroundColor: 'rgba(255,255,255,0.05)', boxShadow: `0 20px 60px ${plan.border}15` }}
              >
                {plan.badge && (
                  <div className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: plan.border + '22', color: plan.border }}>
                    {plan.badge}
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: plan.border }}>
                    Pack {plan.name}
                  </p>
                  <div className="mb-1">
                    <span className="font-syne text-3xl font-black text-white leading-none">{plan.price}</span>
                  </div>
                  <p className="text-[#A0A0A0] text-sm mb-1">{plan.currency}</p>
                  <p className="text-[#A0A0A0] text-xs mb-6">
                    Livraison : <span className="text-white font-medium">{plan.delay}</span>
                  </p>
                  <div className="h-px bg-white/8 mb-6" />
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                        <Check size={15} className="mt-0.5 shrink-0" style={{ color: plan.border }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 w-full text-center py-3 px-5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                    style={{ background: plan.border + '18', color: plan.border, border: `1.5px solid ${plan.border}40` }}
                  >
                    <MessageCircle size={14} /> {plan.cta}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Refonte */}
      <section className="relative pb-20 overflow-hidden" style={{ background: '#020610' }}>
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-10">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Site déjà en ligne ?</p>
            <h3 className="font-syne text-2xl md:text-3xl font-black text-white leading-tight">
              Refonte de site web
            </h3>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
            {refonte.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col bg-white/[0.05] rounded-2xl border border-white/10 overflow-hidden"
                style={{ borderLeftColor: plan.border, borderLeftWidth: 3 }}
              >
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] mb-3" style={{ color: plan.border }}>{plan.name}</p>
                  <span className="font-syne text-3xl font-black text-white leading-none">{plan.price}</span>
                  <p className="text-[#A0A0A0] text-sm mb-2">{plan.currency}</p>
                  <p className="text-[#A0A0A0] text-sm mb-6">{plan.tagline}</p>
                  <div className="h-px bg-white/8 mb-6" />
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                        <Check size={15} className="mt-0.5 shrink-0" style={{ color: plan.border }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.wa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center gap-2 w-full text-center py-3 px-5 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                    style={{ background: plan.border + '18', color: plan.border, border: `1.5px solid ${plan.border}40` }}
                  >
                    <MessageCircle size={14} /> {plan.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[#A0A0A0] text-sm">
            💡 -15% sur la refonte pour les clients sous contrat de maintenance Pro ou Premium.
          </p>
        </div>
      </section>

      {/* Custom projects note */}
      <section className="relative pb-20" style={{ background: '#020610' }}>
        <div className="container mx-auto px-4">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 max-w-2xl">
            <h4 className="font-syne text-lg font-bold text-white mb-2">Projet sur mesure ?</h4>
            <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
              Applications, plateformes, IA, automatisation — chaque projet complexe est unique. Discutons de vos besoins pour un devis personnalisé.
            </p>
            <a
              href={getWhatsAppUrl("J'ai un projet sur mesure, je voudrais un devis.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-teal text-sm font-semibold hover:underline"
            >
              Demander un devis <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}


