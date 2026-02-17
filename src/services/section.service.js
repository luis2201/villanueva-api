const sectionRepo = require('../repositories/section.repo');
const pageRepo = require('../repositories/page.repo');
const { audit } = require('./audit.service');

const ALLOWED_TYPES = ['hero', 'cards', 'text_image', 'features', 'news'];
const ALLOWED_STATUS = ['draft', 'published'];

// Valida los campos de una sección. Lanza error si algo no es válido
const validateSection = ({ section_type, status, config }) => {
  if (section_type && !ALLOWED_TYPES.includes(section_type)) {
    throw new Error('section_type inválido');
  }
  if (status && !ALLOWED_STATUS.includes(status)) {
    throw new Error('status inválido');
  }
  if (config && typeof config !== 'object') {
    throw new Error('config debe ser un objeto JSON');
  }
};

// Lista las secciones de una página, ordenadas por order_index
const listSections = async (pageId) => {
  const page = await pageRepo.findById(pageId);
  if (!page) return null;
  return sectionRepo.listByPageId(pageId);
};

// Crea una nueva sección para una página. Si no se especifica order_index, se asigna al final
const createSection = async (req, pageId, payload) => {
  const { section_type, order_index, config, status } = payload;

  validateSection({ section_type, status, config });

  const page = await pageRepo.findById(pageId);
  if (!page) return null;

  // Si no se especifica order_index, asignamos el siguiente índice disponible (al final)
  const existing = await sectionRepo.listByPageId(pageId);
  const nextIndex = Number.isInteger(order_index) ? order_index : (existing.length ? existing[existing.length - 1].order_index + 1 : 0);

  const id = await sectionRepo.create({
    page_id: pageId,
    section_type,
    order_index: nextIndex,
    config: config || {},
    status: status || 'draft'
  });

  const after = await sectionRepo.findById(id);

  await audit(req, {
    action: 'CREATE',
    entity_type: 'page_section',
    entity_id: id,
    before_data: null,
    after_data: after
  });

  return after;
};

// Actualiza una sección existente. Solo se actualizan los campos que se proporcionen (no nulos)
const updateSection = async (req, sectionId, payload) => {
  const { order_index, config, status } = payload;
  validateSection({ status, config });

  const before = await sectionRepo.findById(sectionId);
  if (!before) return null;

  const affected = await sectionRepo.update(sectionId, { order_index, config, status });
  if (!affected) return null;

  const after = await sectionRepo.findById(sectionId);

  await audit(req, {
    action: 'UPDATE',
    entity_type: 'page_section',
    entity_id: sectionId,
    before_data: before,
    after_data: after
  });

  return after;
};

// Elimina una sección por su ID
const deleteSection = async (req, sectionId) => {
  const before = await sectionRepo.findById(sectionId);
  if (!before) return null;

  const affected = await sectionRepo.remove(sectionId);
  if (!affected) return null;

  await audit(req, {
    action: 'DELETE',
    entity_type: 'page_section',
    entity_id: sectionId,
    before_data: before,
    after_data: null
  });

  return true;
};

// Reordena las secciones de una página. Recibe un array con los IDs y sus nuevos índices
const reorderSections = async (req, pageId, items) => {
  // items: [{id, order_index}]
  if (!Array.isArray(items)) throw new Error('items debe ser un array');

  for (const it of items) {
    if (!it || !Number.isInteger(it.id) || !Number.isInteger(it.order_index)) {
      throw new Error('Formato inválido: cada item requiere id y order_index (int)');
    }
  }

  const before = await sectionRepo.listByPageId(pageId);
  const affected = await sectionRepo.reorder(pageId, items);
  const after = await sectionRepo.listByPageId(pageId);

  await audit(req, {
    action: 'REORDER',
    entity_type: 'page_section',
    entity_id: Number(pageId),
    before_data: before,
    after_data: after
  });

  return affected;
};

module.exports = { listSections, createSection, updateSection, deleteSection, reorderSections };
