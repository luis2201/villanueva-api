const jwt = require('jsonwebtoken');
const { comparePassword } = require('../utils/password');
const userRepo = require('../repositories/user.repo');

const login = async (email, password) => {
  const user = await userRepo.findByEmail(email);

  if (!user) throw new Error('Credenciales inválidas');
  if (user.status !== 'active') throw new Error('Usuario inactivo');

  const ok = await comparePassword(password, user.password_hash);
  if (!ok) throw new Error('Credenciales inválidas');

  await userRepo.updateLastLogin(user.id);
  // Generar JWT con id y role del usuario
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  // Devolver datos del usuario (sin password) y el token de acceso
  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
};

module.exports = { login };
