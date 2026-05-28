import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  campaigns,
  questions,
  annotations,
  sourceEvaluations,
  type Campaign,
  type Question,
  type Annotation,
  type SourceEvaluation,
} from "@/db/schema";

// ----- Campaign queries -----

export async function getAllCampaigns(): Promise<Campaign[]> {
  return db.select().from(campaigns).orderBy(campaigns.createdAt);
}

export async function getCampaignById(id: string): Promise<Campaign | undefined> {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
  return campaign;
}

export async function getCampaignByToken(token: string): Promise<Campaign | undefined> {
  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.token, token));
  return campaign;
}

// ----- Question queries -----

export async function getQuestionsByCampaignId(campaignId: string): Promise<Question[]> {
  return db
    .select()
    .from(questions)
    .where(eq(questions.campaignId, campaignId))
    .orderBy(questions.position);
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  const [question] = await db.select().from(questions).where(eq(questions.id, id));
  return question;
}

// ----- Annotation queries -----

export async function getAnnotationsByQuestionId(
  questionId: string,
): Promise<Annotation[]> {
  return db.select().from(annotations).where(eq(annotations.questionId, questionId));
}

export async function getAnnotationByQuestionAndSession(
  questionId: string,
  sessionToken: string,
): Promise<Annotation | undefined> {
  const [annotation] = await db
    .select()
    .from(annotations)
    .where(
      sql`${annotations.questionId} = ${questionId} AND ${annotations.sessionToken} = ${sessionToken}`,
    );
  return annotation;
}

export async function getAnnotationsForCampaign(campaignId: string): Promise<
  (Annotation & { questionPosition: number; questionText: string })[]
> {
  const rows = await db
    .select({
      id: annotations.id,
      questionId: annotations.questionId,
      sessionToken: annotations.sessionToken,
      acceptableA: annotations.acceptableA,
      acceptableB: annotations.acceptableB,
      comparison: annotations.comparison,
      comment: annotations.comment,
      createdAt: annotations.createdAt,
      updatedAt: annotations.updatedAt,
      questionPosition: questions.position,
      questionText: questions.questionText,
    })
    .from(annotations)
    .innerJoin(questions, eq(annotations.questionId, questions.id))
    .where(eq(questions.campaignId, campaignId))
    .orderBy(questions.position);
  return rows;
}

// ----- Source evaluation queries -----

export async function getSourceEvaluationsByAnnotationId(
  annotationId: string,
): Promise<SourceEvaluation[]> {
  return db
    .select()
    .from(sourceEvaluations)
    .where(eq(sourceEvaluations.annotationId, annotationId));
}

// ----- Aggregated results -----

export interface QuestionResult {
  questionId: string;
  position: number;
  questionText: string;
  totalAnnotations: number;
  acceptableACount: number;
  acceptableBCount: number;
  comparisonABetter: number;
  comparisonEquivalent: number;
  comparisonBBetter: number;
  comments: string[];
}

export interface CampaignResults {
  campaign: Campaign;
  totalAnnotations: number;
  acceptableAPercent: number;
  acceptableBPercent: number;
  comparisonABetterPercent: number;
  comparisonEquivalentPercent: number;
  comparisonBBetterPercent: number;
  questionResults: QuestionResult[];
}

export async function getCampaignResults(campaignId: string): Promise<CampaignResults> {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campagne introuvable");

  const allQuestions = await getQuestionsByCampaignId(campaignId);
  const allAnnotations = await getAnnotationsForCampaign(campaignId);

  const totalAnnotations = allAnnotations.length;

  const acceptableACount = allAnnotations.filter((a) => a.acceptableA === true).length;
  const acceptableBCount = allAnnotations.filter((a) => a.acceptableB === true).length;
  const annotationsWithAcceptableA = allAnnotations.filter(
    (a) => a.acceptableA !== null && a.acceptableA !== undefined,
  ).length;
  const annotationsWithAcceptableB = allAnnotations.filter(
    (a) => a.acceptableB !== null && a.acceptableB !== undefined,
  ).length;
  const annotationsWithComparison = allAnnotations.filter(
    (a) => a.comparison !== null && a.comparison !== undefined,
  ).length;

  const comparisonABetter = allAnnotations.filter((a) => a.comparison === "a_better").length;
  const comparisonEquivalent = allAnnotations.filter(
    (a) => a.comparison === "equivalent",
  ).length;
  const comparisonBBetter = allAnnotations.filter((a) => a.comparison === "b_better").length;

  const questionResults: QuestionResult[] = allQuestions.map((q) => {
    const qAnnotations = allAnnotations.filter((a) => a.questionId === q.id);
    return {
      questionId: q.id,
      position: q.position,
      questionText: q.questionText,
      totalAnnotations: qAnnotations.length,
      acceptableACount: qAnnotations.filter((a) => a.acceptableA === true).length,
      acceptableBCount: qAnnotations.filter((a) => a.acceptableB === true).length,
      comparisonABetter: qAnnotations.filter((a) => a.comparison === "a_better").length,
      comparisonEquivalent: qAnnotations.filter((a) => a.comparison === "equivalent").length,
      comparisonBBetter: qAnnotations.filter((a) => a.comparison === "b_better").length,
      comments: qAnnotations
        .map((a) => a.comment ?? "")
        .filter((c) => c.trim().length > 0),
    };
  });

  const pct = (count: number, total: number): number =>
    total === 0 ? 0 : Math.round((count / total) * 100);

  return {
    campaign,
    totalAnnotations,
    acceptableAPercent: pct(acceptableACount, annotationsWithAcceptableA),
    acceptableBPercent: pct(acceptableBCount, annotationsWithAcceptableB),
    comparisonABetterPercent: pct(comparisonABetter, annotationsWithComparison),
    comparisonEquivalentPercent: pct(comparisonEquivalent, annotationsWithComparison),
    comparisonBBetterPercent: pct(comparisonBBetter, annotationsWithComparison),
    questionResults,
  };
}
