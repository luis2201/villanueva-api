const pageRepo = require('../repositories/page.repo');
const { audit } = require('./audit.service');

// Convierte un texto en un slug amigable para URLs
const slugify = (text) =>
  text.toString().trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');

// Lista todas las páginas
const listPages = async () => pageRepo.list();

// Obtiene una página por su ID
const getPage = async (id) => pageRepo.findById(id);

// Crea una nueva página
const createPage = async (req, { title, slug, seo_title, seo_description }) => {
  if (!title) throw new Error('title es requerido');

  const finalSlug = slugify(slug || title);

  const id = await pageRepo.create({
    title,
    slug: finalSlug,
    seo_title,
    seo_description,
    created_by: req.user.id
  });

  const after = await pageRepo.findById(id);

  await audit(req, {
    action: 'CREATE',
    entity_type: 'page',
    entity_id: id,
    before_data: null,
    after_data: after
  });

  return { id, title, slug: finalSlug, status: 'draft' };
};

// Actualiza una página existente
const updatePage = async (req, id, payload) => {
  const allowedStatus = ['draft', 'review', 'published', 'archived'];
  if (payload.status && !allowedStatus.includes(payload.status)) {
    throw new Error('status inválido');
  }

  const before = await pageRepo.findById(id);
  if (!before) return null;

  const affected = await pageRepo.update(id, { ...payload, updated_by: req.user.id });
  if (!affected) return null;

  const after = await pageRepo.findById(id);

  await audit(req, {
    action: 'UPDATE',
    entity_type: 'page',
    entity_id: id,
    before_data: before,
    after_data: after
  });

  return true;
};

// Elimina (soft delete) una página
const deletePage = async (req, id) => {
  const before = await pageRepo.findById(id);
  if (!before) return null;

  const affected = await pageRepo.softDelete(id, req.user.id);
  if (!affected) return null;

  await audit(req, {
    action: 'DELETE',
    entity_type: 'page',
    entity_id: id,
    before_data: before,
    after_data: null
  });

  return true;
};

module.exports = { listPages, getPage, createPage, updatePage, deletePage };
