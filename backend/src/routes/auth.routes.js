const { Router } = require("express");
const { body } = require("express-validator");
const { register, login, me } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = Router();

router.post(
  "/register",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
    body("name").trim().notEmpty().withMessage("Nombre requerido"),
  ],
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
  ],
  login
);

router.get("/me", authenticate, me);

module.exports = router;
