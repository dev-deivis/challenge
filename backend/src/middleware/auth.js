const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticación requerido" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, avatar: true },
    });
    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

module.exports = { authenticate };
