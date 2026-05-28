import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { campaigns, questions } from "@/db/schema";
import { getAllCampaigns } from "@/lib/db-queries";
import { parseExcelFile, splitSources } from "@/lib/excel";

// GET /api/campagnes — List all campaigns
export async function GET(): Promise<NextResponse> {
  try {
    const all = await getAllCampaigns();
    return NextResponse.json(all);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// POST /api/campagnes — Create campaign from Excel file upload
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // Validate file type
    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "application/csv",
    ];
    if (!validMimeTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      return NextResponse.json(
        { error: "Format non supporté. Utilisez un fichier Excel (.xlsx, .xls) ou CSV." },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 5 Mo)." },
        { status: 400 },
      );
    }

    const buffer = await file.arrayBuffer();
    const parsed = await parseExcelFile(buffer);

    // Campaign name = filename without extension
    const campaignName = file.name.replace(/\.(xlsx|xls|csv)$/i, "");
    const token = crypto.randomUUID();

    // Insert campaign and questions in a transaction
    const campaign = await db.transaction(async (tx) => {
      const [newCampaign] = await tx
        .insert(campaigns)
        .values({ name: campaignName, token, mode: parsed.mode })
        .returning();

      if (!newCampaign) throw new Error("Échec de création de campagne");

      const questionValues = parsed.rows.map((row, i) => ({
        campaignId: newCampaign.id,
        position: i + 1,
        questionText: row.question,
        responseA: row.response_a,
        responseB: row.response_b ?? null,
        sourcesA: splitSources(row.sources_a),
        sourcesB: row.sources_b !== undefined ? splitSources(row.sources_b) : null,
      }));

      if (questionValues.length > 0) {
        await tx.insert(questions).values(questionValues);
      }

      return newCampaign;
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur lors du traitement du fichier";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
