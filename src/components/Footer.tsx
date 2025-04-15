
import React from 'react';
// Changement d'importation pour utiliser le chemin direct
import Logo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/724c9a3c-46ac-4cdf-b270-73bc0e5401aa.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Tous droits réservés.
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
