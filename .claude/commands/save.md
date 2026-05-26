Sauvegarde le travail et déploie en production.

## Étapes (enchaîner sans interruption)

1. **Lancer les tests** :

   ```bash
   npx playwright test
   ```

   Si un test échoue : STOP. Dis au PM quel test échoue et pourquoi.
   Propose de corriger. Ne continue PAS avec des tests rouges.

2. **Vérifier le build** :

   ```bash
   npm run build
   ```

   Si le build échoue : corrige les erreurs TypeScript/ESLint.

3. **Commit** :

   ```bash
   git add -A
   ```

   Génère un message de commit en anglais, format conventionnel,
   descriptif. Exemples :
   - `feat: add partner listing page with search and filters`
   - `fix: correct form validation on interaction creation`
   - `chore: update seed data with realistic test entries`

   ```bash
   git commit -m "<message>"
   ```

4. **Push** :

   ```bash
   git push origin main
   ```

   Récupère le SHA du commit poussé :

   ```bash
   SHA=$(git rev-parse HEAD)
   REPO=$(basename "$(git rev-parse --show-toplevel)")
   ```

5. **Suivre le déploiement** :

   Annonce au PM :

   ```
   ✅ Sauvegardé. Le déploiement Coolify a démarré, je surveille...
   ```

   Poll le proxy de logs toutes les 10 secondes, max 5 minutes.

   Le proxy exige une authentification GitHub : passe le PAT via
   l'header `Authorization`. Le token vient de `gh auth token` (déjà
   configuré dans agent-vm).

   ```bash
   curl -sf -H "Authorization: Bearer $(gh auth token)" \
     "https://coolify-logs.coolify.incubateur.net/logs/$REPO/$SHA"
   ```

   Si tu reçois un 401/403 : c'est probablement que le PM n'est pas
   (encore) membre de l'org `betagouv-experimentations`. Indique-le
   explicitement et propose-lui de contacter son coach beta.

   Selon le `status` retourné :
   - **`queued`** ou **`in_progress`** :
     Affiche au PM toutes les 30s :
     `🔄 Build en cours... (déjà <durée>)`
     Continue à poller.

   - **`finished`** ou **`success`** :
     Récupère le `commit_url`/domaine depuis `.coolify/app.json` ou
     reconstruis-le : `https://<repo>.coolify.incubateur.net`. Affiche :

     ```
     ✅ Déployé !
     → https://<repo>.coolify.incubateur.net
     (déploiement en ~<durée>)
     ```

     STOP.

   - **`failed`** ou **`error`** :
     Récupère les logs (champ `logs` de la réponse JSON), analyse les
     dernières lignes pour identifier la cause. Cas typiques :
     - Erreur TypeScript → propose un /change pour corriger
     - Migration Drizzle qui plante → propose un /change pour
       régénérer la migration
     - Manque d'une variable d'env → liste celles attendues vs
       celles présentes dans Coolify
     - Build OK mais l'app crashe au démarrage → fetch les logs
       runtime (les logs build n'ont rien d'utile dans ce cas) :
       ```bash
       curl -sf -H "Authorization: Bearer $(gh auth token)" \
         "https://coolify-logs.coolify.incubateur.net/runtime-logs/$REPO?lines=200"
       ```
     - Hors de tes compétences → affiche au PM :

       ```
       ❌ Le déploiement a échoué.

       Voici ce que j'ai vu dans les logs :
       <résumé en 3-5 lignes des dernières erreurs>

       Je n'arrive pas à corriger automatiquement. Demande à ton coach
       beta d'aller voir : <deployment_url>
       ```

       STOP.

   - Si le proxy ne répond pas (timeout, 502) après 3 essais :
     ```
     ⚠️ Le push est bien parti mais je n'arrive pas à suivre l'état du
     déploiement. Vérifie dans 2-3 min sur https://<repo>.coolify.incubateur.net
     ```
     STOP.

## Notes importantes

- Le PM ne sait pas ce qu'est Coolify, deployment_uuid, etc. Reste
  côté observable : "build", "déploiement", URL finale.
- Si le polling dure plus de 5 min sans réponse définitive, sors avec
  un message neutre ("ça met plus de temps que prévu, vérifie bientôt
  sur https://...") plutôt que de boucler indéfiniment.
- Le fichier `.coolify/app.json` (créé automatiquement par le workflow
  bootstrap-coolify.yml au premier push) contient l'`app_uuid`, le
  `domain`, et le `database_uuid`. Tu peux t'en servir pour confirmer
  l'URL de déploiement plutôt que de la deviner.
