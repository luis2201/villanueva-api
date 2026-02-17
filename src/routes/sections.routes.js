const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const sectionController = require('../controllers/section.controller');

// Secciones por página
router.get('/pages/:pageId/sections', auth, allowRoles(['ADMIN','EDITOR','PUBLISHER','VIEWER']), sectionController.listByPage);

// Crear / reordenar (solo ADMIN/EDITOR)
router.post('/pages/:pageId/sections', auth, allowRoles(['ADMIN','EDITOR']), sectionController.createForPage);
router.patch('/pages/:pageId/sections/reorder', auth, allowRoles(['ADMIN','EDITOR']), sectionController.reorder);

// Update (ADMIN/EDITOR)
router.put('/sections/:id', auth, allowRoles(['ADMIN','EDITOR']), sectionController.update);

// Delete (solo ADMIN)
router.delete('/sections/:id', auth, allowRoles(['ADMIN']), sectionController.remove);

module.exports = router;
