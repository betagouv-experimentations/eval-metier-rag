Le PM demande une modification. Adapte le niveau d'effort au scope.

## Évaluer le scope

**Petit** (< 30 min) : changement visuel, ajout d'un champ, correction
de texte, réorganisation d'un écran.
→ Implémente directement.

**Moyen** (30 min - 2h) : nouvel écran, nouvelle fonctionnalité simple
(export CSV, recherche, filtre), refonte d'un parcours.
→ Explique en 3-5 lignes ce que tu vas faire, puis implémente.

**Grand** (2h+) : nouveau module complet, changement d'architecture,
intégration API externe.
→ Fais une mini-spec (10-15 lignes), demande validation au PM,
  puis implémente.

## Implémenter

Dans TOUS les cas, suis ces étapes :

1. Si tu modifies le schéma DB :
   - Modifie `src/db/schema.ts`
   - `npx drizzle-kit generate`
   - `npx drizzle-kit migrate`

2. Implémente le changement

3. Mets à jour les tests E2E existants si le parcours a changé

4. Ajoute un nouveau test E2E si c'est un nouveau parcours

5. Lance les tests :
   ```bash
   npx playwright test
   ```
   Corrige tout ce qui échoue.

6. Assure-toi que le dev server tourne :
   ```bash
   npm run dev
   ```

7. **Smoke test via MCP Playwright** (idem `/build` étape 8) :
   - Navigue sur `http://localhost:3000` et sur l'écran impacté par
     le changement
   - Vérifie status 200, console sans erreur, page rendue
   - Si l'écran a un formulaire modifié : essaie de le soumettre
     pour confirmer que la validation marche

   Corrige et itère si nécessaire. Pas de retour au PM tant que le
   smoke test n'est pas vert.

## Livrer

Affiche :

"✅ Modification faite !
→ Vérifie sur http://localhost:3000
→ Tape /save quand c'est bon"
