import type { Metadata } from "next";
import { fr } from "@codegouvfr/react-dsfr";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Mentions légales</h1>

      <h2>Éditeur</h2>
      <p>
        Ce prototype est édité dans le cadre de beta.gouv.fr, l&apos;incubateur
        de services numériques de l&apos;État français.
      </p>

      <h2>Directeur de la publication</h2>
      <p>À compléter.</p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé sur l&apos;infrastructure d&apos;expérimentations
        de beta.gouv.fr.
      </p>

      <h2>Contact</h2>
      <p>
        Pour toute question relative à ce prototype, contactez l&apos;équipe
        à l&apos;adresse indiquée sur la page d&apos;accueil.
      </p>
    </div>
  );
}
