# Utiliser une image officielle de Node.js
FROM node:23-slim

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exécuter le script au démarrage du conteneur
CMD ["node", "main.js"]

# Exemple pour documenter la variable d'environnement
ENV YGG_URL="<URL YGG>"
ENV YGG_COOKIE="<Cookie de connexion YGG>"
ENV USER_AGENT="<User Agent>"
ENV DISCORD_WEBHOOK="<Webhook Discord>"
ENV RUN_ON_STARTUP="false"