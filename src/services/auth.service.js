const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');

const login = async (email, password) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, role, status FROM users WHERE email = ? LIMIT 1',
    [email]
  );

  if (rows.length === 0) {
    throw new Error('Credenciales inválidas');
  }

  const user = rows[0];

  if (user.status !== 'active') {
    throw new Error('Usuario inactivo');
  }

  const validPassword = await comparePassword(password, user.password_hash);
  if (!validPassword) {
    throw new Error('Credenciales inválidas');
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    accessToken
  };
};

module.exports = { login };
