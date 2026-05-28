import { test, expect } from "@playwright/test";

// Uses the seed campaign token
const SEED_TOKEN = "seed-token-demo-123";

test.describe("Interface d'annotation", () => {
  test("la vue liste des questions charge", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await expect(page.locator("main h1")).toContainText("Évaluation FAQ DINUM");
    await expect(page.getByText("3 questions")).toBeVisible();
  });

  test("les questions de la campagne sont listées", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await expect(page.getByText("passeport")).toBeVisible();
    await expect(page.getByText("formation")).toBeVisible();
  });

  test("clic sur une question ouvre la vue annotation", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await page.getByText("passeport").first().click();
    await expect(page).toHaveURL(/\/annotation\/seed-token-demo-123\/.+/);
    await expect(page.getByText("Votre évaluation")).toBeVisible();
  });

  test("la vue annotation affiche la question et les réponses", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await page.getByText("passeport").first().click();

    // Question text should be visible
    await expect(page.getByText("passeport")).toBeVisible();

    // Both responses in tabs
    await expect(page.getByRole("tab", { name: "Réponse A" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Réponse B" })).toBeVisible();
  });

  test("les critères d'évaluation sont présents", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await page.getByText("passeport").first().click();

    await expect(page.getByText("La réponse A est-elle acceptable ?")).toBeVisible();
    await expect(page.getByText("La réponse B est-elle acceptable ?")).toBeVisible();
    await expect(page.getByText("Quelle réponse est la meilleure ?")).toBeVisible();
  });

  test("navigation précédent/suivant fonctionne", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await page.getByText("passeport").first().click();

    // First question: "Précédent" should be disabled
    const prevBtn = page.getByRole("button", { name: /Précédent/i }).first();
    await expect(prevBtn).toBeDisabled();

    // Click "Suivant" — DSFR Button with linkProps renders as <a> (role=link, not button)
    await page.getByRole("link", { name: /Suivant/i }).first().click();
    await expect(page).toHaveURL(/\/annotation\/seed-token-demo-123\/.+/);
  });

  test("un commentaire peut être saisi", async ({ page }) => {
    await page.goto(`/annotation/${SEED_TOKEN}`);
    await page.getByText("passeport").first().click();

    const commentArea = page.getByLabel("Commentaire (optionnel)");
    await expect(commentArea).toBeVisible();
    await commentArea.fill("Réponse B plus complète");
    await expect(commentArea).toHaveValue("Réponse B plus complète");
  });

  test("lien 404 pour un token invalide", async ({ page }) => {
    await page.goto("/annotation/token-inexistant-xyz");
    await expect(page).toHaveURL(/\/annotation\/token-inexistant-xyz/);
    // Next.js notFound() renders a 404 page
    await expect(page.locator("body")).toContainText(/404|introuvable/i);
  });
});
