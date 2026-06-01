import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

/* Séparateur de section stylisé ─────────────────────────────────── */
function Divider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative z-10 overflow-visible">
      <div className="section-divider" style={flip ? { transform: 'scaleX(-1)' } : undefined} />
    </div>
  );
}

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('active'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el));

    const handleScroll = () => {
      document.querySelectorAll<HTMLElement>('.parallax').forEach((el) => {
        const speed = el.getAttribute('data-speed') || '0.5';
        el.style.transform = `translateY(${window.scrollY * Number(speed)}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const id = (this as HTMLAnchorElement).getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (target) {
          const navH = document.querySelector('nav')?.offsetHeight || 0;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH, behavior: 'smooth' });
        }
      });
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Grain noise texture — fixe, plein écran */}
      <div className="grain-overlay" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-x-hidden"
      >
        <Navbar />
        <Hero />
        <Divider />
        <About />
        <Divider flip />
        <Services />
        <Divider />
        <Portfolio />
        <Divider flip />
        <Pricing />
        <Divider />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </motion.div>
    </>
  );
};

export default Index;
