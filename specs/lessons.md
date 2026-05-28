# Lessons learned

## 1. DSFR Button with linkProps renders as `<a>` (role=link, not button)

**Contexte** : test Playwright `getByRole("button", { name: /Suivant/i })` ne trouvait pas
le bouton "Suivant" → timeout.

**Cause** : En react-dsfr, un `<Button linkProps={...}>` est rendu en `<a class="fr-btn">`.
Un `<a>` a le rôle ARIA `link`, pas `button`. `getByRole("button")` ne le trouve pas.

**Règle** : Dans les tests Playwright, utiliser `getByRole("link", { name: /Suivant/i })`
pour cibler un Button DSFR qui a `linkProps`. Réserver `getByRole("button")` aux `<Button>`
sans `linkProps` (qui rendent bien un `<button>`).

---

## 2. XLSX lit les CSV en Latin-1 par défaut (pas UTF-8)

**Contexte** : POST `/api/campagnes` avec un CSV contenant `réponse_A` retournait 422 —
la colonne n'était pas reconnue et `responseA` était vide.

**Cause** : `XLSX.read(buffer, { type: "array" })` sur un CSV UTF-8 sans BOM interprète
les octets en Latin-1/CP1252. Les octets UTF-8 de `é` (0xC3 0xA9) deviennent `Ã©`, qui
après normalisation donnent `___` au lieu de `reponse_a`.

**Règle** : Pour les CSV, décoder les octets explicitement en UTF-8 avec `TextDecoder`
avant de passer la chaîne à `XLSX.read(..., { type: "string" })`. Pour les fichiers
binaires Excel (.xlsx = magic PK, .xls = magic 0xD0 0xCF), garder `type: "array"`.
Voir `src/lib/excel.ts` : détection du format par les magic bytes.

---

## 3. Dev server + Chromium = OOM sur VM avec 376 Mo de RAM libre

**Contexte** : `npx playwright test` avec `npm run dev` (webServer) provoquait des crashes
de page ("Target page, context or browser has been closed").

**Cause** : La VM ne dispose que de ~376 Mo de RAM disponible et n'a pas de swap. Le
serveur Next.js en mode dev + la compilation Chromium dépassent la mémoire disponible.

**Règle** : Sur cette VM, toujours configurer Playwright avec `npm start` (build de prod)
comme webServer — jamais `npm run dev`. Lancer `npm run build` avant chaque série de tests.
Voir `playwright.config.ts` : `command: "npm start"`.

---

## 4. DSFR `<Display />` ajoute un `<h1>` permanent dans le DOM

**Contexte** : Tests Playwright ciblant `page.locator("h1")` échouaient car deux `<h1>`
étaient présents sur la page.

**Cause** : Le composant DSFR `<Display />` (panneau de paramètres d'affichage) rend une
modale qui contient son propre `<h1>` dans le DOM, même quand elle est fermée.

**Règle** : Dans tous les tests, cibler `page.locator("main h1")` plutôt que
`page.locator("h1")` pour éviter de sélectionner le `<h1>` de la modale Display.
