import { test, expect } from "@playwright/test";

// Note: We target `main h1` instead of `h1` because the DSFR Display modal
// renders its own <h1> in the DOM at all times. Using `main h1` ensures we
// target the page's actual heading.

test.describe("Pages obligatoires", () => {
  test("la page d'accueil charge", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main h1")).toBeVisible();
  });

  test("le lien d'évitement est présent", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Aller au contenu")).toBeAttached();
  });

  test("la page mentions légales charge", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("main h1")).toContainText("Mentions légales");
  });

  test("la page accessibilité charge", async ({ page }) => {
    await page.goto("/accessibilite");
    await expect(page.locator("main h1")).toContainText("accessibilité");
  });

  test("la page données personnelles charge", async ({ page }) => {
    await page.goto("/donnees-personnelles");
    await expect(page.locator("main h1")).toContainText("Données personnelles");
  });
});
