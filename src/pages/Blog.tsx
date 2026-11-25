import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';

const MotionLink = motion(Link);

/* ── Blog placeholder — architecture prête pour contenu réel ──── */
import { ARTICLES } from '@/data/blog';

const categoryColors: Record<string, string> = {
  Web: '#378ADD',
  Design: '#F5821F',
  Business: '#00B2AA',
  IA: '#7F77DD',
  Technologie: '#00B2AA',
};

export default function Blog() {
  const { slug } = useParams();
  const article = slug ? ARTICLES.find((a) => a.slug === slug) : undefined;

  if (slug) {
    if (!article) {
      return (
        <section className="relative py-24 overflow-hidden" style={{ background: '#070D1A' }}>
          <div className="container mx-auto px-4 text-center">
            <Head title="Article introuvable" description="Cet article n'existe pas ou plus." />
            <h1 className="font-syne text-2xl font-bold text-white mb-4">Article introuvable</h1>
            <Link to="/blog" className="text-brand-teal text-sm inline-flex items-center gap-2">
              <ArrowLeft size={14} /> Retour au blog
            </Link>
          </div>
        </section>
      );
    }

    const color = categoryColors[article.category] || '#A0A0A0';
    return (
      <section className="relative py-24 overflow-hidden" style={{ background: '#070D1A' }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <Head title={article.title} description={article.excerpt} />
          <Link to="/blog" className="text-white/40 hover:text-white text-sm inline-flex items-center gap-2 mb-8 transition-colors">
            <ArrowLeft size={14} /> Retour au blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: color + '18', color }}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-white/30 text-[10px]">
              <Calendar size={10} /> {article.date}
            </span>
            <span className="text-white/30 text-[10px]">{article.readTime}</span>
          </div>
          <h1 className="font-syne text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">{article.title}</h1>
          <p className="text-[#A0A0A0] text-lg leading-relaxed mb-10">{article.excerpt}</p>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center">
            <p className="text-white/50 text-sm">Article complet en cours de rédaction — revenez bientôt.</p>
          </div>
        </div>
      </section>
    );
  }

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
                <MotionLink
                  to={`/blog/${article.slug}`}
                  key={article.slug}
                  variants={staggerItem}
                  className="group block bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300"
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
                </MotionLink>
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
