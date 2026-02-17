const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');

// Ruta de prueba (solo ADMIN y EDITOR)
router.get('/me', auth, allowRoles(['ADMIN', 'EDITOR', 'PUBLISHER', 'VIEWER']), (req, res) => {
  res.json({ user: req.user });
});

router.get('/pages', auth, allowRoles(['ADMIN', 'EDITOR', 'PUBLISHER']), require('../controllers/pages.controller').list);
router.get('/pages/:id', auth, allowRoles(['ADMIN', 'EDITOR', 'PUBLISHER']), require('../controllers/pages.controller').getById);
router.post('/pages', auth, allowRoles(['ADMIN', 'EDITOR']), require('../controllers/pages.controller').create);
router.put('/pages/:id', auth, allowRoles(['ADMIN', 'EDITOR']), require('../controllers/pages.controller').update);
router.delete('/pages/:id', auth, allowRoles(['ADMIN']), require('../controllers/pages.controller').remove);

module.exports = router;
