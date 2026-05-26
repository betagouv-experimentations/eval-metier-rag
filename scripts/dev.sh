#!/bin/bash
# Lance la stack de développement (DB + dev server)

set -euo pipefail

echo "→ Lancement de PostgreSQL via Docker..."
docker compose up -d db

echo "→ Application des migrations..."
npx drizzle-kit migrate

echo "→ Lancement du serveur de développement..."
npm run dev
