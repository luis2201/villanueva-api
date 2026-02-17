const pageRepo = require('../repositories/page.repo');

// Función para convertir un texto a slug, eliminando espacios y caracteres especiales
const slugify = (text) =>
  text.toString().trim().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');

// Funciones del servicio de páginas, que se encargan de la lógica de negocio y validaciones antes de llamar al repositorio
const listPages = async () => pageRepo.list();

// Obtener una página por ID, si no se encuentra devuelve null
const getPage = async (id) => pageRepo.findById(id);

// Crear una nueva página, validando el título y generando un slug si no se proporciona
const createPage = async ({ title, slug, seo_title, seo_description, userId }) => {
  if (!title) throw new Error('title es requerido');
  const finalSlug = slugify(slug || title);

  const id = await pageRepo.create({
    title,
    slug: finalSlug,
    seo_title,
    seo_description,
    created_by: userId
  });

  return { id, title, slug: finalSlug, status: 'draft' };
};

// Actualizar una página existente, validando el status y generando un slug si se actualiza el título
const updatePage = async (id, payload, userId) => {
  const allowedStatus = ['draft', 'review', 'published', 'archived'];
  if (payload.status && !allowedStatus.includes(payload.status)) {
    throw new Error('status inválido');
  }

  const affected = await pageRepo.update(id, { ...payload, updated_by: userId });
  if (!affected) return null;
  return true;
};

// Eliminar una página (soft delete), si no se encuentra devuelve null
const deletePage = async (id, userId) => {
  const affected = await pageRepo.softDelete(id, userId);
  if (!affected) return null;
  return true;
};

module.exports = { listPages, getPage, createPage, updatePage, deletePage };
