# Guide migrations base de données (Drizzle)

## Principe

Tout changement de schéma de base de données passe par une migration
Drizzle. JAMAIS de modification manuelle de la DB.

## Workflow

### Ajouter ou modifier une table

1. Modifie `src/db/schema.ts` :
```ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

2. Génère la migration SQL :
```bash
npx drizzle-kit generate
```
Cela crée un fichier dans `drizzle/` (ex: `0001_add_partners.sql`).

3. Applique la migration :
```bash
npx drizzle-kit migrate
```

4. Vérifie que le fichier de migration est présent dans `drizzle/`
   et qu'il sera commité avec le code.

### Règles

- Ne JAMAIS modifier un fichier de migration existant qui a déjà
  été appliqué (en prod ou par d'autres)
- Pour corriger un schéma, créer une NOUVELLE migration
- Les migrations doivent être réversibles quand possible
- Nommer les colonnes en snake_case
- Toujours inclure `created_at` et `updated_at` sur les tables
- Utiliser `serial` pour les IDs (auto-increment)
- Utiliser `text` plutôt que `varchar` (pas de limite artificielle
  en Postgres)
- Utiliser `timestamp` avec timezone pour les dates

### En développement

La DB locale tourne dans Docker :
```bash
docker compose up -d db
```

Variables de connexion dans `.env.local` :
```
DATABASE_URL=postgresql://pm:pm@localhost:5432/proto
```

### En production (Coolify)

La variable `DATABASE_URL` est injectée automatiquement par Coolify
quand un addon PostgreSQL est provisionné. Pas de configuration
manuelle nécessaire.
