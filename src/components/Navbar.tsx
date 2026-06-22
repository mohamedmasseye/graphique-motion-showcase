import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Logo = '/lovable-uploads/71d36db5-bb9d-4336-8965-1ace529d6ed6.png';

const navLinks = [
  { name: 'Accueil', href: '#home' },
  { name: 'À propos', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'Offres', href: '#pricing' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smart navigation: hash links scroll on home, navigate cross-page otherwise
  const handleNav = (e: React.MouseEvent, href: string) => {
    setIsOpen(false);

    // Real route (e.g. /boutique) → let router handle via navigate
    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      return;
    }

    // Hash link
    e.preventDefault();
    if (location.pathname !== '/') {
      // Go to home then scroll to the section
      navigate('/' + href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        const navH = document.querySelector('nav')?.offsetHeight || 0;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - navH, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* ── Desktop / tablet nav ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glass pill that floats on scroll */}
        <div
          className={`mx-4 mt-3 transition-all duration-500 ${
            scrolled
              ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl'
              : 'bg-[#0A0A0F]/60 backdrop-blur-md border border-white/6 rounded-2xl'
          }`}
        >
          <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
            {/* Logo */}
            <motion.a
              href="/#home"
              onClick={(e) => handleNav(e, '#home')}
              className="flex items-center shrink-0 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <img
                src={Logo}
                alt="Graphique & Motion"
                className="h-20 w-auto object-contain"
              />
            </motion.a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href.startsWith('/') ? link.href : '/' + link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className={`relative font-syne text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer transition-colors duration-200 group ${
                    link.name === 'Offres'
                      ? 'text-brand-teal'
                      : 'text-white/65 hover:text-white'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                  whileHover={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    transition: { duration: 0.15 },
                  }}
                >
                  {link.name}
                  {link.name !== 'Offres' && (
                    <span className="absolute bottom-1 left-4 right-4 h-px bg-brand-teal scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                  )}
                  {link.name === 'Offres' && (
                    <motion.span
                      className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-brand-orange"
                      animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.a>
              ))}
            </div>

            {/* CTA desktop */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                className="h-4 w-px bg-white/15"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              />
              <motion.a
                href="https://wa.me/221775644478?text=Bonjour%20Graphique%20%26%20Motion"
                target="_blank"
                rel="noopener noreferrer"
                className="font-syne text-sm font-bold text-white px-5 py-2 rounded-xl cursor-pointer"
                style={{ backgroundColor: '#00B2AA', boxShadow: '0 0 0px rgba(0,178,170,0)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, type: 'spring', stiffness: 300 }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(0,178,170,0.82)',
                  boxShadow: '0 0 22px rgba(0,178,170,0.45)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Démarrer →
              </motion.a>
            </div>

            {/* Mobile burger */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 text-white cursor-pointer"
              whileTap={{ scale: 0.93 }}
              aria-label={isOpen ? 'Fermer' : 'Menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mx-4 mt-1 overflow-hidden rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="p-4 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href.startsWith('/') ? link.href : '/' + link.href}
                    className={`font-syne text-base font-semibold px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                      link.name === 'Offres'
                        ? 'text-brand-teal bg-brand-teal/8'
                        : 'text-white/70 hover:text-white hover:bg-white/6'
                    }`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    onClick={(e) => handleNav(e, link.href)}
                  >
                    {link.name}
                    {link.name === 'Offres' && (
                      <span className="text-[10px] font-bold bg-brand-teal/20 text-brand-teal px-2 py-0.5 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </motion.a>
                ))}

                {/* Mobile CTA */}
                <div className="mt-2 pt-3 border-t border-white/8">
                  <motion.a
                    href="https://wa.me/221775644478?text=Bonjour%20Graphique%20%26%20Motion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-syne font-bold text-sm bg-brand-teal text-white py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 cursor-pointer w-full"
                    onClick={() => setIsOpen(false)}
                    whileTap={{ scale: 0.97 }}
                  >
                    Démarrer un projet →
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer so content doesn't hide behind nav */}
      <div className="h-[88px]" />
    </>
  );
}
