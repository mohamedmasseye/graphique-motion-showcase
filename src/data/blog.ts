/* Articles du blog. Syntaxe des liens dans les textes : [texte](/chemin) ; gras : **texte**.
   Règle éditoriale : aucun chiffre, résultat ou statistique inventé. Les seuls montants cités sont les tarifs
   affichés sur la page /tarifs (src/data/pricing.json). */

export type Block = { h2: string } | { p: string } | { ul: string[] };

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: 'Web' | 'Design' | 'Business' | 'IA' | 'Technologie';
  date: string; // affichage
  published: string; // ISO (données structurées)
  readTime: string;
  body: Block[];
}

export const ARTICLES: Article[] = [
  /* ───────────────────────── 1 ───────────────────────── */
  {
    slug: 'creer-site-web-professionnel-senegal',
    title: 'Comment créer un site web professionnel au Sénégal ?',
    excerpt: 'Guide complet pour les entrepreneurs et entreprises qui souhaitent lancer leur présence en ligne au Sénégal.',
    category: 'Web', date: '25 novembre 2026', published: '2026-11-25', readTime: '7 min',
    body: [
      { p: 'Vous avez une activité qui marche grâce au bouche-à-oreille, à WhatsApp ou à Instagram, et vous vous demandez si un site web vaut la peine. Il vaut la peine quand il fait un travail précis : rassurer un client qui ne vous connaît pas, répondre à ses questions à votre place et lui donner un moyen simple de vous contacter ou de commander. Voici comment le construire, étape par étape.' },
      { h2: 'Commencez par l’objectif, pas par le design' },
      { p: 'Avant de choisir des couleurs ou un modèle, répondez à trois questions :' },
      { ul: [
        'Que doit faire le visiteur ? Vous appeler, vous écrire sur WhatsApp, demander un devis, commander, réserver.',
        'Qui sont vos clients, et par où arrivent-ils ? Un lien dans votre bio Instagram, une recherche sur Google, un lien envoyé par un ami.',
        'Quelles informations doivent absolument figurer ? Ce que vous vendez, vos prix ou vos fourchettes, votre zone, vos horaires, vos preuves (réalisations, avis).',
      ] },
      { p: 'Un site qui répond bien à ces trois questions sera toujours plus efficace qu’un site très joli mais flou.' },
      { h2: 'Choisir le bon type de site' },
      { ul: [
        '**Le site vitrine** présente votre activité : qui vous êtes, ce que vous faites, comment vous contacter. C’est le bon choix pour un service, un cabinet, un restaurant, un artisan, une école.',
        '**Le site e-commerce** permet de vendre en ligne : catalogue, panier, commande. Il demande plus de préparation (photos, descriptions, prix, livraison). Voir notre page [e-commerce](/services/ecommerce).',
        '**Le portfolio** met en valeur vos réalisations : photographes, designers, coachs, artistes, indépendants.',
        '**L’application web** va plus loin quand vous avez besoin d’un espace client, de réservations ou d’un outil interne.',
      ] },
      { h2: 'Le nom de domaine et l’hébergement' },
      { p: 'Le nom de domaine est l’adresse de votre site (par exemple monentreprise.com ou monentreprise.sn). L’hébergement est l’endroit où le site est stocké pour être accessible en permanence. Deux conseils simples :' },
      { ul: [
        'Choisissez un nom court, facile à dire à voix haute et à écrire sans faute.',
        'Exigez que le domaine soit enregistré à votre nom. Si le prestataire l’enregistre au sien, vous ne pourrez pas partir avec votre adresse le jour où vous voudrez changer.',
      ] },
      { h2: 'Les pages indispensables' },
      { p: 'Pour une petite entreprise, cinq pages suffisent souvent : un accueil clair, une page services ou produits, une page à propos, une page contact (avec un bouton WhatsApp et, si vous avez un local, l’adresse et les horaires) et les mentions légales. Ajoutez une page réalisations dès que vous avez de vrais projets à montrer.' },
      { h2: 'Pensez au téléphone d’abord' },
      { p: 'Il est probable que la plupart de vos visiteurs arrivent depuis un téléphone, souvent avec une connexion moyenne. Votre site doit donc s’afficher vite, avec des textes lisibles sans zoomer et des boutons assez grands pour être touchés du pouce. Demandez toujours à voir le site sur votre propre téléphone avant de valider.' },
      { h2: 'Les contenus font la différence' },
      { p: 'Un modèle de site ne remplace jamais de bons contenus. Utilisez de vraies photos de votre activité, rédigez des textes courts qui répondent aux questions de vos clients, et montrez ce que vous avez réellement réalisé. Ne laissez jamais de faux textes ou des photos d’illustration sans lien avec votre métier.' },
      { h2: 'Être trouvé : le référencement de base' },
      { p: 'Pour que Google comprenne votre site, chaque page a besoin d’un titre clair, d’une description et d’un contenu utile. Créez aussi votre fiche Google Business Profile si vous avez un lieu ou une zone d’activité : c’est souvent ce qui fait apparaître une entreprise locale dans les recherches. Pour aller plus loin, lisez [7 erreurs qui rendent un site web inefficace](/blog/7-erreurs-site-web-inefficace).' },
      { h2: 'Le paiement en ligne' },
      { p: 'Si vous vendez en ligne, regardez quelles solutions de paiement vos clients utilisent déjà, puis vérifiez que votre prestataire sait les intégrer. La mise en place dépend de la solution disponible pour votre activité : posez la question dès le début, avant de signer.' },
      { h2: 'Combien de temps faut-il ?' },
      { p: 'Cela dépend surtout de la rapidité avec laquelle vous fournissez textes, photos et validations. À titre d’exemple, notre Pack Vitrine, un site de 5 pages, est annoncé en 10 jours à partir du moment où nous avons vos contenus. Pour les budgets, consultez [combien coûte un site web au Sénégal](/blog/cout-creation-site-web-senegal).' },
      { h2: 'Comment choisir son prestataire' },
      { ul: [
        'Demandez des sites réels que vous pouvez ouvrir vous-même, pas seulement des images.',
        'Exigez un prix clair et la liste de ce qui est inclus (domaine, hébergement, nombre de pages, révisions).',
        'Vérifiez qui est propriétaire du domaine et des contenus.',
        'Demandez ce qui se passe après la livraison : maintenance, mises à jour, support.',
      ] },
      { p: 'Vous avez un projet ? Découvrez notre service de [création de site web](/services/creation-site-web) ou [écrivez-nous](/contact) : nous répondons sous 24 h.' },
    ],
  },

  /* ───────────────────────── 2 ───────────────────────── */
  {
    slug: 'cout-creation-site-web-senegal',
    title: 'Combien coûte la création d’un site web au Sénégal ?',
    excerpt: 'Les facteurs qui influencent le prix d’un site web et comment budgétiser votre projet digital.',
    category: 'Business', date: '25 novembre 2026', published: '2026-11-25', readTime: '6 min',
    body: [
      { p: 'C’est la première question que se posent presque tous les entrepreneurs, et la réponse honnête est : cela dépend de ce que vous voulez que le site fasse. Voici ce qui fait varier le prix, nos tarifs affichés, et les questions à poser avant de signer avec n’importe quel prestataire.' },
      { h2: 'Ce qui fait varier le prix d’un site' },
      { ul: [
        '**Le type de site** : une vitrine, une boutique en ligne et une application n’ont pas la même complexité.',
        '**Le nombre de pages** : plus il y a de pages à concevoir, rédiger et tester, plus le travail augmente.',
        '**Le design** : un design pensé pour votre marque demande plus de travail qu’un modèle adapté.',
        '**Les fonctionnalités** : paiement en ligne, réservation, espace client, multilingue, connexion à d’autres outils.',
        '**Les contenus** : textes, photos, logo. S’ils n’existent pas, il faut les créer ou les faire créer.',
        '**Le délai** : un projet urgent mobilise plus de ressources en peu de temps.',
        '**Ce qui est inclus après la livraison** : hébergement, domaine, maintenance, support.',
      ] },
      { h2: 'Nos tarifs affichés' },
      { p: 'Chez Graphique & Motion, nous affichons nos prix. Voici nos offres au moment où nous écrivons cet article (elles peuvent évoluer ; la page [Tarifs](/tarifs) fait toujours foi) :' },
      { ul: [
        '**Pack Starter, 200 000 FCFA** : logo professionnel (2 propositions et 2 révisions), charte couleurs et typographie, kit réseaux sociaux. Délai annoncé : 5 jours.',
        '**Pack Vitrine, 450 000 FCFA** : site de 5 pages adapté mobile et ordinateur, formulaire de contact, hébergement et domaine inclus pendant 1 an, SEO de base. Délai annoncé : 10 jours.',
        '**Pack Pro, 750 000 FCFA** : site jusqu’à 10 pages, application web installable (PWA), identité visuelle complète, 1 mois de support technique, SEO avancé. Délai annoncé : 21 jours.',
        '**Application native, dès 1 500 000 FCFA** : applications Android et iOS, design sur mesure, notifications, publication sur les stores. Délai selon cahier des charges.',
        '**Refonte Lifting, 250 000 FCFA** et **Refonte Complète, 500 000 FCFA** si vous avez déjà un site à moderniser ou à reconstruire.',
      ] },
      { h2: 'Les coûts qu’on oublie' },
      { p: 'Un site a des frais qui reviennent. Dans nos packs, le domaine et l’hébergement sont inclus la première année. Après cette période, leur renouvellement, ainsi que les nouvelles fonctionnalités, font l’objet d’un accord séparé. C’est vrai chez la plupart des prestataires : demandez toujours ce que coûtera la deuxième année.' },
      { h2: 'Les questions à poser avant de signer' },
      { ul: [
        'Que comprend exactement le prix : nombre de pages, révisions, domaine, hébergement ?',
        'Le nom de domaine sera-t-il enregistré à mon nom ?',
        'Combien coûte la deuxième année ?',
        'Qui s’occupe des mises à jour et des corrections, et pendant combien de temps ?',
        'Puis-je voir des sites réalisés par le prestataire, en ligne aujourd’hui ?',
        'Que se passe-t-il si je veux ajouter des pages ou une boutique plus tard ?',
      ] },
      { h2: 'Un prix très bas : à quoi faire attention' },
      { p: 'Un prix très bas peut cacher un modèle copié, un domaine enregistré au nom du prestataire, ou l’absence de support. Comparez toujours ce qui est livré, pas seulement le montant. Un site un peu plus simple mais bien fait, qui vous appartient, vaut mieux qu’un grand site que vous ne maîtrisez pas.' },
      { h2: 'Comment budgétiser votre projet' },
      { p: 'Commencez par l’essentiel : une première version qui répond à votre objectif, puis améliorez-la quand l’activité le permet. Prévoyez aussi un petit budget pour les contenus (photos de qualité, rédaction) et pour la suite (renouvellement, mises à jour). Pour savoir ce qui vous convient, lisez [comment créer un site web professionnel au Sénégal](/blog/creer-site-web-professionnel-senegal).' },
      { p: 'Vous voulez un devis adapté à votre projet ? [Contactez-nous](/contact) ou écrivez-nous sur WhatsApp : nous vous répondrons avec un prix clair et la liste de ce qui est inclus.' },
    ],
  },

  /* ───────────────────────── 3 ───────────────────────── */
  {
    slug: '7-erreurs-site-web-inefficace',
    title: '7 erreurs qui rendent un site web inefficace',
    excerpt: 'Les erreurs courantes qui font fuir vos visiteurs et comment les corriger.',
    category: 'Web', date: '25 novembre 2026', published: '2026-11-25', readTime: '6 min',
    body: [
      { p: 'Un site peut être joli et pourtant ne rapporter aucun client. Dans la plupart des cas, ce n’est pas un problème de beauté mais d’efficacité : le visiteur ne comprend pas, ne trouve pas ce qu’il cherche, ou ne sait pas comment vous joindre. Voici sept erreurs fréquentes et comment les corriger.' },
      { h2: '1. Le site est lent, surtout sur téléphone' },
      { p: 'Des images trop lourdes, trop de fonctionnalités inutiles ou un hébergement faible ralentissent l’affichage. Un visiteur qui attend a tendance à repartir. **Comment corriger :** compressez les images, supprimez ce qui ne sert à rien et testez le site sur un téléphone avec une connexion moyenne.' },
      { h2: '2. Il n’est pas pensé pour le mobile' },
      { p: 'Textes minuscules, boutons trop proches, menus qui débordent : il faut zoomer pour tout. **Comment corriger :** concevez d’abord pour l’écran du téléphone, puis adaptez à l’ordinateur. Vérifiez chaque page sur un vrai téléphone.' },
      { h2: '3. On ne peut pas vous joindre facilement' },
      { p: 'Pas de bouton WhatsApp, numéro non cliquable, formulaire caché : le client doit chercher comment vous écrire, et souvent il abandonne. **Comment corriger :** placez un bouton de contact visible sur chaque page, avec un numéro cliquable et un lien WhatsApp.' },
      { h2: '4. Le message est flou' },
      { p: 'Dès l’arrivée sur la page, le visiteur doit comprendre en quelques secondes ce que vous vendez, pour qui et dans quelle zone. **Comment corriger :** écrivez une phrase simple en haut de l’accueil, suivie d’un seul bouton d’action clair (demander un devis, commander, appeler).' },
      { h2: '5. Les contenus sont dépassés ou de mauvaise qualité' },
      { p: 'Anciens prix, horaires faux, produits épuisés, photos floues : au premier détail faux, la confiance baisse. **Comment corriger :** relisez votre site régulièrement, remplacez les photos faibles par de vraies photos de votre activité et supprimez ce qui n’est plus d’actualité.' },
      { h2: '6. Google ne vous trouve pas' },
      { p: 'Sans titre clair, sans description et sans fiche Google, une personne qui vous cherche tombe sur vos concurrents. **Comment corriger :** donnez à chaque page un titre et une description précis, ajoutez des mots que vos clients utilisent vraiment, et créez votre fiche Google Business Profile si vous avez un lieu ou une zone d’activité.' },
      { h2: '7. Personne ne vous dit si le site fonctionne' },
      { p: 'Beaucoup de sites sont mis en ligne puis oubliés : aucune mesure des visites, aucun suivi des demandes reçues. **Comment corriger :** mettez en place des statistiques simples, notez d’où viennent vos messages et ajustez le site en fonction de ce que vous constatez.' },
      { h2: 'Comment savoir si votre site a ces problèmes ?' },
      { p: 'Ouvrez votre site sur votre téléphone, comme un client, et demandez-vous : est-ce rapide ? Comprend-on ce que je vends ? Peut-on me joindre en un geste ? Si vous répondez non à l’une de ces questions, vous savez par où commencer.' },
      { p: 'Notre équipe peut analyser votre site et vous dire ce qui mérite d’être refait ou simplement amélioré. Découvrez nos offres de [refonte](/tarifs) ou [contactez-nous](/contact).' },
    ],
  },

  /* ───────────────────────── 4 ───────────────────────── */
  {
    slug: 'identite-visuelle-professionnelle',
    title: 'Comment créer une identité visuelle professionnelle ?',
    excerpt: 'Les étapes pour construire une marque visuelle forte et cohérente.',
    category: 'Design', date: '25 novembre 2026', published: '2026-11-25', readTime: '6 min',
    body: [
      { p: 'Une identité visuelle, c’est bien plus qu’un logo. C’est l’ensemble des éléments qui permettent à vos clients de vous reconnaître au premier coup d’œil, sur une carte de visite, un post Instagram, un emballage ou votre site web. Voici comment la construire avec méthode.' },
      { h2: 'Ce que contient une identité visuelle' },
      { ul: [
        'un **logo**, avec ses variantes (horizontale, icône seule, version une couleur) ;',
        'une **palette de couleurs** ;',
        'une ou deux **typographies** ;',
        'un **style d’images** (photos, illustrations, icônes) ;',
        'un **ton de voix** pour les textes ;',
        'des **règles d’utilisation**, réunies dans une charte graphique.',
      ] },
      { h2: 'Étape 1 : clarifier qui vous êtes' },
      { p: 'Avant de dessiner quoi que ce soit, mettez par écrit : ce que vous faites, pour qui, ce qui vous différencie, et trois mots qui décrivent l’image que vous voulez donner (par exemple : fiable, moderne, chaleureux). Ces mots guideront toutes les décisions suivantes.' },
      { h2: 'Étape 2 : regarder autour de vous' },
      { p: 'Observez les marques de votre secteur et celles que vous admirez. Le but n’est pas de copier, mais de repérer ce qui est déjà utilisé pour vous démarquer et pour rester crédible auprès de votre public.' },
      { h2: 'Étape 3 : le logo' },
      { p: 'Un bon logo est simple, lisible en très petit comme en grand, et reste reconnaissable en noir et blanc. Testez-le sur une photo de profil de réseau social, sur un tampon, sur un fond foncé et sur un fond clair. Demandez toujours les fichiers vectoriels et les variantes, pas seulement une image.' },
      { h2: 'Étape 4 : les couleurs' },
      { p: 'Choisissez une ou deux couleurs principales, une couleur d’accent, puis des neutres. Vérifiez que le texte reste lisible sur chaque fond. Trop de couleurs donne un résultat brouillon ; une palette restreinte est plus facile à garder cohérente.' },
      { h2: 'Étape 5 : les typographies' },
      { p: 'Une police pour les titres et une pour les textes suffisent. Choisissez des polices lisibles à l’écran, y compris sur un petit téléphone, et gardez-les partout.' },
      { h2: 'Étape 6 : la charte graphique' },
      { p: 'La charte rassemble le logo, les couleurs, les polices et les règles d’usage (espace minimum autour du logo, ce qu’il ne faut jamais faire). C’est ce qui permet à vous, à votre équipe et à vos prestataires de rester cohérents dans le temps.' },
      { h2: 'Étape 7 : déployer partout' },
      { p: 'Appliquez l’identité de façon identique sur vos réseaux sociaux, votre site, vos documents, votre signalétique et vos emballages. La cohérence se voit : c’est elle qui donne une impression de sérieux.' },
      { h2: 'Les erreurs courantes' },
      { ul: [
        'un logo trop détaillé, illisible en petit ;',
        'plusieurs polices et plus de trois couleurs sans logique ;',
        'une identité différente sur chaque réseau ;',
        'un logo copié ou acheté sans en vérifier les droits ;',
        'ne pas conserver les fichiers sources.',
      ] },
      { h2: 'Combien de temps et que prévoir ?' },
      { p: 'Notre Pack Starter (200 000 FCFA) comprend un logo professionnel avec 2 propositions et 2 révisions, une charte couleurs et typographie, et un kit réseaux sociaux prêt à l’emploi, avec un délai annoncé de 5 jours. Pour une identité complète, voir aussi notre service de [branding et identité](/services/branding-identite).' },
      { p: 'Une identité forte sert ensuite de base à votre site : voir [comment créer un site web professionnel](/blog/creer-site-web-professionnel-senegal). Besoin d’aide ? [Parlons de votre projet](/contact).' },
    ],
  },

  /* ───────────────────────── 5 ───────────────────────── */
  {
    slug: 'pme-intelligence-artificielle',
    title: 'Comment une PME peut utiliser l’intelligence artificielle ?',
    excerpt: 'Applications concrètes de l’IA pour les petites et moyennes entreprises au Sénégal.',
    category: 'IA', date: '25 novembre 2026', published: '2026-11-25', readTime: '7 min',
    body: [
      { p: 'L’intelligence artificielle n’est pas réservée aux grandes entreprises. Utilisée avec méthode, elle peut faire gagner du temps sur des tâches répétitives et aider à mieux communiquer. Utilisée sans recul, elle peut aussi produire des erreurs. Voici des usages concrets, les précautions à prendre et une façon simple de démarrer.' },
      { h2: 'Des usages concrets pour une PME' },
      { ul: [
        '**Rédiger et reformuler** : légendes de réseaux sociaux, descriptions de produits, réponses à des messages, premiers jets de documents. À relire et corriger toujours.',
        '**Répondre aux questions fréquentes** : un assistant sur votre site ou votre messagerie peut répondre aux demandes simples (horaires, tarifs, modalités) et passer la main à un humain pour le reste.',
        '**Trier et résumer** : messages, e-mails, comptes rendus, notes vocales transcrites en texte.',
        '**Traduire** des documents et des échanges avec des clients ou fournisseurs.',
        '**Préparer des visuels et des idées** : pistes de campagnes, plans de contenus, premières ébauches graphiques.',
        '**Analyser des données simples** : mettre en forme un tableau de ventes, repérer des tendances, préparer un rapport.',
      ] },
      { h2: 'Les précautions à prendre' },
      { ul: [
        '**Relisez tout.** L’IA peut se tromper avec beaucoup d’assurance. Elle ne remplace pas votre jugement.',
        '**Protégez les données.** Ne saisissez pas d’informations confidentielles ou personnelles de clients dans un outil dont vous ne maîtrisez pas les conditions.',
        '**Gardez le lien humain.** Pour les sujets sensibles (réclamations, négociations), la relation directe reste plus rassurante.',
        '**Vérifiez les droits** sur les images et contenus générés avant de les utiliser dans vos communications.',
        '**Surveillez les coûts** : beaucoup d’outils ont un abonnement qui s’additionne.',
      ] },
      { h2: 'Comment démarrer sans se disperser' },
      { ul: [
        'Choisissez **une seule tâche** répétitive qui vous prend du temps chaque semaine.',
        'Testez un outil sur cette tâche pendant deux semaines.',
        'Notez simplement le temps que vous passiez avant et celui que vous passez maintenant.',
        'Gardez ce qui marche, abandonnez le reste, puis passez à une autre tâche.',
      ] },
      { h2: 'IA et automatisation : deux choses complémentaires' },
      { p: 'L’IA sait comprendre et produire du texte ou des images ; l’automatisation enchaîne des étapes toute seule (envoyer une confirmation, mettre à jour un tableau). Ensemble, elles permettent par exemple de recevoir une demande, de la classer, de préparer une réponse et de prévenir la bonne personne. Pour la partie automatisation, lisez [comment automatiser les processus de votre entreprise](/blog/automatiser-entreprise).' },
      { h2: 'Et pour une PME au Sénégal ?' },
      { p: 'Le plus utile est souvent de partir de vos habitudes : beaucoup de clients vous écrivent sur WhatsApp, vous répondez souvent aux mêmes questions, vous gérez des commandes ou des réservations à la main. C’est là que l’IA et l’automatisation apportent le plus, parce qu’elles s’appuient sur des usages que vous avez déjà.' },
      { p: 'Vous voulez savoir par où commencer dans votre entreprise ? Découvrez notre service [IA & automatisation](/services/ia-automatisation) ou [écrivez-nous](/contact) : nous commençons par comprendre vos tâches avant de proposer le moindre outil.' },
    ],
  },

  /* ───────────────────────── 6 ───────────────────────── */
  {
    slug: 'automatiser-entreprise',
    title: 'Comment automatiser les processus de votre entreprise ?',
    excerpt: 'Gagner du temps et réduire les erreurs grâce à l’automatisation digitale.',
    category: 'Technologie', date: '25 novembre 2026', published: '2026-11-25', readTime: '6 min',
    body: [
      { p: 'Automatiser, c’est confier à un outil une suite d’actions que vous faites aujourd’hui à la main, toujours de la même façon. L’objectif n’est pas de remplacer les gens mais de leur retirer les tâches répétitives, de réduire les oublis et les erreurs, et de gagner du temps pour le reste.' },
      { h2: 'Quelles tâches automatiser en priorité ?' },
      { p: 'Cherchez les tâches qui ont quatre caractéristiques à la fois :' },
      { ul: [
        'elles se répètent souvent (chaque jour ou chaque semaine) ;',
        'elles suivent des règles claires, sans besoin de jugement ;',
        'elles sont sujettes aux oublis ou aux erreurs ;',
        'elles vous font perdre du temps que vous pourriez mieux utiliser.',
      ] },
      { h2: 'Des exemples concrets' },
      { ul: [
        'envoyer automatiquement une confirmation à un client après une commande, un paiement ou une réservation ;',
        'prévenir l’équipe dès qu’une nouvelle commande ou une nouvelle demande arrive ;',
        'générer et envoyer des reçus ou des factures ;',
        'envoyer des rappels de rendez-vous ou de paiement ;',
        'enregistrer automatiquement les réponses d’un formulaire dans un tableau ;',
        'mettre à jour les stocks ou les statuts de commande ;',
        'sauvegarder régulièrement des fichiers et des données importantes.',
      ] },
      { h2: 'La méthode en cinq étapes' },
      { ul: [
        '**1. Décrire** la tâche telle qu’elle est faite aujourd’hui, étape par étape, avec les personnes concernées.',
        '**2. Simplifier** : supprimer les étapes inutiles avant d’automatiser. Automatiser un mauvais processus ne fait que l’aggraver.',
        '**3. Choisir l’outil** : un outil sans code suffit pour les cas simples ; une solution sur mesure est préférable quand le processus est propre à votre métier ou doit se connecter à votre site.',
        '**4. Tester à petite échelle** sur quelques cas avant de généraliser.',
        '**5. Surveiller** : prévoir une alerte en cas d’échec et vérifier régulièrement que tout fonctionne.',
      ] },
      { h2: 'Les pièges à éviter' },
      { ul: [
        'automatiser trop de choses d’un coup ;',
        'dépendre d’un outil sans pouvoir récupérer vos données ;',
        'oublier un plan B quand l’automatisation tombe en panne ;',
        'envoyer des messages automatiques froids ou impersonnels à vos clients ;',
        'traiter des données personnelles sans en protéger l’accès.',
      ] },
      { h2: 'Un site web connecté à vos processus' },
      { p: 'Un site peut être le point de départ de plusieurs automatisations : commande, formulaire, réservation, notification. Si vous n’avez pas encore de site, commencez par [comment créer un site web professionnel](/blog/creer-site-web-professionnel-senegal). Si vous en avez un, regardez comment il peut déclencher des actions utiles à votre équipe.' },
      { p: 'Vous avez une tâche répétitive qui vous pèse ? Découvrez nos [solutions digitales](/services/solutions-digitales) et notre service [IA & automatisation](/services/ia-automatisation), ou [décrivez-nous votre besoin](/contact).' },
    ],
  },
];
