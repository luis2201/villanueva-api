const express = require('express');
const router = express.Router();

// Rutas para administración de páginas (CRUD)
const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const pageController = require('../controllers/page.controller');

// lectura (todos autenticados)
router.get('/', auth, allowRoles(['ADMIN','EDITOR','PUBLISHER','VIEWER']), pageController.list);
router.get('/:id', auth, allowRoles(['ADMIN','EDITOR','PUBLISHER','VIEWER']), pageController.getById);

// escritura
router.post('/', auth, allowRoles(['ADMIN','EDITOR','PUBLISHER']), pageController.create);
router.put('/:id', auth, allowRoles(['ADMIN','EDITOR']), pageController.update);
router.delete('/:id', auth, allowRoles(['ADMIN']), pageController.remove);

module.exports = router;
