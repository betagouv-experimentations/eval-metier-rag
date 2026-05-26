// scripts/seed.ts — Seed data pour le développement local.
// Lancer avec : npm run seed

import { db } from "../src/db";

async function seed(): Promise<void> {
  console.log("→ Seeding database...");

  // Exemple :
  // await db.insert(partners).values([
  //   { name: "ADEME", email: "contact@ademe.fr" },
  //   { name: "Pôle Emploi", email: "contact@pole-emploi.fr" },
  // ]);

  console.log("✓ Seed terminé. (Aucune donnée insérée — édite scripts/seed.ts)");
}

seed()
  .catch((error: unknown) => {
    console.error("✗ Erreur durant le seed :", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
