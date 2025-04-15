import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Project } from '@/types/project';
import projectsData from '@/data/projects.json';

type Category = 'all' | 'logo' | 'web' | 'print' | 'video';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<Project['category']>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectsData.projects);
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projectsData.projects);
    } else {
      setFilteredProjects(projectsData.projects.filter(project => project.category === activeCategory));
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
  
  const categories = [
    { id: 'all', name: 'Tous' },
    { id: 'logo', name: 'Logos' },
    { id: 'web', name: 'Web' },
    { id: 'print', name: 'Print' },
    { id: 'video', name: 'Vidéo' }
  ];
  
  return (
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
              onClick={() => setActiveCategory(category.id as Project['category'])}
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
              className="group relative overflow-hidden rounded-xl card-hover reveal"
              data-delay={(index % 3) + 1}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                <div>
                  <h4 className="text-xl font-medium text-white mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    {project.category === 'logo' && 'Design de Logo'}
                    {project.category === 'web' && 'Design Web'}
                    {project.category === 'print' && 'Design Imprimé'}
                    {project.category === 'video' && 'Motion Design'}
                  </p>
                  <a 
                    href={project.link}
                    className="inline-flex items-center text-sm text-design-accent hover:text-design-accent/80 transition-colors"
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
  );
};

export default Portfolio;
