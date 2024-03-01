const express = require('express');
const path = require('path');
const app = express();

// Définir le répertoire des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));
