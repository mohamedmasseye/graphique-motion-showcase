/* Source unique des pages publiques pour le SEO :
   - scripts/prerender.mjs : génère un HTML par page (titre, description, h1, texte, liens)
   - functions/sitemap.xml.ts : sitemap complet
   Les titres suivent la même règle que le composant <Head> (nom du site ajouté s'il manque). */
import { SITE, SERVICES } from './content';
import { ARTICLES, type Block } from './blog';

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro?: string;
  points?: string[];
  ogImage?: string;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
  type?: 'website' | 'article';
  blocks?: Block[];
  published?: string;
}

const full = (t: string) => (t.includes(SITE.name) ? t : `${t} | ${SITE.name}`);

export const OG_CONCOURS = `${SITE.url}/og-concours.png`;

const STATIC: SeoRoute[] = [
  {
    path: '/', priority: 1, changefreq: 'weekly',
    title: full('Création Site Web & Application Mobile Dakar'),
    description: 'Agence digitale au Sénégal : site web, application mobile, identité visuelle. Tarifs affichés, devis gratuit. +221 77 564 44 78',
    h1: 'On construit des expériences digitales qui comptent.',
    intro: 'Graphique & Motion est un studio créatif et technologique basé à Dakar : branding, design, création de sites web, applications mobiles, e-commerce, IA et automatisation pour les entreprises ambitieuses.',
  },
  {
    path: '/concours', priority: 0.9, changefreq: 'daily', ogImage: OG_CONCOURS,
    title: full('Jeu concours · Gagnez votre site web'),
    description: 'Graphique & Motion offre deux sites web à deux entrepreneurs : un site neuf (e-commerce, vitrine ou portfolio) et une refonte complète. Domaine, hébergement et maintenance compris pendant un an. Du 30 novembre au 17 décembre 2026 sur Instagram.',
    h1: 'Gagnez votre site web',
    intro: 'Deux sites web offerts à deux entrepreneurs, du 30 novembre au 17 décembre 2026, avec tirage au sort en direct le 19 décembre.',
    points: [
      'Lot 1, Création : un site neuf (e-commerce jusqu’à 30 produits, vitrine ou portfolio)',
      'Lot 2, Refonte : votre site actuel entièrement repensé, jusqu’à 10 pages',
      'Dans les deux cas : nom de domaine, hébergement et maintenance pendant 1 an',
      'Pour participer : suivre @graphiquemotion sur Instagram, commenter CRÉATION ou REFONTE et identifier 2 personnes',
    ],
  },
  {
    path: '/concours/reglement', priority: 0.5, changefreq: 'monthly', ogImage: OG_CONCOURS,
    title: full('Règlement du jeu concours · Gagnez votre site web'),
    description: 'Règlement complet du jeu concours « Gagnez votre site web » organisé par Graphique & Motion, du 30 novembre au 17 décembre 2026.',
    h1: 'Règlement du jeu concours « Gagnez votre site web »',
    intro: 'Organisateur, durée, conditions de participation, lots, tirage au sort, remise des lots, données personnelles et litiges.',
  },
  {
    path: '/services', priority: 0.9, changefreq: 'monthly',
    title: full('Nos Services'),
    description: 'Branding, design graphique, création de sites web, développement d\'applications, e-commerce, solutions IA. Services digitaux complets à Dakar.',
    h1: 'Nos services digitaux à Dakar',
    intro: 'Du logo au site e-commerce, de l\'application mobile à l\'automatisation par l\'IA : une seule équipe pour votre présence digitale.',
  },
  {
    path: '/portfolio', priority: 0.8, changefreq: 'weekly',
    title: full('Nos Réalisations'),
    description: 'Découvrez nos projets — branding, sites web, applications, e-commerce, solutions digitales. Portfolio Graphique & Motion — Dakar, Sénégal.',
    h1: 'Nos réalisations',
    intro: 'Sites web, e-commerce, applications et identités visuelles réalisés pour des entreprises au Sénégal.',
  },
  {
    path: '/tarifs', priority: 0.8, changefreq: 'monthly',
    title: full('Nos Offres & Tarifs'),
    description: 'Offres de création web, branding et solutions digitales au Sénégal. Packs clairs, prix transparents, livraison rapide.',
    h1: 'Nos offres et tarifs',
    intro: 'Des packs clairs et des prix affichés en FCFA pour la création de site web, le branding et les solutions digitales.',
  },
  {
    path: '/a-propos', priority: 0.6, changefreq: 'monthly',
    title: full('À propos de Graphique & Motion — Studio digital à Dakar'),
    description: 'Graphique & Motion est un studio créatif et technologique basé à Dakar, fondé par Mohamed Masseye DIOP : branding, sites web, applications, IA et automatisation.',
    h1: 'À propos de Graphique & Motion',
    intro: 'Un studio créatif et technologique basé à Dakar, qui combine design, technologie et stratégie.',
  },
  {
    path: '/a-propos/mohamed-diop', priority: 0.5, changefreq: 'monthly',
    title: full(`${SITE.founder} — Ingénieur Digital & Télécom · Technologie · IA`),
    description: 'Fondateur de Graphique & Motion. Ingénieur digital & télécom, technologie, IA, entrepreneurship. Basé à Dakar, Sénégal.',
    h1: SITE.founder,
    intro: 'Fondateur de Graphique & Motion, ingénieur digital & télécom basé à Dakar.',
  },
  {
    path: '/processus', priority: 0.6, changefreq: 'monthly',
    title: full('Notre Processus'),
    description: 'De l\'idée au lancement — notre méthode de travail en 6 étapes pour transformer vos projets en réalités digitales.',
    h1: 'Notre processus en 6 étapes',
    intro: 'De l\'idée au lancement : la méthode que nous suivons pour chaque projet.',
  },
  {
    path: '/blog', priority: 0.6, changefreq: 'weekly',
    title: full('Blog'),
    description: 'Articles, conseils et insights sur le digital, le web design, la technologie et l\'entrepreneuriat au Sénégal.',
    h1: 'Le blog Graphique & Motion',
    intro: 'Conseils pratiques sur le web, le digital et l\'entrepreneuriat au Sénégal.',
  },
  {
    path: '/contact', priority: 0.7, changefreq: 'monthly',
    title: full('Contact'),
    description: 'Contactez Graphique & Motion pour votre projet digital. Réponse sous 24h. WhatsApp, email ou formulaire.',
    h1: 'Contactez Graphique & Motion',
    intro: `Écrivez-nous à ${SITE.email} ou appelez le ${SITE.phoneFormatted}. Réponse sous 24 h.`,
  },
  {
    path: '/boutique', priority: 0.7, changefreq: 'daily',
    title: full('Boutique'),
    description: 'La boutique en ligne de Graphique & Motion : produits et solutions digitales, paiement sécurisé.',
    h1: 'La boutique Graphique & Motion',
  },
];

const SERVICE_ROUTES: SeoRoute[] = SERVICES.map((s) => ({
  path: `/services/${s.slug}`, priority: 0.8, changefreq: 'monthly',
  title: full(s.seoTitle), description: s.seoDescription, h1: s.title,
  intro: s.longDescription,
  points: [...s.deliverables, ...s.benefits],
}));

const BLOG_ROUTES: SeoRoute[] = ARTICLES.map((a) => ({
  path: `/blog/${a.slug}`, priority: 0.6, changefreq: 'monthly', type: 'article',
  title: full(a.title), description: a.excerpt, h1: a.title, intro: a.excerpt, blocks: a.body, published: a.published,
}));

export const SEO_ROUTES: SeoRoute[] = [...STATIC, ...SERVICE_ROUTES, ...BLOG_ROUTES];
export const SERVICE_SLUGS: string[] = SERVICES.map((s) => s.slug);
export const ARTICLE_SLUGS: string[] = ARTICLES.map((a) => a.slug);
