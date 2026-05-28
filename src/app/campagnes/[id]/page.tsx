import { notFound } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { getCampaignById, getQuestionsByCampaignId, getAnnotationsForCampaign } from "@/lib/db-queries";
import { ShareLinkBox } from "@/components/campagne/ShareLinkBox";
import { formatDateFr } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<{ title: string }> {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  return { title: `${campaign?.name ?? "Campagne"} — Éval Métier RAG` };
}

export default async function CampagneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  const campaignQuestions = await getQuestionsByCampaignId(id);
  const allAnnotations = await getAnnotationsForCampaign(id);

  // Count annotated questions (at least one annotation)
  const annotatedQuestionIds = new Set(allAnnotations.map((a) => a.questionId));
  const annotatedCount = annotatedQuestionIds.size;

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[{ label: "Campagnes", linkProps: { href: "/campagnes" } }]}
        currentPageLabel={campaign.name}
      />

      <div
        className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-mb-4w")}
        style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
      >
        <div>
          <h1 className={fr.cx("fr-mb-1w")}>{campaign.name}</h1>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <Badge severity="info" small noIcon>
              {campaign.mode === "comparison" ? "Comparaison A vs B" : "Modèle unique"}
            </Badge>
            <span className={fr.cx("fr-ml-2w", "fr-text--sm")}>
              Créée le {formatDateFr(campaign.createdAt)}
            </span>
          </div>
        </div>
        <Button
          iconId="fr-icon-bar-chart-line"
          linkProps={{ href: `/campagnes/${id}/resultats` }}
        >
          Voir les résultats
        </Button>
      </div>

      {/* Share link */}
      <div className={fr.cx("fr-mb-6w")}>
        <ShareLinkBox token={campaign.token} />
      </div>

      {/* Stats */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-6w")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div
            className={fr.cx("fr-p-3w")}
            style={{ background: "#f6f6f6", textAlign: "center" }}
          >
            <p className={fr.cx("fr-display--xs", "fr-mb-1w")} style={{ fontSize: "2rem" }}>
              {campaignQuestions.length}
            </p>
            <p className={fr.cx("fr-mb-0")}>Questions au total</p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div
            className={fr.cx("fr-p-3w")}
            style={{ background: "#f6f6f6", textAlign: "center" }}
          >
            <p className={fr.cx("fr-display--xs", "fr-mb-1w")} style={{ fontSize: "2rem" }}>
              {allAnnotations.length}
            </p>
            <p className={fr.cx("fr-mb-0")}>Annotations reçues</p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div
            className={fr.cx("fr-p-3w")}
            style={{ background: "#f6f6f6", textAlign: "center" }}
          >
            <p className={fr.cx("fr-display--xs", "fr-mb-1w")} style={{ fontSize: "2rem" }}>
              {annotatedCount}/{campaignQuestions.length}
            </p>
            <p className={fr.cx("fr-mb-0")}>Questions annotées</p>
          </div>
        </div>
      </div>

      {/* Question list preview */}
      <h2>Questions ({campaignQuestions.length})</h2>
      {campaignQuestions.length === 0 ? (
        <p>Aucune question dans cette campagne.</p>
      ) : (
        <ul className={fr.cx("fr-raw-list")}>
          {campaignQuestions.map((q) => (
            <li
              key={q.id}
              className={fr.cx("fr-p-2w")}
              style={{
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                <strong>{q.position}.</strong> {q.questionText}
              </span>
              {annotatedQuestionIds.has(q.id) && (
                <Badge severity="success" small noIcon>
                  Annotée
                </Badge>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
