# BACKLOG — {{NOM_PROJET}}

> Liste des tickets pour atteindre le MVP décrit dans `SPEC.md`.
> Ordre = ordre du parcours utilisateur : on construit ce que l'utilisateur voit en premier, en premier.
> Tailles : **S** = quelques heures · **M** = 1-2 jours · **L** = 3-5 jours.

---

## MVP — Tickets prioritaires

### Setup initial

- [ ] **[S] Initialiser le projet** — créer le squelette {{FRONTEND}}, configurer pnpm, prettier, eslint, husky.
  *Critère* : `pnpm validate` passe sur un projet vide.

- [ ] **[S] Configurer le DSFR** — installer `{{DSFR_PACKAGE}}`, vérifier qu'une page de démo s'affiche avec la typo et les couleurs DSFR.
  *Critère* : la page d'accueil affiche un composant DSFR (ex. bouton primaire) correctement stylé.

{{TICKETS_DB_AUTH}}

### Parcours utilisateur

{{TICKETS_PARCOURS}}

### Polish

- [ ] **[S] Page d'accueil** — titre, sous-titre, mention beta.gouv, lien vers la mission.
  *Critère* : la home présente clairement la promesse en 1 phrase.

- [ ] **[S] Mentions légales et politique de confidentialité** — pages obligatoires beta.gouv.
  *Critère* : 2 pages accessibles depuis le footer DSFR.

- [ ] **[M] Tests E2E du parcours principal** — Playwright qui rejoue le parcours D4 du SPEC.
  *Critère* : le test couvre les {{NB_ETAPES}} étapes du parcours et passe en CI.

---

## Hors-scope MVP (à reconsidérer après les 100 premiers users)

{{HORS_SCOPE}}

---

## Comment utiliser ce backlog

1. Prendre **le ticket le plus haut non coché**.
2. Demander à Claude Code de l'implémenter en lui pointant ce ticket : *"Implémente le ticket suivant du backlog : […]"*.
3. Cocher le ticket quand tous les critères sont validés (incluant le test browser).
4. Commit, push, passer au suivant.

**Ne jamais sauter de tickets** sans réflexion : les tickets sont ordonnés pour qu'à chaque étape l'utilisateur puisse voir un résultat concret.
