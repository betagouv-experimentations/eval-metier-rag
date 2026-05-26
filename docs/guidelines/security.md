# Guide sécurité

## Variables d'environnement

- Stocker dans `.env.local` (jamais committé, dans `.gitignore`)
- Documenter dans `.env.example` (committé, sans valeurs réelles)
- En production : injectées par Coolify

## Validation des entrées

Utiliser zod pour TOUTE entrée utilisateur :

```ts
import { z } from "zod";

const PartnerSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(200),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().regex(/^(\+33|0)\d{9}$/, "Numéro invalide").optional(),
});

// Dans une Server Action ou API Route :
const parsed = PartnerSchema.safeParse(rawData);
if (!parsed.success) {
  return { errors: parsed.error.flatten().fieldErrors };
}
```

## Requêtes DB

- TOUJOURS utiliser Drizzle ORM (requêtes paramétrées par défaut)
- JAMAIS de string interpolation dans les requêtes
- JAMAIS de `sql.raw()` avec des données utilisateur

## Headers de sécurité (next.config.ts)

Le template inclut des headers de sécurité de base :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- CSP basique (à affiner selon les besoins)

## Authentification

Le template ne préinstalle pas d'auth. Si nécessaire :
- Utiliser ProConnect (OIDC) pour les agents publics
- Ou NextAuth.js avec un provider adapté
- JAMAIS implémenter un système d'auth custom (mots de passe, etc.)
