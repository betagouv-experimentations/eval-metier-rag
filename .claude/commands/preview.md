Lance ou relance le serveur de développement.

1. Vérifie si le port 3000 est déjà utilisé :
   ```bash
   lsof -i :3000 || true
   ```

2. Si un processus tourne déjà, demande au PM :
   "Un serveur tourne déjà. Tu veux que je le relance ?"

3. Si rien ne tourne (ou si le PM confirme) :
   ```bash
   # S'assurer que la DB tourne
   docker compose up -d db

   # Appliquer les migrations
   npx drizzle-kit migrate

   # Lancer le dev server
   npm run dev
   ```

4. Affiche :
   "Ton proto tourne sur http://localhost:3000
   Ouvre cette URL dans ton navigateur."
