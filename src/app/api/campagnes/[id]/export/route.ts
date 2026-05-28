import { NextRequest, NextResponse } from "next/server";
import { getCampaignById, getAnnotationsForCampaign, getSourceEvaluationsByAnnotationId } from "@/lib/db-queries";

// GET /api/campagnes/[id]/export — CSV export of raw annotations
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

    const allAnnotations = await getAnnotationsForCampaign(id);

    const headers = [
      "question",
      "position",
      "acceptable_a",
      "acceptable_b",
      "comparaison",
      "commentaire",
      "session_token",
      "date",
    ];

    const rows = await Promise.all(
      allAnnotations.map(async (a) => {
        return [
          `"${(a.questionText ?? "").replace(/"/g, '""')}"`,
          String(a.questionPosition ?? ""),
          a.acceptableA === true ? "OUI" : a.acceptableA === false ? "NON" : "",
          a.acceptableB === true ? "OUI" : a.acceptableB === false ? "NON" : "",
          a.comparison === "a_better"
            ? "A meilleure"
            : a.comparison === "equivalent"
              ? "Équivalentes"
              : a.comparison === "b_better"
                ? "B meilleure"
                : "",
          `"${(a.comment ?? "").replace(/"/g, '""')}"`,
          a.sessionToken,
          a.createdAt.toISOString(),
        ].join(",");
      }),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const filename = `export-${campaign.name}-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
