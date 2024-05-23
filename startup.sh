#!/bin/bash
echo 'Début récupération port'
# Récupérer l'adresse MAC (exemple basique, pourrait nécessiter adaptation)
MAC_ADDR=$(ip link show eth0 | awk '/ether/ {print $2}')
echo "$MAC_ADDR"
# Récupérer la clé SSH publique
SSH_KEY=$(cat /root/.ssh/id_rsa.pub)
POST_DATA="{
    \"mac_adresse\": \"$MAC_ADDR\",
    \"shh_pub_key\": \"$SSH_KEY\"
}"
echo "$POST_DATA"
# Appel API avec curl
PORT=$(curl -X GET http://172.22.0.8:5000/port \
    -H "Content-Type: application/json" \
    -d "$POST_DATA" \
    -s)

echo "$PORT"
# Récupérer l'adresse IP du conteneur
container_ip=$(hostname -i)
echo $container_ip
#ssh -R 10022:localhost:22 root@serveur
#ssh -R "$PORT:localhost:80" user@172.22.0.7
echo 'Fin récupération port '
nginx -g 'daemon off;'

