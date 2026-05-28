// scripts/seed.ts — Données de test fictives pour le développement local.
// Lancer avec : npm run seed

import { db } from "../src/db";
import { campaigns, questions, annotations, sourceEvaluations } from "../src/db/schema";

async function seed(): Promise<void> {
  console.log("→ Seeding database with test data...");

  // Clean up existing seed data
  await db.delete(campaigns);

  // Create a test comparison campaign
  const [campaign] = await db
    .insert(campaigns)
    .values({
      name: "Évaluation FAQ DINUM - Mai 2026",
      token: "seed-token-demo-123",
      mode: "comparison",
    })
    .returning();

  if (!campaign) throw new Error("Failed to create campaign");

  // Insert test questions
  const testQuestions = [
    {
      campaignId: campaign.id,
      position: 1,
      questionText: "Quelles sont les démarches pour obtenir un passeport ?",
      responseA:
        "Pour obtenir un passeport, vous devez vous rendre en mairie avec un justificatif de domicile, une photo d'identité récente, votre ancien passeport si vous en avez un, et régler les frais de timbre fiscal.",
      responseB:
        "La demande de passeport s'effectue en mairie. Il faut fournir : une pièce d'identité, un justificatif de domicile de moins de 3 mois, 2 photos d'identité conformes, et un timbre fiscal. Le délai est de 3 à 5 semaines.",
      sourcesA: [
        "https://www.service-public.fr/particuliers/vosdroits/F21091",
        "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006285826",
      ],
      sourcesB: ["https://www.service-public.fr/particuliers/vosdroits/F21091"],
    },
    {
      campaignId: campaign.id,
      position: 2,
      questionText: "Comment fonctionne le compte personnel de formation (CPF) ?",
      responseA:
        "Le CPF permet à toute personne active d'acquérir des droits à la formation. Les droits sont crédités en euros chaque année et utilisables pour financer des formations éligibles via Mon Compte Formation.",
      responseB:
        "Le Compte Personnel de Formation est alimenté chaque année à hauteur de 500€ (800€ pour les personnes peu qualifiées). Il permet de financer des formations certifiantes. Accessible sur moncompteformation.gouv.fr.",
      sourcesA: ["https://www.service-public.fr/particuliers/vosdroits/F10705"],
      sourcesB: [
        "https://www.service-public.fr/particuliers/vosdroits/F10705",
        "https://www.moncompteformation.gouv.fr",
      ],
    },
    {
      campaignId: campaign.id,
      position: 3,
      questionText: "Quelle est la durée légale du congé maternité en France ?",
      responseA:
        "Le congé maternité dure en général 16 semaines : 6 avant l'accouchement et 10 après. Cette durée varie selon le rang de l'enfant et le nombre d'enfants attendus.",
      responseB:
        "Pour un premier ou deuxième enfant, le congé maternité est de 16 semaines au total (6 semaines avant + 10 semaines après l'accouchement). Pour un 3e enfant ou plus, il est de 26 semaines.",
      sourcesA: ["https://www.service-public.fr/particuliers/vosdroits/F2268"],
      sourcesB: [
        "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902898",
      ],
    },
  ];

  const insertedQuestions = await db.insert(questions).values(testQuestions).returning();

  // Add some test annotations
  const sessionA = "session-annotator-alice";
  const sessionB = "session-annotator-bob";

  for (const q of insertedQuestions.slice(0, 2)) {
    // Annotator A
    const [annotA] = await db
      .insert(annotations)
      .values({
        questionId: q.id,
        sessionToken: sessionA,
        acceptableA: true,
        acceptableB: true,
        comparison: "b_better",
        comment: q.position === 1 ? "La réponse B est plus précise sur les délais." : null,
      })
      .returning();

    // Annotator B
    await db.insert(annotations).values({
      questionId: q.id,
      sessionToken: sessionB,
      acceptableA: true,
      acceptableB: false,
      comparison: "a_better",
      comment: null,
    });

    // Source evaluations for annotator A (first question only)
    if (q.position === 1 && annotA) {
      await db.insert(sourceEvaluations).values([
        { annotationId: annotA.id, side: "a", sourceIndex: 0, isRelevant: true },
        { annotationId: annotA.id, side: "a", sourceIndex: 1, isRelevant: false },
        { annotationId: annotA.id, side: "b", sourceIndex: 0, isRelevant: true },
      ]);
    }
  }

  console.log(`✓ Campagne créée : "${campaign.name}"`);
  console.log(`  → ${testQuestions.length} questions`);
  console.log(`  → Lien d'annotation : /annotation/seed-token-demo-123`);
  console.log(`  → Résultats : /campagnes/${campaign.id}/resultats`);
  console.log("✓ Seed terminé.");
}

seed()
  .catch((error: unknown) => {
    console.error("✗ Erreur durant le seed :", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
