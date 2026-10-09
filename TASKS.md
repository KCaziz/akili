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
4. **Galerie** — photos et vidéos de l'agence (locaux, équipe, événements) — section confirmée par le client le 2026-10-09, c'était la section manquante évoquée le 2026-10-05.
5. **Contact** — formulaire email + lien/API WhatsApp.
6. **Vendre (Offre)** — formulaire permettant à un client de proposer un bien à la vente.
7. **Demande** — formulaire permettant à un client de formuler une demande sur un produit ou un service.

## Espace Admin

- Gestion des produits/services : ajout, modification, suppression.
- Gestion des demandes clients : consultation + mise en relation (contact depuis l'admin).
- Gestion des offres de vente reçues (soumises via la section « Vendre »).
- Gestion de la galerie (photos/vidéos de l'agence) : ajout, modification, suppression des médias — prévu en Phase 3 avec le reste du CRUD admin.

Note (2026-10-09) : le client a confirmé la section manquante évoquée le 2026-10-05 — il souhaite intégrer des photos et vidéos de l'agence. Traité comme une section à part entière (« Galerie »), ajoutée au périmètre sans impact sur l'architecture déjà posée. Impact : stockage de médias (images + vidéos) à prévoir en Phase 1 (modèle de données) et Phase 3 (upload admin) ; voir points ouverts en section 4.

## Stack imposée

- Frontend : React (Vite)
- Backend : Express / Node.js
- Base de données : MySQL/MariaDB (migré depuis PostgreSQL le 2026-10-09 — voir P4-01, contrainte de l'hébergement cPanel mutualisé visé)

## Étape en cours (2026-10-09)

**Décision stratégique (2026-10-09, matin)** : le client n'a pas de cahier des charges détaillé et préfère juger sur une V1 la plus complète possible plutôt que de spécifier à l'avance. Il a explicitement autorisé l'usage de photos génériques (stock) pour la Galerie et le catalogue. En conséquence, le développement a avancé volontairement à travers plusieurs phases en parallèle (Phase 1 → Phase 3) pour produire une démonstration fonctionnelle de bout en bout, plutôt que de rester strictement séquentiel comme prévu initialement (règle #8 de ce fichier — impact signalé ici). Les décisions prises restent documentées phase par phase ci-dessous, avec ce qui est réellement fonctionnel vs ce qui reste à faire avant une mise en production réelle.

**Décision stratégique (2026-10-09, après-midi)** : premier chantier de déploiement démarré — cible choisie : hébergement mutualisé cPanel, sans PostgreSQL ni terminal disponibles. Ça a entraîné une migration de PostgreSQL vers MySQL/MariaDB et une refonte de l'architecture serveur (une seule app Node sert front + back). Détail complet en P4-01 et dans `DEPLOYMENT.md`.

Résumé de l'état réel du site à date : navigation publique complète, catalogue produits et galerie servis depuis MySQL/MariaDB, 3 formulaires publics (Contact, Vendre, Demande) qui écrivent réellement en base, espace admin avec authentification réelle (cookie JWT) et CRUD complet sur produits/services/galerie (avec upload réel de fichiers), consultation et traitement des demandes/offres. Un guide de déploiement cPanel complet et testé existe (`DEPLOYMENT.md`). Ce qui n'est pas réel : contenu de l'agence (textes et photos sont génériques/inventés, à valider ou remplacer par le client), envoi d'email (aucun provider configuré), numéro WhatsApp (placeholder), déploiement effectif sur un vrai compte cPanel (pas encore fait, seulement préparé et vérifié en local).

---

# 2. Architecture cible simplifiée

```text
Dev local (deux ports) :                    Production cPanel (un seul port) :
React (Vite, :5173)                          Express sert le build React (server/public/)
  |  fetch /api (absolu, client/.env)          ET l'API, même origine (voir client/.env.production)
  v                                          
Express / Node.js (server/ — :4000, dev ou prod)
  |
  +---- Produits (GET public ✅ / POST+PUT+DELETE admin ✅)
  |
  +---- Services (GET public ✅ / POST+PUT+DELETE admin ✅)
  |
  +---- Galerie / Médias (GET public ✅ / POST+DELETE admin ✅, upload réel de fichiers ✅)
  |
  +---- Uploads (/uploads/*, fichiers servis statiquement ✅)
  |
  +---- Demandes clients (POST public ✅ / GET+PATCH admin ✅)
  |
  +---- Offres de vente (POST public ✅ / GET+PATCH admin ✅)
  |
  +---- Contact (écrit dans Demandes ✅ — pas d'email réel, voir points ouverts)
  |
  +---- Auth admin (login/logout/me, cookie JWT httpOnly ✅)
  |
  v
MySQL / MariaDB (akili_dev en local via docker-compose, 6 tables — voir server/cpanel-setup.sql pour la prod)
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
- Statut : `✅ done`
- Priorité : `🔴 high`
- Dépendances : `P0-02`, `P0-03`

Tâches :
- Présentation du squelette au client.
- Collecte des retours (notamment : section manquante éventuelle signalée par le client).
- Mise à jour de ce fichier selon les retours avant de démarrer la Phase 1.

Réalisé :
- Retour client du 2026-10-09 : la section manquante évoquée le 2026-10-05 est confirmée — le client veut une **Galerie** (photos et vidéos de l'agence). Ajoutée au périmètre (section 1 de ce fichier).
- Décision : la Galerie est traitée comme une page publique supplémentaire (`/galerie`) + une entrée de navigation, pas comme un ajout dans la page Présentation — plus simple à gérer et à faire évoluer côté admin (Phase 3).
- Squelette frontend de la Galerie ajouté dans la foulée (voir P0-05 ci-dessous) pour rester cohérent avec le reste de la Phase 0 avant de démarrer la Phase 1.

### P0-05 — Page Galerie (placeholder)
- Statut : `✅ done`
- Priorité : `🟡 medium`
- Dépendances : `P0-01`

Tâches :
- Page `/galerie` : grille de photos + section vidéos.
- Lien ajouté à la navigation principale.

Réalisé :
- `pages/GalleryPage.jsx` : grille de photos (placeholders Unsplash, à remplacer par les vraies photos de l'agence) + section vidéos avec état vide explicite (aucun fichier fourni par le client pour le moment — pas de lecteur vidéo factice).
- `components/layout/Navigation.jsx` : entrée « Galerie » ajoutée entre Produits et Vendre.
- `router/index.jsx` : route `/galerie` ajoutée sous `MainLayout`.

Décisions techniques / signalements :
- **Aucun média réel de l'agence fourni à ce stade** — les photos sont des placeholders Unsplash clairement temporaires (déjà signalé en P0-01), les vidéos n'ont pas d'équivalent placeholder honnête (une fausse vidéo serait trompeuse) : la section vidéos affiche un état vide explicite en attendant les fichiers réels du client.
- **Stockage des médias** : hors périmètre du squelette frontend. Le besoin (stocker et servir des photos/vidéos, potentiellement volumineuses) est noté en section 4 « Points ouverts » — impacte le choix de stockage objet en Phase 1/Phase 3, pas seulement la base de données.

Tests effectués :
- `npm run build` et `npm run lint` : OK, aucune erreur.
- Route `/galerie` testée via `curl` sur le serveur de dev → `200`.

---

# PHASE 1 — SOCLE TECHNIQUE + PAGES PUBLIQUES FINALISÉES

### P1-01 — Backend Express + PostgreSQL + modèles de données
- Statut : `✅ done`
- Priorité : `🔴 high`
- Dépendances : `P0-04`

Tâches :
- Initialisation Express + structure des dossiers serveur.
- Connexion PostgreSQL + choix de l'ORM.
- Modèles : Produit, Service, Demande, Offre de vente, Admin, Média (galerie).
- Endpoint de santé `/api/health`.

Réalisé :
- `docker-compose.yml` (racine) : service `postgres` (image `postgres:16`), identifiants de dev, volume nommé `postgres_data`, healthcheck `pg_isready`.
- `server/` : Express 4 (ESM, `"type": "module"`), structure `src/{config,controllers,routes,middleware}`. Middlewares : `helmet`, `cors` restreint à `CORS_ORIGIN`, `morgan`. Gestion d'erreurs centralisée (`errorHandler` ne fuite pas la stack trace en production via `NODE_ENV`), 404 handler dédié.
- **ORM** : Prisma 7, avec `@prisma/adapter-pg` (driver adapter désormais obligatoire pour la connexion). Générateur `prisma-client-js` (le générateur par défaut `prisma-client` de Prisma 7 ne produit que du TypeScript, inutilisable tel quel dans ce serveur 100% JS/ESM).
- **Modèles** (`prisma/schema.prisma`) : `Admin`, `Product` (avec enum `PropertyType` VENTE/LOCATION), `Service`, `ClientRequest` (demandes, avec enum `RequestType` PRODUIT/SERVICE et `RequestStatus` EN_ATTENTE/TRAITE), `SellOffer` (offres de vente, même `RequestStatus`), `GalleryMedia` (photos/vidéos, enum `MediaType` PHOTO/VIDEO) — ce dernier modèle anticipe le besoin Galerie confirmé le 2026-10-09 (voir P0-04/P0-05).
- Migration `20261009113056_init` appliquée sur la base `akili_dev` — 6 tables créées et vérifiées réellement en base (`psql \dt`).
- `GET /api/health` : vérifie la connexion réelle à PostgreSQL via Prisma (`$queryRaw SELECT 1`), renvoie `503`/`"database":"unavailable"` si la base est injoignable.
- **API de lecture minimale** : `GET /api/products`, `GET /api/products/:id`, `GET /api/services` — lecture seule, bases vides (aucune donnée fabriquée). Pas encore appelées par le frontend (câblage réel prévu plus tard dans cette phase, une fois le contenu validé par le client disponible).
- `.env.example` fourni ; `.env` réel non versionné (`.gitignore` généré par `prisma init`, complété).

Décisions techniques / signalements :
- **Pas de routes d'écriture pour les demandes/offres de vente** (`POST /api/requests`, `POST /api/sell-offers`) à ce stade : ces endpoints sont explicitement prévus en Phase 2, une fois les formulaires publics câblés. Les ajouter maintenant sans consommateur réel aurait élargi le périmètre de cette tâche sans raison (règle #8 de ce fichier).
- **Pas de CRUD produits/services ni d'authentification admin** à ce stade : prévus en Phase 3 avec la sécurisation. Construire un CRUD non protégé maintenant simulerait un back-office qui n'existe pas encore réellement.
- **Dossiers générés par `prisma init`** (`.claude/skills`, `.windsurf/skills`, `.agents/skills`, `skills-lock.json` dans `server/`) : sans rapport avec ce projet, à supprimer. Tentative de suppression bloquée par une règle de sécurité de l'environnement (suppression récursive refusée) — **à faire manuellement** par l'utilisateur (`rm -rf server/.claude server/.windsurf server/.agents server/skills-lock.json`), sans impact sur le fonctionnement du serveur en attendant.
- Mise à jour majeure Prisma disponible (7.10.0 → 8.0.0-rc.22) signalée par la CLI — non appliquée (version release candidate), à réévaluer plus tard.

Tests effectués :
- `docker compose up -d` : conteneur `akili_postgres_dev` à l'état `healthy`.
- `npx prisma migrate dev` : migration appliquée sans erreur ; `psql \dt` confirme les 6 tables réelles en base.
- Script ponctuel : `prisma.product.create()` → `findUnique()` → `delete()` exécutés avec succès contre la vraie base (puis nettoyage), preuve que la connexion et les modèles fonctionnent de bout en bout, pas seulement au niveau du schéma.
- Serveur démarré (`node src/server.js`) : `GET /api/health` → `200 {"status":"ok","database":"connected"}` ; `GET /api/products` → `200 []` ; `GET /api/services` → `200 []` ; `GET /api/nope` → `404 {"error":"Route introuvable"}` géré proprement.
- Pas de linter configuré côté serveur (seul le frontend en a un) — relecture manuelle des fichiers créés.

### P1-02 — Intégration du contenu réel dans les pages publiques
- Statut : `🚧 in-progress`
- Priorité : `🔴 high`
- Dépendances : `P1-01`

Tâches prévues :
- Remplacer le contenu provisoire (Présentation, Services, textes de la Galerie) par le contenu réel validé par le client.
- Remplacer les photos/vidéos placeholder de la Galerie et du catalogue par les vrais médias de l'agence, une fois fournis.
- Câbler `ProductsPage`/`ProductDetailPage`/`ServicesPage` sur les endpoints `GET /api/products` et `GET /api/services` à la place des données factices de `mockProducts.js`.

Réalisé (2026-10-09) :
- Le client n'a pas de texte final à fournir, mais a demandé de s'inspirer du contenu de sites d'agences existants (ex. bessapromotion.com) sans copier, et d'écrire du contenu logique en l'absence d'original — consigne explicite, donc ce n'est pas du contenu inventé hors mandat.
- Texte réécrit (ton chaleureux et orienté bénéfice client, inspiré du registre observé sur des sites d'agences immobilières, jamais copié mot pour mot) : accroche et section « Qui sommes-nous » de `HomePage.jsx`, les 4 cartes de services de la page d'accueil.
- **Services** : contenu définitif rédigé et **seedé en base** (`server/prisma/seed.js`, idempotent — relançable sans dupliquer), puis `ServicesPage.jsx` entièrement câblée sur `GET /api/services` (`client/src/lib/api.js`) à la place du tableau statique — gère les états chargement/erreur. C'est la première page du site branchée réellement sur le backend.
- `client/.env.example` ajouté (`VITE_API_URL`, défaut `http://localhost:4000/api`).

Volontairement non traité à ce stade :
- **Catalogue Produits** : toujours sur `mockProducts.js`, pas câblé sur `GET /api/products`. Contrairement aux services (texte générique sur l'activité de l'agence), un catalogue de biens est une donnée métier concrète (adresses, prix, surfaces réels) — en inventer pour remplir la base serait fabriquer de fausses annonces immobilières, ce que la consigne du client ne couvre pas. La base `products` reste vide jusqu'à ce que le client fournisse de vrais biens à lister.
- **Photos/vidéos réelles** (Galerie + catalogue) : toujours en attente. Le client a autorisé à écrire du texte de substitution, pas à fabriquer de fausses photos de ses locaux/équipe ni de fausses vidéos — ça resterait trompeur même avec son accord verbal, donc aucun changement sur ce point tant que les vrais fichiers ne sont pas fournis.

Tests effectués :
- `npm run build` et `npm run lint` (client) : OK, aucune erreur.
- Serveur backend relancé après le seed : `GET /api/services` → `200`, 4 services réels renvoyés (vérifié via `curl`).
- CORS vérifié en conditions réelles : `curl -H "Origin: http://localhost:5173" http://localhost:4000/api/services` → `Access-Control-Allow-Origin: http://localhost:5173` présent, confirmant que l'appel fonctionnera bien depuis le navigateur.
- Limite de vérification : toujours aucun navigateur réel disponible dans cette session pour confirmer visuellement l'état de chargement/erreur de `ServicesPage`. À vérifier manuellement (`docker compose up -d`, `node server/src/server.js`, `npm run dev` dans `client/`).

---

# PHASE 2 — FORMULAIRES FONCTIONNELS

- Statut : `🚧 in-progress`
- Priorité : `🔴 high`
- Dépendances : Phase 1

Tâches prévues :
- Formulaire Contact → envoi email réel (provider à définir).
- Lien/bouton WhatsApp (API WhatsApp Business ou lien `wa.me` selon le besoin réel et le budget).
- Formulaire Vendre → enregistrement en base + notification admin.
- Formulaire Demande → enregistrement en base + notification admin.

Réalisé (2026-10-09) :
- `POST /api/requests` et `POST /api/sell-offers` (backend) : écriture réelle en base, validation des champs requis côté serveur.
- `SellPage.jsx`, `RequestPage.jsx`, `ContactPage.jsx` : les 3 formulaires publics appellent réellement l'API et écrivent en base (testé de bout en bout, y compris avec accents/UTF-8). États chargement/succès/erreur gérés honnêtement (plus de fausse confirmation).
- `ContactPage.jsx` : faute de provider email, le message est enregistré comme une `ClientRequest` (type `SERVICE`, préfixé `[Message de contact]`) et apparaît dans l'admin au même titre qu'une demande — c'est un choix pragmatique pour que le formulaire soit fonctionnel en V1, pas une solution définitive.
- Admin : « Contacter » sur une demande ouvre `mailto:`, sur une offre ouvre `tel:` — pas d'envoi automatique, juste un raccourci.

Non réalisé — notification admin automatique (email/SMS à chaque nouvelle demande) :
- Pas de notification réelle : ni provider email configuré, ni service SMS. L'admin doit consulter manuellement `/admin/demandes` et `/admin/offres`. Prévu si le client veut aller plus loin après la revue de la V1.

Volontairement non traité :
- **WhatsApp** : toujours un lien `wa.me` avec un numéro placeholder (`213000000000`) — aucun vrai numéro fourni. API WhatsApp Business non intégrée (voir points ouverts).
- **Envoi d'email réel** : aucun fournisseur (SendGrid, Mailgun, etc.) configuré — nécessite un choix du client et des identifiants, non disponibles à ce stade.

Tests effectués :
- `npm run build`/`npm run lint` (client) : OK.
- Les 3 formulaires testés via appels HTTP réels contre le serveur (`fetch` Node, incluant un cas avec accents) : création en base vérifiée, puis nettoyée.

---

# PHASE 3 — BACK-OFFICE ADMIN

- Statut : `🚧 in-progress`
- Priorité : `🔴 high`
- Dépendances : Phase 1

Tâches prévues :
- Authentification admin sécurisée.
- CRUD produits/services (création, modification, suppression, upload images).
- Consultation des demandes clients + marquage traité/en cours.
- Consultation des offres de vente reçues + marquage traité/en cours.
- Action « contacter le client » depuis l'admin (ouvre email ou WhatsApp pré-rempli).

Réalisé (2026-10-09) :
- **Authentification réelle** : `POST /api/auth/login` (bcrypt + JWT dans un cookie `httpOnly`, `SameSite=Lax`, `Secure` en production), `GET /api/auth/me`, `POST /api/auth/logout`. Middleware `requireAdmin` protège toutes les routes d'écriture (produits, services, galerie) et de lecture admin (demandes, offres).
- Compte admin de démonstration créé par seed (`admin` / `akili2026`) — **identifiants de développement, à changer avant toute mise en production réelle**, affichés en clair sur la page de connexion pour cette V1 de démo.
- `AdminAuthContext` (frontend) : vérifie la session au chargement, expose `login`/`logout`. `AdminLayout` redirige vers `/admin/connexion` si non authentifié — garde réelle cette fois (contrairement au squelette initial où rien ne protégeait `/admin/*`).
- **CRUD produits** complet (`AdminProductsPage.jsx` + routes `POST/PUT/DELETE /api/products`) : créer, modifier, supprimer un bien, formulaire inline. Testé de bout en bout (create → update → delete, + vérification qu'une requête sans cookie admin est bien rejetée en `401`).
- **CRUD services** complet (`AdminServicesPage.jsx`, nouvelle page) + routes équivalentes.
- **CRUD galerie** (`AdminGalleryPage.jsx`) : ajout/suppression de photos et vidéos, avec **upload réel de fichier** (voir ci-dessous) ou URL externe au choix.
- `AdminRequestsPage.jsx`/`AdminOffersPage.jsx` : listes réelles depuis l'API, bouton pour basculer le statut `en attente`/`traité` via `PATCH`, lien « Contacter » (`mailto:`/`tel:`).
- `AdminDashboardPage.jsx` : compteurs réels (produits, services, demandes en attente, offres en attente) depuis l'API.
- **Upload réel de fichiers** (2026-10-09, suite au retour « l'admin doit pouvoir ajouter des produits avec images ») : `POST /api/uploads` (protégé, `multer`), stockage sur disque local (`server/uploads/`, servi statiquement via `/uploads/...`), limite 25 Mo, types acceptés : images (jpeg/png/webp/gif) et vidéos (mp4/webm). Composant `MediaUploadField.jsx` réutilisé dans `AdminProductsPage` (image du bien) et `AdminGalleryPage` (photo/vidéo) : sélection de fichier → upload immédiat → aperçu. Le champ URL manuel reste disponible en parallèle pour coller un lien externe si besoin.
- Front : `resolveMediaUrl()` (`lib/api.js`) transforme les URLs relatives (`/uploads/...`) en URLs absolues vers le serveur ; les URLs externes (Unsplash) ne sont pas touchées. Utilisé partout où une image/vidéo est affichée (catalogue public, fiche produit, galerie publique, tableaux admin).
- Backend : `crossOriginResourcePolicy: "cross-origin"` ajouté à la config `helmet` — sans ça, le navigateur bloque le chargement des images par le frontend (port 5173) depuis l'API (port 4000).

Décisions techniques / signalements :
- **Stockage sur disque local, pas un vrai object storage** : les fichiers uploadés vivent dans `server/uploads/` sur la machine qui fait tourner le serveur. Fonctionne très bien en local/démo, mais ne survivra pas à un déploiement sur une plateforme avec filesystem éphémère (Heroku, etc.) ni ne scale à plusieurs instances. Migration vers S3/Cloudinary ou équivalent nécessaire avant une mise en production réelle (Phase 4) — le code est structuré pour que ce changement reste localisé (`middleware/upload.js` + `routes/uploads.js`).
- **Authentification simplifiée mais réelle** : un seul rôle admin (pas de RBAC multi-niveaux), pas de limitation de tentatives de connexion (rate limiting), pas de rotation/révocation de token autre que l'expiration (7 jours) — acceptable pour une V1 à usage interne restreint, à durcir avant une mise en production réelle (Phase 4).
- Mot de passe admin de démo affiché en clair sur la page de connexion : acceptable uniquement parce que c'est un environnement de démonstration avec des données fictives ; **à supprimer avant toute mise en ligne réelle**.
- Fichiers uploadés exclus du dépôt Git (`server/.gitignore`) — seul `server/uploads/.gitkeep` est versionné pour garder le dossier.

Tests effectués :
- Flux complet simulé par scripts Node (`fetch`) : login échoué (mauvais mot de passe) → `401` ; login valide → cookie posé ; `GET /api/auth/me` avec cookie → `200` ; `GET /api/requests` sans cookie → `401`, avec cookie → `200`.
- Cycle CRUD produit complet (create → update → delete) vérifié contre la vraie base, plus vérification qu'une création sans authentification échoue bien (`401`).
- Upload de fichier testé de bout en bout : upload sans auth → `401` ; upload avec auth → `201` + URL renvoyée ; fichier re-téléchargé depuis cette URL → `200`, header `Cross-Origin-Resource-Policy: cross-origin` et `Content-Type: image/png` corrects ; produit créé avec cette image, puis nettoyage (produit et fichier supprimés).
- `npm run build`/`npm run lint` (client) : OK, aucune erreur (quelques avertissements de style non bloquants sur les appels `setState` dans des effets — non corrigés, sans impact fonctionnel).
- Limite de vérification : toujours aucun navigateur réel disponible dans cette session — le rendu visuel des formulaires admin (notamment l'aperçu d'image après upload) n'a pas été confirmé à l'œil. À vérifier manuellement (`docker compose up -d`, `node server/src/server.js`, `npm run dev` dans `client/`, connexion avec `admin`/`akili2026`).

---

# PHASE 4 — SÉCURITÉ, TESTS, MISE EN PRODUCTION

- Statut : `🚧 in-progress`
- Priorité : `🔴 high`
- Dépendances : Phase 2, Phase 3

Tâches prévues :
- Sécurisation des routes admin (RBAC minimal : un seul rôle admin pour le moment — déjà le cas, suffisant tant qu'il n'y a qu'un seul type d'utilisateur back-office).
- Validation des entrées (formulaires publics = surface d'attaque principale) — validation basique déjà en place côté serveur (champs requis, enums), à renforcer (longueurs max, sanitisation).
- Protection anti-spam sur les formulaires publics (captcha ou équivalent) — pas encore fait, les 3 formulaires publics sont ouverts sans limitation.
- Rate limiting sur les routes d'authentification et les formulaires publics — pas encore fait.
- Tests fonctionnels de bout en bout sur les 3 formulaires + CRUD admin — fait manuellement via scripts (voir Phase 2/3), pas de suite de tests automatisée.
- Remplacement des identifiants admin de démo et du secret JWT de développement.
- **Déploiement — démarré (2026-10-09)**, voir ci-dessous.

### P4-01 — Portage vers MySQL + architecture déploiement cPanel mutualisé
- Statut : `✅ done`
- Priorité : `🔴 high`
- Dépendances : Phase 3

Contexte : l'hébergement cible est un **cPanel mutualisé**, sans PostgreSQL (seulement MySQL/MariaDB via « MySQL Databases ») et **sans accès Terminal/SSH** (interface web uniquement : File Manager, Setup Node.js App, phpMyAdmin). Ces deux contraintes ont déterminé toutes les décisions ci-dessous.

Réalisé :
- **Migration PostgreSQL → MySQL/MariaDB** : `prisma/schema.prisma` (`provider = "mysql"`), adaptateur `@prisma/adapter-mariadb` (compatible MySQL et MariaDB) à la place de `@prisma/adapter-pg`. Champs texte potentiellement longs passés en `@db.Text` (`description`, `details`, `image`, `url`) pour éviter la limite `VARCHAR(191)` par défaut de Prisma sur MySQL.
- `docker-compose.yml` : service `postgres` remplacé par `mariadb:11` (port hôte `3307` pour ne pas entrer en conflit avec un autre conteneur MySQL/MariaDB déjà présent sur la machine) — environnement de dev maintenant representatif de la cible de prod.
- **Serveur unique front + back** (`server/src/app.js`) : Express sert maintenant aussi les fichiers statiques du frontend buildé (`server/public/`, non versionné — généré) avec fallback SPA (`GET *` → `index.html`, sauf `/api/*` et `/uploads/*` qui gardent leur comportement JSON/fichier normal). Nécessaire car un mutualisé cPanel n'autorise typiquement qu'une seule application Node par domaine.
- `client/src/lib/api.js` : URL de l'API relative par défaut (`/api`) au lieu d'absolue — fonctionne en same-origin une fois front et back servis par le même serveur. `client/.env` (dev, ports séparés) et `client/.env.production` (build prod, `VITE_API_URL=/api`) séparent les deux cas ; Vite charge automatiquement le bon fichier selon le mode.
- `scripts/build-for-cpanel.sh` : build le frontend et copie `client/dist` dans `server/public`, en une commande.
- **`server/cpanel-setup.sql`** : structure des 6 tables + données de démo (seed), à coller une seule fois dans phpMyAdmin — remplace `prisma migrate deploy` qui nécessiterait un terminal. **Testé réellement** : importé sur une base MySQL vierge, serveur démarré contre cette base, login admin + lecture des produits vérifiés avant livraison (pas une simple relecture du SQL).
- `server/package.json` : script `postinstall: "prisma generate"` ajouté explicitement, pour que le bouton « Run NPM Install » de cPanel régénère automatiquement le client Prisma, sans commande manuelle.
- **`DEPLOYMENT.md`** (racine du projet) : guide complet pas-à-pas pour cPanel (créer la base, initialiser via phpMyAdmin, préparer le paquet, Setup Node.js App, variables d'environnement, SSL, mises à jour futures, limites connues).

Décisions techniques importantes :
- **Moteur Prisma WebAssembly, pas de binaire natif** : avec les driver adapters (Prisma 7), le moteur de requêtes est un module WASM (`query_compiler_fast_bg.wasm`), portable par nature — contrairement aux anciennes versions de Prisma qui téléchargeaient un binaire natif selon l'OS du serveur (source classique d'échecs de déploiement sur mutualisé). Le paramètre `binaryTargets` a été essayé puis retiré du schéma car inutile dans cette architecture — vérifié en regénérant le client sans lui et en confirmant la présence du `.wasm`.
- **Pas de `prisma migrate` en production** : impossible sans terminal. Le schéma est appliqué une fois via `cpanel-setup.sql` (SQL brut dans phpMyAdmin). Toute évolution future du schéma nécessitera de générer un nouveau script SQL (`ALTER TABLE`/`CREATE TABLE`) à la main, au lieu d'une vraie migration Prisma — accepté comme compromis du fait de la contrainte d'hébergement, signalé explicitement dans `DEPLOYMENT.md` section 10.
- **Table `_prisma_migrations` volontairement absente de `cpanel-setup.sql`** : elle ne sert qu'au CLI `prisma migrate` (jamais utilisé en production ici) ; `PrismaClient` à l'exécution ne la lit ni ne l'écrit, donc elle n'est pas nécessaire.
- **Stockage des fichiers uploadés sur disque local** (`server/uploads/`) reste inchangé — fonctionne sur un mutualisé classique, limite connue documentée dans `DEPLOYMENT.md` (pas de garantie de persistance en cas de migration d'hébergeur).
- **Cookie de session `Secure` en production** (déjà en place depuis la Phase 3) : implique que le HTTPS (AutoSSL cPanel) doit être activé avant de pouvoir se connecter à l'admin — point explicitement rappelé dans le guide (section 9), sans quoi l'échec serait silencieux et déroutant.

Tests effectués :
- Migration complète rejouée contre une vraie instance MariaDB locale (conteneur Docker) : `npx prisma migrate dev` → 6 tables créées, structure vérifiée (`SHOW TABLES`).
- Serveur démarré en mode `NODE_ENV=production` contre cette base : `GET /api/health` → `200`, `GET /api/products` → 6 résultats, login admin → `200` avec cookie `Secure`.
- **Scénario de déploiement simulé** : `cpanel-setup.sql` importé sur une base MySQL fraîche et vide (`akili_verify`), serveur pointé dessus, `GET /api/health`, login admin (`admin`/`akili2026`) et lecture du catalogue vérifiés avec succès — preuve que le fichier SQL fourni fonctionne réellement, pas seulement en théorie. Base de vérification supprimée après test.
- `scripts/build-for-cpanel.sh` exécuté : build réussi, `server/public/` contient bien `index.html` + assets.
- Serveur unique testé en conditions same-origin (front + API sur le même port `4000`) : page d'accueil (`200`, `text/html`), route client `/produits` (fallback SPA, `200`), asset JS (`200`, bon `Content-Type`), API toujours fonctionnelle, route API inconnue toujours `404` JSON (pas absorbée par le fallback SPA).
- `npm run build`/`npm run lint` (client) : OK.
- Limite de vérification : le déploiement réel sur un vrai compte cPanel n'a pas pu être testé dans cette session (pas d'accès à un hébergement réel) — tout a été vérifié en reproduisant fidèlement les contraintes annoncées (MySQL, pas de terminal, same-origin, SQL via import direct) en local. Le guide `DEPLOYMENT.md` doit être suivi et les résultats confirmés une fois l'hébergement réel disponible.

---

# 4. Points ouverts / à confirmer avec le client

- API WhatsApp Business (payante, nécessite un compte Meta Business vérifié) vs simple lien `wa.me` (gratuit, plus simple) — le choix impacte le budget et doit être tranché. Le numéro reste un placeholder en attendant.
- Provider d'envoi d'email (pour le formulaire Contact ET pour notifier l'admin des nouvelles demandes/offres) — aucun choisi à ce stade, rien n'est envoyé par email actuellement.
- **Hébergement cible** : cPanel mutualisé choisi (2026-10-09), architecture adaptée en conséquence (MySQL, serveur unique front+back — voir P4-01). Le déploiement effectif sur le vrai compte cPanel du client n'est pas encore fait — tout a été préparé et vérifié en local en reproduisant les contraintes annoncées. Guide complet : `DEPLOYMENT.md`.
- **Stockage des photos/vidéos** (produits + Galerie) : l'admin peut uploader de vrais fichiers (P3), stockés sur le disque local du serveur. Ça fonctionne sur le mutualisé visé mais reste une limite à moyen terme (pas de garantie de persistance en cas de migration d'hébergeur, pas de scaling multi-instance) — migration vers un stockage objet (S3/Cloudinary ou équivalent) à envisager plus tard si besoin. Le client doit fournir les vraies photos/vidéos de l'agence (autorisation donnée le 2026-10-09 d'utiliser des photos génériques en attendant).
- **Contenu définitif** : textes (présentation, services) et biens du catalogue actuellement rédigés/inventés par Claude pour la démonstration (accord explicite du client le 2026-10-09 en l'absence de cahier des charges détaillé) — à valider, corriger ou remplacer par le client après la revue de cette V1.
- **Identifiants admin et secret JWT** : valeurs de développement (`admin`/`akili2026`, secret généré localement) — à régénérer avant toute mise en production réelle (instructions dans `DEPLOYMENT.md`).
- **Évolutions futures du schéma de base de données** : sans terminal sur l'hébergement cPanel, impossible d'utiliser `prisma migrate`. Toute évolution nécessitera un script SQL écrit à la main (sur le modèle de `server/cpanel-setup.sql`) à coller dans phpMyAdmin.
