const express = require('express');
const app = express();
const portfinder = require('portfinder');
const mysql = require('mysql');
const axios = require('axios');

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'matias',
  database: 'db_airlux'
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/port', async (req, res) => {
  const mac_adresse = req.body.mac_adresse;
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
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    res.status(500).send('Erreur lors de l\'exécution de la requête SQL');
  }
});

app.listen(5000, () => console.log('Server is up and running'));