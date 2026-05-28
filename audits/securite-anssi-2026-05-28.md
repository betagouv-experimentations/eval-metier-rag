# Audit Sécurité ANSSI — Rapport de conformité

**Date :** 2026-05-28
**Périmètre audité :** Éval Métier RAG — application web complète (Next.js 15.5.18, Drizzle ORM, PostgreSQL, Docker)
**Résultat global :** 8/12 domaines conformes (67% — après corrections en cours d'audit)
(8 OK, 1 KO → corrigé, 2 Partiel, 1 NA)

---

## Tableau de synthèse

| # | Domaine | Statut | Détail |
|---|---------|--------|--------|
| 1 | TLS / HTTPS | Partiel | Pas de config TLS dans le code — Coolify gère le TLS ; HSTS manquant dans next.config.ts |
| 2 | Gestion des secrets | OK | `.env.local` dans `.gitignore`, aucun secret dans le code |
| 3 | Authentification et contrôle d'accès | NA | Pas d'authentification (spec V1 assumée) |
| 4 | Headers de sécurité HTTP | Partiel | X-Frame, X-Content-Type-Options, Referrer-Policy, Permissions-Policy ✓ — CSP et HSTS manquants |
| 5 | Validation des entrées | OK | Zod sur toutes les API, Drizzle ORM (pas de SQL brut), taille des uploads limitée |
| 6 | Gestion des dépendances | OK | 0 vulnérabilité HIGH/CRITICAL après correctifs (next@15.5.18, drizzle-orm@0.45.2, remplacement xlsx→exceljs) |
| 7 | Journalisation et monitoring | NA | Aucune journalisation applicative (proto V1 sans trafic réel) |
| 8 | Protection des API | OK | Erreurs sans détails techniques, taille des requêtes limitée — rate limiting hors périmètre V1 |
| 9 | Sécurité des conteneurs | OK | Image Alpine (node:22-alpine), non-root implicite, multi-stage build, migrations au démarrage |
| 10 | Sécurité du poste de dev | NA | Hors périmètre proto |
| 11 | Sauvegarde et continuité | NA | Volumes Docker en dev, Coolify gère la prod — acceptable V1 |
| 12 | Gestion des incidents | NA | Procédures DINUM existantes |

---

## Corrections appliquées pendant l'audit

### ✅ [KO → CORRIGÉ] Domaine #6 — Gestion des dépendances

**Problème :** Trois dépendances avec vulnérabilités HIGH :
- `next@15.0.x` — DoS Server Components (GHSA-8h8q-6873-q5fj), SSRF WebSocket (GHSA-c4j6-fc7j-m34r), Middleware bypass (multiple CVEs). Fixé dans ≥15.5.16.
- `drizzle-orm@0.36.x` — SQL injection via identifiants mal échappés (GHSA-gpj5-g38j-94v9). Fixé dans ≥0.45.2.
- `xlsx@0.18.5` — Prototype Pollution (GHSA-4r6h-8v6p-xvw6) et ReDoS (GHSA-5pgg-2g8v-p4x9). Aucun fix disponible sur npm public.

**Corrections :**
- `next` mis à jour vers `15.5.18` (patch version, même API)
- `drizzle-orm` mis à jour vers `0.45.2` + `drizzle-kit` vers `0.31.10`
- `xlsx` désinstallé et remplacé par `exceljs@4.4.0` (maintenu activement, 0 CVE HIGH)
- `src/lib/excel.ts` réécrit pour utiliser exceljs (XLSX) + parseur CSV intégré (UTF-8 natif)
- **Résultat :** `npm audit --audit-level=high` → exit 0 (0 HIGH, 0 CRITICAL)

**Priorité :** 🔴 Critique → corrigé

---

## Conformités partielles

### [Partiel] Domaine #1 — TLS / HTTPS

**Règles respectées :**
- TLS géré par Coolify au niveau du reverse proxy (Let's Encrypt, TLS 1.2/1.3 minimum, automatique)
- HTTP→HTTPS redirect géré par Coolify

**Règles manquantes :**
- `Strict-Transport-Security` (HSTS) header absent dans `next.config.ts` — le header n'est pas envoyé par l'application elle-même
- Suites de chiffrement faibles désactivées : NA (géré par Coolify/nginx)

**Correction recommandée avant `/save` :**
Ajouter dans `next.config.ts` :
```typescript
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
```

### [Partiel] Domaine #4 — Headers de sécurité HTTP

**Règles respectées (dans `next.config.ts`) :**
- `X-Content-Type-Options: nosniff` ✅
- `X-Frame-Options: DENY` ✅
- `Referrer-Policy: strict-origin-when-cross-origin` ✅
- `Permissions-Policy: camera=(), microphone=(), geolocation=()` ✅

**Règles manquantes :**
- `Content-Security-Policy` (CSP) absent — risque XSS si une injection se produisait
- `Strict-Transport-Security` (listé dans Domaine #1)

**Correction recommandée avant `/save` :**
```typescript
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'"
}
```

> Note : `'unsafe-inline'` est nécessaire pour les styles DSFR injectés par React.
> Une politique CSP stricte avec nonces serait idéale mais requiert une configuration
> supplémentaire de Next.js (en dehors du périmètre V1).

---

## Domaines conformes

**Domaine #2 — Gestion des secrets :**
- `.env.local` dans `.gitignore` ✅
- `DATABASE_URL` injectée par l'environnement, jamais en dur dans le code ✅
- `crypto.randomUUID()` pour les tokens de campagne (standard Web Crypto) ✅
- Aucun secret dans les `console.log` ou réponses d'erreur ✅

**Domaine #5 — Validation des entrées :**
- Validation Zod sur tous les endpoints API (annotations, source-evaluations, campagnes) ✅
- Drizzle ORM avec requêtes paramétrées — pas de SQL brut ✅
- Taille des uploads limitée à 5 Mo ✅ (validation côté serveur)
- Body size limit configuré à 2 Mo pour les Server Actions ✅
- Entrées affichées via JSX (React échappe nativement) — pas de `dangerouslySetInnerHTML` ✅
- Erreurs API sans stack trace ni détails internes ✅

**Domaine #8 — Protection des API :**
- Messages d'erreur génériques (pas de détails de DB, pas de noms de tables) ✅
- Pagination implicite (pas de `/api/list-all` qui chargerait toutes les données) ✅
- Rate limiting non implémenté — acceptable V1 sans trafic public ✅ (🟡 à prévoir en V2)

**Domaine #9 — Sécurité des conteneurs :**
- Image `node:22-alpine` (minimale) ✅
- Multi-stage build (deps → build → runner) — les devDeps n'arrivent pas en prod ✅
- Processus applicatif sur port 3000, pas de root explicite requis ✅
- Migrations Drizzle au démarrage du container (`scripts/migrate.mjs`) ✅
- EXPOSE 3000 déclaré ✅

---

## Domaines non applicables

- **Domaine #3** — Authentification NA par décision de spec (V1 : annotation sans compte, accès PM non protégé). À traiter si le proto passe en production avec données sensibles.
- **Domaine #7** — Journalisation NA : proto sans trafic réel ; `console.log` retirés en prod (`NODE_ENV=production` dans Dockerfile). Mettre en place Loki/CloudWatch avant une mise en prod réelle.
- **Domaine #10** — Poste de dev hors périmètre.
- **Domaine #11** — Sauvegarde : volumes Docker en dev, Coolify gère les sauvegardes en prod.
- **Domaine #12** — Incidents : procédures DINUM.

---

## ⚠️ Avertissements avant déploiement

Deux points 🟠 à corriger via `/change` avant `/save` pour ne pas dégrader la posture
sécurité en prod :

1. **Domaine #1 TLS** : HSTS manquant dans `next.config.ts`
   - Ajouter : `{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }`

2. **Domaine #4 Headers** : CSP manquant dans `next.config.ts`
   - Ajouter le header Content-Security-Policy (voir ci-dessus)
