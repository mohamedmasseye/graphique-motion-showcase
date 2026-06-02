import { motion } from 'framer-motion';
import { Check, MessageCircle } from 'lucide-react';
import pricingData from '../data/pricing.json';

const plans = pricingData.plans;

const containerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(160deg, #020610 0%, #050A18 40%, #040810 100%)' }}>
      {/* Grid teal subtil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(#00B2AA 1px, transparent 1px), linear-gradient(90deg, #00B2AA 1px, transparent 1px)',
          backgroundSize: '70px 70px',
        }}
      />
      {/* Atmospheric glow */}
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand-teal/8 blur-[140px]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-brand-purple/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-orange/5 blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Nos offres</p>
          <h2 className="font-syne text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            Des packs <span className="text-brand-teal">clairs</span>,<br />
            des résultats <span className="text-brand-orange">concrets</span>.
          </h2>
          <p className="mt-5 text-[#A0A0A0] text-lg max-w-xl">
            Votre projet livré dans les délais, au prix annoncé. Aucune surprise.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
          variants={containerStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardVariant}
              className="relative flex flex-col bg-white/[0.05] rounded-2xl border border-white/10 overflow-hidden"
              style={{ borderLeftColor: plan.border, borderLeftWidth: 3 }}
              whileHover={{
                y: -8,
                backgroundColor: 'rgba(255,255,255,0.05)',
                boxShadow: `0 20px 60px ${plan.border}15`,
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
            >
              {/* Badge */}
              {plan.badge && (
                <motion.div
                  className="absolute top-4 right-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                  style={{ background: plan.border + '22', color: plan.border }}
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {plan.badge}
                </motion.div>
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
                    <motion.li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-[#A0A0A0]"
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: plan.border }} />
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.a
                  href={plan.wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 flex items-center justify-center gap-2 w-full text-center py-3 px-5 rounded-xl font-bold text-sm cursor-pointer"
                  style={{
                    background: plan.border + '18',
                    color: plan.border,
                    border: `1.5px solid ${plan.border}40`,
                  }}
                  whileHover={{
                    backgroundColor: plan.border,
                    color: '#fff',
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <MessageCircle size={14} />
                  {plan.cta}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          className="mt-10 text-center text-[#A0A0A0] text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Besoin d'un devis personnalisé ?{' '}
          <motion.a
            href="https://wa.me/221775644478?text=Bonjour%2C%20j%27ai%20un%20projet%20sp%C3%A9cifique"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-teal underline underline-offset-4 cursor-pointer"
            whileHover={{ color: '#F5821F' }}
            transition={{ duration: 0.2 }}
          >
            Écrivez-nous
          </motion.a>
          .
        </motion.p>
      </div>
    </section>
  );
}
