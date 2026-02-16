require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

/* Login */
const authRoutes = require('./routes/auth.routes');
/* Admin */
const adminRoutes = require('./routes/admin.routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

/* Health Check Endpoint para verificar si la API está viva y respondiendo */
app.get('/health', async (_, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'down' });
  }
});

/* Rutas Auth */
app.use('/api/auth', authRoutes);
/* Rutas Admin */
app.use('/api/admin', adminRoutes);

module.exports = app;
