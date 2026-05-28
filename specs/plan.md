# Plan technique — Éval Métier RAG

> Généré le 2026-05-28. Remis à zéro à chaque nouveau /build.

## Architecture générale

Next.js 15 App Router · TypeScript strict · DSFR · Drizzle + PostgreSQL · Playwright

---

## Modèle de données (Drizzle)

### `campaigns`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| name | text NOT NULL | nom du fichier importé |
| token | text UNIQUE NOT NULL | UUID opaque pour le lien de partage |
| mode | text NOT NULL | 'comparison' \| 'single' |
| created_at | timestamptz | default now() |

### `questions`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| campaign_id | uuid FK → campaigns | ON DELETE CASCADE |
| position | integer NOT NULL | ordre dans le fichier (1-based) |
| question_text | text NOT NULL | |
| response_a | text NOT NULL | |
| response_b | text | NULL si mode = 'single' |
| sources_a | jsonb NOT NULL | array de strings (liens) |
| sources_b | jsonb | NULL si mode = 'single' |

### `annotations`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| question_id | uuid FK → questions | ON DELETE CASCADE |
| session_token | text NOT NULL | UUID généré côté client (localStorage) |
| acceptable_a | boolean | NULL si non renseigné |
| acceptable_b | boolean | NULL si non renseigné |
| comparison | text | 'a_better' \| 'equivalent' \| 'b_better' \| NULL |
| comment | text | NULL si vide |
| created_at | timestamptz | |
| updated_at | timestamptz | |

Contrainte UNIQUE : (question_id, session_token) → permet l'upsert par session.

### `source_evaluations`
| Colonne | Type | Notes |
|---|---|---|
| id | uuid PK | |
| annotation_id | uuid FK → annotations | ON DELETE CASCADE |
| side | text NOT NULL | 'a' \| 'b' |
| source_index | integer NOT NULL | index 0-based dans le tableau sources |
| is_relevant | boolean | NULL si non renseigné |

Contrainte UNIQUE : (annotation_id, side, source_index)

---

## Structure des pages

```
src/app/
├── page.tsx                          → Accueil + CTA créer une campagne
├── layout.tsx                        → Root layout DSFR (Header + Footer)
├── campagnes/
│   ├── page.tsx                      → Liste des campagnes (PM)
│   ├── nouvelle/
│   │   └── page.tsx                  → Import Excel + création campagne
│   └── [id]/
│       ├── page.tsx                  → Détail campagne + lien de partage
│       └── resultats/
│           └── page.tsx              → Tableau de bord résultats
├── annotation/
│   └── [token]/
│       ├── page.tsx                  → Vue liste des questions
│       └── [questionId]/
│           └── page.tsx              → Vue annotation question par question
└── api/
    ├── campagnes/
    │   ├── route.ts                  → GET list, POST create (multipart)
    │   └── [id]/
    │       ├── route.ts              → GET détail
    │       ├── resultats/route.ts    → GET résultats agrégés
    │       └── export/route.ts       → GET CSV export
    ├── annotation/
    │   └── [token]/route.ts          → GET campagne + questions par token
    ├── annotations/route.ts          → POST upsert annotation
    └── source-evaluations/route.ts   → POST upsert source evaluation
```

---

## Composants React (Client)

```
src/components/
├── annotation/
│   ├── AnnotationForm.tsx            → Formulaire complet d'annotation
│   ├── AcceptabilityField.tsx        → OUI/NON (RadioButtons DSFR)
│   ├── ComparisonField.tsx           → A/equiv/B (RadioButtons DSFR)
│   ├── SourceEvaluationList.tsx      → Liste de sources avec OUI/NON
│   └── QuestionNav.tsx               → Navigation précédent/suivant
├── campagne/
│   ├── CampagneUploadForm.tsx        → Formulaire d'upload Excel
│   └── ShareLinkBox.tsx              → Affichage + copie du lien
└── results/
    ├── ResultsOverview.tsx            → Indicateurs agrégés
    └── QuestionAccordion.tsx          → Détail par question (Accordion DSFR)
```

---

## Parsing des sources Excel

Séparateur auto-détecté dans l'ordre :
1. `\n` (saut de ligne dans la cellule)
2. `\r\n` (Windows)
3. `;` (point-virgule)
4. `,` (virgule — seulement si pas d'URL avec virgule)

Filtre : on ignore les chaînes vides après split et trim.

---

## Gestion du session token (anonymat)

- Au premier accès à `/annotation/[token]`, le client génère un UUID v4 et le stocke dans `localStorage` sous la clé `eval_session_token`.
- Toutes les requêtes API d'annotation incluent ce token dans le body.
- L'upsert se fait sur la contrainte UNIQUE (question_id, session_token).
- Résultat : chaque navigateur = un annotateur distinct. Modification possible en revenant sur la question.

---

## Tickets à implémenter (dans l'ordre)

- [x] T-01 — Setup projet (starter kit déjà opérationnel, à adapter au produit)
- [ ] T-02 — Import Excel + création campagne
- [ ] T-03 — Lien de partage
- [ ] T-04 — Liste des campagnes
- [ ] T-05 — Vue liste questions (annotateur)
- [ ] T-06 — Vue question par question
- [ ] T-07 — Critère acceptabilité
- [ ] T-08 — Critère comparaison
- [ ] T-09 — Évaluation des sources
- [ ] T-10 — Commentaire libre
- [ ] T-11 — Modification d'annotation
- [ ] T-12 — Tableau de bord résultats
- [ ] T-13 — Export CSV
