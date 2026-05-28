# Spec produit — Éval Métier RAG

> Outil d'évaluation humaine de réponses générées par des systèmes RAG.
> Prototype beta.gouv.fr — dernière mise à jour : 2026-05-28

---

## 1. Vision

Permettre à une cheffe produit d'organiser des campagnes d'évaluation
qualitative de systèmes RAG, et à des experts métier d'annoter rapidement
les réponses générées — afin d'identifier facilement quel modèle déployer
en production.

---

## 2. Personas

### 👩‍💼 La cheffe produit (PM)
- Pilote les campagnes d'évaluation
- Importe les fichiers de données, génère les liens de partage
- Consulte et exporte les résultats agrégés
- Peut être aussi annotateur sur une même campagne

### 👩‍⚕️ L'expert métier
- Évalue la qualité des réponses sur le fond (pas sur l'aspect technique)
- Appartient potentiellement à une organisation différente du PM
- ~10 experts par campagne
- Accède à l'outil via un lien partagé, sans compte ni mot de passe

---

## 3. Problème résolu

Aujourd'hui, la comparaison entre deux versions d'un système RAG se fait
soit sur un fichier Excel partagé par email (conflits, pas d'agrégation),
soit ne se fait pas du tout. Il n'existe pas d'outil structuré pour
collecter et agréger les retours humains d'experts métier.

**Conséquence** : le PM ne peut pas décider avec confiance quel modèle
est le plus qualitatif.

---

## 4. Fonctionnalités

### 4.1 Créer une campagne d'évaluation (PM)

1. Le PM importe un fichier Excel structuré avec les colonnes :

   | question | réponse_A | réponse_B | sources_A | sources_B |

   - `sources_A` et `sources_B` contiennent plusieurs liens séparés
     dans une même cellule (liens PDF ministériels, URLs service-public.fr
     ou legifrance.fr)

2. Une campagne est créée automatiquement avec :
   - **Nom** = nom du fichier Excel importé
   - **Mode** : comparaison A vs B (par défaut) ou évaluation d'un seul
     modèle (si le fichier ne contient qu'une réponse)

3. Le PM obtient un **lien de partage** à envoyer aux experts.

### 4.2 Annoter les réponses (Expert métier)

L'expert accède au lien sans authentification.

Il peut naviguer de deux façons :
- **Vue liste** : toutes les questions visibles, avec leur statut (annoté / non annoté)
- **Vue question par question** : une question à la fois, avec navigation précédent/suivant

Pour chaque question, l'expert remplit :

| Critère | Options |
|---|---|
| **Acceptabilité A** | OUI / NON — "La réponse A est-elle acceptable ?" |
| **Acceptabilité B** | OUI / NON — "La réponse B est-elle acceptable ?" |
| **Comparaison** | A meilleure / Équivalentes / B meilleure |
| **Sources A** | Pour chaque source : OUI / NON — "Cette source justifie-t-elle bien la réponse ?" |
| **Sources B** | Pour chaque source : OUI / NON — "Cette source justifie-t-elle bien la réponse ?" |
| **Commentaire** | Texte libre (optionnel) |

> Note : l'acceptabilité et la comparaison sont indépendantes — deux réponses
> peuvent être toutes deux acceptables, mais l'une meilleure que l'autre.

L'expert peut **modifier ses annotations** à tout moment tant que la campagne
est ouverte.

Les annotations sont **anonymes** (pas d'identifiant annotateur).

### 4.3 Consulter les résultats (PM)

Le PM accède à un tableau de bord récapitulatif par campagne :

- **% de réponses A acceptables** (sur le total des annotations)
- **% de réponses B acceptables**
- **Répartition de la comparaison** : nb et % pour "A meilleure" / "Équivalentes" / "B meilleure"
- **Détail par question** : répartition des votes + tous les commentaires laissés
- **Export CSV/Excel** des annotations brutes (une ligne par annotation)

---

## 5. Ce qui n'est PAS dans le périmètre (MVP)

- ❌ Authentification des annotateurs (anonymat complet pour le MVP)
- ❌ Suivi en temps réel de l'avancement des annotateurs
- ❌ Gestion des droits / rôles utilisateurs
- ❌ Notifications par email
- ❌ Historique des versions d'un même fichier
- ❌ Évaluation de plus de deux modèles simultanément

---

## 6. Critères de succès

- Les experts métier annotent **plus rapidement** qu'avec un fichier Excel
- Le PM peut **identifier en un coup d'œil** quel modèle est le plus qualitatif
- 2 campagnes d'évaluation organisées dans les 3 prochains mois

---

## 7. Contraintes

- Pas de données sensibles dans les campagnes
- Pas de contrainte d'hébergement particulière
- Stack imposée : Next.js 15 + TypeScript + DSFR + Drizzle + PostgreSQL
