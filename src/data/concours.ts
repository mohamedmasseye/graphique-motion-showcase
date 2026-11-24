import { useEffect, useState } from 'react';

/* ── Jeu concours « Gagnez votre site web » ────────────────────────
   Toutes les heures sont en heure de Dakar (GMT = UTC).            */
export const CONCOURS = {
  start: new Date('2026-11-30T18:00:00Z'),
  end: new Date('2026-12-17T23:59:59Z'),
  draw: new Date('2026-12-19T00:00:00Z'),
  /** le bandeau et l'encart d'accueil disparaissent après cette date */
  hideAfter: new Date('2026-12-27T00:00:00Z'),
  instagram: 'https://www.instagram.com/graphiquemotion',
  tiktok: 'https://www.tiktok.com/@graphiquemotion',
  path: '/concours',
  reglementPath: '/concours/reglement',
  reglementVersion: '24 novembre 2026',
};

export type Phase = 'avant' | 'ouvert' | 'clos' | 'termine';

export function getPhase(now: Date = new Date()): Phase {
  if (now < CONCOURS.start) return 'avant';
  if (now <= CONCOURS.end) return 'ouvert';
  if (now < new Date('2026-12-20T00:00:00Z')) return 'clos';
  return 'termine';
}

export function isConcoursVisible(now: Date = new Date()): boolean {
  return now < CONCOURS.hideAfter;
}

/** Heure courante rafraîchie (pour les comptes à rebours). */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { jours: Math.floor(s / 86400), heures: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), secondes: s % 60 };
}

/* ── Les lots ──────────────────────────────────────────────────── */
export const LOTS = [
  {
    id: 'creation',
    numero: '01',
    nom: 'Création',
    motCle: 'CRÉATION',
    pour: 'Pour l’entrepreneur qui n’a pas encore de site.',
    accroche: 'Un site neuf, pensé pour votre activité.',
    points: [
      'Site e-commerce (jusqu’à 30 produits), site vitrine ou portfolio, au choix',
      'Design sur mesure, adapté au mobile',
      'Paiement en ligne mis en place selon la solution dont vous disposez',
    ],
    image: '/concours/ecommerce.jpg',
    images: [
      { src: '/concours/ecommerce.jpg', label: 'E-commerce' },
      { src: '/concours/vitrine.jpg', label: 'Vitrine' },
      { src: '/concours/portfolio.jpg', label: 'Portfolio' },
    ],
    couleur: '#00B2AA',
  },
  {
    id: 'refonte',
    numero: '02',
    nom: 'Refonte',
    motCle: 'REFONTE',
    pour: 'Pour l’entrepreneur dont le site ne le sert plus.',
    accroche: 'Votre site actuel, entièrement repensé.',
    points: [
      'Nouveau design et nouvelle structure, jusqu’à 10 pages',
      'Migration de votre contenu existant',
      'Reconstruit avec les technologies de Graphique & Motion',
    ],
    image: '/concours/refonte.jpg',
    images: [{ src: '/concours/refonte.jpg', label: 'Refonte · BlackieFit' }],
    couleur: '#F5821F',
  },
] as const;

export const INCLUS = [
  { titre: 'Nom de domaine', detail: '1 an offert' },
  { titre: 'Hébergement', detail: '1 an offert' },
  { titre: 'Maintenance', detail: '1 an offerte' },
] as const;

export const ETAPES = [
  { n: '1', titre: 'Abonnez-vous', texte: 'Suivez le compte Instagram @graphiquemotion.' },
  { n: '2', titre: 'Commentez', texte: 'Sous la publication du concours, écrivez « CRÉATION » ou « REFONTE », suivi d’une phrase sur votre activité.' },
  { n: '3', titre: 'Identifiez 2 personnes', texte: 'Dans ce même commentaire, identifiez deux personnes.' },
] as const;

export const CALENDRIER = [
  { date: '30 nov.', heure: '18h00', titre: 'Ouverture du concours', texte: 'Publication du concours sur Instagram.' },
  { date: '17 déc.', heure: '23h59', titre: 'Clôture des participations', texte: 'Dernier moment pour commenter.' },
  { date: '19 déc.', heure: 'En direct', titre: 'Tirage au sort', texte: 'En direct sur TikTok @graphiquemotion, un gagnant par lot.' },
  { date: '21 déc.', heure: 'Dès le', titre: 'Début des travaux', texte: 'Lot Création d’abord, puis lot Refonte en janvier 2027.' },
] as const;

export const FAQ = [
  { q: 'La participation est-elle payante ?', r: 'Non. Participer est entièrement gratuit et ne demande aucun achat.' },
  { q: 'Qui peut participer ?', r: 'Toute personne majeure, ou toute entreprise, qui exerce ou projette d’exercer une activité commerciale au Sénégal. Votre compte Instagram doit rester public jusqu’au tirage.' },
  { q: 'Puis-je tenter les deux lots ?', r: 'Non : une seule participation par personne (ou par entreprise). Choisissez le lot qui vous correspond, CRÉATION ou REFONTE.' },
  { q: 'Je vois le concours sur Facebook, TikTok ou LinkedIn. Je peux commenter là-bas ?', r: 'Le concours est relayé sur plusieurs réseaux, mais seules les participations sur Instagram sont prises en compte.' },
  { q: 'Comment fonctionne le bonus ?', r: 'Partagez la publication du concours en story Instagram en identifiant @graphiquemotion : votre participation compte double au tirage. C’est facultatif.' },
  { q: 'Que se passe-t-il après la première année ?', r: 'Le renouvellement du nom de domaine et de l’hébergement, ainsi que les nouvelles fonctionnalités, ne sont pas compris dans le lot. Ils font l’objet d’un accord séparé, si vous le souhaitez.' },
] as const;
