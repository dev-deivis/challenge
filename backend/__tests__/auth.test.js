const request = require("supertest");
const app = require("../src/app");

// Mock de Prisma para no necesitar DB en tests unitarios
jest.mock("@prisma/client", () => {
  const mockUser = {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
    password: "$2a$10$abcdefghijklmnopqrstuvuDummyHashForTesting",
    avatar: null,
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue(null),
      },
      $disconnect: jest.fn(),
    })),
  };
});

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn().mockResolvedValue(false),
}));

describe("Auth routes", () => {
  describe("POST /api/v1/auth/register", () => {
    it("rechaza registro con email inválido", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "not-an-email", password: "123456", name: "Test" });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it("rechaza registro con contraseña muy corta", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "test@test.com", password: "123", name: "Test" });
      expect(res.status).toBe(400);
    });

    it("rechaza registro sin nombre", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({ email: "test@test.com", password: "123456", name: "" });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("rechaza login con credenciales inválidas", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({ email: "nonexistent@test.com", password: "password123" });
      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("rechaza acceso sin token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("rechaza token inválido", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid.token.here");
      expect(res.status).toBe(401);
    });
  });
});
