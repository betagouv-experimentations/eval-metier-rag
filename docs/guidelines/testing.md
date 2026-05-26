# Guide tests E2E (Playwright)

## Principe

Chaque parcours utilisateur critique doit avoir au minimum un test
E2E. Un parcours critique = une action que l'utilisateur fait
régulièrement et qui ne doit pas casser.

## Quoi tester

Pour chaque entité principale du projet (ex: partenaire, interaction,
projet), tester :
- **Lister** : la page de liste affiche les données
- **Créer** : le formulaire de création fonctionne
- **Voir** : la page de détail affiche les bonnes données
- **Modifier** : le formulaire de modification fonctionne
- **Supprimer** : la suppression fonctionne (si applicable)
- **Chercher/Filtrer** : la recherche retourne les bons résultats

## Exemple de test

```ts
// tests/partners.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Partners", () => {
  test("can create a new partner", async ({ page }) => {
    await page.goto("/partners/new");

    await page.fill('input[name="name"]', "ADEME");
    await page.fill('input[name="email"]', "contact@ademe.fr");
    await page.click('button[type="submit"]');

    // Vérifier la redirection vers la liste
    await expect(page).toHaveURL(/\/partners$/);
    // Vérifier que le partenaire apparaît
    await expect(page.getByText("ADEME")).toBeVisible();
  });

  test("shows validation errors on empty form", async ({ page }) => {
    await page.goto("/partners/new");
    await page.click('button[type="submit"]');

    await expect(page.getByText(/obligatoire/i)).toBeVisible();
  });

  test("can list partners", async ({ page }) => {
    await page.goto("/partners");
    // Vérifier que la page charge sans erreur
    await expect(page.locator("h1")).toContainText("Partenaires");
  });
});
```

## Commandes

```bash
# Lancer tous les tests
npx playwright test

# Lancer un fichier spécifique
npx playwright test tests/partners.spec.ts

# Mode debug (ouvre un navigateur visible)
npx playwright test --debug

# Voir le rapport après les tests
npx playwright show-report
```

## Règles

- Les tests doivent être indépendants (pas de dépendance d'ordre)
- Chaque test crée ses propres données de test (via l'UI ou via seed)
- Utiliser des sélecteurs stables : `name`, `role`, `text` plutôt
  que des classes CSS
- Attendre les éléments plutôt que des timeouts fixes
- Un test qui prend plus de 30 secondes est trop lent — optimiser
