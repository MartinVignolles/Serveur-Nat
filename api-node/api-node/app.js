const express = require('express');

// Initialisation de l'application Express
const app = express();
app.use(express.json());
const PORT = 3000; 

// Route pour obtenir un port disponible
app.get('/GetPort', (req, res) => {
    const port = 3000;
    if (port !== null) {
        res.json({ port });
    } else {
        res.status(500).json({ error: 'Aucun port disponible.' });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});