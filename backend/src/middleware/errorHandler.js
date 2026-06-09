const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error(`${err.message} — ${req.method} ${req.path}`, { stack: err.stack });

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === "P2002") {
    return res.status(409).json({ error: "El recurso ya existe" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "Recurso no encontrado" });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? "Error interno del servidor" : err.message,
  });
}

module.exports = { errorHandler };
