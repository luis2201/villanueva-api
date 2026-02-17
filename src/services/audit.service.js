const auditRepo = require('../repositories/audit.repo');

const audit = async (req, {
  action,
  entity_type,
  entity_id,
  before_data = null,
  after_data = null
}) => {
  // Evita que falle el flujo principal por un error de auditoría
  try {
    await auditRepo.insert({
      actor_user_id: req.user.id,
      action,
      entity_type,
      entity_id,
      before_data,
      after_data,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'] || null
    });
  } catch (e) {
    // Loguea si ya tienes logger; por ahora, consola.
    console.error('Audit error:', e.message);
  }
};

module.exports = { audit };
