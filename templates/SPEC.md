# SPEC — {{NOM_PROJET}}

> Document produit, lisible par tout le monde. Tu peux le relire et le corriger librement — c'est ton document.
> Il a été généré le {{DATE}} par le sub-agent `cadrer`. Toute modification ici doit être reflétée dans `BACKLOG.md` si elle change le périmètre.

---

## En une phrase

{{PROMESSE_PRODUIT}}

## Pour qui (persona)

{{PERSONA_DETAILS}}

**Contexte d'usage** : {{CONTEXTE_USAGE}}
**Fréquence** : {{FREQUENCE}}

## Pourquoi (problème adressé)

Aujourd'hui, **{{PERSONA_COURT}}** doit **{{TACHE_PENIBLE}}** pour **{{OBJECTIF}}**.

Cette façon de faire actuelle est :
{{POINTS_PENIBILITE}}

Si on retirait notre produit, ce qui manquerait le plus serait : **{{MANQUE_PRINCIPAL}}**.

## Ce que le produit permet (promesse)

Avec {{NOM_PROJET}}, **{{PERSONA_COURT}}** peut **{{ACTION_PRODUIT}}** en **{{TEMPS_EFFORT}}**.

## Parcours minimum viable

{{PARCOURS_ETAPES}}

**Moment "aha"** : étape {{NUMERO_AHA}} — c'est à ce moment que l'utilisateur se dit *"ça marche, je l'utiliserai"*.

## Données manipulées

**Objets persistants** (qu'on retrouve d'une session à l'autre) :

{{OBJETS_PERSISTANTS}}

**Données entrantes** (saisies par l'utilisateur ou venues d'ailleurs) :

{{DONNEES_ENTRANTES}}

**Multi-utilisateur** : {{OUI_NON_MULTI}}

## Critères de succès

Sur les 100 premiers utilisateurs, on regardera :

{{CRITERES_SUCCES}}

**Le critère "non-négociable"** : {{CRITERE_PRINCIPAL}}

**Échec si** : {{CRITERE_ECHEC}}

---

## Notes pour relecture

- Ce document est le **support de discussion** avec l'équipe (devs, designers, autres PM).
- Les choix techniques (framework, base de données, hébergement) ne figurent pas ici — ils sont dans `CLAUDE.md`.
- Le découpage en tickets implémentables est dans `BACKLOG.md`.
- Si tu changes le périmètre ici, mets `BACKLOG.md` à jour ou demande à `cadrer` de le régénérer.
