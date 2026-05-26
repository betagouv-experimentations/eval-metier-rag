// src/db/schema.ts — Schéma Drizzle ORM.
// Définis ici les tables de ton projet, puis lance :
//   npx drizzle-kit generate
//   npx drizzle-kit migrate

// Exemple (décommenter et adapter) :
//
// import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
//
// export const partners = pgTable("partners", {
//   id: serial("id").primaryKey(),
//   name: text("name").notNull(),
//   email: text("email"),
//   createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
// });
//
// export type Partner = typeof partners.$inferSelect;
// export type NewPartner = typeof partners.$inferInsert;

export {};
