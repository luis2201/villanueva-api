const express = require('express');
const router = express.Router();

const pagesRoutes = require('./pages.routes');

// aquí iremos agregando más módulos luego: posts, menus, media, etc.
router.use('/pages', pagesRoutes);

module.exports = router;
