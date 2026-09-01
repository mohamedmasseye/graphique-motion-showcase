import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SITE, NAV_LINKS, SOCIAL_LINKS, getWhatsAppUrl } from '@/data/content';

const Logo = '/lovable-uploads/de699b4d-f281-49b8-b42d-18ceb13b6677.png';

const FOOTER_NAV = [
  { name: 'Services', href: '/services' },
  { name: 'Work', href: '/portfolio' },
  { name: 'About', href: '/a-propos' },
  { name: 'Process', href: '/processus' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

const SERVICE_LINKS = [
  { name: 'Branding', href: '/services/branding-identite' },
  { name: 'Design', href: '/services/design-graphique' },
  { name: 'Sites Web', href: '/services/creation-site-web' },
  { name: 'Développement', href: '/services/developpement-web' },
  { name: 'E-commerce', href: '/services/ecommerce' },
  { name: 'IA & Automatisation', href: '/services/ia-automatisation' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-black pt-16 pb-8 overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-teal/40 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] rounded-full bg-brand-teal/4 blur-[80px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-5">
              <img src={Logo} alt={SITE.name} className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-[#A0A0A0] text-sm leading-relaxed max-w-xs mb-6">
              {SITE.description}
            </p>
            <p className="text-white/30 text-xs">{SITE.address}</p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-syne text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {FOOTER_NAV.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#A0A0A0] text-sm hover:text-brand-teal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h4 className="font-syne text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-[#A0A0A0] text-sm hover:text-brand-teal transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + Social */}
          <div className="lg:col-span-3">
            <h4 className="font-syne text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 mb-8">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[#A0A0A0] text-sm hover:text-brand-teal transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="text-[#A0A0A0] text-sm hover:text-brand-teal transition-colors"
                >
                  {SITE.phoneFormatted}
                </a>
              </li>
            </ul>

            <h4 className="font-syne text-xs font-bold uppercase tracking-[0.15em] text-white/40 mb-4">
              Suivez-nous
            </h4>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-[#A0A0A0] text-xs font-medium hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-200"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-white/8 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © {year} {SITE.name}. Tous droits réservés.
            </p>
            <a
              href={getWhatsAppUrl("J'ai une idée, construisons-la ensemble.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-white/40 text-xs hover:text-brand-teal transition-colors"
            >
              Une idée ? Construisons-la.
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
