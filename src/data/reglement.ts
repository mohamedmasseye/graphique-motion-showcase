/* Règlement du jeu concours « Gagnez votre site web ».
   Texte repris de la version v3 (Reglement-Jeu-Concours-Gagnez-votre-site-web-v3.docx).
   Syntaxe : **gras** ; un bloc est soit un paragraphe (string), soit une liste ({ list: [...] }). */

export type Bloc = string | { list: string[] };
export interface Article { n: number; slug: string; titre: string; blocs: Bloc[] }

export const REGLEMENT: Article[] = [
  {
    n: 1, slug: 'organisateur', titre: 'Organisateur',
    blocs: [
      'Le jeu concours « Gagnez votre site web » (ci-après « le Concours ») est organisé par **Graphique & Motion**, représentée par Mohamed Masseye DIOP, Dakar (Sénégal), NINEA 013068483 (ci-après « l’Organisateur »). Contact : support@graphiquemotion.com · +221 77 564 44 78.',
    ],
  },
  {
    n: 2, slug: 'duree', titre: 'Durée',
    blocs: [
      'Le Concours se déroule du **lundi 30 novembre 2026 à 18 h 00** au **jeudi 17 décembre 2026 à 23 h 59** (heure de Dakar, GMT). Le tirage au sort a lieu le **samedi 19 décembre 2026**. L’Organisateur peut prolonger, suspendre ou annuler le Concours en cas de nécessité, en l’annonçant sur ses comptes.',
    ],
  },
  {
    n: 3, slug: 'participants', titre: 'Qui peut participer',
    blocs: [{ list: [
      'Toute personne physique majeure, ou toute entreprise, exerçant ou projetant d’exercer une activité commerciale au Sénégal.',
      'Le compte Instagram du participant doit être public pendant toute la durée du Concours et jusqu’au tirage.',
      'Sont exclus : l’Organisateur, ses collaborateurs, et leurs proches directs.',
      'Une seule participation valable par personne (ou par entreprise), tous comptes confondus. Les comptes multiples, comptes créés pour l’occasion et comptes automatisés sont exclus.',
    ] }],
  },
  {
    n: 4, slug: 'lots', titre: 'Les lots',
    blocs: [
      '**Lot 1, « Création » :** création d’un site web neuf au choix du gagnant : site e-commerce (jusqu’à 30 produits), site vitrine ou portfolio, la mise en place du nom de domaine et de l’hébergement pour une durée de 1 an, et la maintenance technique pendant 1 an à compter de la mise en ligne. Pour un site e-commerce, la mise en place du paiement en ligne dépend de la solution de paiement dont dispose le gagnant : elle est réalisée si une solution compatible est disponible et n’est pas garantie.',
      '**Lot 2, « Refonte » :** refonte complète du site existant du gagnant (nouveau design et nouvelle structure) comprenant jusqu’à 10 pages, la migration de son contenu, le nom de domaine et l’hébergement pour une durée de 1 an si nécessaire, et la maintenance technique pendant 1 an à compter de la mise en ligne. Le site est reconstruit avec les technologies de l’Organisateur ; le gagnant doit pouvoir lui donner accès à son contenu et à son nom de domaine.',
      '**Maintenance :** mises à jour, sauvegardes, surveillance et corrections de dysfonctionnements. Les évolutions et nouvelles fonctionnalités, ainsi que le renouvellement du domaine et de l’hébergement après la première année, ne sont pas compris et font l’objet d’un accord séparé.',
      'Les lots ne sont ni échangeables, ni cessibles, ni convertibles en argent. Un même gagnant ne peut remporter qu’un seul lot.',
    ],
  },
  {
    n: 5, slug: 'participation', titre: 'Comment participer',
    blocs: [
      'Pour participer, il faut, pendant la durée du Concours, accomplir les trois actions suivantes sur Instagram :',
      { list: [
        '**1.** suivre le compte **@graphiquemotion** ;',
        '**2.** commenter la publication du Concours en indiquant le lot visé, **« CRÉATION »** ou **« REFONTE »**, suivi d’une phrase décrivant son activité ou son projet ;',
        '**3.** identifier **2 personnes** dans ce même commentaire.',
      ] },
      '**Participation bonus :** republier la publication du Concours en story Instagram en identifiant @graphiquemotion donne une chance supplémentaire (la participation compte double au tirage). Elle n’est pas obligatoire.',
      'Le Concours étant également relayé sur d’autres réseaux, seule la participation sur Instagram est prise en compte. Un seul commentaire par personne est comptabilisé. Un commentaire incomplet ou ne désignant aucun lot n’est pas valable.',
    ],
  },
  {
    n: 6, slug: 'tirage', titre: 'Tirage au sort',
    blocs: [{ list: [
      'Le 18 décembre 2026, l’Organisateur établit la liste des participations valables, séparément pour chaque lot.',
      'Un gagnant est tiré au sort parmi les participations valables de chaque lot, par un procédé aléatoire, lors d’un tirage diffusé en direct sur le compte TikTok de l’Organisateur (@graphiquemotion) ou, si le direct est impossible, filmé et publié en intégralité sur ses réseaux sociaux, afin de garantir la transparence. Les participations bonus comptent double.',
      'Deux suppléants sont tirés au sort pour chaque lot, dans le même ordre, pour le cas où un gagnant serait disqualifié ou injoignable.',
      'Si la même personne est tirée pour les deux lots, elle choisit l’un d’eux et un nouveau tirage est effectué pour l’autre.',
    ] }],
  },
  {
    n: 7, slug: 'remise', titre: 'Annonce et remise des lots',
    blocs: [{ list: [
      'Les gagnants sont annoncés sur le compte Instagram @graphiquemotion et contactés par message privé le jour du tirage.',
      'Un gagnant qui ne répond pas dans un délai de 5 jours est déclaré renonçant : le premier suppléant le remplace.',
      'Le gagnant fournit les contenus nécessaires (textes, photos, produits, accès) dans un délai de 15 jours après le contact. La réalisation est livrée dans un délai de 30 jours après réception complète des contenus ; tout retard de transmission décale la livraison d’autant.',
      'Calendrier prévisionnel : début des travaux du lot 1 à partir du 21 décembre 2026 ; début des travaux du lot 2 en janvier 2027, après la livraison du lot 1. Les dates exactes sont confirmées par écrit à chaque gagnant.',
    ] }],
  },
  {
    n: 8, slug: 'engagements', titre: 'Engagements du gagnant',
    blocs: [
      'En acceptant le lot, le gagnant autorise l’Organisateur à présenter le site réalisé comme réalisation dans son portfolio et sur ses réseaux, à publier son nom (ou celui de son entreprise), son logo et un témoignage s’il en donne un, et à documenter la création du site (captures, vidéos du chantier). Il garantit être titulaire des droits sur les contenus qu’il fournit (textes, images, logos, produits).',
    ],
  },
  {
    n: 9, slug: 'donnees', titre: 'Données personnelles',
    blocs: [
      'Les données recueillies (nom du compte, contenu du commentaire, coordonnées du gagnant) sont utilisées uniquement pour la gestion du Concours, la désignation et la prise de contact avec les gagnants. Elles ne sont pas cédées à des tiers. Les participants peuvent demander l’accès, la rectification ou la suppression de leurs données en écrivant à support@graphiquemotion.com, dans le respect de la législation sénégalaise applicable à la protection des données personnelles.',
    ],
  },
  {
    n: 10, slug: 'responsabilite', titre: 'Responsabilité et réseaux sociaux',
    blocs: [{ list: [
      'Ce Concours n’est ni sponsorisé, ni géré, ni associé à Instagram, Facebook, TikTok, LinkedIn ou Meta. Les participants fournissent leurs informations à l’Organisateur, et non à ces plateformes.',
      'L’Organisateur n’est pas responsable des dysfonctionnements des réseaux sociaux ou des connexions, ni d’un commentaire non affiché ou supprimé.',
      'L’Organisateur peut écarter tout participant ayant triché, fourni de fausses informations ou contrevenu au présent règlement.',
    ] }],
  },
  {
    n: 11, slug: 'acceptation', titre: 'Acceptation et litiges',
    blocs: [
      'La participation au Concours implique l’acceptation entière du présent règlement. Il est disponible sur demande et à l’adresse graphiquemotion.com/concours/reglement, indiquée en bio du compte @graphiquemotion. Il est régi par le droit sénégalais. Tout litige relève, à défaut d’accord amiable, des tribunaux compétents de Dakar.',
    ],
  },
];
