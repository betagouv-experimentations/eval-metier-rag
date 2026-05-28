import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

export default function HomePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Évaluez vos systèmes RAG avec vos experts métier</h1>
      <p className={fr.cx("fr-text--lead", "fr-mb-4w")}>
        Importez un fichier Excel avec les réponses de vos modèles, partagez un lien à vos
        experts, et identifiez en un coup d'œil quel modèle est le plus qualitatif.
      </p>

      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-6w")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div className={fr.cx("fr-p-3w")} style={{ borderLeft: "4px solid #000091" }}>
            <p className={fr.cx("fr-text--bold")}>1. Importez vos données</p>
            <p>
              Déposez un fichier Excel contenant vos questions, réponses et sources. Une
              campagne est créée automatiquement.
            </p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div className={fr.cx("fr-p-3w")} style={{ borderLeft: "4px solid #000091" }}>
            <p className={fr.cx("fr-text--bold")}>2. Partagez avec vos experts</p>
            <p>
              Envoyez le lien de la campagne à vos experts métier. Ils annotent sans créer
              de compte.
            </p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
          <div className={fr.cx("fr-p-3w")} style={{ borderLeft: "4px solid #000091" }}>
            <p className={fr.cx("fr-text--bold")}>3. Analysez les résultats</p>
            <p>
              Consultez le tableau de bord agrégé et identifiez quel modèle déployer en
              production.
            </p>
          </div>
        </div>
      </div>

      <CallOut
        title="Prêt à lancer votre première campagne ?"
        iconId="fr-icon-survey-line"
        buttonProps={{
          children: "Créer une campagne",
          linkProps: { href: "/campagnes/nouvelle" },
        }}
      >
        Importez votre fichier Excel et obtenez un lien de partage en moins d'une minute.
      </CallOut>

      <div className={fr.cx("fr-mt-6w")}>
        <Button priority="secondary" linkProps={{ href: "/campagnes" }}>
          Voir toutes les campagnes
        </Button>
      </div>
    </div>
  );
}
