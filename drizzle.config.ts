import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://pm:pm@localhost:5432/proto",
  },
  strict: true,
  verbose: true,
} satisfies Config;
