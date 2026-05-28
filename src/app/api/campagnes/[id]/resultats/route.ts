import { NextRequest, NextResponse } from "next/server";
import { getCampaignResults } from "@/lib/db-queries";

// GET /api/campagnes/[id]/resultats — Aggregated results
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const results = await getCampaignResults(id);
    return NextResponse.json(results);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    if (message === "Campagne introuvable") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
