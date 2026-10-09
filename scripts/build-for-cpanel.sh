#!/usr/bin/env bash
# Assemble le paquet à uploader sur l'hébergement cPanel : build le frontend React
# et copie le résultat dans server/public (servi par Express en production).
# Usage : bash scripts/build-for-cpanel.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIENT_DIR="$ROOT_DIR/client"
SERVER_DIR="$ROOT_DIR/server"
PUBLIC_DIR="$SERVER_DIR/public"

echo "==> Build du frontend (client/)"
(cd "$CLIENT_DIR" && npm run build)

echo "==> Copie de client/dist vers server/public"
rm -rf "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"
cp -r "$CLIENT_DIR/dist/." "$PUBLIC_DIR/"

echo "==> Terminé."
echo "Dossier 'server/' prêt à être zippé et uploadé sur cPanel."
echo "Rappel avant de zipper : exclure node_modules/, .env, uploads/* (sauf .gitkeep)."
