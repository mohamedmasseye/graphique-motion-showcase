import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import { ProjectCategory } from '@/types/project';
import { supabase } from '@/lib/supabase';
import type { PortfolioProject } from '@/types/database';

type FilterCategory = ProjectCategory | 'all';

const categories: { id: FilterCategory; name: string }[] = [
  { id: 'all', name: 'Tous' },
  { id: 'web', name: 'Web' },
  { id: 'pwa', name: 'PWA / App' },
  { id: 'app', name: 'Mobile' },
  { id: 'logo', name: 'Logos' },
  { id: 'print', name: 'Print' },
  { id: 'event', name: 'Événements' },
];

const categoryLabel: Record<ProjectCategory, string> = {
  logo: 'Design de Logo',
  web: 'Design Web',
  pwa: 'App Web / PWA',
  app: 'Application Mobile',
  print: 'Design Imprimé',
  video: 'Motion Design',
  event: 'Design Événementiel',
};

const categoryColor: Record<ProjectCategory, string> = {
  logo: '#00B2AA',
  web: '#378ADD',
  pwa: '#7F77DD',
  app: '#F5821F',
  print: '#A0A0A0',
  video: '#EC4899',
  event: '#F5821F',
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState<PortfolioProject[]>([]);
  const [selectedImage, setSelectedImage] = useState<PortfolioProject | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    supabase
      .from('portfolio')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data) setProjects(data as PortfolioProject[]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter((p) => p.category === activeCategory));
    }
  }, [activeCategory, projects]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedImage(null); };
    if (selectedImage) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach((el) => el.classList.add('active'));
      }),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <>
      <section id="portfolio" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000000 0%, #05060F 50%, #000000 100%)' }}>
        {/* Atmospheric lighting */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-brand-blue/4 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full bg-brand-purple/4 blur-[100px]" />

        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-3">Portfolio</p>
            <h2 className="font-syne text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
              Nos <span className="text-brand-teal">réalisations</span>.
            </h2>
            <p className="mt-5 text-[#A0A0A0] text-lg max-w-xl">
              Chaque projet est une collaboration. Voici ce qu'on a construit ensemble.
            </p>
          </motion.div>

          {/* Filters — centrés sur mobile */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full text-sm font-semibold cursor-pointer border overflow-hidden ${
                  activeCategory === cat.id
                    ? 'text-white border-brand-teal'
                    : 'bg-white/5 text-[#A0A0A0] border-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {activeCategory === cat.id && (
                  <motion.span
                    className="absolute inset-0 bg-brand-teal rounded-full"
                    layoutId="filterActive"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Grid — 2 colonnes mobile, 2 tablette, 3 desktop */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square sm:aspect-video rounded-2xl bg-white/[0.05] border border-white/10 animate-pulse" />
              ))}
            </div>
          ) : (
          <motion.div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-2xl bg-white/[0.05] border border-white/10 cursor-pointer hover:border-white/20 transition-colors duration-300"
                  onClick={() => setSelectedImage(project)}
                >
                  {/* Category badge */}
                  <div
                    className="absolute top-2 left-2 z-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full"
                    style={{
                      background: (categoryColor[project.category as ProjectCategory] ?? '#A0A0A0') + '22',
                      color: categoryColor[project.category as ProjectCategory] ?? '#A0A0A0',
                    }}
                  >
                    {categoryLabel[project.category as ProjectCategory] ?? project.category}
                  </div>

                  {/* Image — aspect carré sur mobile, vidéo sur sm+ */}
                  <div className="aspect-square sm:aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Titre toujours visible sous l'image sur mobile */}
                  <div className="sm:hidden px-3 py-2.5">
                    <p className="text-white text-xs font-semibold leading-tight line-clamp-2">{project.title}</p>
                  </div>

                  {/* Hover overlay — desktop uniquement */}
                  <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col justify-end p-5">
                    <h4 className="text-white font-bold text-lg leading-tight mb-2">{project.title}</h4>
                    {project.tags && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] bg-white/10 text-white/70 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#A0A0A0] text-xs flex items-center gap-1">
                        <ZoomIn size={12} /> Voir détails
                      </span>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-teal text-xs flex items-center gap-1 hover:text-brand-orange transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visiter <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-[#A0A0A0] mb-4 text-sm">Vous aimez ce que vous voyez ?</p>
            <a
              href="#contact"
              className="inline-block bg-brand-teal hover:bg-brand-teal/85 text-white font-bold py-3 px-8 rounded-full transition-all duration-200 text-sm cursor-pointer"
            >
              Démarrer un projet
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-[#111115] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X size={18} className="text-white" />
              </button>

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[65vh] object-contain bg-black"
              />

              <div className="p-6">
                <div
                  className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3"
                  style={{
                    background: (categoryColor[selectedImage.category as ProjectCategory] ?? '#A0A0A0') + '22',
                    color: categoryColor[selectedImage.category as ProjectCategory] ?? '#A0A0A0',
                  }}
                >
                  {categoryLabel[selectedImage.category as ProjectCategory] ?? selectedImage.category}
                </div>
                <h3 className="text-xl font-black text-white mb-2">{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">{selectedImage.description}</p>
                )}
                {selectedImage.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedImage.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/8 text-white/60 px-3 py-1 rounded-full border border-white/10">{tag}</span>
                    ))}
                  </div>
                )}
                {selectedImage.link && (
                  <a
                    href={selectedImage.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-teal hover:bg-brand-teal/85 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Visiter le projet <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
