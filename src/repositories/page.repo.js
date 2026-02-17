const pool = require('../config/database');

// Funciones relacionadas con las páginas, como listar, obtener por ID, crear, actualizar y eliminar (soft delete)
const list = async () => {
  const [rows] = await pool.query(
    `SELECT id, title, slug, status, published_at, created_at, updated_at
     FROM pages
     WHERE deleted_at IS NULL
     ORDER BY updated_at DESC`
  );
  return rows;
};

// Obtener una página por ID, si no se encuentra devuelve null
const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, title, slug, status, seo_title, seo_description, published_at, created_at, updated_at
     FROM pages
     WHERE id = ? AND deleted_at IS NULL
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

// Crear una nueva página, validando el título y generando un slug si no se proporciona
const create = async ({ title, slug, seo_title, seo_description, created_by }) => {
  const [result] = await pool.query(
    `INSERT INTO pages (title, slug, status, seo_title, seo_description, created_by)
     VALUES (?, ?, 'draft', ?, ?, ?)`,
    [title, slug, seo_title || null, seo_description || null, created_by]
  );
  return result.insertId;
};

// Actualizar una página existente, validando el status y generando un slug si se actualiza el título
const update = async (id, { title, slug, status, seo_title, seo_description, updated_by }) => {
  const [result] = await pool.query(
    `UPDATE pages
     SET title = COALESCE(?, title),
         slug = COALESCE(?, slug),
         status = COALESCE(?, status),
         seo_title = COALESCE(?, seo_title),
         seo_description = COALESCE(?, seo_description),
         updated_by = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND deleted_at IS NULL`,
    [title || null, slug || null, status || null, seo_title || null, seo_description || null, updated_by, id]
  );
  return result.affectedRows;
};

// Eliminar una página (soft delete), si no se encuentra devuelve null
const softDelete = async (id, updated_by) => {
  const [result] = await pool.query(
    `UPDATE pages
     SET deleted_at = CURRENT_TIMESTAMP, updated_by = ?
     WHERE id = ? AND deleted_at IS NULL`,
    [updated_by, id]
  );
  return result.affectedRows;
};

module.exports = { list, findById, create, update, softDelete };
