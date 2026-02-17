const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Rutas públicas para acceder a páginas y secciones sin autenticación
router.get('/pages/:slug', publicController.getPageBySlug);

module.exports = router;
