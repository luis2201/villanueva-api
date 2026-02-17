const sectionService = require('../services/section.service');

// Controlador para manejar las secciones de una página
const listByPage = async (req, res) => {
  const rows = await sectionService.listSections(req.params.pageId);
  if (!rows) return res.status(404).json({ message: 'Página no encontrada' });
  res.json(rows);
};

// Crea una nueva sección para una página
const createForPage = async (req, res) => {
  try {
    const created = await sectionService.createSection(req, req.params.pageId, req.body);
    if (!created) return res.status(404).json({ message: 'Página no encontrada' });
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Actualiza una sección existente. Solo se actualizan los campos que se proporcionen (no nulos)
const update = async (req, res) => {
  try {
    const updated = await sectionService.updateSection(req, req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Sección no encontrada' });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// Elimina una sección por su ID
const remove = async (req, res) => {
  const ok = await sectionService.deleteSection(req, req.params.id);
  if (!ok) return res.status(404).json({ message: 'Sección no encontrada' });
  res.json({ message: 'Sección eliminada' });
};

// Reordena las secciones de una página. Recibe un array con los IDs y sus nuevos índices
const reorder = async (req, res) => {
  try {
    const affected = await sectionService.reorderSections(req, req.params.pageId, req.body.items);
    res.json({ affected });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { listByPage, createForPage, update, remove, reorder };
