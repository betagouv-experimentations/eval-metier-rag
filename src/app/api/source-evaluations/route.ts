import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { sourceEvaluations } from "@/db/schema";
import { sql } from "drizzle-orm";

const upsertSourceEvalSchema = z.object({
  annotationId: z.string().uuid(),
  side: z.enum(["a", "b"]),
  sourceIndex: z.number().int().min(0),
  isRelevant: z.boolean().nullable(),
});

// POST /api/source-evaluations — Create or update a source evaluation
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await req.json();
    const parsed = upsertSourceEvalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { annotationId, side, sourceIndex, isRelevant } = parsed.data;

    const [evaluation] = await db
      .insert(sourceEvaluations)
      .values({ annotationId, side, sourceIndex, isRelevant })
      .onConflictDoUpdate({
        target: [
          sourceEvaluations.annotationId,
          sourceEvaluations.side,
          sourceEvaluations.sourceIndex,
        ],
        set: {
          isRelevant: sql`EXCLUDED.is_relevant`,
        },
      })
      .returning();

    return NextResponse.json(evaluation, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
