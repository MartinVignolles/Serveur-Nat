#!/bin/bash

# Faites un appel API pour obtenir le port (remplacez l'URL par votre API)
#PORT=$(curl -s http://exemple-api.com/api/port)

# Établissez une connexion SSH inversée en utilisant le port obtenu
#ssh -R "${PORT}":localhost:80 user@172.17.0.5
echo 'jesuisla'
nginx -g 'daemon off;'
