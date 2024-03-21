const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());
const PORT = 3000; 

const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'matias',
    database: 'ports'
});

app.post('/addData', (req, res) => { 
  const mac_adresse = req.body.mac_adresse;
  const port = req.body.port;
  
  const queryUse = connection.query('USE db_airlux', (err, result) => {
    if (err) {
        console.error('Erreur lors de l\'ajout de données:', err);
        return res.status(500).send('Erreur lors de l\'ajout de données');
    }
    console.log('Connecté à db_airlux');
  });

  const queryAdd = connection.query('INSERT INTO ports (mac_adresse, port) VALUES (\''+mac_adresse+'\', '+port+');', (err, result) => {
      if (err) {
          console.error('Erreur lors de l\'ajout de données:', err);
          return res.status(500).send('Erreur lors de l\'ajout de données');
      }
      console.log('Données ajoutées avec succès !');
      res.status(200).send('Données ajoutées avec succès !');
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
