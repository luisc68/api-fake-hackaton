const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.get('/api/player/:playerId/:field?', (req, res) => {
  const playerId = parseInt(req.params.playerId);
  const field = req.params.field;

  if (!playerId) {
    res.status(400).json({ error: 'Parámetro playerId requerido' });
    return;
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo JSON' });
      return;
    }

    const jsonData = JSON.parse(data);
    const playerData = jsonData.find(item => item.playerId === playerId);

    if (!playerData) {
      res.status(404).json({ error: 'No se encontraron datos para el playerId especificado' });
      return;
    }

    if (!field) {
      res.json(playerData);
    } else {
      const fieldValue = playerData[field];
      if (fieldValue === undefined) {
        res.status(404).json({ error: 'Campo especificado no encontrado' });
      } else {
        res.json({ [field]: fieldValue });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
