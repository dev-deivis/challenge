const { PrismaClient } = require("@prisma/client");
const aiService = require("../services/ai.service");

const prisma = new PrismaClient();

// Guarda/cachea una imagen de NASA en la DB para enriquecerla con IA
async function saveAndEnrichImage(req, res, next) {
  try {
    const { nasaId, title, description, imageUrl, thumbUrl, date, source, rover, camera, sol, earthDate, mission } = req.body;

    let image = await prisma.nasaImage.findUnique({ where: { nasaId } });

    if (!image) {
      image = await prisma.nasaImage.create({
        data: { nasaId, title, description, imageUrl, thumbUrl, date: new Date(date), source, rover, camera, sol, earthDate, mission },
      });
    }

    // Enriquecer con IA si aún no fue enriquecida
    if (!image.aiDescription) {
      const enriched = await aiService.enrichImageWithAI({ title, description, date, rover, camera });

      // Crear/obtener tags sugeridos por IA
      const tagConnects = [];
      for (const tagName of enriched.tags || []) {
        const slug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const tag = await prisma.tag.upsert({
          where: { slug },
          update: {},
          create: { name: tagName, slug },
        });

        const existingTag = await prisma.imageTag.findUnique({
          where: { imageId_tagId: { imageId: image.id, tagId: tag.id } },
        });
        if (!existingTag) {
          tagConnects.push({ imageId: image.id, tagId: tag.id, source: "AI_SUGGESTED" });
        }
      }

      if (tagConnects.length > 0) {
        await prisma.imageTag.createMany({ data: tagConnects });
      }

      image = await prisma.nasaImage.update({
        where: { id: image.id },
        data: {
          aiDescription: enriched.description,
          aiCuriousFacts: JSON.stringify(enriched.curiousFacts || []),
          aiAnalysis: enriched.analysis,
          aiEnrichedAt: new Date(),
        },
        include: { tags: { include: { tag: true } } },
      });
    } else {
      image = await prisma.nasaImage.findUnique({
        where: { id: image.id },
        include: { tags: { include: { tag: true } } },
      });
    }

    res.json({ image });
  } catch (err) {
    next(err);
  }
}

async function getImage(req, res, next) {
  try {
    const image = await prisma.nasaImage.findUnique({
      where: { id: req.params.id },
      include: { tags: { include: { tag: true } } },
    });
    if (!image) return res.status(404).json({ error: "Imagen no encontrada" });
    res.json({ image });
  } catch (err) {
    next(err);
  }
}

async function suggestTags(req, res, next) {
  try {
    const { title, description } = req.body;
    const tags = await aiService.suggestTagsForImage({ title, description });
    res.json({ tags });
  } catch (err) {
    next(err);
  }
}

module.exports = { saveAndEnrichImage, getImage, suggestTags };
