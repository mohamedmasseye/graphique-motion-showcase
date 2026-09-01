import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { staggerContainer, viewportOnce } from '@/lib/animations';
import { fadeUp } from '@/lib/animations';
import SectionHeading from '@/components/SectionHeading';
import ProjectCard from '@/components/ProjectCard';
import CTASection from '@/components/CTASection';
import Head from '@/components/Head';
import type { PortfolioProject, PortfolioCategory } from '@/types/database';
import { PORTFOLIO_CATEGORY_LABELS } from '@/types/database';

type Filter = 'all' | PortfolioCategory;

const FILTERS: { id: Filter; name: string }[] = [
  { id: 'all', name: 'Tous' },
  { id: 'digital_products', name: 'Produits Digitaux' },
  { id: 'web_ecommerce', name: 'Sites Web & E-commerce' },
  { id: 'branding', name: 'Branding' },
  { id: 'design', name: 'Design Graphique' },
  { id: 'events', name: 'Événementiel' },
];

/* Map legacy category to filter group */
function matchesFilter(project: PortfolioProject, filter: Filter): boolean {
  if (filter === 'all') return true;
  const c = project.category.toLowerCase();
  switch (filter) {
    case 'web_ecommerce':
      return ['web', 'pwa', 'ecommerce'].includes(c);
    case 'branding':
      return ['logo', 'branding'].includes(c);
    case 'design':
      return ['print', 'design', 'video'].includes(c);
    case 'events':
      return c === 'event';
    case 'digital_products':
      return ['app', 'digital_product'].includes(c) || (project.project_type === 'digital_product');
    default:
      return false;
  }
}

/* ── Skeleton loader ──────────────────────────────────────────── */
function ProjectSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
          <div className="aspect-video bg-white/[0.05] animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-white/[0.06] rounded-full w-1/3" />
            <div className="h-5 bg-white/[0.06] rounded-full w-3/4" />
            <div className="h-3 bg-white/[0.06] rounded-full w-full" />
            <div className="h-3 bg-white/[0.06] rounded-full w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Filter>('all');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('portfolio')
      .select('*')
      .eq('published', true)
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setProjects(data as PortfolioProject[]);
        setLoading(false);
      });
  }, []);

  const filtered = projects.filter((p) => matchesFilter(p, active));

  return (
    <>
      <Head
        title="Nos Réalisations"
        description="Découvrez nos projets — branding, sites web, applications, e-commerce, solutions digitales. Portfolio Graphique & Motion — Dakar, Sénégal."
      />

      {/* Hero */}
      <section className="relative pt-16 pb-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #05060F 100%)' }}>
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-brand-blue/4 blur-[120px]" />

        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-3xl">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">Réalisations</p>
            <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Nos <span className="text-brand-teal">projets</span>
            </h1>
            <p className="text-[#A0A0A0] text-lg leading-relaxed max-w-xl">
              Une sélection de marques, produits digitaux et expériences conçus et réalisés par Graphique & Motion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="relative pb-24 overflow-hidden" style={{ background: '#05060F' }}>
        <div className="container mx-auto px-4">
          {/* Filters — horizontally scrollable on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-12 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`relative shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                  active === f.id
                    ? 'text-white border-brand-teal bg-brand-teal/10'
                    : 'bg-white/[0.04] text-[#A0A0A0] border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {active === f.id && (
                  <motion.span
                    className="absolute inset-0 bg-brand-teal/15 rounded-full border border-brand-teal/30"
                    layoutId="portfolioFilter"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{f.name}</span>
                {f.id !== 'all' && (
                  <span className="relative z-10 ml-1.5 text-white/30 text-xs">
                    {projects.filter((p) => matchesFilter(p, f.id)).length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          {loading ? (
            <ProjectSkeleton />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 text-lg font-semibold mb-2">Aucun projet dans cette catégorie.</p>
              <button onClick={() => setActive('all')} className="text-brand-teal text-sm hover:underline">
                Voir tous les projets
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      <CTASection
        headline="Un projet en tête ?"
        description="Transformons votre idée en une expérience digitale."
        primaryLabel="Démarrer un projet"
      />
    </>
  );
}
