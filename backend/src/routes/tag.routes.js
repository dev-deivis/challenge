const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { authenticate } = require("../middleware/auth");

const prisma = new PrismaClient();
const router = Router();
router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({
      include: { _count: { select: { images: true } } },
      orderBy: { name: "asc" },
    });
    res.json({ tags });
  } catch (err) {
    next(err);
  }
});

router.post("/image/:imageId", async (req, res, next) => {
  try {
    const { tagName } = req.body;
    const slug = tagName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: tagName, slug },
    });
    await prisma.imageTag.upsert({
      where: { imageId_tagId: { imageId: req.params.imageId, tagId: tag.id } },
      update: {},
      create: { imageId: req.params.imageId, tagId: tag.id, source: "MANUAL" },
    });
    res.status(201).json({ tag });
  } catch (err) {
    next(err);
  }
});

router.delete("/image/:imageId/:tagId", async (req, res, next) => {
  try {
    await prisma.imageTag.delete({
      where: { imageId_tagId: { imageId: req.params.imageId, tagId: req.params.tagId } },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
