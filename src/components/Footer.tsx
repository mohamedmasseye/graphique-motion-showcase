import { Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black py-12 overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] rounded-full bg-brand-teal/4 blur-[80px]" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo + tagline */}
          <div>
            <img
              src="/lovable-uploads/de699b4d-f281-49b8-b42d-18ceb13b6677.png"
              alt="Graphique & Motion"
              className="h-20 w-auto object-contain mb-3"
            />
            <p className="text-[#A0A0A0] text-sm max-w-xs">
              Agence digitale à Dakar — sites web, apps & branding professionnel.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap gap-6 text-sm text-[#A0A0A0]">
            {[
              { label: 'Accueil', href: '#home' },
              { label: 'Services', href: '#services' },
              { label: 'Portfolio', href: '#portfolio' },
              { label: 'Offres', href: '#pricing' },
              { label: 'Contact', href: '#contact' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="hover:text-brand-teal transition-colors cursor-pointer">
                {l.label}
              </a>
            ))}
          </div>

          {/* Social + copyright */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/18ZbMPjH39/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://www.instagram.com/graphiquemotion"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Instagram size={15} />
              </a>
            </div>
            <p className="text-[#A0A0A0] text-xs">
              © {year} GRAPHIQUE&MOTION. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
