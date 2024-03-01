# Utiliser une image de base compatible avec l'architecture ARM
FROM arm32v7/ubuntu:latest

# Mettre à jour les paquets, installer NGINX et SSH
RUN apt-get update && apt-get install -y nginx openssh-server

# Supprimer le fichier de configuration NGINX par défaut et les fichiers de site par défaut
RUN rm /etc/nginx/sites-enabled/default && rm -rf /var/www/html/*

# Exposer les ports 80 pour le trafic HTTP et 22 pour le trafic SSH
EXPOSE 80
EXPOSE 22

# Utiliser une variable d'argument pour spécifier le dossier contenant la configuration spécifique au Pi
ARG pi_folder

# Copier le fichier de configuration NGINX personnalisé dans le conteneur
#COPY ./docker-raspberry-nginx/nginx/${pi_folder}/default.conf /etc/nginx/conf.d/default.conf

# Copier le contenu du site web dans le conteneur
COPY nginx/${pi_folder}/index.html /var/www/html/

# Copier les clés SSH dans le conteneur
COPY ssh-keys/* /root/.ssh/

# Réglage des permissions des clés SSH
RUN chmod 600 /root/.ssh/*

# Copiez le script de démarrage dans l'image
COPY startup.sh /startup.sh

# Rendez le script exécutable
RUN chmod +x startup.sh

# Lancer NGINX en premier plan
CMD ["startup.sh","nginx", "-g", "daemon off;"]