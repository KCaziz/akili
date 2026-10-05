# Akili — Site Agence Immobilière — Task Tracker

## 0. Rôle de ce fichier

Ce fichier est la source de vérité du projet.

Claude Code doit :
1. Lire ce fichier avant toute intervention.
2. Identifier les tâches réalisables selon leurs dépendances.
3. Travailler dans l'ordre des phases défini ci-dessous.
4. Ne pas commencer une tâche dont les dépendances ne sont pas terminées.
5. Après chaque tâche terminée, mettre à jour son statut dans ce fichier.
6. Ajouter une note courte lorsqu'une décision technique importante est prise.
7. Vérifier le résultat avant de passer à la tâche suivante.
8. Ne pas élargir le périmètre sans signaler clairement l'impact sur le délai.
9. Ne jamais commiter, pousser ni gérer le dépôt Git sans demande explicite de l'utilisateur.

Statuts :
- `❌ todo` : non commencée
- `🚧 in-progress` : en cours
- `✅ done` : terminée et vérifiée
- `⛔ blocked` : bloquée par un problème ou une décision externe

Priorités :
- `🔴 high` : indispensable pour le MVP
- `🟡 medium` : importante mais peut être simplifiée
- `🟢 low` : confort / amélioration / V2

---

# 1. Résumé du projet

Site web pour une agence immobilière (Akili), avec une partie publique (vitrine + catalogue produits) et un espace d'échange client/agence (offres, demandes, contact), ainsi qu'un back-office admin.

## Sections du site public

1. **Présentation** — qui est l'agence Akili, son activité, ses valeurs.
2. **Services** — présentation des services proposés par l'agence.
3. **Produits** — catalogue des biens proposés par l'agence (liste + fiche détail).
4. **Contact** — formulaire email + lien/API WhatsApp.
5. **Vendre (Offre)** — formulaire permettant à un client de proposer un bien à la vente.
6. **Demande** — formulaire permettant à un client de formuler une demande sur un produit ou un service.

## Espace Admin

