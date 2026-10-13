#!/usr/bin/env bash
# Assemble le paquet à uploader sur l'hébergement cPanel dans akili-en-ligne/akili-app/ :
# build le frontend React, copie le backend (src/, prisma/, app.cjs, package.json) et
# le résultat du build, prêt à être zippé et envoyé via le File Manager cPanel.
# Usage : bash scripts/build-for-cpanel.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"
DEST_DIR="$ROOT_DIR/akili-en-ligne/akili-app"

echo "==> Build du frontend (client/)"
(cd "$CLIENT_DIR" && npm run build)

echo "==> Assemblage de akili-en-ligne/akili-app/"
rm -rf "$DEST_DIR/src" "$DEST_DIR/prisma" "$DEST_DIR/public"
mkdir -p "$DEST_DIR/src" "$DEST_DIR/prisma" "$DEST_DIR/public" "$DEST_DIR/uploads"

cp -r "$SERVER_DIR/src/." "$DEST_DIR/src/"
cp -r "$SERVER_DIR/prisma/." "$DEST_DIR/prisma/"
cp "$SERVER_DIR/prisma7.config.ts" "$DEST_DIR/prisma7.config.ts"
cp "$SERVER_DIR/package.json" "$DEST_DIR/package.json"
cp "$SERVER_DIR/package-lock.json" "$DEST_DIR/package-lock.json"
cp "$SERVER_DIR/app.cjs" "$DEST_DIR/app.cjs"
cp "$SERVER_DIR/cpanel-setup.sql" "$ROOT_DIR/akili-en-ligne/base-de-donnees.sql"
cp -r "$CLIENT_DIR/dist/." "$DEST_DIR/public/"
touch "$DEST_DIR/uploads/.gitkeep"

echo "==> Terminé."
echo "Dossier '$DEST_DIR' prêt à être zippé et uploadé sur cPanel."
echo "Rappel avant de zipper : remplir akili-en-ligne/akili-app/.env avec les vraies valeurs"
echo "(ou configure les variables directement dans l'UI cPanel et supprime ce .env)."
