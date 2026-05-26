# Aide-mémoire — Les 5 commandes

| Commande   | Quand l'utiliser                              |
| ---------- | --------------------------------------------- |
| `/cadrer`  | Cadrer le produit avant /build (20 min)       |
| `/build`   | Créer le proto from scratch                   |
| `/change`  | Modifier ce qui existe (feature, fix, design) |
| `/save`    | Mettre en ligne (tests + commit + deploy)     |
| `/preview` | Relancer le serveur local sur :3000           |

## Workflow type

```
/cadrer         → 6 questions produit → specs/SPEC.md + specs/BACKLOG.md
/build          → décris ton idée → proto créé
/change         → "ajoute un champ secteur" → modifié
/preview        → vérifie sur http://localhost:3000
/change         → "change le titre en 'Mes partenaires'" → modifié
/save           → en ligne sur https://[repo].coolify.incubateur.net
```

## Bons réflexes

- **Décris en français**, comme à un collègue
- **Sois précis** : "ajoute un bouton" < "ajoute un bouton 'Exporter'
  en haut à droite de la liste"
- **Itère** : 5 petits `/change` valent mieux qu'un gros
- **`/save` souvent** : à chaque étape qui te plaît

## Tu n'as PAS besoin de connaître

- Git (commit, push, branches…)
- Docker, Postgres, Node.js
- TypeScript, React, CSS
- Les fichiers du projet

Claude gère tout.

## En cas de blocage

| Symptôme                       | Solution                |
| ------------------------------ | ----------------------- |
| `localhost:3000` ne charge pas | `/preview`              |
| Une feature buggue             | `/change` + décris bug  |
| Tu veux annuler la dernière ✗  | `/change` + "annule X"  |
| Le déploiement a échoué        | `/save` (Claude fixera) |
