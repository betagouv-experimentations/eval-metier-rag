import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

// ----- campaigns -----
export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  token: text("token").notNull().unique(),
  mode: text("mode", { enum: ["comparison", "single"] }).notNull().default("comparison"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;

// ----- questions -----
export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  questionText: text("question_text").notNull(),
  responseA: text("response_a").notNull(),
  responseB: text("response_b"),
  sourcesA: jsonb("sources_a").$type<string[]>().notNull().default([]),
  sourcesB: jsonb("sources_b").$type<string[]>(),
});

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

// ----- annotations -----
export const annotations = pgTable(
  "annotations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull(),
    acceptableA: boolean("acceptable_a"),
    acceptableB: boolean("acceptable_b"),
    comparison: text("comparison", { enum: ["a_better", "equivalent", "b_better"] }),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("annotations_question_session_unique").on(t.questionId, t.sessionToken)],
);

export type Annotation = typeof annotations.$inferSelect;
export type NewAnnotation = typeof annotations.$inferInsert;

// ----- source_evaluations -----
export const sourceEvaluations = pgTable(
  "source_evaluations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    annotationId: uuid("annotation_id")
      .notNull()
      .references(() => annotations.id, { onDelete: "cascade" }),
    side: text("side", { enum: ["a", "b"] }).notNull(),
    sourceIndex: integer("source_index").notNull(),
    isRelevant: boolean("is_relevant"),
  },
  (t) => [
    unique("source_evaluations_annotation_side_index_unique").on(
      t.annotationId,
      t.side,
      t.sourceIndex,
    ),
  ],
);

export type SourceEvaluation = typeof sourceEvaluations.$inferSelect;
export type NewSourceEvaluation = typeof sourceEvaluations.$inferInsert;
