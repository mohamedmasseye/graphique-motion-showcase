import type { Variants, Transition } from 'framer-motion';

/* ── Shared easing curves ──────────────────────────────────────── */
export const ease: Transition = {
  ease: [0.22, 1, 0.36, 1],
  duration: 0.6,
};

export const easeSlow: Transition = {
  ease: [0.22, 1, 0.36, 1],
  duration: 0.8,
};

/* ── Fade variants ─────────────────────────────────────────────── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: ease },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: ease },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

/* ── Slide variants ────────────────────────────────────────────── */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: ease },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: ease },
};

/* ── Scale ─────────────────────────────────────────────────────── */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: ease },
};

/* ── Stagger container ─────────────────────────────────────────── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export const staggerContainerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

/* ── Child item (used inside stagger containers) ───────────────── */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: ease },
};

/* ── Image reveal (clip-path wipe) ─────────────────────────────── */
export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Section heading line ──────────────────────────────────────── */
export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Viewport defaults (useInView once) ────────────────────────── */
export const viewportOnce = { once: true, margin: '-80px' } as const;
