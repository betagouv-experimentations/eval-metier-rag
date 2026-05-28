import { NextRequest, NextResponse } from "next/server";
import {
  getCampaignByToken,
  getQuestionsByCampaignId,
  getAnnotationByQuestionAndSession,
  getSourceEvaluationsByAnnotationId,
} from "@/lib/db-queries";

// GET /api/annotation/[token]?session=<sessionToken>
// Returns campaign + questions + existing annotations for the session
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  try {
    const { token } = await params;
    const sessionToken = req.nextUrl.searchParams.get("session") ?? "";

    const campaign = await getCampaignByToken(token);
    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    }

    const campaignQuestions = await getQuestionsByCampaignId(campaign.id);

    // Load existing annotations for this session if sessionToken provided
    const annotationsMap: Record<
      string,
      {
        annotation: Awaited<ReturnType<typeof getAnnotationByQuestionAndSession>>;
        sourceEvaluations: Awaited<ReturnType<typeof getSourceEvaluationsByAnnotationId>>;
      }
    > = {};

    if (sessionToken) {
      for (const q of campaignQuestions) {
        const annotation = await getAnnotationByQuestionAndSession(q.id, sessionToken);
        if (annotation) {
          const sourceEvals = await getSourceEvaluationsByAnnotationId(annotation.id);
          annotationsMap[q.id] = { annotation, sourceEvaluations: sourceEvals };
        }
      }
    }

    return NextResponse.json({ campaign, questions: campaignQuestions, annotationsMap });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
