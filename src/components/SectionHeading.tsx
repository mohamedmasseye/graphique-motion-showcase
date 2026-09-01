import { motion } from 'framer-motion';
import { fadeUp, viewportOnce } from '@/lib/animations';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.95] tracking-tight">
        {highlight ? (
          <>
            {parts[0]}
            <span className="text-brand-teal">{highlight}</span>
            {parts[1] || ''}
          </>
        ) : (
          title
        )}
      </h2>
      {description && (
        <p className="mt-5 text-[#A0A0A0] text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