- Gestion des produits/services : ajout, modification, suppression.
- Gestion des demandes clients : consultation + mise en relation (contact depuis l'admin).
- Gestion des offres de vente reçues (soumises via la section « Vendre »).

Note : la liste des sections ci-dessus est basée sur les informations fournies le 2026-10-05. Le client a signalé qu'il pourrait manquer une section — à confirmer et ajouter si besoin, sans que cela remette en cause l'architecture déjà posée.

## Stack imposée

- Frontend : React (Vite)
- Backend : Express / Node.js
- Base de données : PostgreSQL

## Étape en cours (2026-10-05)

Objectif immédiat : squelette frontend uniquement, pour une démonstration visuelle. Le backend et la base de données ne sont pas encore implémentés — seules la structure des dossiers et les routes API prévues sont documentées pour cadrer le développement futur.

---

# 2. Architecture cible simplifiée

```text
React (client/)
  |
  | HTTPS / API (à venir)
  v
Express / Node.js (server/ — non démarré)
  |
  +---- Produits / Services (CRUD admin)
  |
  +---- Offres de vente (soumissions clients)
  |
  +---- Demandes clients (soumissions + suivi admin)
  |
  +---- Contact (email + lien WhatsApp)
  |
  +---- Auth admin (accès back-office)
  |
  v
PostgreSQL (non démarré)
```

---

# 3. Planning global

| Phase | Objectif |
|---|---|
| Phase 0 | Squelette frontend (démonstration) |
| Phase 1 | Socle technique complet (backend + BD) + pages publiques finalisées |
| Phase 2 | Formulaires fonctionnels (Vendre, Demande, Contact) + emails/WhatsApp |
| Phase 3 | Back-office Admin (CRUD produits/services, gestion demandes/offres) |
| Phase 4 | Sécurité, tests, mise en production |

Le détail chiffré (durées, jalons, acomptes) est dans l'offre de service, pas dans ce fichier technique.

---

# PHASE 0 — SQUELETTE FRONTEND (DÉMONSTRATION)

## Objectif

Donner une première visualisation du site au client : navigation entre toutes les sections prévues, avec un contenu minimal/placeholder mais une structure définitive. Aucune logique métier réelle (pas d'appel API, pas de sauvegarde).

### P0-01 — Initialisation du projet frontend
- Statut : `✅ done`
- Priorité : `🔴 high`
- Dépendances : aucune

Tâches :
- Initialiser le projet React avec Vite.
- Mettre en place `react-router-dom`.
- Structure de dossiers (`components`, `pages`, `layouts`, `router`).
- Layout global (header, navigation, footer).

Réalisé :
- `client/` : React 19 + Vite 8 (`npm create vite@latest -- --template react`), `react-router-dom` installé.
- `router/index.jsx` : `createBrowserRouter`, deux arborescences distinctes — `MainLayout` (site public) et `AdminLayout` (back-office), sans layout partagé entre les deux (aucune navigation publique ne doit apparaître dans l'admin et inversement).
- `layouts/MainLayout.jsx` : Header + `<Outlet/>` + Footer. `layouts/AdminLayout.jsx` : sidebar de navigation admin + `<Outlet/>`.
- `components/layout/Header.jsx`, `Navigation.jsx`, `Footer.jsx` : header sticky, navigation principale (6 sections), menu mobile (burger) avec état local.
- `components/ui/Button.jsx`, `Container.jsx`, `Card.jsx` : composants réutilisables.
- `index.css` : feuille de style unique, thème sobre agence immobilière (bleu nuit + accent doré), responsive (breakpoint 860px).

Tests effectués :
- `npm run build` : compilation réussie, aucune erreur.
- `npm run lint` (oxlint) : aucun avertissement (un avertissement initial sur `new Date()` impur dans `Footer.jsx` corrigé en sortant le calcul du rendu).

Révision design (2026-10-05, retour client « squelette trop pauvre ») :
- Refonte complète de la palette : vert profond (`--color-primary` / `--color-dark`) + accent doré (`--color-accent`), fond ivoire, boutons arrondis en pilule, ombres douces, police Google Fonts « Plus Jakarta Sans ».
- Page d'accueil enrichie avec de vraies photos (Unsplash, usage de démonstration uniquement — **à remplacer par de vraies photos de l'agence/des biens avant mise en production**) : section hero plein écran avec image + overlay dégradé, section « Qui sommes-nous » illustrée, bande d'appel à l'action finale illustrée.
- Catalogue produits (`data/mockProducts.js`) : chaque produit factice a maintenant une vraie image Unsplash au lieu d'un encart gris « Photo du bien ».
- Toutes les images externes vérifiées accessibles (`curl` → `200`) avant intégration.

### P0-02 — Pages publiques (placeholder)
- Statut : `✅ done`
- Priorité : `🔴 high`
- Dépendances : `P0-01`

Pages :
- Présentation (`/`)
- Services (`/services`)
- Produits (`/produits`) + fiche produit (`/produits/:id`)
- Contact (`/contact`)
- Vendre / Offre (`/vendre`)
- Demande (`/demande`)

Réalisé :
- `pages/HomePage.jsx` : présentation de l'agence + mise en avant des 4 domaines de service.
- `pages/ServicesPage.jsx` : 4 services présentés sous forme de cartes (vente, location, estimation, accompagnement administratif) — contenu provisoire, à valider par le client.
- `pages/products/ProductsPage.jsx` + `ProductDetailPage.jsx` (route `/produits/:id`) : catalogue en grille + fiche détail, alimentés par des données factices (`data/mockProducts.js`), pas d'appel API.
- `pages/ContactPage.jsx` : formulaire (nom/email/message) + bouton WhatsApp (`wa.me`, numéro placeholder à remplacer). Le formulaire affiche un message honnête indiquant qu'aucun envoi réel n'est encore effectué.
- `pages/SellPage.jsx` (`/vendre`) : formulaire de proposition de bien (type, ville, surface, prix, description).
- `pages/RequestPage.jsx` (`/demande`) : formulaire de demande client (produit ou service).
- `pages/NotFoundPage.jsx` : page 404.

Décisions techniques / signalements :
- **Aucun des 3 formulaires publics n'envoie de données réelles** : ni sauvegarde en base, ni email, ni appel API — c'est un squelette de démonstration. Chaque formulaire affiche un message explicite à ce sujet après soumission plutôt qu'une fausse confirmation. Le câblage réel est prévu en Phase 2.
- **Numéro WhatsApp** : placeholder (`213000000000`) dans `ContactPage.jsx` — à remplacer par le vrai numéro de l'agence avant toute mise en ligne. Choix API WhatsApp Business vs lien simple `wa.me` encore ouvert (voir section 4 de ce fichier).
- **Catalogue produits** : 3 biens factices pour démontrer la mise en page liste + fiche détail. Aucune donnée réelle inventée au-delà de ce qui est nécessaire à la démonstration visuelle.

Tests effectués :
- `npm run build` : compilation réussie.
- Toutes les routes testées via `curl` sur le serveur de dev (`npm run dev`) : `/`, `/services`, `/produits`, `/produits/1`, `/contact`, `/vendre`, `/demande`, route inconnue → toutes `200` (SPA — confirme que le serveur sert l'app, pas le rendu exact de chaque composant).
- Limite de vérification : aucun outil de navigateur réel (ni navigateur intégré, ni Claude in Chrome) n'était disponible dans cette session pour confirmer visuellement le rendu (mise en page des cartes, menu mobile, formulaires). À vérifier manuellement via `npm run dev` dans `client/` avant la démonstration.

### P0-03 — Espace admin (maquette)
- Statut : `✅ done`
- Priorité : `🟡 medium`
- Dépendances : `P0-01`

Pages :
- Connexion admin (`/admin/connexion`) — formulaire uniquement, pas d'auth réelle.
- Tableau de bord (`/admin`).
- Gestion produits/services (`/admin/produits`) — liste + formulaire ajout/modif, données locales factices.
- Demandes clients (`/admin/demandes`) — liste factice.
- Offres de vente reçues (`/admin/offres`) — liste factice.

Réalisé :
- `pages/admin/AdminLoginPage.jsx` : formulaire identifiant/mot de passe, redirige directement vers `/admin` sans vérification (aucune auth réelle — message explicite affiché à l'utilisateur).
- `pages/admin/AdminDashboardPage.jsx` : 3 compteurs (produits, demandes, offres) basés sur les données factices.
- `pages/admin/AdminProductsPage.jsx` : tableau des produits avec boutons « Modifier »/« Supprimer » non fonctionnels (maquette visuelle uniquement) + bouton « Ajouter un produit » non fonctionnel.
- `pages/admin/AdminRequestsPage.jsx`, `AdminOffersPage.jsx` : tableaux des demandes/offres factices avec statut (badge) et actions « Contacter »/« Marquer traité » non fonctionnelles.
- `data/mockProducts.js` : données factices centralisées (produits, demandes, offres), réutilisées entre site public et admin.

Décisions techniques / signalements :
- **Aucune authentification ni autorisation réelle** : `/admin/*` est actuellement accessible sans connexion (pas de garde de route). Ajouter une redirection « non connecté → connexion » maintenant simulerait une sécurité qui n'existe pas, contraire à la logique retenue sur les projets précédents (une restriction React n'est jamais une mesure de sécurité réelle). La vraie protection (backend + garde frontend) est prévue en Phase 3.
- **Toutes les actions CRUD sont visuelles uniquement** (aucun clic ne modifie les données factices) — le but de cette phase est de valider la structure et l'ergonomie avec le client, pas la logique métier.

Tests effectués :
- `npm run build` : compilation réussie, aucune erreur.
- Toutes les routes admin testées via `curl` : `/admin/connexion`, `/admin`, `/admin/produits`, `/admin/demandes`, `/admin/offres` → toutes `200`.
- Limite de vérification identique à P0-02 : rendu visuel non confirmé par un navigateur réel dans cette session. À vérifier manuellement.

### P0-04 — Revue avec le client
- Statut : `❌ todo`
- Priorité : `🔴 high`
- Dépendances : `P0-02`, `P0-03`

Tâches :
- Présentation du squelette au client.
- Collecte des retours (notamment : section manquante éventuelle signalée par le client).
- Mise à jour de ce fichier selon les retours avant de démarrer la Phase 1.

---

# PHASE 1 — SOCLE TECHNIQUE + PAGES PUBLIQUES FINALISÉES

- Statut : `❌ todo`
- Priorité : `🔴 high`
- Dépendances : `P0-04`

Tâches prévues (à détailler après validation du squelette) :
- Initialisation Express + structure des dossiers serveur.
- Connexion PostgreSQL + choix de l'ORM.
- Modèles : Produit, Service, Demande, Offre de vente, Admin.
- Endpoint de santé `/api/health`.
- Intégration du contenu réel validé par le client dans les pages publiques.

---

# PHASE 2 — FORMULAIRES FONCTIONNELS

- Statut : `❌ todo`
- Priorité : `🔴 high`
- Dépendances : Phase 1

Tâches prévues :
- Formulaire Contact → envoi email réel (provider à définir).
- Lien/bouton WhatsApp (API WhatsApp Business ou lien `wa.me` selon le besoin réel et le budget).
- Formulaire Vendre → enregistrement en base + notification admin.
- Formulaire Demande → enregistrement en base + notification admin.

---

# PHASE 3 — BACK-OFFICE ADMIN

- Statut : `❌ todo`
- Priorité : `🔴 high`
- Dépendances : Phase 1

Tâches prévues :
- Authentification admin sécurisée.
- CRUD produits/services (création, modification, suppression, upload images).
- Consultation des demandes clients + marquage traité/en cours.
- Consultation des offres de vente reçues + marquage traité/en cours.
- Action « contacter le client » depuis l'admin (ouvre email ou WhatsApp pré-rempli).

---

# PHASE 4 — SÉCURITÉ, TESTS, MISE EN PRODUCTION

- Statut : `❌ todo`
- Priorité : `🔴 high`
- Dépendances : Phase 2, Phase 3

Tâches prévues :
- Sécurisation des routes admin (RBAC minimal : un seul rôle admin pour le moment).
- Validation des entrées (formulaires publics = surface d'attaque principale).
- Protection anti-spam sur les formulaires publics (captcha ou équivalent).
- Tests fonctionnels de bout en bout sur les 3 formulaires + CRUD admin.
- Déploiement (hébergement à définir avec le client).

---

# 4. Points ouverts / à confirmer avec le client

- Section potentiellement manquante signalée par le client le 2026-10-05 — à identifier lors de la revue (P0-04).
- API WhatsApp Business (payante, nécessite un compte Meta Business vérifié) vs simple lien `wa.me` (gratuit, plus simple) — le choix impacte le budget et doit être tranché avant la Phase 2.
- Provider d'envoi d'email pour le formulaire Contact (à choisir en Phase 1/2).
- Hébergement cible pour la mise en production (Phase 4).
