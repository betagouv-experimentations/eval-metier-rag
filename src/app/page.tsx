import { fr } from "@codegouvfr/react-dsfr";

export default function HomePage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1>Bienvenue sur ton prototype</h1>
      <p className={fr.cx("fr-text--lead")}>
        Ce prototype est prêt à être construit. Décris ce que tu veux à Claude
        avec la commande <code>/build</code>.
      </p>
      <p>
        En attendant, tu peux consulter les pages obligatoires :{" "}
        <a href="/mentions-legales">Mentions légales</a>,{" "}
        <a href="/accessibilite">Accessibilité</a>, et{" "}
        <a href="/donnees-personnelles">Données personnelles</a>.
      </p>
    </div>
  );
}
