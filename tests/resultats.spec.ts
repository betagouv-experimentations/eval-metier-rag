import { test, expect } from "@playwright/test";
import { db } from "../src/db";
import { campaigns } from "../src/db/schema";
import { eq } from "drizzle-orm";

test.describe("Tableau de bord des résultats", () => {
  let campaignId: string;

  test.beforeAll(async () => {
    // Get the seed campaign id
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.token, "seed-token-demo-123"));
    if (campaign) campaignId = campaign.id;
  });

  test("la page résultats charge pour une campagne avec annotations", async ({ page }) => {
    if (!campaignId) test.skip();
    await page.goto(`/campagnes/${campaignId}/resultats`);
    await expect(page.locator("main h1")).toContainText("Résultats");
    await expect(page.getByText("Vue d'ensemble")).toBeVisible();
  });

  test("les statistiques d'acceptabilité s'affichent", async ({ page }) => {
    if (!campaignId) test.skip();
    await page.goto(`/campagnes/${campaignId}/resultats`);
    await expect(page.getByText("Réponses A acceptables")).toBeVisible();
    await expect(page.getByText("Réponses B acceptables")).toBeVisible();
  });

  test("la comparaison des modèles s'affiche", async ({ page }) => {
    if (!campaignId) test.skip();
    await page.goto(`/campagnes/${campaignId}/resultats`);
    await expect(page.getByText("Comparaison des modèles")).toBeVisible();
    await expect(page.getByText("A meilleure que B")).toBeVisible();
    await expect(page.getByText("B meilleure que A")).toBeVisible();
  });

  test("le détail par question est accessible via accordéon", async ({ page }) => {
    if (!campaignId) test.skip();
    await page.goto(`/campagnes/${campaignId}/resultats`);
    await expect(page.getByText("Détail par question")).toBeVisible();
    // Open the first accordion
    const firstAccordion = page.locator(".fr-accordion").first();
    await firstAccordion.locator("button").click();
    await expect(firstAccordion).toContainText("Acceptable A");
  });

  test("le bouton d'export CSV est présent", async ({ page }) => {
    if (!campaignId) test.skip();
    await page.goto(`/campagnes/${campaignId}/resultats`);
    await expect(page.getByRole("link", { name: /Exporter CSV/i })).toBeVisible();
  });

  test("la page résultats affiche un message si pas d'annotations", async ({ page }) => {
    // Create a fresh campaign with no annotations
    const res = await page.request.post("/api/campagnes", {
      multipart: {
        file: {
          name: "empty-test.csv",
          mimeType: "text/csv",
          buffer: Buffer.from(
            "question,réponse_A\n\"Test question\",\"Test response A\"",
          ),
        },
      },
    });
    const campaign = (await res.json()) as { id: string };
    await page.goto(`/campagnes/${campaign.id}/resultats`);
    await expect(page.getByText("Aucune annotation pour le moment")).toBeVisible();
  });
});
