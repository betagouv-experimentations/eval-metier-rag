#!/bin/bash
# .agent-vm.runtime.sh — Provisioning beta.gouv pour agent-vm.
# Exécuté automatiquement par agent-vm à la création de la VM,
# avant le démarrage de Claude. Voir
# https://github.com/sylvinus/agent-vm.

set -euo pipefail

echo "=== Provisioning des outils beta.gouv ==="

# GitHub CLI (si pas déjà installé par agent-vm)
if ! command -v gh &>/dev/null; then
  curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
  sudo apt-get update && sudo apt-get install -y gh
fi

# Playwright browsers (chromium + dépendances système via apt — sudo).
# pa11y et drizzle-kit ne sont pas installés en global : on passe par
# `npx pa11y ...` à la demande, et drizzle-kit est déjà dans les
# devDependencies du projet.
sudo npx --yes playwright install --with-deps chromium

# Spec Kit (pour initialisation de projets futurs, optionnel)
pip install --user specify-cli 2>/dev/null || true

echo "=== Outils beta.gouv installés ==="

# Auth GitHub (interactif, une seule fois)
if ! gh auth status &>/dev/null 2>&1; then
  echo ""
  echo "╔════════════════════════════════════════════════╗"
  echo "║  Connexion à GitHub                            ║"
  echo "║  Un navigateur va s'ouvrir.                    ║"
  echo "║  Connecte-toi avec ton compte GitHub.          ║"
  echo "╚════════════════════════════════════════════════╝"
  echo ""
  gh auth login --web --git-protocol https
fi

echo ""
echo "✅ Tout est prêt ! Lance 'agent-vm claude' pour démarrer."
