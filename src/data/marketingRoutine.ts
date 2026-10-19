// Checklists de la page Routine. Contenu fixe, cases mémorisées dans le navigateur.
export interface RoutineBlock {
  id: 'daily' | 'weekly' | 'monthly' | 'once';
  title: string;
  reset: string;
  items: { id: string; label: string }[];
}

export const ROUTINE: RoutineBlock[] = [
  {
    id: 'daily', title: 'Chaque jour', reset: 'remise à zéro chaque jour',
    items: [
      { id: 'd1', label: 'Matin : ouvrir Planning, voir les publications du jour et leurs fichiers' },
      { id: 'd2', label: 'Poster à la main ce qui est marqué « À la main » (stories avec sticker, repartages)' },
      { id: 'd3', label: 'À l’heure de publication : vérifier que le post est bien sorti sur chaque réseau' },
      { id: 'd4', label: 'Dans l’heure qui suit : 20 min pour répondre aux commentaires (une vraie phrase) et aux DM « PROJET »' },
      { id: 'd5', label: 'Soir : passer les publications faites en « Publié » dans Planning' },
    ],
  },
  {
    id: 'weekly', title: 'Chaque dimanche', reset: 'remise à zéro chaque semaine',
    items: [
      { id: 'w1', label: 'Ouvrir Analyses (7 jours) et noter vues, interactions et conversations entrantes' },
      { id: 'w2', label: 'Relever le meilleur et le moins bon contenu de la semaine, et pourquoi' },
      { id: 'w3', label: 'Programmer la semaine suivante dans Adaptly (après validation du tableau)' },
      { id: 'w4', label: 'Mettre à jour le plan : « Synchroniser le plan » après modification' },
    ],
  },
  {
    id: 'monthly', title: 'Chaque mois', reset: 'remise à zéro chaque mois',
    items: [
      { id: 'm1', label: 'Fixer l’objectif du mois (conversations entrantes, pas les likes)' },
      { id: 'm2', label: 'Revoir les mots-clics : garder ceux qui amènent des vues, remplacer les autres' },
      { id: 'm3', label: 'Vérifier la cohérence des prix publiés avec graphiquemotion.com/tarifs' },
      { id: 'm4', label: 'Vérifier que les comptes Adaptly sont toujours connectés' },
    ],
  },
  {
    id: 'once', title: 'À faire une seule fois', reset: 'jamais remis à zéro',
    items: [
      { id: 'o1', label: 'Créer le jeton AdaptlyPost en lecture seule (analytics.read)' },
      { id: 'o2', label: 'Ajouter ADAPTLYPOST_API_KEY dans les variables Cloudflare Pages' },
      { id: 'o3', label: 'Obtenir l’accord de Coach Aimée (vidéo + collab @blackiefit)' },
      { id: 'o4', label: 'Déployer la correction d’AgriUni (chiffres non prouvés retirés)' },
    ],
  },
];

export const RULES = [
  'AgriUni : plateforme du fondateur, en phase de lancement. Jamais « notre client », aucun chiffre.',
  'BlackieFit : projet client. Aucun chiffre, ne pas dire « codé à la main », ne jamais filmer l’admin.',
  'Prix : uniquement ceux affichés sur graphiquemotion.com/tarifs.',
  'Employeur : aucune capture, procédure ni nom de produit interne.',
  'X : pas de lien dans le texte.',
  'Toujours montrer la liste complète (texte, fichier, heure, comptes) avant de programmer.',
];
