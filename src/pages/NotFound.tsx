import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';
import Head from '@/components/Head';

export default function NotFound() {
  return (
    <>
      <Head
        title="Page introuvable"
        description="La page que vous recherchez n'existe pas ou a été déplacée."
      />

      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #050509 0%, #0A0C15 50%, #060810 100%)',
        }}
      >
        {/* Atmospheric glow */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-brand-teal/6 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/3 w-[300px] h-[200px] rounded-full bg-brand-orange/4 blur-[80px]" />

        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,178,170,1) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-4"
        >
          {/* 404 number */}
          <motion.div
            className="font-syne text-[10rem] sm:text-[14rem] md:text-[18rem] font-black leading-none tracking-tight text-white/[0.04] select-none pointer-events-none"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            404
          </motion.div>

          {/* Content over the number */}
          <div className="relative -mt-24 sm:-mt-32 md:-mt-40">
            <p className="text-brand-teal text-sm font-semibold uppercase tracking-[0.2em] mb-4">
              Erreur
            </p>
            <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Cette page s'est échappée.
            </h1>
            <p className="text-[#A0A0A0] text-lg max-w-md mx-auto mb-10 leading-relaxed">
              Elle n'existe plus ou a été déplacée. Pas de panique, on peut vous remettre sur la bonne route.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 bg-brand-teal text-white font-bold py-3.5 px-8 rounded-full text-sm hover:bg-brand-teal/85 transition-all"
              >
                <Home size={15} />
                Retour à l'accueil
              </Link>
              <Link
                to="/realisations"
                className="group inline-flex items-center gap-2 bg-white/5 border border-white/15 text-white font-semibold py-3.5 px-8 rounded-full text-sm hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Voir nos réalisations
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
