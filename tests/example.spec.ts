import { test, expect } from "@playwright/test";

test.describe("Pages obligatoires", () => {
  test("la page d'accueil charge", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("le lien d'évitement est présent", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Aller au contenu")).toBeAttached();
  });

  test("la page mentions légales charge", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toContainText("Mentions légales");
  });

  test("la page accessibilité charge", async ({ page }) => {
    await page.goto("/accessibilite");
    await expect(page.locator("h1")).toContainText("accessibilité");
  });

  test("la page données personnelles charge", async ({ page }) => {
    await page.goto("/donnees-personnelles");
    await expect(page.locator("h1")).toContainText("Données personnelles");
  });
});
