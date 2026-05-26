# Checklist accessibilité RGAA

## Contexte

Le RGAA (Référentiel Général d'Amélioration de l'Accessibilité)
est obligatoire pour les services publics numériques français.
Ce projet doit respecter au minimum les critères de niveau AA.

## Checklist par composant

### Layout (src/app/layout.tsx)
- [ ] `<html lang="fr">`
- [ ] `<SkipLinks>` avec lien "Aller au contenu" pointant vers
      `<main id="content">`
- [ ] `<main id="content">` qui encadre le contenu principal
- [ ] `<Header>` DSFR avec navigation
- [ ] `<Footer>` DSFR avec liens obligatoires

### Pages
- [ ] Un seul `<h1>` par page
- [ ] Hiérarchie des titres respectée (h1 > h2 > h3, pas de saut)
- [ ] `<title>` unique et descriptif pour chaque page
  (via `metadata` Next.js)

### Images
- [ ] `alt="Description"` sur les images informatives
- [ ] `alt=""` sur les images purement décoratives
- [ ] Utiliser `next/image` pour toutes les images

### Formulaires
- [ ] Chaque champ a un `<label>` explicite lié via `htmlFor`/`id`
- [ ] Les champs obligatoires sont indiqués (texte, pas juste `*`)
- [ ] Les messages d'erreur sont :
  - Visibles textuellement (pas seulement en rouge)
  - Associés au champ via `aria-describedby`
  - Précis ("Le nom est obligatoire", pas "Erreur")
- [ ] L'autocomplétion est activée quand pertinente
  (`autoComplete="name"`, `"email"`, etc.)

### Navigation
- [ ] Navigation au clavier complète (Tab, Shift+Tab, Enter, Escape)
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Au moins 2 systèmes de navigation parmi :
  menu principal, recherche, plan du site, fil d'Ariane
- [ ] Pas de "piège au clavier" (on peut toujours sortir avec Tab
  ou Escape)

### Tableaux
- [ ] `<caption>` décrivant le contenu du tableau
- [ ] `<th scope="col">` pour les en-têtes de colonnes
- [ ] `<th scope="row">` pour les en-têtes de lignes
- [ ] Pas de tableaux pour la mise en page

### Couleurs et contrastes
- [ ] Utiliser UNIQUEMENT les couleurs DSFR (conformes par design)
- [ ] L'information ne repose jamais sur la couleur seule (ajouter
  texte, icône, ou forme)
- [ ] Pas de `outline: none` ou `outline: 0` sur les focus

### Contenus dynamiques
- [ ] Les messages de statut utilisent `role="status"` ou
  `aria-live="polite"`
- [ ] Les modales piègent le focus (DSFR le gère nativement)
- [ ] Les notifications/alertes sont annoncées aux lecteurs d'écran

## Outil de vérification

Lancer régulièrement :
```bash
npx pa11y http://localhost:3000
npx pa11y http://localhost:3000/autres-pages
```

pa11y vérifie les critères automatisables (environ 30% du RGAA).
Les 70% restants nécessitent une vérification manuelle (parcours
clavier, pertinence des alternatives textuelles, etc.).
