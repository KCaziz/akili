# Guide de déploiement — Akili sur hébergement mutualisé cPanel

Ce guide suppose :
- Un hébergement **cPanel mutualisé**, avec l'outil **« Setup Node.js App »** (Node.js Selector) et **« MySQL Databases »**.
- **Pas d'accès Terminal/SSH** — tout se fait via l'interface web de cPanel (File Manager, Setup Node.js App, phpMyAdmin).
- Une base **MySQL/MariaDB** (pas PostgreSQL).

Le site est servi par **une seule application Node** : le serveur Express sert à la fois l'API (`/api/...`) et le frontend React déjà buildé (fichiers statiques). C'est nécessaire sur un mutualisé, qui n'autorise généralement qu'une seule app Node par domaine/sous-domaine.

---

## 0. Vue d'ensemble du processus

1. Créer la base de données MySQL dans cPanel.
2. Initialiser la base avec `server/cpanel-setup.sql` via phpMyAdmin (structure + données de démo).
3. Préparer le paquet à uploader **depuis ta machine** (build du frontend + assemblage).
4. Uploader et extraire ce paquet via le File Manager de cPanel.
5. Créer l'application Node dans « Setup Node.js App ».
6. Configurer les variables d'environnement.
7. Lancer l'installation des dépendances (bouton intégré, pas de terminal nécessaire).
8. Démarrer l'app, activer le SSL, tester.

---

## 1. Créer la base de données MySQL

Dans cPanel → **MySQL Databases** :

1. Section « Create New Database » : donne un nom, ex. `akili`. cPanel va le préfixer automatiquement avec ton nom d'utilisateur cPanel (ex. `monpseudo_akili`). Note le nom complet.
2. Section « MySQL Users » → « Add New User » : crée un utilisateur (ex. `akili_app`) avec un mot de passe **fort** (note-le quelque part de sûr). cPanel le préfixera aussi (ex. `monpseudo_akili_app`).
3. Section « Add User To Database » : associe l'utilisateur à la base, avec **ALL PRIVILEGES**.

Note les 3 valeurs finales (avec préfixe cPanel) :
- Nom de la base : `monpseudo_akili`
- Nom d'utilisateur : `monpseudo_akili_app`
- Mot de passe : celui que tu as choisi

---

## 2. Initialiser la base via phpMyAdmin

1. cPanel → **phpMyAdmin**.
2. Sélectionne ta base (`monpseudo_akili`) dans la colonne de gauche.
3. Onglet **SQL** en haut.
4. Ouvre le fichier `server/cpanel-setup.sql` (fourni dans le projet), copie **tout son contenu**, colle-le dans la zone de texte.
5. Clique **Exécuter**.

Ce fichier crée les 6 tables (produits, services, demandes, offres, galerie, admin) et insère les données de démonstration, y compris **un compte admin** :
- Identifiant : `admin`
- Mot de passe : `akili2026`

**Change ce mot de passe dès ta première connexion à l'admin** (section 9).

Ce fichier a été testé de bout en bout avant livraison (import réel + connexion admin + lecture des produits vérifiés), donc il n'y a normalement rien à corriger dedans.

---

## 3. Préparer le paquet à uploader (sur ta machine)

Depuis la racine du projet, en local :

```bash
bash scripts/build-for-cpanel.sh
```

