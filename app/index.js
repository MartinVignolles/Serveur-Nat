const express = require('express');
const app = express();
const portfinder = require('portfinder');

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/port', async (req, res) => {
  try {
    const port = await portfinder.getPortPromise();
    if (typeof port === 'number' && Number.isInteger(port) && port > 0 && port <= 65535) {
      // Vérifie si le port est un nombre entier positif dans la plage des ports valides
      res.status(200).json({"port" : port.toString()});
    } else {
      res.status(500).send('Port invalide obtenu');
    }
  } catch (err) {
    console.error('Erreur lors de la recherche de port :', err);
    res.status(500).send('Erreur lors de la recherche de port');
  }
});

app.listen(5000, () => console.log('Server is up and running'));
