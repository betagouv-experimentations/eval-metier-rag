Le PM décrit ce qu'il veut construire. Suis ce workflow en séquence.

## Phase 1 — Vérifier le cadrage

Vérifie si `specs/SPEC.md` existe :

- **Si `specs/SPEC.md` n'existe pas** :
  Affiche exactement ce message, puis STOP (pas de questions, pas de
  fichiers générés) :

  "Avant /build, on cadre le produit. Tape /cadrer — un dialogue
  d'environ 20 minutes (persona, problème, promesse, parcours, données,
  succès) qui produit specs/SPEC.md + specs/BACKLOG.md. Reviens ensuite
  sur /build."

- **Si `specs/SPEC.md` existe** :
  Lis `specs/SPEC.md` et `specs/BACKLOG.md`. Passe directement en
  Phase 2.

## Phase 2 — Valider la spec

Tu as déjà `specs/SPEC.md` et `specs/BACKLOG.md` produits par `/cadrer`.
Présente au PM un **résumé en 10-15 lignes max** qui couvre : persona
principal, parcours en 3-5 étapes, données clés, et les 3-5 premiers
tickets du backlog.

Demande : "Ça correspond à ce que tu veux ? Si oui je lance la
construction. Sinon, dis-moi ce qu'il faut changer dans specs/SPEC.md
ou specs/BACKLOG.md."

ATTENDS la validation explicite du PM avant de continuer.

## Phase 3 — Construire

Enchaîne SANS interruption :

1. **Planifier** : Écris le plan technique dans `specs/plan.md`
   (architecture, modèle de données détaillé, endpoints API, composants)

2. **Schéma DB** : Écris le schéma Drizzle dans `src/db/schema.ts`,
   génère et applique la migration :
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

3. **Implémenter les tickets de `specs/BACKLOG.md` dans l'ordre** :
   Pour chaque ticket (du haut vers le bas du backlog) :
   a. Lis le ticket et son critère d'acceptation
   b. Implémente la page/composant/API correspondant dans `src/`
   c. Utilise UNIQUEMENT les composants `@codegouvfr/react-dsfr`.
      **Consulte la skill `react-dsfr`** avant d'écrire le composant
      (liste des composants disponibles, props, patterns d'usage,
      thème dark/light, setup Next.js App Router pour éviter le
      glitch de thème). Les composants DSFR sont nativement
      accessibles ; pour les patterns RGAA additionnels (focus
      management SPA, `alt` informative, `aria-live` pour les mises
      à jour partielles), suis la section "Accessibilité — RGAA" du
      `CLAUDE.md`. L'audit RGAA formel est lancé en étape 6.
   d. Écris un test E2E Playwright qui couvre ce ticket
   e. Coche le ticket dans `specs/BACKLOG.md` (`[ ]` devient `[x]`)
   f. Passe au ticket suivant

   Ne pas sauter de ticket sans validation explicite du PM. Si un
   ticket bloque, demande-lui.

4. **Seed data** : Écris des données de test réalistes dans
   `scripts/seed.ts` et exécute `npm run seed`

5. **Tester** : Lance TOUS les tests E2E :
   ```bash
   npx playwright test
   ```
   Si un test échoue, corrige et relance jusqu'à 100% vert.

