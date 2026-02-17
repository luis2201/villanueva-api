const express = require('express');
const router = express.Router();

// Rutas para administración de páginas
const pagesRoutes = require('./pages.routes');
const sectionsRoutes = require('./sections.routes');

// aquí iremos agregando más módulos luego: posts, menus, media, etc.
router.use('/pages', pagesRoutes);

// Rutas para secciones de páginas
router.use('/sections', sectionsRoutes);

module.exports = router;
