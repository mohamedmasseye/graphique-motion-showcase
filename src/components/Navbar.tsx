import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS, getWhatsAppUrl } from '@/data/content';

const Logo = '/lovable-uploads/71d36db5-bb9d-4336-8965-1ace529d6ed6.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Nav bar */}
        <div
          className={`mx-3 sm:mx-4 mt-3 transition-all duration-500 ${
            scrolled
              ? 'bg-[#0A0A0F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl'
              : 'bg-[#0A0A0F]/50 backdrop-blur-md border border-white/5 rounded-2xl'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <motion.img
                src={Logo}
                alt="Graphique & Motion"
                className="h-20 w-auto object-contain"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              />
            </Link>

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`relative font-syne text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200 group ${
                    isActive(link.href)
                      ? 'text-white'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-1 left-4 right-4 h-px bg-brand-teal transition-transform duration-300 origin-left rounded-full ${
                      isActive(link.href)
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-4 w-px bg-white/15" />
              <motion.a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-syne text-sm font-bold text-white px-5 py-2.5 rounded-xl inline-flex items-center gap-2"
                style={{ backgroundColor: '#00B2AA' }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(0,178,170,0.82)',
                  boxShadow: '0 0 22px rgba(0,178,170,0.45)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                Démarrer un projet
                <ArrowRight size={14} />
              </motion.a>
            </div>

            {/* Mobile burger */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/8 border border-white/10 text-white"
              whileTap={{ scale: 0.93 }}
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mx-3 sm:mx-4 mt-1 overflow-hidden rounded-2xl bg-[#0D0D14]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="p-4 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.04 }}
                  >
                    <Link
                      to={link.href}
                      className={`font-syne text-base font-semibold px-4 py-3 rounded-xl flex items-center transition-colors duration-150 ${
                        isActive(link.href)
                          ? 'text-white bg-white/6'
                          : 'text-white/65 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <div className="mt-2 pt-3 border-t border-white/8">
                  <motion.a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-syne font-bold text-sm bg-brand-teal text-white py-3.5 px-5 rounded-xl flex items-center justify-center gap-2 w-full"
                    whileTap={{ scale: 0.97 }}
                  >
                    Démarrer un projet
                    <ArrowRight size={14} />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-[88px]" />
    </>
  );
}
