const pool = require('../config/database');

// Solo funciones relacionadas con usuarios, como findByEmail para login y updateLastLogin para actualizar el último acceso
const findByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

// Función para actualizar el último acceso del usuario
const updateLastLogin = async (userId) => {
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [userId]);
};

module.exports = { findByEmail, updateLastLogin };
