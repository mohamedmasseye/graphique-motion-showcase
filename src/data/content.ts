/* ── Site-wide content data ──────────────────────────────────────
   Centralise tout le contenu éditable : navigation, services,
   processus, réseaux sociaux, defaults SEO, etc.
   Ne jamais inventer d'informations — utiliser uniquement les
   données réelles existantes.
   ──────────────────────────────────────────────────────────────── */

export const SITE = {
  name: 'Graphique & Motion',
  tagline: 'Studio Digital Créatif & Technologie',
  description:
    "Studio digital basé à Dakar, spécialisé dans la création de marques, sites web, applications et solutions digitales qui combinent design, technologie et stratégie.",
  url: 'https://graphiquemotion.com',
  email: 'support@graphiquemotion.com',
  phone: '+221775644478',
  phoneFormatted: '+221 77 564 44 78',
  address: 'Dakar, Sénégal',
  founder: 'Mohamed Masseye DIOP',
} as const;

/* ── Navigation ────────────────────────────────────────────────── */
export const NAV_LINKS = [
  { name: 'Réalisations', href: '/portfolio' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/a-propos' },
  { name: 'Processus', href: '/processus' },
  { name: 'Boutique', href: '/boutique' },
  { name: 'Contact', href: '/contact' },
] as const;

/* ── Services ──────────────────────────────────────────────────── */
export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  deliverables: string[];
  benefits: string[];
  problem: string;
  solution: string;
  seoTitle: string;
  seoDescription: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'branding-identite',
    title: 'Branding & Identité',
    shortTitle: 'Branding',
    description:
      'Créez des identités visuelles mémorables qui donnent à votre marque une présence forte et cohérente sur tous vos supports.',
    longDescription:
      "Votre identité visuelle est le premier contact que vos clients ont avec votre marque. Nous créons des logos, chartes graphiques et systèmes visuels qui communiquent votre identité de manière cohérente et professionnelle — du logo au kit réseaux sociaux.",
    icon: 'Palette',
    color: '#00B2AA',
    deliverables: [
      'Logo et déclinaisons',
      'Charte graphique complète',
      'Couleurs et typographies',
      'Kit réseaux sociaux',
      ' Supports imprimés',
    ],
    benefits: [
      'Marque reconnaissable immédiatement',
      'Cohérence sur tous les canaux',
      'Professionnalisme renforcé',
      'Différenciation concurrentielle',
    ],
    problem:
      "Sans identité visuelle cohérente, votre marque manque de crédibilité et se confond avec la concurrence.",
    solution:
      "Nous créons un système visuel complet qui reflète votre personnalité et communique vos valeurs.",
    seoTitle: 'Création de logo & identité visuelle à Dakar | Graphique & Motion',
    seoDescription:
      "Agence de branding à Dakar — création de logo, charte graphique, identité visuelle professionnelle au Sénégal.",
  },
  {
    slug: 'design-graphique',
    title: 'Design Graphique',
    shortTitle: 'Design',
    description:
      "Communication visuelle pour marques, campagnes, réseaux sociaux et marketing.",
    longDescription:
      "Du flyer à la affiche, du kit réseaux sociaux à la charte éditoriale — nous concevons des supports visuels qui captent l'attention et renforcent votre image de marque.",
    icon: 'PenTool',
    color: '#F5821F',
    deliverables: [
      'Flyers et affiches',
      'Kit réseaux sociaux',
      'Catalogues et brochures',
      'Cartes de visite',
      'Supports marketing',
    ],
    benefits: [
      'Supports professionnels',
      'Communication cohérente',
      'Prêt à imprimer et diffusion',
      'Adaptés à chaque canal',
    ],
    problem:
      'Des supports visuels médiocres affaiblissent votre communication et réduisent votre impact.',
    solution:
      "Nous concevons chaque support avec soin pour qu'il serve votre stratégie de communication.",
    seoTitle: 'Design graphique professionnel à Dakar | Graphique & Motion',
    seoDescription:
      "Design graphique à Dakar — flyers, affiches, supports marketing, réseaux sociaux au Sénégal.",
  },
  {
    slug: 'creation-site-web',
    title: 'Création de Site Web',
    shortTitle: 'Sites Web',
    description:
      'Sites web modernes, rapides et responsifs. Conçus pour convertir vos visiteurs en clients.',
    longDescription:
      'Un site web professionnel est la base de votre présence digitale. Nous créons des sites vitrines, corporate et institutionnels qui impressionnent vos visiteurs et les transforment en clients.',
    icon: 'Globe',
    color: '#378ADD',
    deliverables: [
      'Design sur mesure',
      'Responsive mobile + desktop',
      'Formulaire de contact',
      'SEO de base',
      'Hébergement 1 an inclus',
    ],
    benefits: [
      'Première impression professionnelle',
      'Accessible 24h/24, 7j/7',
      'Génère des leads automatiquement',
      'Optimisé pour Google',
    ],
    problem:
      "Sans site web, 75% de vos prospects potentiels ne vous trouvent même pas.",
    solution:
      'Nous créons un site rapide, magnifique et optimisé pour transformer les visiteurs en clients.',
    seoTitle: 'Création de site web professionnel au Sénégal | Graphique & Motion',
    seoDescription:
      "Création de site web au Sénégal — site vitrine, corporate, responsive, optimisé SEO. Livraison en 7 jours.",
  },
  {
    slug: 'developpement-web',
    title: 'Développement Web',
    shortTitle: 'Développement',
    description:
      "Applications web, plateformes et solutions digitales sur mesure pour votre entreprise.",
    longDescription:
      'Au-delà du site vitrine, nous développons des applications web complexes : plateformes SaaS, dashboards, systèmes de gestion, outils internes et APIs. La technologie au service de votre business.',
    icon: 'Code',
    color: '#7F77DD',
    deliverables: [
      'Application web sur mesure',
      'Dashboard et back-office',
      'APIs et intégrations',
      'Base de données',
      'Déploiement et maintenance',
    ],
    benefits: [
      'Automatisation des processus',
      'Outils adaptés à votre business',
      'Évolutivité et performance',
      'Maîtrise technique complète',
    ],
    problem:
      'Les outils génériques ne répondent pas à vos besoins spécifiques et limitent votre croissance.',
    solution:
      "Nous développons la solution exacte dont vous avez besoin, avec les technologies adaptées à votre projet.",
    seoTitle: 'Développement web sur mesure à Dakar | Graphique & Motion',
    seoDescription:
      "Développement web à Dakar — applications web, plateformes, APIs, solutions sur mesure au Sénégal.",
  },
  {
    slug: 'ecommerce',
    title: 'E-commerce',
    shortTitle: 'E-commerce',
    description:
      "Boutiques en ligne et expériences de commerce digital pensées pour vos clients et vos objectifs.",
    longDescription:
      'Lancez ou optimisez votre boutique en ligne. Nous créons des expériences e-commerce fluides, sécurisées et optimisées pour la conversion — de la sélection du produit au paiement.',
    icon: 'ShoppingBag',
    color: '#00B2AA',
    deliverables: [
      'Boutique en ligne complète',
      'Catalogue et gestion produits',
      'Paiement sécurisé',
      'Gestion des commandes',
      'Optimisation conversion',
    ],
    benefits: [
      'Vendez en ligne 24h/24',
      'Expérience d\'achat fluide',
      'Gestion simplifiée',
      'Croissance mesurable',
    ],
    problem:
      "Le commerce évolue vers le digital. Sans boutique en ligne, vous perdez une part croissante du marché.",
    solution:
      "Nous créons une boutique en ligne performante qui reflète votre marque et maximise les ventes.",
    seoTitle: 'Création boutique en ligne e-commerce au Sénégal | Graphique & Motion',
    seoDescription:
      "Création de boutique en ligne au Sénégal — e-commerce, paiement mobile, gestion commandes à Dakar.",
  },
  {
    slug: 'solutions-digitales',
    title: 'Solutions Digitales',
    shortTitle: 'Solutions',
    description:
      "Applications mobiles, PWA et plateformes digitales pour connecter votre business à vos utilisateurs.",
    longDescription:
      "Des applications mobiles natives aux PWA installables, nous créons des solutions digitales qui mettent votre business dans la poche de vos clients. Android, iOS ou les deux.",
    icon: 'Smartphone',
    color: '#F5821F',
    deliverables: [
      'Application Android / iOS',
      'PWA (installable)',
      'Notifications push',
      'Synchronisation données',
      'Publication sur les stores',
    ],
    benefits: [
      'Proximité avec vos clients',
      'Expérience native rapide',
      'Notifications et engagement',
      'Disponible partout',
    ],
    problem:
      "Vos clients sont sur mobile. Si votre business n'y est pas, ils vont ailleurs.",
    solution:
      "Nous développons une application mobile qui offre une expérience native à vos utilisateurs.",
    seoTitle: 'Création application mobile à Dakar | Graphique & Motion',
    seoDescription:
      "Création d'application mobile au Sénégal — Android, iOS, PWA, notifications push à Dakar.",
  },
  {
    slug: 'ia-automatisation',
    title: 'IA & Automatisation',
    shortTitle: 'IA & Auto',
    description:
      "Outils pilotés par l'IA, automatisation de workflows et solutions digitales intelligentes pour votre entreprise.",
    longDescription:
      "L'intelligence artificielle n'est plus réservée aux grandes entreprises. Nous intégrons l'IA et l'automatisation dans vos processus métier pour gagner du temps, réduire les coûts et améliorer vos résultats.",
    icon: 'Brain',
    color: '#378ADD',
    deliverables: [
      'Analyse de vos processus',
      'Intégration IA existante',
      'Automatisation de workflows',
      'Chatbots intelligents',
      'Formation à l\'utilisation',
    ],
    benefits: [
      'Gain de temps significatif',
      'Réduction des erreurs',
      'Décisions basées sur les données',
      'Compétitivité accrue',
    ],
    problem:
      "Vos équipes perdent du temps sur des tâches répétitives. L'IA peut les libérer pour créer de la valeur.",
    solution:
      "Nous identifions les opportunités d'automatisation et déployons des solutions IA adaptées à votre business.",
    seoTitle: 'Intelligence artificielle et automatisation au Sénégal | Graphique & Motion',
    seoDescription:
      "Solutions IA et automatisation au Sénégal — chatbots, workflows automatisés, outils intelligents à Dakar.",
  },
];

