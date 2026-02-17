const pool = require('../config/database');

/// Inserta un nuevo registro en la tabla de auditoría
const insert = async ({
  actor_user_id,
  action,
  entity_type,
  entity_id,
  before_data = null,
  after_data = null,
  ip_address = null,
  user_agent = null
}) => {
  await pool.query(
    `INSERT INTO audit_log
     (actor_user_id, action, entity_type, entity_id, before_data, after_data, ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      actor_user_id,
      action,
      entity_type,
      entity_id,
      before_data ? JSON.stringify(before_data) : null,
      after_data ? JSON.stringify(after_data) : null,
      ip_address,
      user_agent
    ]
  );
};

module.exports = { insert };
