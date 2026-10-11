# Akili — Site Agence Immobilière

Site web pour une agence immobilière : vitrine publique (présentation, services, catalogue de
biens, galerie, contact, formulaires vendre/demande) + back-office admin (React + Express +
MySQL/MariaDB via Prisma).

- [TASKS.md](TASKS.md) — suivi détaillé du projet, phase par phase (la source de vérité pour le développement).
- [DEPLOYMENT.md](DEPLOYMENT.md) — guide de déploiement sur hébergement mutualisé cPanel.

## Structure du projet

```
client/   Frontend React (Vite)
server/   Backend Express + Prisma (API + sert aussi le frontend buildé en production)
scripts/  Scripts utilitaires (ex. build-for-cpanel.sh)
```

## Prérequis

- Node.js 20+ (développé avec Node 22)
- Docker (pour lancer MariaDB en local)

## Lancer le projet en local

### 1. Base de données

Depuis la racine du projet :

```bash
docker compose up -d
```

Ça démarre un conteneur MariaDB (`akili_mariadb_dev`) sur le port `3307`.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env     # valeurs par défaut déjà correctes pour le dev local
npx prisma migrate dev   # crée les tables (première fois seulement)
node prisma/seed.js      # données de démo : services, produits, galerie, compte admin
npm run dev
```

Le serveur démarre sur `http://localhost:4000`. Vérifier : `curl http://localhost:4000/api/health`
doit répondre `{"status":"ok", ...}`.

### 3. Frontend

Dans un second terminal :

```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:4000/api
npm run dev
```

Le site est accessible sur `http://localhost:5173`.

### 4. Accès admin

- URL : `http://localhost:5173/admin/connexion`
- Identifiant : `admin`
- Mot de passe : `akili2026`

**Change ce mot de passe** depuis l'admin, section « Mon compte », avant tout usage réel.

## Scripts utiles

| Commande | Où | Effet |
|---|---|---|
| `npm run dev` | `server/` | Lance l'API avec rechargement automatique |
| `npm run dev` | `client/` | Lance le serveur de développement Vite |
| `npm run build` | `client/` | Build de production du frontend |
| `npm run lint` | `client/` | Vérifie le code avec oxlint |
| `node prisma/seed.js` | `server/` | (Re)charge les données de démonstration |
| `bash scripts/build-for-cpanel.sh` | racine | Build le frontend et l'assemble dans `server/public/` pour déploiement |

## Stack technique

- **Frontend** : React 19, Vite, react-router-dom
- **Backend** : Express, Prisma (driver adapter MariaDB — moteur WebAssembly, pas de binaire natif)
- **Base de données** : MySQL/MariaDB
- **Auth admin** : JWT dans un cookie `httpOnly`

Pour le détail complet de ce qui est fonctionnel vs encore en attente (contenu réel du client,
email, WhatsApp, etc.), voir [TASKS.md](TASKS.md), section « Points ouverts ».
