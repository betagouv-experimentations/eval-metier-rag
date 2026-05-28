import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { CampagneUploadForm } from "@/components/campagne/CampagneUploadForm";

export const metadata = {
  title: "Nouvelle campagne — Éval Métier RAG",
};

export default function NouvelleCampagnePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[{ label: "Campagnes", linkProps: { href: "/campagnes" } }]}
        currentPageLabel="Nouvelle campagne"
      />

      <h1>Créer une campagne d'évaluation</h1>
      <p className={fr.cx("fr-text--lead", "fr-mb-4w")}>
        Importez votre fichier Excel pour créer une campagne. Un lien de partage vous sera
        fourni immédiatement pour vos experts métier.
      </p>

      <CampagneUploadForm />
    </div>
  );
}
