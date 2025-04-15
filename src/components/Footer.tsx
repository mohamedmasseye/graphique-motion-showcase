
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/de699b4d-f281-49b8-b42d-18ceb13b6677.png" 
              alt="Notion Logo" 
              className="h-24 w-auto object-contain" // Increased from h-12 to h-24
            />
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
