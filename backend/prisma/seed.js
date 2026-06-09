const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@mindshore.io" },
    update: {},
    create: {
      email: "demo@mindshore.io",
      password: passwordHash,
      name: "Demo User",
    },
  });
  console.log(`✅ Usuario demo creado: ${user.email}`);

  const tags = [
    { name: "Marte", slug: "marte" },
    { name: "Superficie", slug: "superficie" },
    { name: "Cráter", slug: "crater" },
    { name: "Rover", slug: "rover" },
    { name: "Atmósfera", slug: "atmosfera" },
    { name: "Curiosity", slug: "curiosity" },
    { name: "Perseverance", slug: "perseverance" },
    { name: "Nebulosa", slug: "nebulosa" },
    { name: "Galaxia", slug: "galaxia" },
    { name: "Sistema Solar", slug: "sistema-solar" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`✅ ${tags.length} tags creados`);

  const collection = await prisma.collection.upsert({
    where: { id: "demo-collection-1" },
    update: {},
    create: {
      id: "demo-collection-1",
      name: "Mis favoritos de Marte",
      description: "Imágenes increíbles del planeta rojo",
      isPublic: true,
      userId: user.id,
    },
  });
  console.log(`✅ Colección demo creada: ${collection.name}`);

  console.log("✨ Seed completado");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
