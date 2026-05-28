import { NextRequest, NextResponse } from "next/server";
import { getCampaignById, getQuestionsByCampaignId } from "@/lib/db-queries";

// GET /api/campagnes/[id] — Get campaign with questions
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const campaign = await getCampaignById(id);
    if (!campaign) {
      return NextResponse.json({ error: "Campagne introuvable" }, { status: 404 });
    }
    const campaignQuestions = await getQuestionsByCampaignId(id);
    return NextResponse.json({ campaign, questions: campaignQuestions });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
