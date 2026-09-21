# YARA — version statique de validation
Prototype React/Vite autonome, sans PHP, API, base de données ni authentification réelle.
Données fictives incluses dans le code. Les modifications et demandes de paiement restent en mémoire et sont réinitialisées à l’actualisation. Aucun e-mail ni virement n’est envoyé.
Le bouton « Ouvrir la démo sans compte » permet d’accéder directement au dashboard.
Parcours inclus : inscription avec lien social, connexion, vérification simulée, mot de passe oublié, dashboard, liens, commandes, revenus, paiements, catalogue/contenus et profil.
Cette version présente l’espace influenceur ; le CRM PHP n’est pas inclus.
Ne saisir que des informations fictives. Les liens commerciaux affichés sont des exemples, sans attribution réelle.

## GitHub et Vercel
1. Créer un dépôt GitHub privé et y déposer le contenu de ce dossier (sans node_modules ni dist).
2. Dans Vercel : Add New Project → importer ce dépôt.
3. Framework : Vite. Build : npm run build. Output : dist.
4. Aucune variable d’environnement ni base de données à configurer.
5. Déployer et partager l’URL fournie par Vercel. L’accès direct au dashboard est /#overview.
Le fichier vercel.json contient déjà ces réglages.
Si ce dossier est placé dans un dépôt existant, le sélectionner comme Root Directory dans Vercel.

## Local
Node 22 recommandé.
npm ci
npm run dev

## Export compilé
npm run build
dist/ contient le site statique autonome. Les routes utilisent # et ne nécessitent pas de réécriture serveur.
