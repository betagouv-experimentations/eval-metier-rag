# CLAUDE.md — Constitution du projet

## Contexte

Ce projet est un prototype de service public numérique français,
développé dans le cadre de beta.gouv.fr.

Le développeur principal est un Product Manager non technique qui
communique en français. Tu es son unique outil de développement.
Tu dois produire du code de qualité professionnelle, comme si un
dev senior allait le relire demain.

## Commandes disponibles

Le PM utilise 5 commandes. Ne le redirige pas vers d'autres outils :

- `/cadrer` — Cadrer le produit en 6 dimensions (à faire AVANT /build, produit specs/SPEC.md + specs/BACKLOG.md)
- `/build` — Créer le projet ou une refonte majeure
- `/change` — Modifier l'existant (feature, fix, amélioration)
- `/save` — Tests, commit, push, déploiement
- `/preview` — Lancer ou relancer le serveur de dev

## Source de vérité produit

Le périmètre du proto est défini par :
- `specs/SPEC.md` — la spec lisible par le PM (généré par /cadrer)
- `specs/BACKLOG.md` — les tickets ordonnés (généré par /cadrer)

Ne pas implémenter de fonctionnalité absente du BACKLOG sans validation
explicite du PM. Le PM peut éditer SPEC.md et BACKLOG.md à tout moment
— relire avant chaque nouveau ticket.

## Skills installées

Le projet a 6 skills dans `.claude/skills/`. **Tu DOIS les consulter
proactivement** — la skill correspondante fait autorité sur son domaine :

- **`react-dsfr`** → à consulter à chaque création de composant UI
  (liste des composants disponibles, props, patterns d'usage, gestion
  du thème dark/light)
- **`rgaa`** → à consulter à chaque création de page ou de formulaire
  (critères RGAA 4.1.2, checklist d'audit)
- **`securite-anssi`** → à consulter au moment de la review finale et
  pour toute config serveur/CI (12 règles, headers, secrets)
- **`datagouv-apis`** → si le proto consomme des données publiques
  (datasets, API gouvernementales)
- **`lasuite-ui-kit`** → si le proto s'intègre à La Suite (Docs, Drive,
  etc.)
- **`pause-session`** → utilisable par le PM s'il doit interrompre sa
  session

Si tu n'as pas consulté la skill pertinente pour une tâche, tu ne fais
pas correctement ton travail.

## Comportement attendu

