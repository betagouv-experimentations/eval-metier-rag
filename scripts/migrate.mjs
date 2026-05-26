// Applies pending Drizzle migrations against DATABASE_URL.
// Run automatically by the Docker container at startup; can also be
// invoked manually via `node scripts/migrate.mjs`.

import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set; refusing to run migrations.");
  process.exit(1);
}

// Skip cleanly when no migrations have been generated yet. drizzle-orm
// throws "Can't find meta/_journal.json" otherwise, which crashes the
// container before Next.js can start.
const journalPath = "./drizzle/meta/_journal.json";
if (!existsSync(journalPath)) {
  console.log(
    `No Drizzle journal at ${journalPath} — no migrations to apply, skipping.`,
  );
  process.exit(0);
}

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log("Applying Drizzle migrations from ./drizzle ...");
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
} catch (err) {
  console.error("Migration failed:", err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
