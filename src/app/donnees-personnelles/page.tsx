import type { Metadata } from "next";
import { fr } from "@codegouvfr/react-dsfr";

export const metadata: Metadata = {
  title: "Données personnelles",
};

export default function DonneesPersonnellesPage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Données personnelles</h1>

      <h2>Responsable de traitement</h2>
      <p>
        Le responsable du traitement des données personnelles est l&apos;équipe
        en charge de ce prototype au sein de beta.gouv.fr.
      </p>

      <h2>Données collectées</h2>
      <p>
        Ce prototype applique le principe de minimisation : seules les
        données strictement nécessaires au fonctionnement du service sont
        collectées. La liste détaillée sera complétée à mesure que le service
        évolue.
      </p>

      <h2>Finalités</h2>
      <p>
        Les données collectées servent uniquement au fonctionnement du
        service. Aucune donnée n&apos;est revendue ou transférée à des
        tiers à des fins commerciales.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
        rectification, d&apos;effacement, de limitation et d&apos;opposition
        sur vos données. Pour exercer ces droits, contactez l&apos;équipe
        du service.
      </p>

      <h2>Cookies et traceurs</h2>
      <p>
        Ce site n&apos;utilise pas de traceurs tiers. Aucun cookie de mesure
        d&apos;audience publicitaire n&apos;est déposé.
      </p>
    </div>
  );
}
