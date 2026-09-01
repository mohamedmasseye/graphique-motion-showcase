import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, ArrowLeft, Share2, Copy, Linkedin, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/animations';
import { SITE, getWhatsAppUrl } from '@/data/content';
import Head from '@/components/Head';
import ProjectCard from '@/components/ProjectCard';
import CTASection from '@/components/CTASection';
import {
  mapCategoryToGroup,
  PORTFOLIO_CATEGORY_COLORS,
  PROJECT_TYPE_LABELS,
} from '@/types/database';
import type { PortfolioProject, ProjectType } from '@/types/database';

/* ── Skeleton ─────────────────────────────────────────────────── */
function ProjectSkeleton() {
  return (
    <div className="min-h-[60vh]">
      <div className="container mx-auto px-4 pt-8">
        <div className="h-4 bg-white/[0.06] rounded-full w-32 mb-8 animate-pulse" />
        <div className="max-w-4xl">
          <div className="h-4 bg-white/[0.06] rounded-full w-24 mb-4 animate-pulse" />
          <div className="h-12 bg-white/[0.06] rounded-full w-3/4 mb-6 animate-pulse" />
          <div className="h-4 bg-white/[0.06] rounded-full w-full mb-2 animate-pulse" />
          <div className="h-4 bg-white/[0.06] rounded-full w-2/3 animate-pulse" />
        </div>
        <div className="mt-12 aspect-video bg-white/[0.04] rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

/* ── Case Study Section ───────────────────────────────────────── */
function CaseStudySection({ label, title, content }: { label: string; title: string; content: string }) {
  return (
    <motion.div variants={staggerItem} className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-brand-teal text-xs font-bold uppercase tracking-[0.15em]">{label}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <h3 className="font-syne text-xl sm:text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-3xl whitespace-pre-line">{content}</p>
    </motion.div>
  );
}

/* ── Social Share ─────────────────────────────────────────────── */
function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-white/30 text-xs mr-1">Partager</span>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white transition-all" aria-label="LinkedIn">
        <Linkedin size={14} />
      </a>
      <a href={getWhatsAppUrl(`Regarde ce projet : ${title} — ${url}`)}
        target="_blank" rel="noopener noreferrer"
        className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all" aria-label="WhatsApp">
        <MessageCircle size={14} />
      </a>
      <button onClick={copyLink}
        className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all" aria-label="Copy link">
        <Copy size={14} />
      </button>
      {copied && <span className="text-brand-teal text-xs font-medium">Copié !</span>}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    supabase
      .from('portfolio')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
      .then(async ({ data, error }) => {
        if (!error && data) {
          const proj = data as PortfolioProject;
          setProject(proj);

          // Fetch related projects
          const { data: relatedData } = await supabase
            .from('portfolio')
            .select('*')
            .eq('published', true)
            .neq('id', proj.id)
            .order('sort_order')
            .limit(20);

          if (relatedData) {
            const all = relatedData as PortfolioProject[];
            // Priority: same project_type → same category → others
            const sorted = all.sort((a, b) => {
              const aType = a.project_type === proj.project_type ? 0 : 1;
              const bType = b.project_type === proj.project_type ? 0 : 1;
              if (aType !== bType) return aType - bType;
              const aCat = a.category === proj.category ? 0 : 1;
              const bCat = b.category === proj.category ? 0 : 1;
              return aCat - bCat;
            });
            setRelated(sorted.slice(0, 3));
          }
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <ProjectSkeleton />;

  if (!project) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="font-syne text-6xl font-black text-white/10 mb-4">404</p>
        <h1 className="font-syne text-2xl font-black text-white mb-3">Project not found.</h1>
        <p className="text-[#A0A0A0] text-sm mb-6">Ce projet a peut-être été supprimé ou n'existe pas.</p>
        <Link to="/portfolio" className="inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-3 px-6 rounded-full text-sm hover:bg-brand-teal/85 transition-all">
          <ArrowLeft size={14} /> Retour au portfolio
        </Link>
      </div>
    );
  }

  const catGroup = mapCategoryToGroup(project.category);
  const catColor = PORTFOLIO_CATEGORY_COLORS[catGroup];
  const typeLabel = project.project_type ? PROJECT_TYPE_LABELS[project.project_type as ProjectType] : project.category;
  const projectUrl = `${SITE.url}/portfolio/${project.slug}`;
  const hasCaseStudy = project.case_study && (project.challenge || project.strategy || project.solution);

  // Case study sections — only render if content exists
  const caseStudySections = [
    { key: 'challenge', label: '01 — Défi', title: 'Le défi', content: project.challenge },
    { key: 'strategy', label: '02 — Stratégie', title: 'Notre stratégie', content: project.strategy },
    { key: 'solution', label: '03 — Solution', title: 'La solution', content: project.solution },
    { key: 'development', label: '04 — Développement', title: 'Développement', content: project.development },
    { key: 'outcome', label: '05 — Résultat', title: 'Le résultat', content: project.outcome },
  ].filter((s) => s.content);

  return (
    <>
      <Head
        title={project.seo_title || project.title}
        description={project.seo_description || project.short_description || project.description || `${project.title} — Graphique & Motion`}
        image={project.og_image || project.image}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.short_description || project.description,
            url: projectUrl,
            image: project.image,
            author: { '@type': 'Organization', name: SITE.name },
            dateCreated: project.created_at,
            dateModified: project.updated_at,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
              { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE.url}/portfolio` },
              { '@type': 'ListItem', position: 3, name: project.title, item: projectUrl },
            ],
          },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #05060F 100%)' }}>
        <div className="container mx-auto px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-brand-teal transition-colors mb-8">
              <ArrowLeft size={14} /> Retour au portfolio
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: catColor + '22', color: catColor }}>
                  {typeLabel}
                </span>
                {project.case_study && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-orange/20 text-brand-orange">Étude de cas</span>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-4"
              >
                {project.title}
              </motion.h1>

              {(project.short_description || project.description) && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#A0A0A0] text-base leading-relaxed"
                >
                  {project.short_description || project.description}
                </motion.p>
              )}

              {/* Meta info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4 mt-8"
              >
                {[
                  project.client_name && { label: 'Client', value: project.client_name },
                  project.industry && { label: 'Secteur', value: project.industry },
                  project.year && { label: 'Année', value: String(project.year) },
                  project.technologies?.length > 0 && { label: 'Technologies', value: project.technologies.join(', ') },
                ].filter(Boolean).map((item: any) => (
                  <div key={item.label}>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.15em] mb-1">{item.label}</p>
                    <p className="text-white text-sm">{item.value}</p>
                  </div>
                ))}
              </motion.div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-2 mt-6">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-white/[0.06] text-white/50 px-3 py-1.5 rounded-full border border-white/10">{tag}</span>
                  ))}
                </motion.div>
              )}

              {/* CTAs */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center gap-3 mt-8">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-3 px-6 rounded-full text-sm hover:bg-brand-teal/85 transition-all">
                    Voir le projet <ExternalLink size={14} />
                  </a>
                )}
                <a href={getWhatsAppUrl(`Intéressé par un projet similaire à "${project.title}".`)}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-3 px-6 rounded-full text-sm hover:bg-white/10 transition-all">
                  Démarrer un projet <ArrowRight size={14} />
                </a>
              </motion.div>

              {/* Social share */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6">
                <SocialShare url={projectUrl} title={project.title} />
              </motion.div>
            </div>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-white/10"
            >
              <img src={project.image} alt={`${project.title} — ${typeLabel}`} className="w-full h-auto object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Long description ──────────────────────────────────── */}
      {project.long_description && (
        <section className="relative py-16" style={{ background: '#05060F' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}>
                <h2 className="font-syne text-2xl font-bold text-white mb-6">À propos du projet</h2>
                <div className="text-[#A0A0A0] text-sm leading-relaxed whitespace-pre-line">{project.long_description}</div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery ───────────────────────────────────────────── */}
      {project.images && project.images.length > 0 && (
        <section className="relative py-16" style={{ background: '#05060F' }}>
          <div className="container mx-auto px-4">
            <h2 className="font-syne text-2xl font-bold text-white mb-8">Galerie</h2>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              {project.images.map((img, i) => (
                <motion.div key={i} variants={staggerItem} className="rounded-xl overflow-hidden border border-white/10">
                  <img src={img} alt={`${project.title} — Gallery ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Case Study ────────────────────────────────────────── */}
      {hasCaseStudy && (
        <section className="relative py-20" style={{ background: 'linear-gradient(180deg, #05060F 0%, #0A0C15 100%)' }}>
          <div className="container mx-auto px-4">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="mb-12">
              <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Étude de cas</p>
              <h2 className="font-syne text-3xl sm:text-4xl font-black text-white leading-[0.95] tracking-tight">
                {project.title}
              </h2>
            </motion.div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
              {caseStudySections.map((section) => (
                <CaseStudySection key={section.key} label={section.label} title={section.title} content={section.content!} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Related Projects ──────────────────────────────────── */}
      {related.length > 0 && (
        <section className="relative py-20" style={{ background: '#0A0C15' }}>
          <div className="container mx-auto px-4">
            <h2 className="font-syne text-2xl font-bold text-white mb-8">Projets similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <ProjectCard key={r.id} project={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CTASection
        headline="Vous avez un projet similaire ?"
        description="Transformons votre idée en une expérience digitale."
        primaryLabel="Démarrer un projet"
        secondaryLabel="Nous contacter"
        secondaryHref="/contact"
      />
    </>
  );
}
