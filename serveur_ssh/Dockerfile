# Utilisez une image de base appropriée
FROM ubuntu:latest

# Mise à jour des paquets et installation de SSH
RUN apt-get update && apt-get install -y openssh-server

# Création du répertoire manquant pour SSH
RUN mkdir /run/sshd

# Création d'un utilisateur pour SSH
RUN useradd -rm -d /home/user -s /bin/bash -g root -G sudo -u 1000 user
RUN echo 'user:password' | chpasswd

# Exécutez le serveur SSH lors du démarrage du conteneur
CMD ["/usr/sbin/sshd", "-D"]
