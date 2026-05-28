import { test, expect } from "@playwright/test";

test.describe("Gestion des campagnes", () => {
  test("la page liste des campagnes charge", async ({ page }) => {
    await page.goto("/campagnes");
    await expect(page.locator("main h1")).toContainText("Campagnes");
  });

  test("la page création de campagne charge", async ({ page }) => {
    await page.goto("/campagnes/nouvelle");
    await expect(page.locator("main h1")).toContainText("Créer une campagne");
  });

  test("le formulaire d'upload affiche le format attendu", async ({ page }) => {
    await page.goto("/campagnes/nouvelle");
    await expect(page.getByText("Format attendu du fichier")).toBeVisible();
    await expect(page.getByText("réponse_A")).toBeVisible();
  });

  test("erreur si le fichier a un mauvais format", async ({ page }) => {
    await page.goto("/campagnes/nouvelle");
    // Upload a non-Excel file
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not an excel file"),
    });
    await page.getByRole("button", { name: /Importer/i }).click();
    // Should show an error
    await expect(page.locator("[role=alert]")).toBeVisible({ timeout: 5000 });
  });

  test("import d'un fichier CSV crée une campagne", async ({ page }) => {
    // CSV with the expected structure
    const csvContent = [
      "question,réponse_A,réponse_B,sources_A,sources_B",
      '"Comment obtenir une carte vitale ?","Rendez-vous à la CPAM","Téléchargez le formulaire S1104","https://service-public.fr/a","https://ameli.fr/b"',
    ].join("\n");

    await page.goto("/campagnes/nouvelle");
    const fileInput = page.locator("input[type=file]");
    await fileInput.setInputFiles({
      name: "test-campagne.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(csvContent),
    });
    await page.getByRole("button", { name: /Importer/i }).click();

    // Should redirect to campaign detail page
    await page.waitForURL(/\/campagnes\/[a-f0-9-]+$/);
    await expect(page.locator("main h1")).toContainText("test-campagne");
  });

  test("la campagne de seed apparaît dans la liste", async ({ page }) => {
    await page.goto("/campagnes");
    await expect(page.getByText("Évaluation FAQ DINUM")).toBeVisible({ timeout: 5000 });
  });
});