6. **Audits RGAA et ANSSI** :

   Les skills `rgaa` et `securite-anssi` sont des **outils d'audit
   a posteriori** (workflow : parcourir N critères/domaines, produire
   un rapport C/NC/NA ou OK/KO/Partiel/NA). Tu DOIS les invoquer
   explicitement via le tool `Skill()` — ne pas faire une review
   mentale en citant des critères de tête.

   Vérifications transverses préalables :
   - Les pages obligatoires existent (`/mentions-legales`,
     `/accessibilite`, `/donnees-personnelles`)
   - Les migrations Drizzle sont commitées

   ### 6.a — Audit RGAA

   Invoque `Skill(rgaa)` et applique son workflow sur le code généré
   (106 critères répartis en 13 thèmes). La skill produira un rapport
   markdown dans `audits/`.

   Pour les non-conformités (NC) :
   - **Critères critiques** (navigation clavier, focus visible, labels
     de formulaires, contrastes 4.5:1 et 3:1, hiérarchie `<h1>` à
     `<h6>` sans saut, `<html lang="fr">`, lien d'évitement) :
     corriger automatiquement et **relancer l'audit** jusqu'à 0 NC
     sur ces critères.
   - **Critères secondaires** (alt informative complexe, multimédia
     riche, scripts complexes, tableaux de données complexes) :
     documenter dans le rapport, ne pas bloquer.

   ### 6.b — Audit ANSSI

   Invoque `Skill(securite-anssi)` et applique son workflow d'audit
   (12 domaines). La skill produira un rapport dans `audits/`.

   Applique les **3 niveaux de blocage** suivants en fonction du
   résultat par domaine :

   - 🔴 **BLOQUANT smoke test** — Si KO sur l'un de ces domaines,
     **corriger automatiquement et relancer l'audit jusqu'à OK** avant
     de passer à l'étape 7. Ces domaines exposent le proto à un risque
     immédiat dès qu'il est public :
     - **Domaine #2 Gestion des secrets** (secret en dur dans le code)
     - **Domaine #5 Validation des entrées** (risque d'injection
       SQL/XSS/SSRF — toutes les entrées doivent être validées par
       zod côté serveur)
     - **Domaine #6 Dépendances** — uniquement les vulnérabilités
       **high/critical** (`npm audit --audit-level=high` ne doit
       rien rapporter). Les vulnérabilités `moderate` sont
       acceptables en V1 (voir 🟡 ci-dessous).

   - 🟠 **PRÉVIENT le PM avant `/save`** — Si Partiel ou KO sur l'un
     de ces domaines, **continue en étape 7** mais signale-les
     explicitement au PM en Phase 4 (voir la phrase d'avertissement
     ci-dessous). Ces domaines dégradent la posture sécurité du proto
     en prod sans le rendre dangereux immédiatement :
     - **Domaine #1 TLS / HTTPS** (typiquement HSTS manquant dans
       `next.config.ts` — `Strict-Transport-Security: max-age=63072000;
       includeSubDomains; preload`)
     - **Domaine #4 Headers de sécurité** (typiquement CSP manquant ou
       autres headers : `X-Frame-Options`, `Referrer-Policy`,
       `Permissions-Policy`, `X-Content-Type-Options`)

   - 🟡 **Documente sans bloquer ni avertir** — Mentionne dans le
     rapport, mais ne bloque pas et n'avertit pas le PM. Ces domaines
     sont acceptables pour un proto V1 :
     - **Domaine #3 Authentification** (souvent NA en V1, décision spec)
     - **Domaine #6 Dépendances** — uniquement les `moderate` (esbuild
       dev-only, postcss, etc.) qui n'ont pas d'impact runtime prod
     - **Domaine #7 Journalisation** (souvent NA sans trafic réel)
     - **Domaine #8 Protection des API** (rate limiting acceptable
       sans trafic en V1)
     - **Domaine #9 Conteneurs** (devrait être OK par défaut grâce au
       Dockerfile du template — si KO ici, signale-le comme bug du
       template, pas du proto)
     - **Domaine #10 Poste de dev** (hors périmètre proto)
     - **Domaine #11 Sauvegarde** (volumes Docker suffisent en V1,
       Coolify gère les backups niveau infra)
     - **Domaine #12 Incidents** (procédures DINUM existantes)

   Si tu as des avertissements 🟠 à signaler, garde la liste en
   mémoire pour la Phase 4.

7. **Dev server** : Lance le serveur :
   ```bash
   npm run dev
   ```

8. **Smoke test** : utilise le MCP Playwright pour vérifier que le
   serveur répond correctement AVANT de rendre la main au PM :

   - Navigue sur `http://localhost:3000`
   - Vérifie que la réponse HTTP est 200
   - Capture les messages console (`browser_console_messages`) — il
     ne doit pas y avoir d'erreur JS au chargement
   - Prends un snapshot accessibility (`browser_snapshot`) — vérifie
     qu'un `<h1>` est présent et que la page n'est pas cassée
   - Visite **au moins** un écran principal du parcours utilisateur
     (le plus important du plan), idem : pas d'erreur, page rend.

   Si le smoke test détecte un problème :
   - Diagnostique (route 404, erreur de serveur, erreur Hydration,
     bundle qui ne charge pas, etc.)
   - Corrige
   - Relance le dev server si besoin
   - Refais le smoke test
   - Itère jusqu'à ce que tout passe.

   NE rends PAS la main au PM tant que le smoke test n'est pas vert.

## Phase 4 — Livrer

**Si tu as des avertissements 🟠 issus de l'audit ANSSI (étape 6.b)**,
affiche-les en premier sous cette forme :

"⚠️ Avertissements avant déploiement (rapport complet :
`audits/securite-anssi-<date>.md`) :
- Domaine #1 TLS : HSTS manquant dans `next.config.ts`
- Domaine #4 Headers : CSP manquant dans `next.config.ts`
À corriger via `/change` avant `/save` pour ne pas dégrader la
posture sécurité en prod."

Puis (toujours, qu'il y ait des avertissements ou non) affiche au PM :

"✅ Ton proto est prêt !

→ Ouvre http://localhost:3000 dans ton navigateur pour le voir
→ Navigue dans les écrans, teste les formulaires
→ Dis-moi si tu veux changer quelque chose (/change)
→ Quand c'est bon, tape /save pour le mettre en ligne"
