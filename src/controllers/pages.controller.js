const pageService = require('../services/page.service');

// Controladores para manejar las rutas de páginas, utilizando el servicio de páginas para la lógica de negocio
const list = async (req, res) => {
  const rows = await pageService.listPages();
  res.json(rows);
};

// Obtener una página por ID, si no se encuentra devuelve 404
const getById = async (req, res) => {
  const page = await pageService.getPage(req.params.id);
  if (!page) return res.status(404).json({ message: 'Página no encontrada' });
  res.json(page);
};

// Crear una nueva página, validando el título y manejando errores de slug duplicado
const create = async (req, res) => {
  try {
    const created = await pageService.createPage({ ...req.body, userId: req.user.id });
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'slug ya existe, usa otro' });
    res.status(400).json({ message: e.message });
  }
};

// Actualizar una página existente, validando el status y manejando errores de slug duplicado
const update = async (req, res) => {
  try {
    const ok = await pageService.updatePage(req.params.id, req.body, req.user.id);
    if (!ok) return res.status(404).json({ message: 'Página no encontrada' });
    res.json({ message: 'Página actualizada' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'slug ya existe, usa otro' });
    res.status(400).json({ message: e.message });
  }
};

// Eliminar una página (soft delete), si no se encuentra devuelve 404
const remove = async (req, res) => {
  const ok = await pageService.deletePage(req.params.id, req.user.id);
  if (!ok) return res.status(404).json({ message: 'Página no encontrada' });
  res.json({ message: 'Página eliminada (soft delete)' });
};

module.exports = { list, getById, create, update, remove };
