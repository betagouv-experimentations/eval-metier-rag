# Guide DSFR (Système de Design de l'État)

## Principe

Toute interface de ce projet utilise le DSFR via le package
`@codegouvfr/react-dsfr`. Aucune autre librairie UI n'est autorisée.

## Installation (déjà faite dans le template)

Le template inclut déjà `@codegouvfr/react-dsfr` et la configuration
nécessaire dans `src/app/layout.tsx`.

## Composants disponibles

Les composants les plus utilisés (import depuis `@codegouvfr/react-dsfr`) :

### Navigation et structure
- `Header` — En-tête de site avec navigation
- `Footer` — Pied de page réglementaire
- `MainNavigation` — Navigation principale
- `Breadcrumb` — Fil d'Ariane
- `SideMenu` — Menu latéral
- `SkipLinks` — Liens d'évitement (OBLIGATOIRE)
- `Notice` — Bandeau d'information

### Contenu
- `Card` — Carte de contenu
- `Tile` — Tuile
- `Badge` — Badge
- `Tag` — Étiquette
- `Callout` — Mise en exergue
- `Alert` — Alerte (info, success, warning, error)
- `Accordion` — Accordéon
- `Tabs` — Onglets
- `Table` — Tableau de données
- `Pagination` — Pagination

### Formulaires
- `Input` — Champ texte
- `Select` — Liste déroulante
- `Checkbox` — Case à cocher
- `RadioButtons` — Boutons radio
- `ToggleSwitch` — Interrupteur
- `Upload` — Upload de fichier
- `SearchBar` — Barre de recherche
- `PasswordInput` — Champ mot de passe

### Actions
- `Button` — Bouton (primary, secondary, tertiary)
- `ButtonsGroup` — Groupe de boutons
- `Modal` — Modale

### Mise en page
- `fr.cx()` — Classes utilitaires DSFR pour marges, paddings, grille

## Règles d'utilisation

1. **Toujours vérifier si un composant DSFR existe** avant d'en créer
   un custom. La doc complète est sur :
   https://components.react-dsfr.codegouv.studio/

2. **Ne jamais overrider les styles DSFR** avec du CSS custom.
   Si tu as besoin d'un style particulier, utilise les classes
   utilitaires DSFR via `fr.cx()`.

3. **Couleurs** : utiliser uniquement les couleurs du DSFR.
   Ne pas écrire de code couleur en dur (#xxx, rgb, etc.).

4. **Icônes** : utiliser les icônes DSFR (basées sur Remix Icon).
   Import via `fr.cx("fr-icon-...")`.

5. **Grille** : utiliser la grille DSFR (`fr.cx("fr-grid-row")`,
   `fr.cx("fr-col-6")`), pas flexbox/grid CSS custom.

6. **Responsive** : le DSFR est responsive par défaut. Ne pas
   ajouter de media queries custom.

## Exemple de page type

```tsx
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Card } from "@codegouvfr/react-dsfr/Card";

export default function HomePage() {
  return (
    <>
      <div className={fr.cx("fr-container", "fr-my-4w")}>
        <h1>Mon service public</h1>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
            <Card
              title="Action 1"
              desc="Description de l'action"
              linkProps={{ href: "/action-1" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
```

## Référence

- Documentation react-dsfr : https://react-dsfr.codegouv.studio/
- Storybook des composants : https://components.react-dsfr.codegouv.studio/
- DSFR officiel : https://www.systeme-de-design.gouv.fr/
