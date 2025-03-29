# YGG Ratio Discord

## Description

**YGG Ratio Discord** est un projet automatisé permettant de récupérer quotidiennement le ratio YGG Torrent et de le publier sur un webhook Discord. Publication tous les jours à 00h00 AM (minuit).

Ce projet est conçu pour être facilement déployé en tant que conteneur Docker et automatisé à l'aide de GitHub Actions.

---

## Fonctionnalités

- **Récupération automatique des données YGG** via un scraping.
- **Planification quotidienne** des tâches avec `node-schedule`.
- **Notification Discord** via webhook avec des messages dynamiques et colorés.
- **Conteneurisation Docker** pour un déploiement rapide et isolé.
- **Workflow GitHub Actions** pour automatiser la construction et la publication d'images Docker.

---

## Prérequis

- **Node.js** : Version 18 ou supérieure.
- **Docker** : Pour exécuter le projet en conteneur.
- **GitHub Actions** : Pour l'automatisation des builds (optionnel).

---

## Installation

### 1. Cloner le dépôt
```
git clone https://github.com/fazetitans/ygg-ratio-discord.git
cd ygg-ratio-discord
```

### 2. Installer les dépendances
```
npm install
```

### 3. Configuration
Ajoutez un fichier `.env` à la racine pour gérer les variables sensibles :

- `YGG_URL` (requis) :
  - URL de la page YGG à scraper pour récupérer le ratio.
- `YGG_COOKIE` (requis) :
  - Cookie de session YGG pour accéder aux données du compte.
- `DISCORD_WEBHOOK` (requis) :
  - Webhook Discord où les messages doivent être envoyés.
- `USER_AGENT` (optionnel) :
  - User-Agent à utiliser pour la requête HTTP (par défaut : `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36`).
- `RUN_ON_STARTUP` (optionnel) : 
  - Si définie sur `true`, le script s'exécutera immédiatement après le démarrage (utile pour les tests).
  - Valeur par défaut : `false`.

#### Exemple :
```
YGG_URL=https://www.yggtorrent.com/
YGG_COOKIE=cf_clearance=2gv4...
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...
```

---

## Utilisation

### Exécuter localement
Pour exécuter le script manuellement :
```
npm run start
```

---

## Docker

### Construction de l'image Docker
```
docker build -t ygg-ratio-discord .
```

### Exécution du conteneur
```
docker run -d \
  --name ygg-ratio \
  -e YGG_URL="https://www.yggtorrent.com/" \
  -e YGG_COOKIE="cf_clearance=2gv4..." \
  -e DISCORD_WEBHOOK="https://discord.com/api/webhooks/..." \
  ygg-ratio-discord
```

---

## Automatisation avec GitHub Actions

Ce projet inclut un workflow GitHub Actions pour automatiser la construction et la publication d'images Docker.

### 1. Configuration des Secrets GitHub
Ajoutez les variables suivantes dans **Settings > Secrets and variables > Actions** :
- `DOCKER_USERNAME` : Votre nom d'utilisateur Docker Hub.
- `DOCKER_PASSWORD` : Le token généré sur Docker Hub.

### 2. Workflow de publication
Chaque fois qu'un nouveau **tag** est poussé au format `vMAJOR.MINOR.PATCH`, GitHub Actions :
- Construit une nouvelle image Docker.
- Publie l'image sur Docker Hub avec les tags `latest` et `vMAJOR.MINOR.PATCH`.

---

## Contribuer

1. Forkez ce dépôt.
2. Créez une branche pour vos modifications.
3. Envoyez un pull request avec une description détaillée.

---

## Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

---

## Auteurs

- **Axel DA SILVA (FaZeTitans)** - Développeur principal
- Contact : [contact@fazetitans.fr](mailto:contact@fazetitans.fr)

---

## Aperçu des Notifications Discord

Les notifications envoyées au webhook Discord incluent (chaque jour à 12h00 PM) :
- **Ratio** et **Status du compte** YGG Torrent (vert ou rouge).
- **Date** de la récupération.
- **Upload** et **Download**
- **Gap** (en Go) entre le nombre de Go téléchargés et le nombre de Go uploadés (estimation en fonction des Go affichés sur le site YGG).

---

## Exemple d'Image Docker

Pour télécharger l'image Docker publiée :
```
docker pull fazetitans/ygg-ratio-discord:latest
```

---
