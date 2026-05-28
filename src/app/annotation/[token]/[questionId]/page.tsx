import { notFound } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import {
  getCampaignByToken,
  getQuestionsByCampaignId,
  getQuestionById,
} from "@/lib/db-queries";
import { QuestionAnnotationView } from "@/components/annotation/QuestionAnnotationView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string; questionId: string }>;
}): Promise<{ title: string }> {
  const { token } = await params;
  const campaign = await getCampaignByToken(token);
  return { title: `Annotation — ${campaign?.name ?? "Campagne"} — Éval Métier RAG` };
}

export default async function QuestionAnnotationPage({
  params,
}: {
  params: Promise<{ token: string; questionId: string }>;
}): Promise<React.ReactElement> {
  const { token, questionId } = await params;

  const campaign = await getCampaignByToken(token);
  if (!campaign) notFound();

  const allQuestions = await getQuestionsByCampaignId(campaign.id);
  const question = await getQuestionById(questionId);
  if (!question || question.campaignId !== campaign.id) notFound();

  const currentIndex = allQuestions.findIndex((q) => q.id === questionId);
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

  return (
    <div>
      <div className={fr.cx("fr-container", "fr-my-2w")}>
        <Breadcrumb
          homeLinkProps={{ href: "/" }}
          segments={[
            {
              label: campaign.name,
              linkProps: { href: `/annotation/${token}` },
            },
          ]}
          currentPageLabel={`Question ${question.position}`}
        />
      </div>

      <QuestionAnnotationView
        token={token}
        question={question}
        campaignMode={campaign.mode as "comparison" | "single"}
        prevQuestionId={prevQuestion?.id ?? null}
        nextQuestionId={nextQuestion?.id ?? null}
      />
    </div>
  );
}
