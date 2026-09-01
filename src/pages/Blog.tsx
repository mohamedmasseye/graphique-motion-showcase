import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

/* ── Blog placeholder — architecture prête pour contenu réel ──── */
const ARTICLES = [
  {
    slug: 'creer-site-web-professionnel-senegal',
    title: 'Comment créer un site web professionnel au Sénégal ?',
    excerpt: 'Guide complet pour les entrepreneurs et entreprises qui souhaitent lancer leur présence en ligne au Sénégal.',
    category: 'Web',
    date: '2025',
    readTime: '5 min',
  },
  {
    slug: 'cout-creation-site-web-senegal',
    title: 'Combien coûte la création d\'un site web au Sénégal ?',
    excerpt: 'Les facteurs qui influencent le prix d\'un site web et comment budgétiser votre projet digitale.',
    category: 'Business',
    date: '2025',
    readTime: '4 min',
  },
  {
    slug: '7-erreurs-site-web-inefficace',
    title: '7 erreurs qui rendent un site web inefficace',
    excerpt: 'Les erreurs courantes qui font fuir vos visiteurs et comment les corriger.',
    category: 'Web',
    date: '2025',
    readTime: '6 min',
  },
  {
    slug: 'identite-visuelle-professionnelle',
    title: 'Comment créer une identité visuelle professionnelle ?',
    excerpt: 'Les étapes pour construire une marque visuelle forte et cohérente.',
    category: 'Design',
    date: '2025',
    readTime: '5 min',
  },
  {
    slug: 'pme-intelligence-artificielle',
    title: 'Comment une PME peut utiliser l\'intelligence artificielle ?',
    excerpt: 'Applications concrètes de l\'IA pour les petites et moyennes entreprises au Sénégal.',
    category: 'IA',
    date: '2025',
    readTime: '7 min',
  },
  {
    slug: 'automatiser-entreprise',
    title: 'Comment automatiser les processus de votre entreprise ?',
    excerpt: 'Gagner du temps et réduire les erreurs grâce à l\'automatisation digitale.',
    category: 'Technologie',
    date: '2025',
    readTime: '5 min',
  },
];

const categoryColors: Record<string, string> = {
  Web: '#378ADD',
  Design: '#F5821F',
  Business: '#00B2AA',
  IA: '#7F77DD',
  Technologie: '#00B2AA',
};

export default function Blog() {
  return (
    <>
      <Head title="Blog" description="Articles, conseils et insights sur le digital, le web design, la technologie et l'entrepreneuriat au Sénégal." />

      {/* Hero */}
      <section className="relative pt-16 pb-16 overflow-hidden" style={{ background: 'linear-gradient(160deg, #070D1A 0%, #0A0C15 50%, #080A12 100%)' }}>
        <div className="container mx-auto px-4">
          <SectionHeading
            eyebrow="Insights"
            title="Le blog "
            highlight="Graphique & Motion"
            description="Articles, conseils et insights sur le digital, la technologie et l'entrepreneuriat."
          />
        </div>
      </section>

      {/* Articles */}
      <section className="relative pb-24 overflow-hidden" style={{ background: '#070D1A' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {ARTICLES.map((article) => {
              const color = categoryColors[article.category] || '#A0A0A0';
              return (
                <motion.article
                  key={article.slug}
                  variants={staggerItem}
                  className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300"
                >
                  {/* Placeholder image */}
                  <div className="aspect-video relative" style={{ background: `linear-gradient(135deg, ${color}08, ${color}03)` }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Tag size={32} style={{ color: color + '30' }} />
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: color + '18', color }}
                      >
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-white/30 text-[10px]">
                        <Calendar size={10} /> {article.date}
                      </span>
                      <span className="text-white/30 text-[10px]">{article.readTime}</span>
                    </div>

                    <h3 className="font-syne text-base font-bold text-white mb-2 group-hover:text-brand-teal transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-[#A0A0A0] text-sm leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-white/30 text-xs group-hover:text-brand-teal transition-colors">
                      Lire l'article <ArrowRight size={12} />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      <CTASection
        headline="Un sujet en tête ?"
        description="Parlez-nous de votre projet, on s'occupe du reste."
      />
    </>
  );
}
