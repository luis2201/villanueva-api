const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Ruta de prueba (solo ADMIN y EDITOR)
router.get('/me', auth, allowRoles(['ADMIN', 'EDITOR', 'PUBLISHER', 'VIEWER']), (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
