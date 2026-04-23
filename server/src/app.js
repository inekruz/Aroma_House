const express = require('express');
const cors = require('cors');

const materialRoutes = require('./routes/materialRoutes');
const materialTypeRoutes = require('./routes/materialTypeRoutes');
const calculationRoutes = require('./routes/calculationRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'API работает.' });
});

app.use('/api/materials', materialRoutes);
app.use('/api/material-types', materialTypeRoutes);
app.use('/api/calculations', calculationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Маршрут не найден.' });
});

module.exports = app;