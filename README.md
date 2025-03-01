# SecureVault - Gestionnaire de Mots de Passe

SecureVault est une application web sécurisée de gestion de mots de passe qui vous permet de stocker et gérer vos informations d'identification de manière sûre et organisée.

## Fonctionnalités

- 🔐 Stockage sécurisé des mots de passe avec chiffrement AES
- 📂 Organisation des mots de passe par catégories (Personnel, Travail, Finance)
- 🔍 Recherche et filtrage des mots de passe
- 🎲 Générateur de mots de passe forts
- 👁️ Affichage/Masquage des mots de passe
- 📋 Copie rapide des mots de passe dans le presse-papiers
- 🌐 Gestion des URLs associées aux comptes

## Technologies Utilisées

- React.js avec TypeScript
- Tailwind CSS pour le style
- CryptoJS pour le chiffrement
- Lucide React pour les icônes

## Sécurité

- Chiffrement AES-256 pour tous les mots de passe stockés
- Aucun mot de passe n'est stocké en clair
- Verrouillage automatique de l'application après inactivité (à venir)
- Protection contre les attaques XSS et CSRF

## Installation

1. Clonez le dépôt :
```bash
git clone [url-du-repo]
```

2. Dans le fichier .env, mettez votre clé API et l'URL de Supabase.
   
3. Installez les dépendances :
```bash
npm install
```

4. Lancez l'application en mode développement :
```bash
npm run dev
```

## Utilisation

1. Ajout d'un nouveau mot de passe :
   - Cliquez sur le bouton "New Password"
   - Remplissez les informations requises
   - Utilisez le générateur de mot de passe si nécessaire
   - Sauvegardez le mot de passe

2. Gestion des mots de passe :
   - Utilisez la barre de recherche pour trouver des mots de passe
   - Filtrez par catégorie en utilisant le menu latéral
   - Cliquez sur l'icône d'œil pour afficher/masquer les mots de passe
   - Utilisez l'icône de copie pour copier rapidement un mot de passe

## Roadmap

- [ ] Authentification des utilisateurs
- [ ] Synchronisation multi-appareils
- [ ] Export/Import des mots de passe
- [ ] Mode sombre
- [ ] Applications mobiles
- [ ] Extension navigateur

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur le dépôt GitHub.
