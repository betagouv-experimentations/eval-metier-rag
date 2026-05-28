import { notFound } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { getCampaignByToken, getQuestionsByCampaignId } from "@/lib/db-queries";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<{ title: string }> {
  const { token } = await params;
  const campaign = await getCampaignByToken(token);
  return { title: `Annoter — ${campaign?.name ?? "Campagne"} — Éval Métier RAG` };
}

export default async function AnnotationListPage({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<React.ReactElement> {
  const { token } = await params;
  const campaign = await getCampaignByToken(token);
  if (!campaign) notFound();

  const campaignQuestions = await getQuestionsByCampaignId(campaign.id);

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>{campaign.name}</h1>
      <p className={fr.cx("fr-text--lead", "fr-mb-4w")}>
        Campagne d'évaluation — {campaignQuestions.length} question
        {campaignQuestions.length > 1 ? "s" : ""} à annoter
      </p>

      <CallOut
        title="Comment annoter ?"
        iconId="ri-information-line"
        bodyAs="div"
      >
        <p className={fr.cx("fr-mb-1w")}>
          Pour chaque question, vous évaluerez :
        </p>
        <ul className={fr.cx("fr-mb-0")}>
          {campaign.mode === "comparison" && (
            <>
              <li>L'acceptabilité de la réponse A (OUI / NON)</li>
              <li>L'acceptabilité de la réponse B (OUI / NON)</li>
              <li>La comparaison (A meilleure / Équivalentes / B meilleure)</li>
            </>
          )}
          {campaign.mode === "single" && (
            <li>L'acceptabilité de la réponse (OUI / NON)</li>
          )}
          <li>La pertinence de chaque source (OUI / NON)</li>
          <li>Un commentaire libre (optionnel)</li>
        </ul>
      </CallOut>

      <div className={fr.cx("fr-mt-4w", "fr-mb-2w")}>
        <Button
          iconId="fr-icon-arrow-right-line"
          iconPosition="right"
          linkProps={{ href: `/annotation/${token}/${campaignQuestions[0]?.id ?? ""}` }}
        >
          Commencer l'annotation
        </Button>
      </div>

      <h2 className={fr.cx("fr-mt-6w")}>Liste des questions</h2>
      {campaignQuestions.length === 0 ? (
        <p>Aucune question dans cette campagne.</p>
      ) : (
        <ul className={fr.cx("fr-raw-list")}>
          {campaignQuestions.map((q) => (
            <li key={q.id}>
              <Link
                href={`/annotation/${token}/${q.id}`}
                className={fr.cx("fr-link")}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 8px",
                  borderBottom: "1px solid #ddd",
                  textDecoration: "none",
                }}
              >
                <span>
                  <strong>{q.position}.</strong>{" "}
                  {q.questionText.length > 120
                    ? `${q.questionText.slice(0, 120)}…`
                    : q.questionText}
                </span>
                <span
                  className={fr.cx("fr-icon-arrow-right-line")}
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginLeft: "8px" }}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
