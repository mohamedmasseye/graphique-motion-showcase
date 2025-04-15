import React, { useEffect, useRef } from 'react';
import { Box, Brush, Image, Layout, Pen, PlayCircle, Printer, Type } from 'lucide-react';

const Services = () => {
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
  
  const services = [
    {
      icon: <Pen />,
      title: "Création de Logo",
      description: "Identités visuelles distinctives et mémorables qui représentent parfaitement votre marque."
    },
    {
      icon: <Layout />,
      title: "Design Web",
      description: "Sites web modernes, responsifs et optimisés pour une expérience utilisateur exceptionnelle."
    },
    {
      icon: <Printer />,
      title: "Supports Imprimés",
      description: "Cartes de visite, flyers, affiches et tous types de supports imprimés de qualité professionnelle."
    },
    {
      icon: <Brush />,
      title: "Identité Visuelle",
      description: "Développement complet de l'identité de votre marque, de la couleur à la typographie."
    },
    {
      icon: <Box />,
      title: "Packaging",
      description: "Design d'emballages créatifs qui attirent l'attention et augmentent la valeur perçue."
    },
    {
      icon: <Type />,
      title: "Typographie",
      description: "Sélection et création de typographies personnalisées pour renforcer votre message."
    },
    {
      icon: <PlayCircle />,
      title: "Vidéos Institutionnelles",
      description: "Montages vidéo professionnels pour présenter votre entreprise ou vos produits."
    },
    {
      icon: <Image />,
      title: "Retouche Photo",
      description: "Traitement d'image de haute qualité pour sublimer vos visuels et photos."
    }
  ];
  
  return (
    <section id="services" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-design-dark dark:via-black dark:to-design-dark"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm uppercase tracking-widest text-design-accent mb-2 reveal">Services</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 reveal text-light-primary" data-delay="1">Mes Expertises</h3>
          <div className="w-20 h-1 bg-design-accent mx-auto mb-8 reveal" data-delay="2"></div>
          <p className="max-w-2xl mx-auto text-light-secondary reveal" data-delay="3">
            Une gamme complète de services créatifs pour répondre à tous vos besoins en communication visuelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="card-dark p-6 card-hover reveal"
              data-delay={index % 4 + 1}
            >
              <div className="w-12 h-12 rounded-lg bg-design-accent/10 flex items-center justify-center mb-4 text-design-accent">
                {service.icon}
              </div>
              <h4 className="text-xl font-medium mb-3 text-light-primary">{service.title}</h4>
              <p className="text-light-secondary text-sm">{service.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center reveal" data-delay="5">
          <a 
            href="#contact" 
            className="bg-design-accent hover:bg-design-accent/90 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 inline-block"
          >
            Discutons de votre projet
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
