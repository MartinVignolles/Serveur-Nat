const express = require('express');
const app = express();
const portfinder = require('portfinder');
const mysql = require('mysql');
const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'matias',
  database: 'db_airlux'
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté en tant que ID ' + connection.threadId);
});

//app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  connection.query('SELECT * FROM ports ', async (err, result) => {
    message = 'Heeeello <br>';
    fs.readFile(path.join(__dirname, 'public', 'accueil.html'), 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error reading index.html');
        return;
      }

      // Injecter le message dans le contenu du fichier HTML
      const updatedData = data.replace('<!-- Injected Content -->', message);
      res.status(200).send(updatedData);
    });
  });
});

app.get('/port', async (req, res) => {
  const mac_adresse = req.body.mac_adresse;
  const shh_pub_key = req.body.ssh_pub;
  console.log("Mac adresse");
  console.log(mac_adresse);
  console.log("Mac adresse");

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