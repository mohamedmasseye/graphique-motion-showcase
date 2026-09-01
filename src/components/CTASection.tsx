import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { fadeUp, viewportOnce } from '@/lib/animations';
import { getWhatsAppUrl } from '@/data/content';

interface CTASectionProps {
  headline?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export default function CTASection({
  headline = 'Un projet en tête ?',
  description = "Parlons-en. On répond dans les 24h.",
  primaryLabel = 'Démarrer un projet',
  primaryHref,
  secondaryLabel = 'Voir nos réalisations',
  secondaryHref = '/portfolio',
  className = '',
}: CTASectionProps) {
  return (
    <section
      className={`relative py-24 md:py-32 overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(135deg, #050810 0%, #0A1018 40%, #060912 100%)',
      }}
    >
      {/* Atmospheric glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-brand-teal/6 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-brand-orange/4 blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-6">
            {headline}
          </h2>
          {description && (
            <p className="text-[#A0A0A0] text-lg leading-relaxed mb-10">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href={primaryHref || getWhatsAppUrl()}
              target={primaryHref?.startsWith('http') ? '_blank' : undefined}
              rel={primaryHref?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-4 px-8 rounded-full text-sm"
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(0,178,170,0.85)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              {primaryLabel}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </motion.a>

            {secondaryLabel && (
              <motion.a
                href={secondaryHref}
                className="inline-flex items-center justify-center bg-white/5 border border-white/15 text-white font-semibold py-4 px-8 rounded-full text-sm"
                whileHover={{
                  scale: 1.04,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {secondaryLabel}
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
