import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { annotations } from "@/db/schema";
import { sql } from "drizzle-orm";

const upsertAnnotationSchema = z.object({
  questionId: z.string().uuid(),
  sessionToken: z.string().min(1).max(100),
  acceptableA: z.boolean().nullable().optional(),
  acceptableB: z.boolean().nullable().optional(),
  comparison: z.enum(["a_better", "equivalent", "b_better"]).nullable().optional(),
  comment: z.string().max(2000).nullable().optional(),
});

// POST /api/annotations — Create or update an annotation
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = upsertAnnotationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { questionId, sessionToken, acceptableA, acceptableB, comparison, comment } =
      parsed.data;

    // Upsert: insert or update on (question_id, session_token) constraint
    const [annotation] = await db
      .insert(annotations)
      .values({
        questionId,
        sessionToken,
        acceptableA: acceptableA ?? null,
        acceptableB: acceptableB ?? null,
        comparison: comparison ?? null,
        comment: comment ?? null,
      })
      .onConflictDoUpdate({
        target: [annotations.questionId, annotations.sessionToken],
        set: {
          acceptableA: sql`EXCLUDED.acceptable_a`,
          acceptableB: sql`EXCLUDED.acceptable_b`,
          comparison: sql`EXCLUDED.comparison`,
          comment: sql`EXCLUDED.comment`,
          updatedAt: sql`now()`,
        },
      })
      .returning();

    return NextResponse.json(annotation, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
