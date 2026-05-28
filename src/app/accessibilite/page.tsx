import type { Metadata } from "next";
import { fr } from "@codegouvfr/react-dsfr";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité — Éval Métier RAG",
};

export default function AccessibilitePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Déclaration d&apos;accessibilité</h1>

      <p>
        Éval Métier RAG s&apos;engage à rendre son service accessible
        conformément à l&apos;article 47 de la loi n°2005-102 du 11 février 2005.
      </p>

      <h2>État de conformité</h2>
      <p>
        Éval Métier RAG est <strong>partiellement conforme</strong> avec le
        référentiel général d&apos;amélioration de l&apos;accessibilité (RGAA) version 4.1.
      </p>

      <h2>Résultats de l&apos;audit</h2>
      <p>
        Un audit RGAA 4.1.2 a été réalisé en mai 2026 sur l&apos;ensemble des
        pages du service. Le taux de conformité global est de <strong>96 %</strong>.
      </p>
      <ul>
        <li>69 critères applicables</li>
        <li>66 critères conformes</li>
        <li>0 critère non conforme (3 non-conformités corrigées lors de l&apos;audit)</li>
        <li>37 critères non applicables</li>
      </ul>

      <h2>Non-conformités et dérogations</h2>
      <p>
        Aucune non-conformité résiduelle. Les 3 non-conformités identifiées lors
        de l&apos;audit ont été corrigées :
      </p>
      <ul>
        <li>Hiérarchie des titres : h1 manquant sur la page d&apos;annotation (corrigé)</li>
        <li>Titres de pages incomplets sur les pages mentions légales et accessibilité (corrigé)</li>
        <li>Liens s&apos;ouvrant dans un nouvel onglet sans indication (corrigé)</li>
      </ul>

      <h2>Établissement de cette déclaration</h2>
      <p>Cette déclaration a été établie le 28 mai 2026.</p>

      <h2>Signaler un problème</h2>
      <p>
        Si vous rencontrez un défaut d&apos;accessibilité vous empêchant
        d&apos;accéder à un contenu ou une fonctionnalité, vous pouvez nous
        en informer à l&apos;adresse de contact du service.
      </p>

      <h2>Voies de recours</h2>
      <p>
        Si une réponse satisfaisante ne vous est pas apportée, vous pouvez
        contacter le Défenseur des droits :{" "}
        <a href="https://www.defenseurdesdroits.fr">defenseurdesdroits.fr</a>.
      </p>
    </div>
  );
}
