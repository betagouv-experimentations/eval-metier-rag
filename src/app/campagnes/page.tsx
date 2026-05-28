import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { getAllCampaigns, getQuestionsByCampaignId, getAnnotationsForCampaign } from "@/lib/db-queries";
import { formatDateFr } from "@/lib/utils";
import type { Campaign } from "@/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Campagnes — Éval Métier RAG",
};

export default async function CampagnesPage(): Promise<React.ReactElement> {
  const allCampaigns = await getAllCampaigns();

  // Fetch counts for each campaign
  const campaignData = await Promise.all(
    allCampaigns.map(async (c) => {
      const qs = await getQuestionsByCampaignId(c.id);
      const annots = await getAnnotationsForCampaign(c.id);
      return { campaign: c, questionCount: qs.length, annotationCount: annots.length };
    }),
  );

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[]}
        currentPageLabel="Campagnes"
      />

      <div
        className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-mb-4w")}
        style={{ justifyContent: "space-between" }}
      >
        <h1 className={fr.cx("fr-mb-0")}>Campagnes d'évaluation</h1>
        <Button iconId="fr-icon-add-circle-line" linkProps={{ href: "/campagnes/nouvelle" }}>
          Nouvelle campagne
        </Button>
      </div>

      {campaignData.length === 0 ? (
        <div className={fr.cx("fr-p-6w")} style={{ textAlign: "center", background: "#f6f6f6" }}>
          <p className={fr.cx("fr-text--lead")}>Aucune campagne pour le moment.</p>
          <Button linkProps={{ href: "/campagnes/nouvelle" }}>
            Créer la première campagne
          </Button>
        </div>
      ) : (
        <div className={fr.cx("fr-table", "fr-table--bordered")} id="campagnes-table">
          <table>
            <caption>Liste des campagnes d'évaluation</caption>
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Mode</th>
                <th scope="col">Questions</th>
                <th scope="col">Annotations</th>
                <th scope="col">Date de création</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaignData.map(({ campaign, questionCount, annotationCount }) => (
                <tr key={campaign.id}>
                  <td>
                    <Link href={`/campagnes/${campaign.id}`} className={fr.cx("fr-link")}>
                      {campaign.name}
                    </Link>
                  </td>
                  <td>
                    <Badge severity="info" small noIcon>
                      {campaign.mode === "comparison" ? "Comparaison" : "Modèle unique"}
                    </Badge>
                  </td>
                  <td>{questionCount}</td>
                  <td>{annotationCount}</td>
                  <td>{formatDateFr(campaign.createdAt)}</td>
                  <td>
                    <Button
                      priority="tertiary no outline"
                      size="small"
                      iconId="fr-icon-bar-chart-line"
                      linkProps={{ href: `/campagnes/${campaign.id}/resultats` }}
                    >
                      Résultats
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