Ce script :
- build le frontend React (`client/` → `client/dist/`)
- copie le résultat dans `server/public/` (c'est ce dossier que Express servira en production)

Ensuite, **zippe le dossier `server/`**, en excluant :
- `node_modules/` (sera réinstallé sur le serveur)
- `.env` (tu vas configurer les variables directement dans l'UI cPanel)
- le contenu de `uploads/` sauf `.gitkeep` (pas de fichiers de test à envoyer)

Sous Windows, le plus simple : copie le dossier `server/` ailleurs, supprime-y `node_modules` et `.env` si présents, vide `uploads/` (garde `.gitkeep`), puis fais clic droit → « Envoyer vers » → « Dossier compressé » sur ce dossier nettoyé. Tu obtiens un fichier `server.zip`.

---

## 4. Uploader et extraire via File Manager

1. cPanel → **File Manager**.
2. Va dans ton répertoire personnel (pas forcément `public_html` — voir section 5).
3. Crée un dossier, ex. `akili-app`.
4. Upload `server.zip` dedans, puis clic droit → **Extract**.
5. Une fois extrait, tu dois voir `akili-app/src/`, `akili-app/prisma/`, `akili-app/public/`, `akili-app/package.json`, etc.

---

## 5. Créer l'application Node dans cPanel

cPanel → **Setup Node.js App** → **Create Application**.

- **Node.js version** : la plus récente disponible (22.x si possible — le projet a été développé avec Node 22).
- **Application mode** : Production.
- **Application root** : le dossier créé en section 4, ex. `akili-app` (chemin relatif à ta racine, cPanel te montre généralement `/home/monpseudo/akili-app`).
- **Application URL** : le domaine ou sous-domaine où le site doit être visible (ex. `akili-immo.com` ou `app.akili-immo.com`).
- **Application startup file** : `src/server.js`

Clique **Create**. cPanel crée l'environnement virtuel Node et configure automatiquement le proxy (Apache/LiteSpeed) vers ton app — tu n'as rien à écrire toi-même (pas de `.htaccess` à créer à la main).

---

## 6. Variables d'environnement

Toujours dans la page de l'application (Setup Node.js App), section **Environment Variables** — ajoute :

| Nom | Valeur |
|---|---|
| `DATABASE_URL` | `mysql://monpseudo_akili_app:TON_MOT_DE_PASSE@localhost:3306/monpseudo_akili` |
| `JWT_SECRET` | une longue chaîne aléatoire (voir ci-dessous) |
| `CORS_ORIGIN` | `https://ton-domaine.com` (ton vrai domaine, avec `https://`) |
| `NODE_ENV` | `production` |

Ne mets **pas** de variable `PORT` — cPanel la gère lui-même automatiquement.

Pour générer un `JWT_SECRET` aléatoire, tu peux utiliser n'importe quel générateur de mot de passe long (32+ caractères), ou dans un terminal Node sur ta machine :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 7. Installer les dépendances

Toujours sur la page de l'application cPanel, clique **Run NPM Install**.

Ça va :
- installer toutes les dépendances (`express`, `prisma`, etc.)
- déclencher automatiquement `prisma generate` (configuré dans `package.json` → script `postinstall`), ce qui génère le client Prisma adapté — **aucune commande à taper**, et pas de souci de compatibilité binaire : le moteur Prisma utilisé ici est en WebAssembly (portable), pas un binaire natif lié à l'OS du serveur.

Ça peut prendre 1 à 3 minutes. Attends que ça affiche un succès avant de continuer.

---

## 8. Démarrer l'application

Clique **Restart** (ou **Start**) sur la page de l'application.

Un lien vers le fichier de log (souvent « Passenger log file ») est généralement affiché sur la même page — utile en cas de souci pour voir si le serveur a bien démarré (tu dois voir une ligne du type `Akili API démarrée sur http://localhost:XXXX`).

---

## 9. Activer le SSL et tester

1. cPanel → **SSL/TLS Status** (ou **AutoSSL**) → active le certificat gratuit pour ton domaine, si ce n'est pas déjà fait. **C'est indispensable** : les cookies de session admin sont marqués `Secure` en production, donc ils ne fonctionnent qu'en HTTPS. Sans SSL, la connexion admin échouera silencieusement.
2. Visite `https://ton-domaine.com` — le site public doit s'afficher (catalogue, galerie, etc. avec les données de démo).
3. Va sur `https://ton-domaine.com/admin/connexion`, connecte-toi avec `admin` / `akili2026`.
4. **Change immédiatement ce mot de passe** : pour l'instant il n'y a pas d'interface pour ça dans l'admin (à prévoir si besoin) — le plus simple est de repasser par phpMyAdmin et de remplacer la valeur `passwordHash` de la ligne `admin` dans la table `admins` par un nouveau hash bcrypt. Si tu veux, je peux ajouter une vraie page « changer le mot de passe » dans l'admin plus tard.
5. Teste l'ajout d'un produit avec upload d'image depuis l'admin, pour confirmer que `server/uploads/` est bien accessible en écriture (ça devrait l'être par défaut).

---

## 10. Mettre à jour le site après une modification

À chaque fois que tu modifies le code (front ou back) :

1. En local : `bash scripts/build-for-cpanel.sh` (rebuild le frontend dans `server/public/`).
2. Si tu as touché au `server/`, re-zippe le dossier (toujours en excluant `node_modules`, `.env`, le contenu de `uploads/`).
3. Dans File Manager : remplace les fichiers modifiés (ou ré-uploade et extrais par-dessus — cPanel demande confirmation avant d'écraser).
4. Si tu as modifié `server/package.json` (nouvelle dépendance) : reclique **Run NPM Install** dans Setup Node.js App.
5. Si tu as modifié `prisma/schema.prisma` (nouveau champ, nouvelle table) : il faut adapter la base MySQL manuellement via phpMyAdmin (`ALTER TABLE ...` ou `CREATE TABLE ...`), puisqu'il n'y a pas de terminal pour lancer `prisma migrate`. Dis-moi quand tu en es là, je te génère le SQL correspondant à chaque changement de schéma, comme pour `cpanel-setup.sql`.
6. Clique **Restart** sur l'application.

---

## Limites connues de cette configuration (à garder en tête)

- **Stockage des fichiers uploadés (`server/uploads/`) sur le disque du serveur mutualisé** : fonctionne, mais si l'hébergeur change de serveur physique ou si tu migres d'offre un jour, ces fichiers ne sont pas automatiquement transférés — à sauvegarder toi-même périodiquement (via File Manager ou un export). Pour un usage sérieux à moyen terme, migrer vers un stockage objet (S3, Cloudinary...) reste recommandé, mais n'est pas nécessaire pour démarrer.
- **Pas d'envoi d'email réel** : le formulaire Contact enregistre toujours le message en base (visible dans l'admin), aucun fournisseur d'email n'est configuré. À ajouter si besoin (SendGrid, Brevo, etc. — la plupart ont une API simple compatible avec un hébergement mutualisé).
- **Numéro WhatsApp** : toujours un placeholder dans `client/src/pages/ContactPage.jsx` — remplace `WHATSAPP_NUMBER` par le vrai numéro avant un nouveau build.
- **Pas de sauvegarde automatique de la base** : vérifie si ton hébergeur fait des backups automatiques de MySQL, sinon configure un export régulier (cPanel propose généralement un outil « Backup » ou « Backup Wizard »).
