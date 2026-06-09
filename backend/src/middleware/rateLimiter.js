const rateLimit = require("express-rate-limit");

// Límite general para la API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: "Demasiadas peticiones. Intentá en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite específico para llamadas a APIs externas (NASA + OpenAI)
const externalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: process.env.NODE_ENV === "production" ? 20 : 200,
  message: { error: "Límite de consultas externas alcanzado. Esperá un momento." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Límite estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos de autenticación. Esperá 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiLimiter, externalApiLimiter, authLimiter };
