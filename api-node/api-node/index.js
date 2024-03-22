const express = require('express');
const mysql = require('mysql');
const axios = require('axios');

const app = express();
app.use(express.json());
const PORT = 3000; 

const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'matias',
    database: 'db_airlux'
});

app.post('/getPort', async (req, res) => {
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
    const querySelect = connection.query('SELECT port FROM ports WHERE mac_adresse = ?', [mac_adresse], (err, result) => {
      if (err) {
        console.error('Erreur lors de la recherche en base de données:', err);
        return res.status(500).send('Erreur lors de la recherche en base de données');
      } else {
        if (result.length > 0) { // Vérifier si un port a été trouvé
          return res.status(200).send(result[0]);
        } else {
          // Si pas de port attribué, demander au serveur
          const apiUrl = 'http://nodeserver:5000/port';
          axios.get(apiUrl)
            .then(response => {
              const newPort = response.data.port;
              // Ajouter l'adresse MAC et le port dans la base de données
              const queryAdd = connection.query('INSERT INTO ports (mac_adresse, port) VALUES (?, ?)', [mac_adresse, newPort], (err, result) => {
                if (err) {
                  console.error('Erreur lors de l\'ajout de données:', err);
                  return res.status(500).send('Erreur lors de l\'ajout de données');
                }
                console.log('Données ajoutées avec succès !');
              });
              // Renvoyer le nouveau port
              res.status(200).send({"port" : newPort});
            })
            .catch(error => {
              console.error('Erreur lors de l\'appel à l\'API externe :', error);
              res.status(500). b({ error: 'Erreur lors de l\'appel à l\'API externe' });
            });
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la requête SQL :', error);
    res.status(500).send('Erreur lors de l\'exécution de la requête SQL');
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
