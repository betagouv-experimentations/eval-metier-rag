import type { Metadata } from "next";
import { fr } from "@codegouvfr/react-dsfr";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité",
};

export default function AccessibilitePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Déclaration d&apos;accessibilité</h1>

      <p>
        Ce site est un prototype expérimental et n&apos;a pas encore fait
        l&apos;objet d&apos;un audit RGAA. Le statut de conformité est donc :{" "}
        <strong>non conforme</strong>.
      </p>

      <h2>État de conformité</h2>
      <p>
        Ce site est en cours de construction. Des efforts sont faits pour
        respecter les critères du RGAA 4.1 dès la conception (utilisation
        du Système de Design de l&apos;État, navigation clavier, alternatives
        textuelles).
      </p>

      <h2>Signaler un problème</h2>
      <p>
        Si vous rencontrez un défaut d&apos;accessibilité vous empêchant
        d&apos;accéder à un contenu ou une fonctionnalité, vous pouvez nous
        en informer à l&apos;adresse de contact du service.
      </p>

      <h2>Voies de recours</h2>
      <p>
        Si une réponse satisfaisante ne vous est pas apportée, vous pouvez
        contacter le Défenseur des droits : <a href="https://www.defenseurdesdroits.fr">defenseurdesdroits.fr</a>.
      </p>
    </div>
  );
}
