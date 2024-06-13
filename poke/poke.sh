#!/bin/sh

INFLUXDB_URL="http://influxdb:8086/api/v2/write?org=my-org&bucket=my-bucket&precision=s"
TOKEN="my-secret-token"
HOST="host1"

while true; do
  TIMESTAMP=$(date +%s)
  
  # Générer des valeurs aléatoires pour les capteurs
  SENSOR1=$(awk -v min=20 -v max=30 'BEGIN{srand(); print min+rand()*(max-min+1)}')
  SENSOR2=$(awk -v min=50 -v max=60 'BEGIN{srand(); print min+rand()*(max-min+1)}')
  SENSOR3=$(awk -v min=70 -v max=80 'BEGIN{srand(); print min+rand()*(max-min+1)}')
  
  # Créer la chaîne de données pour InfluxDB
  DATA="measurement,host=$HOST sensor1=$SENSOR1,sensor2=$SENSOR2,sensor3=$SENSOR3 $TIMESTAMP"
  
  # Envoyer les données à InfluxDB
  curl -i -XPOST "$INFLUXDB_URL" --header "Authorization: Token $TOKEN" --data-raw "$DATA"
  
  # Pause de 1 seconde avant la prochaine mesure
  sleep 1
done
