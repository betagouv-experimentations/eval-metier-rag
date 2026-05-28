import { notFound } from "next/navigation";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { getCampaignResults } from "@/lib/db-queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<{ title: string }> {
  const { id } = await params;
  try {
    const results = await getCampaignResults(id);
    return { title: `Résultats — ${results.campaign.name} — Éval Métier RAG` };
  } catch {
    return { title: "Résultats — Éval Métier RAG" };
  }
}

function StatCard({
  label,
  value,
  severity,
}: {
  label: string;
  value: string;
  severity?: "success" | "info" | "warning";
}): React.ReactElement {
  const bg = severity === "success" ? "#b8fec9" : severity === "warning" ? "#ffe9a0" : "#f6f6f6";
  return (
    <div
      className={fr.cx("fr-p-3w")}
      style={{ background: bg, textAlign: "center", borderRadius: "4px" }}
    >
      <p
        className={fr.cx("fr-mb-1w")}
        style={{ fontSize: "2rem", fontWeight: "bold", lineHeight: 1.2 }}
      >
        {value}
      </p>
      <p className={fr.cx("fr-mb-0", "fr-text--sm")}>{label}</p>
    </div>
  );
}

export default async function ResultatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.ReactElement> {
  const { id } = await params;

  let results;
  try {
    results = await getCampaignResults(id);
  } catch {
    notFound();
  }

  const {
    campaign,
    totalAnnotations,
    acceptableAPercent,
    acceptableBPercent,
    comparisonABetterPercent,
    comparisonEquivalentPercent,
    comparisonBBetterPercent,
    questionResults,
  } = results;

  const isComparison = campaign.mode === "comparison";

  // Determine winner badge
  let winnerBadge: React.ReactElement | null = null;
  if (isComparison && totalAnnotations > 0) {
    if (comparisonABetterPercent > comparisonBBetterPercent) {
      winnerBadge = (
        <Badge severity="success">🏆 Modèle A recommandé ({comparisonABetterPercent}%)</Badge>
      );
    } else if (comparisonBBetterPercent > comparisonABetterPercent) {
      winnerBadge = (
        <Badge severity="success">🏆 Modèle B recommandé ({comparisonBBetterPercent}%)</Badge>
      );
    } else {
      winnerBadge = <Badge severity="info">Modèles équivalents</Badge>;
    }
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[
          { label: "Campagnes", linkProps: { href: "/campagnes" } },
          { label: campaign.name, linkProps: { href: `/campagnes/${id}` } },
        ]}
        currentPageLabel="Résultats"
      />

      <div
        className={fr.cx("fr-grid-row", "fr-grid-row--middle", "fr-mb-4w")}
        style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
      >
        <div>
          <h1 className={fr.cx("fr-mb-1w")}>Résultats — {campaign.name}</h1>
          <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
            {totalAnnotations} annotation{totalAnnotations > 1 ? "s" : ""} reçue
            {totalAnnotations > 1 ? "s" : ""}
          </p>
          {winnerBadge && <div className={fr.cx("fr-mt-1w")}>{winnerBadge}</div>}
        </div>
        <Button
          priority="secondary"
          iconId="fr-icon-download-line"
          linkProps={{ href: `/api/campagnes/${id}/export` }}
        >
          Exporter CSV
        </Button>
      </div>

      {totalAnnotations === 0 ? (
        <div
          className={fr.cx("fr-p-6w")}
          style={{ textAlign: "center", background: "#f6f6f6" }}
        >
          <p className={fr.cx("fr-text--lead")}>Aucune annotation pour le moment.</p>
          <Button linkProps={{ href: `/campagnes/${id}` }}>
            Copier le lien de partage
          </Button>
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <h2>Vue d'ensemble</h2>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-6w")}>
            <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
              <StatCard
                label="Réponses A acceptables"
                value={`${acceptableAPercent}%`}
                severity={acceptableAPercent >= 70 ? "success" : "warning"}
              />
            </div>
            {isComparison && (
              <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                <StatCard
                  label="Réponses B acceptables"
                  value={`${acceptableBPercent}%`}
                  severity={acceptableBPercent >= 70 ? "success" : "warning"}
                />
              </div>
            )}
            <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
              <StatCard label="Annotations totales" value={String(totalAnnotations)} />
            </div>
          </div>

          {isComparison && (
            <>
              <h2>Comparaison des modèles</h2>
              <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-6w")}>
                <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                  <StatCard
                    label="A meilleure que B"
                    value={`${comparisonABetterPercent}%`}
                    severity={
                      comparisonABetterPercent > comparisonBBetterPercent
                        ? "success"
                        : undefined
                    }
                  />
                </div>
                <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                  <StatCard
                    label="Équivalentes"
                    value={`${comparisonEquivalentPercent}%`}
                  />
                </div>
                <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                  <StatCard
                    label="B meilleure que A"
                    value={`${comparisonBBetterPercent}%`}
                    severity={
                      comparisonBBetterPercent > comparisonABetterPercent
                        ? "success"
                        : undefined
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* Per-question details */}
          <h2>Détail par question</h2>
          <div className={fr.cx("fr-accordions-group")}>
            {questionResults.map((qr) => (
              <Accordion
                key={qr.questionId}
                label={`${qr.position}. ${qr.questionText.length > 100 ? `${qr.questionText.slice(0, 100)}…` : qr.questionText} — ${qr.totalAnnotations} annotation${qr.totalAnnotations > 1 ? "s" : ""}`}
                titleAs="h3"
              >
                <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
                  <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                    <p>
                      <strong>Acceptable A :</strong>{" "}
                      {qr.totalAnnotations > 0
                        ? `${Math.round((qr.acceptableACount / qr.totalAnnotations) * 100)}% OUI (${qr.acceptableACount}/${qr.totalAnnotations})`
                        : "—"}
                    </p>
                  </div>
                  {isComparison && (
                    <>
                      <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                        <p>
                          <strong>Acceptable B :</strong>{" "}
                          {qr.totalAnnotations > 0
                            ? `${Math.round((qr.acceptableBCount / qr.totalAnnotations) * 100)}% OUI (${qr.acceptableBCount}/${qr.totalAnnotations})`
                            : "—"}
                        </p>
                      </div>
                      <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                        <p>
                          <strong>Comparaison :</strong>{" "}
                          A ({qr.comparisonABetter}) — Équivalent ({qr.comparisonEquivalent}) — B ({qr.comparisonBBetter})
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {qr.comments.length > 0 && (
                  <div className={fr.cx("fr-mt-2w")}>
                    <p className={fr.cx("fr-text--bold")}>
                      Commentaires ({qr.comments.length}) :
                    </p>
                    <ul>
                      {qr.comments.map((c, i) => (
                        <li key={i} className={fr.cx("fr-mb-1w")}>
                          &ldquo;{c}&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Accordion>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
