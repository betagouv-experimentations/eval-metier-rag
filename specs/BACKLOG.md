# Backlog — Éval Métier RAG

> Tickets ordonnés par dépendance technique et valeur produit.
> Source de vérité : `specs/SPEC.md`. Ne pas implémenter de ticket absent
> de cette liste sans validation explicite du PM.

---

## 🏗️ Socle technique

### [x] T-01 — Setup du projet Next.js
**Priorité** : P0 — Bloquant pour tout le reste
**Description** : Initialiser le projet Next.js 15 (App Router), TypeScript strict,
DSFR, Drizzle ORM + PostgreSQL via Docker, Playwright.
Inclure les pages obligatoires : `/mentions-legales`, `/accessibilite`, `/donnees-personnelles`.
**Critères de succès** :
- `npm run dev` fonctionne
- Page d'accueil avec header/footer DSFR
- DB PostgreSQL accessible en local via Docker
- Un test Playwright de smoke passe

---

## 📁 Gestion des campagnes

### [x] T-02 — Import d'un fichier Excel et création de campagne
**Priorité** : P0 — Cœur du produit
**Dépend de** : T-01
**Description** : Le PM importe un fichier `.xlsx` ou `.csv`.
Le système parse les colonnes `question`, `réponse_A`, `réponse_B`,
`sources_A`, `sources_B`. Les sources sont splittées (séparateur à définir
lors de l'implémentation : saut de ligne, virgule, point-virgule).
Une campagne est créée avec le nom = nom du fichier.
**Critères de succès** :
- Upload d'un fichier Excel → campagne créée en base
- Les questions et réponses sont correctement parsées
- Les sources sont splittées en liste de liens
- Erreur explicite si le fichier ne respecte pas la structure attendue

### [x] T-03 — Génération du lien de partage
**Priorité** : P0
**Dépend de** : T-02
**Description** : Après l'import, le PM obtient une URL unique et opaque
(ex. `/campagne/[token]`) permettant à n'importe qui d'accéder à la campagne
pour annoter. Pas d'authentification requise.
**Critères de succès** :
- Le lien est affiché et copiable après création de campagne
- Accéder au lien sans compte permet d'annoter
- Le token est suffisamment opaque (UUID ou équivalent)

### [x] T-04 — Liste des campagnes (PM)
**Priorité** : P1
**Dépend de** : T-02
**Description** : Page listant toutes les campagnes créées, avec leur nom,
date de création, nombre de questions et nombre d'annotations.
**Critères de succès** :
- La liste s'affiche avec les bonnes métadonnées
- Lien vers les résultats de chaque campagne

---

## ✍️ Interface d'annotation

### [x] T-05 — Vue liste des questions (Expert)
**Priorité** : P0
**Dépend de** : T-03
**Description** : L'expert accédant au lien voit la liste de toutes les questions
de la campagne, avec pour chaque question un indicateur "annoté / non annoté".
Clic sur une question → ouvre la vue détaillée.
**Critères de succès** :
- Liste paginée ou scrollable
- Statut annoté/non annoté visible
- Navigation vers la vue question

### [x] T-06 — Vue question par question (Expert)
**Priorité** : P0
**Dépend de** : T-05
**Description** : Interface d'annotation d'une question unique, avec :
- La question posée
- La réponse A et la réponse B côte à côte (ou empilées sur mobile)
- Les sources de A et de B (liens cliquables)
- Les critères d'évaluation (voir T-07, T-08, T-09)
- Navigation précédent / suivant
**Critères de succès** :
- La question, les deux réponses et toutes les sources s'affichent
- Les liens de sources sont cliquables et s'ouvrent dans un nouvel onglet
- Navigation précédent/suivant fonctionnelle

### [x] T-07 — Critère d'acceptabilité (OUI/NON par réponse)
**Priorité** : P0
**Dépend de** : T-06
**Description** : Pour chaque question, l'expert répond :
- "La réponse A est-elle acceptable ?" → OUI / NON
- "La réponse B est-elle acceptable ?" → OUI / NON
Ces deux évaluations sont indépendantes l'une de l'autre et de la comparaison.
**Critères de succès** :
- Deux champs distincts OUI/NON affichés
- La sélection est sauvegardée en base immédiatement (pas de bouton "valider" global)

### [x] T-08 — Critère de comparaison (A / équivalent / B)
**Priorité** : P0
**Dépend de** : T-06
**Description** : Pour chaque question, l'expert choisit parmi :
"A meilleure que B" / "Équivalentes" / "B meilleure que A"
**Critères de succès** :
- Les 3 options s'affichent clairement (boutons radio ou équivalent DSFR)
- La sélection est sauvegardée en base

### [x] T-09 — Évaluation des sources (OUI/NON par source)
**Priorité** : P0
**Dépend de** : T-06
**Description** : Pour chaque source de la réponse A et de la réponse B,
l'expert répond : "Cette source justifie-t-elle bien la réponse ?" → OUI / NON.
Chaque source est évaluée individuellement.
**Critères de succès** :
- Chaque lien source est affiché avec son OUI/NON associé
- Toutes les évaluations de sources sont sauvegardées

### [x] T-10 — Commentaire libre
**Priorité** : P1
**Dépend de** : T-06
**Description** : Champ texte optionnel permettant à l'expert de laisser
un commentaire libre sur la question (applicable à la réponse A, B ou aux deux).
**Critères de succès** :
- Champ texte visible et optionnel
- Commentaire sauvegardé et associé à l'annotation

### [x] T-11 — Modification d'une annotation
**Priorité** : P1
**Dépend de** : T-07, T-08, T-09
**Description** : L'expert peut revenir sur une question déjà annotée
et modifier ses réponses. La modification écrase l'annotation précédente.
**Critères de succès** :
- En revenant sur une question déjà annotée, les réponses précédentes sont pré-remplies
- La modification est bien prise en compte

---

## 📊 Résultats et export

### [x] T-12 — Tableau de bord des résultats (PM)
**Priorité** : P1
**Dépend de** : T-07, T-08, T-09
**Description** : Page de résultats agrégés par campagne, affichant :
- % de réponses A acceptables
- % de réponses B acceptables
- Répartition "A meilleure / Équivalentes / B meilleure" (nb + %)
- Détail par question : répartition des votes et liste des commentaires
**Critères de succès** :
- Les indicateurs s'affichent correctement avec les bonnes valeurs
- Le détail par question est accessible (accordéon ou page dédiée)

### [x] T-13 — Export CSV des annotations brutes
**Priorité** : P2
**Dépend de** : T-12
**Description** : Bouton permettant au PM de télécharger un fichier CSV
contenant toutes les annotations brutes de la campagne
(une ligne par annotation : question, réponse, critère, valeur, commentaire).
**Critères de succès** :
- Le fichier CSV est téléchargeable
- Structure : `question | acceptable_A | acceptable_B | comparaison | sources_A_eval | sources_B_eval | commentaire`

---

## Légende des priorités

| Priorité | Signification |
|---|---|
| **P0** | Indispensable au MVP — bloque la valeur produit si absent |
| **P1** | Important — à faire dès que le P0 est stable |
| **P2** | Utile mais différable si contrainte de temps |
