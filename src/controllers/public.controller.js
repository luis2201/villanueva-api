const pageRepo = require('../repositories/page.repo');
const sectionRepo = require('../repositories/section.repo');

// Controlador para manejar las solicitudes públicas relacionadas con las páginas y secciones
// Este controlador se encarga de mostrar solo el contenido publicado, sin requerir autenticación
const getPageBySlug = async (req, res) => {
  const page = await pageRepo.findBySlugPublished(req.params.slug);
  if (!page) return res.status(404).json({ message: 'Página no encontrada' });

  const sections = await sectionRepo.listByPageId(page.id);

  // En público, típicamente solo se muestran secciones publicadas
  const publishedSections = sections.filter(s => s.status === 'published');

  res.json({ page, sections: publishedSections });
};

module.exports = { getPageBySlug };
