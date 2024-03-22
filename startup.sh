#!/bin/bash
echo 'Début récupération port'
# Faites un appel API pour obtenir le port (remplacez l'URL par votre API)
#PORT=$(wget http://172.19.0.2:3000/GetPort)
#echo "$PORT"
# Récupérer l'adresse IP du conteneur
container_ip=$(hostname -i)
echo $container_ip
ssh -R 10022:localhost:22 root@serveur
#ssh -R "$PORT:localhost:80" user@172.22.0.7
echo 'Fin récupération port '
nginx -g 'daemon off;'