> Aligné sur le standard [beta.gouv / etalab-ia](https://github.com/etalab-ia/skills/blob/main/templates/instructions/beta.gouv.md).

### Réfléchir avant de coder

Ne pas supposer. Ne pas cacher la confusion. Si tu hésites sur l'exigence
ou l'approche, **demande au PM** plutôt que d'inventer. Si une approche
plus simple existe, signale-la avant d'écrire du code.

Pour toute tâche non triviale (3+ étapes ou décision d'architecture),
écris ton plan dans `specs/plan.md` (la Phase 3 de `/build` le fait déjà),
attends la validation du PM, puis avance en marquant les étapes au fur
et à mesure.

Si ça déraille : **STOP** et re-planifie avant de continuer.

### Simplicité d'abord

Pas de fonctionnalité au-delà de ce qui a été demandé. Pas d'abstraction
pour du code à usage unique. Pas de "flexibilité" que personne n'a
réclamée. Si 200 lignes peuvent en faire 50, simplifie — sans sortir du
périmètre chirurgical de la tâche.

Pour tout changement non trivial, demande-toi : *"Existe-t-il une
solution plus élégante ?"* Si une correction sent le bricolage : *"En
sachant tout ce que je sais maintenant, implémente la solution propre."*
Ne pas appliquer aux corrections simples et évidentes — pas de
sur-ingénierie.

### Changements chirurgicaux

Ne touche que ce qui est nécessaire. Ne pas "améliorer" le code
adjacent. Ne pas refactorer ce qui n'est pas cassé. Chaque ligne
modifiée doit être traçable directement à la demande du PM.

### Exécution orientée résultat

Ne pas décrire les étapes — définis les critères de succès et boucle
jusqu'à vérification. Écris d'abord le test, puis fais-le passer.

Face à un bug : corrige-le directement. Pointe vers les logs, les
erreurs, les tests qui échouent — puis résous sans demander un guide
pas-à-pas.

### Boucle d'auto-amélioration

Après chaque correction du PM, ajoute le motif d'erreur et la règle à
retenir dans `specs/lessons.md`. Relis ce fichier au démarrage de chaque
session pour éviter de répéter les mêmes erreurs. `specs/lessons.md` est
cumulatif sur la durée du projet (contrairement à `specs/plan.md` qui
est remis à zéro à chaque nouvelle tâche).

## Stack technique imposée

- **Framework** : Next.js 15 (App Router) + TypeScript strict
- **UI** : `@codegouvfr/react-dsfr` exclusivement
  - NE PAS utiliser Tailwind, Material UI, shadcn, Chakra, ou autre
  - NE PAS écrire du CSS custom sauf cas exceptionnel documenté
  - Importer les composants depuis `@codegouvfr/react-dsfr`
  - Consulter docs/guidelines/dsfr.md pour la liste des composants
- **ORM** : Drizzle ORM avec PostgreSQL
  - Toujours passer par des migrations (voir docs/guidelines/migrations.md)
- **Validation** : zod pour toutes les entrées utilisateur
- **Tests** : Playwright pour les tests E2E
- **Langue du code** : anglais (variables, fonctions, commentaires)
- **Langue de l'interface** : français

## Règles de développement

### Architecture Next.js

- Utiliser l'App Router (dossier `src/app/`)
- Server Components par défaut, Client Components uniquement si
  nécessaire (interactivité, hooks, effets)
- Marquer explicitement les Client Components avec `"use client"`
- API Routes dans `src/app/api/` pour les endpoints backend
- Server Actions pour les mutations simples (formulaires)
- Pas de dossier `pages/` (ancien router)

### Base de données

- **TOUJOURS** utiliser des migrations Drizzle pour chaque changement
  de schéma
- Workflow :
  1. Modifier `src/db/schema.ts`
  2. `npx drizzle-kit generate` (génère la migration SQL)
  3. `npx drizzle-kit migrate` (applique la migration)
  4. Vérifier que la migration est dans `drizzle/`
- **JAMAIS** de modification manuelle de la DB (pas de `ALTER TABLE`
  direct, pas de `psql` pour changer le schéma)
- Seed data dans `scripts/seed.ts`, exécutable via `npm run seed`
- En développement, la DB tourne dans Docker (docker-compose.yml)
- En production, la DB est provisionnée par Coolify (DATABASE_URL
  injectée automatiquement)
- **En production, les migrations sont appliquées automatiquement au
  démarrage du container** via `scripts/migrate.mjs`. Tu n'as pas à
  les déclencher manuellement après un déploiement. Si la migration
  échoue, le container ne démarre pas et Coolify rapporte l'erreur.

### Tests

- **Au minimum un test E2E Playwright par parcours utilisateur
  critique** : créer, modifier, supprimer, lister, chercher
- Lancer les tests AVANT de considérer une tâche terminée
- Commande : `npx playwright test`
- Si un test échoue, le corriger IMMÉDIATEMENT. Ne JAMAIS :
  - Skipper un test avec `.skip`
  - Supprimer un test qui échoue
  - Committer avec des tests rouges
- Les tests doivent être indépendants (chaque test setup/teardown
  ses propres données)
- Consulter docs/guidelines/testing.md pour les patterns

### Qualité TypeScript

- `"strict": true` dans tsconfig.json — pas de dérogation
- JAMAIS de `any` — utiliser `unknown` + type guard si nécessaire
- JAMAIS de `@ts-ignore` ou `@ts-expect-error`
- Typer explicitement les props de composants, les retours de fonctions,
  les schémas Drizzle, les paramètres d'API
- Utiliser les types utilitaires TypeScript (Partial, Pick, Omit, etc.)
  plutôt que de redéfinir des types

### Accessibilité — RGAA

Obligatoire, pas optionnel. Conformité RGAA 4.2 (équivalent WCAG 2.1 AA).
Référence officielle : https://accessibilite.numerique.gouv.fr/

Consulter en priorité la skill `.claude/skills/rgaa/` (audit 106 critères).
La doc humaine `docs/guidelines/rgaa.md` reste disponible en complément.

**Images**
- `alt` uniquement sur les images qui portent une information
- Images décoratives : `alt=""` obligatoire (sinon le lecteur d'écran lit
  l'URL)
- L'alternative décrit le **sens**, pas l'apparence

**Contrastes**
- Texte : ratio minimum 4.5:1 (3:1 pour le texte large)
- Composants d'interface : ratio minimum 3:1 avec leur environnement
- Utiliser les couleurs DSFR (conformes par défaut) — ne pas inventer
  de couleur hors palette

**Structure et navigation**
- Lien d'évitement "Aller au contenu" dans le layout principal
- `<html lang="fr">` sur toutes les pages
- Hiérarchie stricte `<h1>` à `<h6>`, sans saut de niveau (`<h1>` unique
  par page)
- Navigation au clavier fonctionnelle (tab, enter, escape)
- Focus visible sur tous les éléments interactifs (DSFR le gère, ne pas
  l'overrider avec `outline: none`)
- Deux systèmes de navigation (menu principal + un autre : recherche,
  plan du site, ou fil d'Ariane)

**Formulaires**
- Chaque champ a un `<label htmlFor>` ou un `aria-label`
- Le `placeholder` n'est **pas** un label
- Erreurs et messages d'aide liés aux champs via `aria-describedby`
- Ne pas désactiver le bouton de soumission

**Navigation SPA (Next.js App Router)**
- Repositionner le focus après chaque changement de vue (`tabindex="-1"`
  + focus programmatique sur le nouveau `<h1>` ou la zone principale)
- Tester la navigation clavier après chaque changement d'écran
- `aria-live="polite"` pour les mises à jour partielles (toast, statuts,
  résultats de recherche qui changent en place)

### Sécurité — ANSSI

Référence officielle : https://cyber.gouv.fr/les-regles-de-securite

Consulter en priorité la skill `.claude/skills/securite-anssi/` (12 règles
ANSSI complètes). La doc humaine `docs/guidelines/security.md` reste
disponible en complément.

- Variables d'environnement dans `.env.local` (jamais committé), valeurs
  différentes par environnement (dev / prod)
- **JAMAIS** de secret en dur dans le code (API keys, mots de passe,
  tokens)
- Valider TOUTES les entrées utilisateur avec zod :
  - Côté serveur (API routes, Server Actions) : source de vérité
  - Côté client (formulaires) : pour l'UX uniquement
- Pas de requêtes SQL brutes — utiliser Drizzle ORM exclusivement
  (requêtes paramétrées par défaut)
- Échapper les données affichées (React le fait par défaut, ne pas
  utiliser `dangerouslySetInnerHTML`)
- Messages d'erreur sans détails internes (pas de stack trace côté
  client, pas de nom de table dans une erreur 500)
- Dépendances à jour : `npm audit` ne doit pas signaler de vulnérabilité
  haute ou critique
- Pas de `console.log` en production (utiliser un logger conditionné par
  `NODE_ENV`)
- CSRF : Next.js le gère nativement avec les Server Actions
- Headers de sécurité (CSP, X-Frame-Options, Referrer-Policy, etc.)
  configurés dans `next.config.ts`

### RGPD / CNIL

Tout proto qui collecte des données personnelles, même internes,
applique les principes RGPD :

- **Minimisation** : ne collecter que les données strictement nécessaires
  au cas d'usage défini dans `specs/SPEC.md`. Si un champ n'est pas
  utilisé activement, ne pas le collecter.
- **Consentement explicite** pour tout cookie non essentiel (analytics,
  tracking). Cookies de session strictement nécessaires : OK sans
  consentement.
- **Pas de tracker tiers** sans consentement (Google Analytics, Hotjar,
  Crisp, etc.) — pour les protos, préférer une solution sans tracker
  ou de l'analytics serveur conforme (Plausible, Matomo en self-hosted).
- **Pages obligatoires** : `/mentions-legales`, `/donnees-personnelles`,
  `/accessibilite` (cf. section "Pages obligatoires" plus bas).
- **Droit d'accès et de suppression** : si le proto stocke des données
  personnelles identifiantes (email, téléphone, nom), prévoir au minimum
  un mécanisme manuel (contact admin) — pas nécessaire d'avoir l'UI V1.
- **Pas de données réelles dans `scripts/seed.ts`** : les données de
  démonstration sont fictives (jamais d'extrait d'un fichier RH ou d'une
  base prod).

### Commits et Git

Le PM ne connaît pas Git. C'est la commande `/save` qui gère.
Quand `/save` est appelée :
- Message de commit en anglais, format conventionnel :
  `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
- Message descriptif et clair (pas "update", pas "fix stuff")
- Un commit par `/save` (tout le travail depuis le dernier save)

### Style de code

- Indentation : 2 espaces
- Guillemets : doubles pour JSX, simples pour JS/TS
- Point-virgule : oui
- Trailing comma : oui
- Max ligne : 100 caractères (flexible pour JSX)
- Nommage : camelCase pour variables/fonctions, PascalCase pour
  composants/types, SCREAMING_SNAKE_CASE pour constantes
- Fichiers : kebab-case (ex: `user-profile.tsx`)
- Un composant React par fichier

### Pages obligatoires

Ces pages DOIVENT exister dans le projet. Des templates sont fournis
dans le starter kit :
- `/mentions-legales`
- `/accessibilite`
- `/donnees-personnelles`

Quand le projet a des utilisateurs réels, ajouter :
- `/stats` (métriques d'impact, cf. standards beta)

### Éco-conception

- Pas de dépendances inutiles. Chaque `npm install` doit avoir une
  raison claire.
- Pas de polyfills ou libs de compatibilité sauf si nécessaire
- Optimiser les images (format WebP, lazy loading)
- Utiliser `next/image` pour toutes les images
- Pas de requêtes en cascade (N+1). Utiliser les jointures Drizzle.
- Pagination des listes longues (pas de "charger tout d'un coup")

### Ce que tu ne dois JAMAIS faire

1. Supprimer ou modifier du code existant sans qu'on te l'ait demandé
2. Utiliser des composants UI qui ne sont pas du DSFR
3. Modifier la DB sans migration Drizzle
4. Ignorer ou supprimer un test qui échoue
5. Committer des secrets ou des données personnelles
6. Installer des dépendances sans justification
7. Faire des requêtes fetch vers des APIs non documentées dans le projet
8. Utiliser `any`, `@ts-ignore`, ou `@ts-expect-error`
9. Écrire du CSS custom quand un composant DSFR existe
10. Supprimer les pages obligatoires (mentions légales, accessibilité, etc.)

### Références contextuelles

La source de vérité est dans `.claude/skills/` (cf. section "Skills
installées" en haut de ce fichier) — c'est ce que tu dois consulter
proactivement quand tu codes.

Les `docs/guidelines/*.md` du repo restent disponibles comme docs
humaines lisibles dans le repo (pour le PM qui veut comprendre les
principes), mais c'est aux skills que tu te réfères :

| Domaine | Skill (faisant autorité) | Doc humaine complémentaire |
|---|---|---|
| UI et composants | `react-dsfr` | `docs/guidelines/dsfr.md` |
| Accessibilité | `rgaa` | `docs/guidelines/rgaa.md` |
| Sécurité | `securite-anssi` | `docs/guidelines/security.md` |
| Base de données | — | `docs/guidelines/migrations.md` |
| Tests | — | `docs/guidelines/testing.md` |
| Standards beta | — | `docs/guidelines/beta-standards.md` |
