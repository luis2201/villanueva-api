const pool = require('../config/database');

/// Repositorio para manejar las secciones de una página
const listByPageId = async (pageId) => {
  const [rows] = await pool.query(
    `SELECT id, page_id, section_type, order_index, config, status
     FROM page_sections
     WHERE page_id = ?
     ORDER BY order_index ASC, id ASC`,
    [pageId]
  );
  return rows;
};

// Obtiene una sección por su ID
const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT id, page_id, section_type, order_index, config, status
     FROM page_sections
     WHERE id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

// Crea una nueva sección para una página
const create = async ({ page_id, section_type, order_index, config, status }) => {
  const [result] = await pool.query(
    `INSERT INTO page_sections (page_id, section_type, order_index, config, status)
     VALUES (?, ?, ?, ?, ?)`,
    [page_id, section_type, order_index, JSON.stringify(config), status]
  );
  return result.insertId;
};

// Actualiza una sección existente. Solo actualiza los campos que se proporcionen (no nulos)
const update = async (id, { order_index, config, status }) => {
  const [result] = await pool.query(
    `UPDATE page_sections
     SET order_index = COALESCE(?, order_index),
         config = COALESCE(?, config),
         status = COALESCE(?, status)
     WHERE id = ?`,
    [
      order_index ?? null,
      config ? JSON.stringify(config) : null,
      status ?? null,
      id
    ]
  );
  return result.affectedRows;
};

// Elimina una sección por su ID
const remove = async (id) => {
  const [result] = await pool.query(
    `DELETE FROM page_sections WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};

// Reordena las secciones de una página. Recibe un array con los IDs y sus nuevos índices
const reorder = async (pageId, items) => {
  // items: [{id, order_index}, ...]
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Validación: que todas las secciones pertenezcan a esa página
    const ids = items.map(i => i.id);
    if (ids.length === 0) {
      await conn.rollback();
      return 0;
    }

    const [rows] = await conn.query(
      `SELECT id FROM page_sections WHERE page_id = ? AND id IN (${ids.map(() => '?').join(',')})`,
      [pageId, ...ids]
    );

    if (rows.length !== ids.length) {
      throw new Error('Una o más secciones no pertenecen a la página');
    }

    let affectedTotal = 0;
    for (const it of items) {
      const [r] = await conn.query(
        `UPDATE page_sections SET order_index = ? WHERE id = ? AND page_id = ?`,
        [it.order_index, it.id, pageId]
      );
      affectedTotal += r.affectedRows;
    }

    await conn.commit();
    return affectedTotal;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};

module.exports = { listByPageId, findById, create, update, remove, reorder };
