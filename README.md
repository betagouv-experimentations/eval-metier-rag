# {{REPO_NAME}}

> Prototype beta.gouv.fr propulsé par Claude Code et le DSFR.

<!-- TEMPLATE_ONLY_START -->

> ⚠️ **Tu es sur le template, pas sur ton projet.**
>
> Pour créer ton propre prototype, suis cette section. Ton nouveau repo aura un README personnalisé qui prendra le relais.

## 1. Créer ton repo à partir du template

1. Clique sur **« Use this template »** (bouton vert en haut à droite de cette page) → **« Create a new repository »**.
2. Dans le formulaire :
   - **Owner** : choisis **`betagouv-experimentations`** (pas ton compte perso, sinon le déploiement automatique ne se fera pas).
   - **Repository name** : choisis un nom court, en minuscules, sans accents (ex : `partenariats-ademe`, `simulateur-rsa`). Ce nom deviendra l'URL publique de ton service : `https://<ton-nom>.coolify.incubateur.net`.
   - **Public** (par défaut beta.gouv).
3. Clique **« Create repository »**.
4. Patiente 30 à 60 secondes : un workflow GitHub Actions provisionne automatiquement la base de données et le déploiement. Tu peux suivre dans l'onglet **Actions** de ton nouveau repo.
5. Une fois fini, **rouvre le README de TON repo** (pas celui-ci) — il sera mis à jour avec les bonnes URLs et la suite des instructions.

Si tu n'as pas la permission de choisir `betagouv-experimentations` comme Owner, contacte ton coach beta pour qu'il t'ajoute à l'organisation.

---

(La suite ci-dessous décrit le flow PM **après** bootstrap — affichée ici à titre informatif.)

<!-- TEMPLATE_ONLY_END -->

## 🚀 Démarrer

Tu as ton repo : **{{REPO_FULL_NAME}}**. Voici la suite, en 5 minutes.

### 1. Installer agent-vm

agent-vm est l'environnement isolé dans lequel Claude Code tourne. Suis les instructions sur https://github.com/sylvinus/agent-vm.

### 2. Cloner ton repo et lancer Claude

Dans un terminal :

```bash
git clone {{REPO_CLONE_URL}}
cd {{REPO_NAME}}
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

**{{DEPLOY_URL}}**

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
