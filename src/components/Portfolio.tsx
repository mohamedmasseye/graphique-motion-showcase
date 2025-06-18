

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import { Project, ProjectCategory } from '@/types/project';
import projectsData from '@/data/projects.json';

type FilterCategory = ProjectCategory | 'all';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData.projects as Project[]);
  const [selectedImage, setSelectedImage] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projectsData.projects as Project[]);
    } else {
      setFilteredProjects((projectsData.projects as Project[]).filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll('.reveal, .reveal-left, .reveal-right');
            elements.forEach(el => el.classList.add('active'));
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Fermer la modal avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'logo', name: 'Logos' },
    { id: 'web', name: 'Web' },
    { id: 'print', name: 'Print' },
    { id: 'video', name: 'Vidéo' },
    { id: 'event', name: 'Événements' }
  ];

  const handleImageClick = (project: Project) => {
    setSelectedImage(project);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  
  return (
    <>
      <section id="portfolio" ref={sectionRef} className="section-padding bg-design-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-design-secondary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-widest text-design-accent mb-2 reveal">Portfolio</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 reveal" data-delay="1">Mes Réalisations</h3>
            <div className="w-20 h-1 bg-design-accent mx-auto mb-8 reveal" data-delay="2"></div>
            <p className="max-w-2xl mx-auto text-gray-300 reveal" data-delay="3">
              Découvrez une sélection de mes projets les plus récents et représentatifs.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12 reveal" data-delay="4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as FilterCategory)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-design-accent text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative overflow-hidden rounded-xl card-hover reveal cursor-pointer"
                data-delay={(index % 3) + 1}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                onClick={() => handleImageClick(project)}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn 
                      size={32} 
                      className="text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100" 
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                  <div>
                    <h4 className="text-xl font-medium text-white mb-2">{project.title}</h4>
                    <p className="text-sm text-gray-300 mb-4">
                      {project.category === 'logo' && 'Design de Logo'}
                      {project.category === 'web' && 'Design Web'}
                      {project.category === 'print' && 'Design Imprimé'}
                      {project.category === 'video' && 'Motion Design'}
                      {project.category === 'event' && 'Design Événementiel'}
                    </p>
                    <a 
                      href={project.link}
                      className="inline-flex items-center text-sm text-design-accent hover:text-design-accent/80 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Voir le projet <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-16 text-center reveal" data-delay="5">
            <p className="text-gray-400 mb-4">Vous aimez ce que vous voyez?</p>
            <a 
              href="#contact" 
              className="bg-design-accent hover:bg-design-accent/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 inline-block"
            >
              Contactez-moi
            </a>
          </div>
        </div>
      </section>

      {/* Modal d'image */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-4xl max-h-[90vh] w-full bg-design-dark rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton de fermeture */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 text-white hover:scale-110"
              >
                <X size={20} />
              </button>

              {/* Image */}
              <div className="relative">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>

              {/* Informations du projet */}
              <div className="p-6 bg-gradient-to-t from-design-dark to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                    <p className="text-design-accent text-sm font-medium mb-3">
                      {selectedImage.category === 'logo' && 'Design de Logo'}
                      {selectedImage.category === 'web' && 'Design Web'}
                      {selectedImage.category === 'print' && 'Design Imprimé'}
                      {selectedImage.category === 'video' && 'Motion Design'}
                      {selectedImage.category === 'event' && 'Design Événementiel'}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {selectedImage.description}
                    </p>
                    {selectedImage.link !== '#' && (
                      <a
                        href={selectedImage.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-design-accent hover:bg-design-accent/90 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                      >
                        Voir le projet <ExternalLink size={16} className="ml-2" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Portfolio;

