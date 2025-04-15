
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="text-2xl font-bold text-white flex items-center">
              <span className="text-design-accent">GRAPHIQUE</span>
              <span className="text-white">&</span>
              <span className="text-design-tertiary">MOTION</span>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} GRAPHIQUE&MOTION. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Conçu avec passion par Mohamed Masseye DIOP
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