/* ── Process steps ─────────────────────────────────────────────── */
export interface ProcessStep {
  number: string;
  title: string;
  titleEn: string;
  description: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Découvrir',
    titleEn: 'Discover',
    description:
      "Comprendre votre entreprise, votre audience et vos objectifs pour définir le cadre du projet.",
  },
  {
    number: '02',
    title: 'Stratégiser',
    titleEn: 'Strategize',
    description:
      "Définir la direction digitale optimale — choix technologiques, architecture, parcours utilisateur.",
  },
  {
    number: '03',
    title: 'Designer',
    titleEn: 'Design',
    description:
      "Créer l'expérience visuelle et fonctionnelle — maquettes, prototypes, design system.",
  },
  {
    number: '04',
    title: 'Développer',
    titleEn: 'Build',
    description:
      "Construire la solution avec les technologies adaptées — code propre, performant, maintenable.",
  },
  {
    number: '05',
    title: 'Lancer',
    titleEn: 'Launch',
    description:
      "Déployer en production, tester, optimiser et former votre équipe à l'utilisation.",
  },
  {
    number: '06',
    title: 'Évoluer',
    titleEn: 'Grow',
    description:
      "Améliorer, maintenir et faire évoluer votre solution avec le temps. Un projet n'est jamais fini.",
  },
];

