# Standards beta.gouv.fr

## Référence

Standards complets : https://standards.incubateur.net/

## Standards applicables aux prototypes

### Open source
- Le code est public sur GitHub (par défaut dans l'org
  betagouv-experimentations)
- Licence MIT (fichier LICENSE à la racine)

### 12 facteurs
- Configuration par variables d'environnement
- Pas de dépendance à un état local (stateless)
- Le même code tourne en dev et en prod (Docker)

### Accessibilité
- DSFR obligatoire
- RGAA : respecter la checklist dans docs/guidelines/rgaa.md
- Déclaration d'accessibilité sur /accessibilite

### Données personnelles
- Minimisation : ne collecter que ce qui est nécessaire
- Politique de confidentialité sur /donnees-personnelles
- Pas de tracking tiers (pas de Google Analytics — utiliser Matomo
  si besoin de stats)

### Langage
- Langage clair et direct, sans jargon administratif
- Vouvoiement par défaut
- Écriture inclusive recommandée (point médian : ·)

### Pages obligatoires
- /mentions-legales
- /accessibilite
- /donnees-personnelles
- /stats (quand il y a des métriques d'impact à montrer)

### Éco-conception
- Prioriser les fonctionnalités les plus simples possible
- Pas de fonctionnalité "au cas où"
- Pas de chatbot si une FAQ suffit
- Pas de dark patterns
