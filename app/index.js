const express = require('express');
const app = express();
const portfinder = require('portfinder');
const mysql = require('mysql');
const axios = require('axios');
const { exec } = require('child_process');

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'matias',
  database: 'db_airlux'
});

app.use(express.json());

app.get('/', (req, res) => {

  const queryUse = connection.query('USE db_airlux', (err, result) => {
    if (err) {
        console.error('Erreur lors de l\'ajout de données:', err);
        return res.status(500).send('Erreur lors de l\'ajout de données');
    }
    console.log('Connecté à db_airlux');
  });

  const querySelect = connection.query('SELECT * FROM ports ', async (err, result) => {
    message = 'Heeeello <br>';
    result.forEach(element => {
      message += 'Mac_adresse : '+ element.mac_adresse +' -> Link : http://localhost:' + element.port + '<br>';
    });
    res.status(200).send(message)
  });
});

app.get('/port', async (req, res) => {
  const mac_adresse = req.body.mac_adresse;
  const shh_pub_key = req.body.ssh_pub;
  console.log("Mac adresse");
  console.log(mac_adresse);
  console.log("Mac adresse");
  const queryUse = connection.query('USE db_airlux', (err, result) => {
    if (err) {
        console.error('Erreur lors de l\'ajout de données:', err);
        return res.status(500).send('Erreur lors de l\'ajout de données');
    }
    console.log('Connecté à db_airlux');
  });

  try {
    // Vérifier si l'adresse MAC a déjà un port attribué
    const querySelect = connection.query('SELECT port FROM ports WHERE mac_adresse = ?', [mac_adresse], async (err, result) => {
      if (err) {
        console.error('Erreur lors de la recherche en base de données:', err);
        return res.status(500).send('Erreur lors de la recherche en base de données');
      } else {
        if (result.length > 0) { // Vérifier si un port a été trouvé
          return res.status(200).send(result[0]);
        } else {
          // Si pas de port attribué, demander au serveur
          try {
            const port = await portfinder.getPortPromise();
            if (typeof port === 'number' && Number.isInteger(port) && port > 0 && port <= 65535) {
              // Vérifie si le port est un nombre entier positif dans la plage des ports valides
              
              const queryAdd = connection.query('INSERT INTO ports (mac_adresse, port) VALUES (?, ?)', [mac_adresse, port], (err, result) => {
                if (err) {
                  console.error('Erreur lors de l\'ajout de données:', err);
                  return res.status(500).send('Erreur lors de l\'ajout de données');
                }
                console.log('Données ajoutées avec succès !');
              });
              
              res.status(200).json({"port" : port.toString()});
            } else {
              res.status(500).send('Port invalide obtenu');
            }
          } catch (err) {
            console.error('Erreur lors de la recherche de port :', err);
            res.status(500).send('Erreur lors de la recherche de port');
          }
          try {
            //TODO appel scripts ajout clé ssh ICI
            // Clé SSH en tant qu'argument
            //const sshKey = 'ssh-rsa VOTRE_CLÉ_PUBLIQUE';
            // Commande pour exécuter le script authorizer.sh avec la clé SSH comme argument
            const command = `sh authorizer.sh ${shh_pub_key}`;
            // Exécution de la commande
            exec(command, (error, stdout, stderr) => {
              if (error) {
                console.error(`Erreur lors de l'exécution de la commande ssh-key : ${error}`);
                return;
              }
              console.log(`Sortie standard : ${stdout}`);
              console.error(`Sortie d'erreur : ${stderr}`);
            });
            
          } catch (err) {
            console.error('Erreur lors de l\'exécution de la commande ssh-key 2 :', err);
            res.status(500).send('Erreur lors de la recherche de port');
            
          }
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    res.status(500).send('Erreur lors de l\'exécution de la requête SQL');
  }
});

app.listen(5000, () => console.log('Server is up and running'));