/* ── Social links ──────────────────────────────────────────────── */
export const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mohamed-masseye-diop/',
    label: 'Suivre sur LinkedIn',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/graphiquemotion',
    label: 'Suivre sur Instagram',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/share/18ZbMPjH39/?mibextid=wwXIfr',
    label: 'Suivre sur Facebook',
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/221775644478?text=Bonjour%20Graphique%20%26%20Motion',
    label: 'Discuter sur WhatsApp',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@graphiquemotion',
    label: 'Suivre sur TikTok',
  },
] as const;

/* ── SEO defaults ──────────────────────────────────────────────── */
export interface SeoMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export const SEO: Record<string, SeoMeta> = {
  home: {
    title: 'Studio Créatif Digital & Technologie à Dakar | Graphique & Motion',
    description:
      'Studio créatif et technologique à Dakar — branding, design, sites web, applications, solutions digitales, IA et automatisation. Livraison rapide.',
    ogImage: `${SITE.url}/og-image.png`,
  },
  services: {
    title: 'Nos Services | Graphique & Motion — Dakar, Sénégal',
    description:
      'Branding, design graphique, création de sites web, développement d\'applications, e-commerce, solutions IA. Services digitaux complets à Dakar.',
  },
  about: {
    title: 'À propos — Mohamed Masseye DIOP | Graphique & Motion',
    description:
      'Fondateur de Graphique & Motion, studio créatif et technologique basé à Dakar. Branding, web, IA, automatisation.',
  },
  projects: {
    title: 'Nos Réalisations | Graphique & Motion',
    description:
      'Découvrez nos projets — branding, sites web, applications mobiles, e-commerce, solutions digitales. Portfolio Graphique & Motion.',
  },
  process: {
    title: 'Notre Processus | Graphique & Motion',
    description:
      "De l'idée au lancement — notre méthode de travail en 6 étapes pour transformer vos projets en réalités digitales.",
  },
  pricing: {
    title: 'Nos Offres & Tarifs | Graphique & Motion — Dakar',
    description:
      'Offres de création web, branding et solutions digitales au Sénégal. Packs clairs, prix transparents, livraison rapide.',
  },
  blog: {
    title: 'Blog — Insights Digitals | Graphique & Motion',
    description:
      'Articles, conseils et insights sur le digital, le web design, la technologie et l\'entrepreneuriat au Sénégal.',
  },
  contact: {
    title: 'Contact | Graphique & Motion — Dakar, Sénégal',
    description:
      'Contactez Graphique & Motion pour votre projet digital. Réponse sous 24h. WhatsApp, email ou formulaire.',
  },
};

/* ── Budget options for contact form ───────────────────────────── */
export const BUDGET_OPTIONS = [
  { value: '<100k', label: 'Moins de 100 000 FCFA' },
  { value: '100k-250k', label: '100 000 – 250 000 FCFA' },
  { value: '250k-500k', label: '250 000 – 500 000 FCFA' },
  { value: '500k-1m', label: '500 000 – 1 000 000 FCFA' },
  { value: '1m+', label: 'Plus de 1 000 000 FCFA' },
  { value: 'discuss', label: 'À discuter' },
] as const;

/* ── WhatsApp URL helpers ──────────────────────────────────────── */
export function getWhatsAppUrl(text?: string): string {
  const msg = text
    ? encodeURIComponent(text)
    : encodeURIComponent('Bonjour Graphique & Motion, j\'ai un projet.');
  return `https://wa.me/221775644478?text=${msg}`;
}
