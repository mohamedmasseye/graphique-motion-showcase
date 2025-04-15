import React, { useEffect, useRef } from 'react';
import { Calendar, Layers, Monitor, User } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
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
  
  return (
    <section id="about" ref={sectionRef} className="section-padding bg-design-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-design-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-design-accent mb-2 reveal">À PROPOS</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 reveal text-light-primary" data-delay="1">Mohamed Masseye DIOP</h3>
          <div className="w-20 h-1 bg-design-accent mx-auto mb-8 reveal" data-delay="2"></div>
          <p className="max-w-2xl mx-auto text-light-secondary reveal" data-delay="3">
            Fondateur de GRAPHIQUE&MOTION depuis 2014, je suis passionné par la création visuelle sous toutes ses formes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="reveal-left">
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-design-accent/20 to-design-tertiary/20 rounded-xl overflow-hidden">
                {/* Remplacer par votre photo */}
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                  <User size={64} />
                  <span className="ml-2 text-lg">Votre photo ici</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-24 bg-design-accent/10 rounded-lg backdrop-blur-sm border border-white/10 p-4">
                <div className="text-white">
                  <span className="text-design-accent font-medium">GRAPHIQUE&MOTION</span>
                  <p className="text-sm text-white/70">Établie en 2014</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-2xl font-bold mb-6 reveal-right text-light-primary">Ma passion pour le design</h4>
            <p className="text-light-secondary mb-6 reveal-right" data-delay="1">
              Depuis plus de 10 ans, je mets ma créativité et mon expertise technique au service de clients variés, des startups aux grandes entreprises. GRAPHIQUE&MOTION est née de ma passion pour l'art visuel et la communication graphique.
            </p>
            <p className="text-light-secondary mb-8 reveal-right" data-delay="2">
              Mon approche allie créativité, stratégie et précision technique pour donner vie à des projets visuels qui se démarquent et atteignent leurs objectifs.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="card-dark p-4 reveal-right" data-delay="3">
                <Layers className="text-design-accent mb-3" size={24} />
                <h5 className="font-medium mb-1">Design Graphique</h5>
                <p className="text-sm text-gray-400">Logos, identités visuelles, supports imprimés</p>
              </div>
              
              <div className="card-dark p-4 reveal-right" data-delay="4">
                <Monitor className="text-design-accent mb-3" size={24} />
                <h5 className="font-medium mb-1">Design Web</h5>
                <p className="text-sm text-gray-400">Sites web, interfaces, expériences interactives</p>
              </div>
              
              <div className="card-dark p-4 reveal-right" data-delay="5">
                <Calendar className="text-design-accent mb-3" size={24} />
                <h5 className="font-medium mb-1">Expérience</h5>
                <p className="text-sm text-gray-400">Plus de 10 ans dans le domaine créatif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
