# eval-metier-rag

> Prototype beta.gouv.fr propulsé par Claude Code et le DSFR


## 🚀 Démarrer

Tu as ton repo : **betagouv-experimentations/eval-metier-rag**. Voici la suite, en 5 minutes.

### 1. Installer agent-vm

agent-vm est l'environnement isolé dans lequel Claude Code tourne. Suis les instructions sur https://github.com/sylvinus/agent-vm.

### 2. Cloner ton repo et lancer Claude

Dans un terminal :

```bash
git clone https://github.com/betagouv-experimentations/eval-metier-rag.git
cd eval-metier-rag
agent-vm --memory 16 --disk 40 --cpus 6 claude
```

Les flags `--memory 16 --disk 40 --cpus 6` ne sont nécessaires qu'au **premier lancement** : ils dimensionnent la VM (sinon agent-vm la crée en 2 GB de RAM, ce qui ne suffit pas — Claude + Playwright Chromium + Postgres + Next.js consomment facilement 10-12 GB pendant un build). Les fois suivantes, un simple `agent-vm claude` suffit.

Première fois : agent-vm provisionne sa VM (Node, Playwright, gh CLI, …) et te demande de te connecter à GitHub via le navigateur. Compte 3-5 min.

### 2.5 Cadrer ton produit (recommandé)

Si tu hésites sur le périmètre ou que tu veux structurer ton idée avant de coder, tape :

```
/cadrer
```

Tu vas dialoguer 20-30 min avec un sous-agent qui te pose des questions produit (persona, problème, parcours, données, succès). En sortie : `specs/SPEC.md` (la version lisible par toi) et `specs/BACKLOG.md` (les tickets que /build implémentera dans l'ordre).

Si tu as déjà ton idée bien claire, passe directement à l'étape 3.

### 3. Décrire ce que tu veux construire

Une fois Claude lancé, tape :

```
/build
```

Décris en français ton service. Sois précis sur :

- qui sont les utilisateurs ;
- les 3 actions principales qu'ils doivent pouvoir faire ;
- les données manipulées (et si elles sont sensibles).

Claude posera 1 à 3 questions, montrera un résumé en 10 lignes, attendra ta validation, puis construira tout : schéma de base de données, écrans, formulaires, tests automatisés, données de démo.

### 4. Tester ton proto en local

Quand Claude annonce que c'est prêt, ouvre **http://localhost:3000** dans ton navigateur. Clique partout. Teste les formulaires.

### 5. Itérer

Pour modifier :

```
/change
```

Exemples :

> Ajoute un champ « secteur » sur les partenaires.
> Mets le titre principal en bleu DSFR.
> Ajoute un export CSV de la liste des projets.

Pour relancer le serveur local s'il s'est arrêté :

```
/preview
```

### 6. Mettre en ligne

Quand ton proto te plaît :

```
/save
```

Claude lance les tests, commit, push, et suit le déploiement automatique. Ton service sera en ligne sur :

**https://eval-metier-rag.coolify.incubateur.net**

en environ 2 à 3 minutes. Claude te tient au courant pendant le build et te diagnostique tout échec éventuel.

## Les 5 commandes à retenir

| Commande   | Quand l'utiliser                              |
| ---------- | --------------------------------------------- |
| `/cadrer`  | Cadrer le périmètre du proto avant de coder   |
| `/build`   | Créer le proto from scratch                   |
| `/change`  | Modifier ce qui existe (feature, fix, design) |
| `/save`    | Tester + déployer en ligne                    |
| `/preview` | Relancer le serveur local sur :3000           |

C'est tout. Tu n'as **pas besoin** de connaître Git, Docker, TypeScript, React, ou Postgres — Claude gère.

## En cas de problème

- "Mon serveur ne répond pas" → tape `/preview`.
- "Une fonctionnalité ne marche pas" → tape `/change` et décris le bug.
- "Le déploiement a échoué" → Claude lit les logs et te dit quoi faire. S'il n'arrive pas à corriger, contacte ton coach beta.
- Autre question : ton coach beta.

## Pour aller plus loin

- [Aide-mémoire 1 page](docs/AIDE_MEMOIRE.md)
- [Constitution technique du projet](CLAUDE.md) — règles que Claude suit
- [Guidelines DSFR / RGAA / DB / tests / sécurité / standards beta](docs/guidelines/)

## Stack technique

Next.js 15 (App Router) + TypeScript strict · `@codegouvfr/react-dsfr` · Drizzle ORM + PostgreSQL · zod · Playwright · Docker · Coolify.

Licence : [MIT](LICENSE).
