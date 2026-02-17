const pageService = require('../services/page.service');

// Controladores para manejar las rutas relacionadas con páginas
const list = async (req, res) => {
  const rows = await pageService.listPages();
  res.json(rows);
};

// Obtiene una página por su ID
const getById = async (req, res) => {
  const page = await pageService.getPage(req.params.id);
  if (!page) return res.status(404).json({ message: 'Página no encontrada' });
  res.json(page);
};

// Crea una nueva página
const create = async (req, res) => {
  try {
    const created = await pageService.createPage(req, req.body);
    res.status(201).json(created);
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'slug ya existe, usa otro' });
    res.status(400).json({ message: e.message });
  }
};

// Actualiza una página existente
const update = async (req, res) => {
  try {
    const ok = await pageService.updatePage(req, req.params.id, req.body);
    if (!ok) return res.status(404).json({ message: 'Página no encontrada' });
    res.json({ message: 'Página actualizada' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'slug ya existe, usa otro' });
    res.status(400).json({ message: e.message });
  }
};

// Elimina (soft delete) una página
const remove = async (req, res) => {
  const ok = await pageService.deletePage(req, req.params.id);
  if (!ok) return res.status(404).json({ message: 'Página no encontrada' });
  res.json({ message: 'Página eliminada (soft delete)' });
};

module.exports = { list, getById, create, update, remove };
