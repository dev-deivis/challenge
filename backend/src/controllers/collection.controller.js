const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

async function listCollections(req, res, next) {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { items: true } } },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ collections });
  } catch (err) {
    next(err);
  }
}

async function getCollection(req, res, next) {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: {
          include: { image: { include: { tags: { include: { tag: true } } } } },
          orderBy: { addedAt: "desc" },
        },
      },
    });
    if (!collection) return res.status(404).json({ error: "Colección no encontrada" });
    res.json({ collection });
  } catch (err) {
    next(err);
  }
}

async function createCollection(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, isPublic } = req.body;
    const collection = await prisma.collection.create({
      data: { name, description, isPublic: isPublic ?? false, userId: req.user.id },
    });
    res.status(201).json({ collection });
  } catch (err) {
    next(err);
  }
}

async function updateCollection(req, res, next) {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!collection) return res.status(404).json({ error: "Colección no encontrada" });

    const updated = await prisma.collection.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ collection: updated });
  } catch (err) {
    next(err);
  }
}

async function deleteCollection(req, res, next) {
  try {
    await prisma.collection.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function addImageToCollection(req, res, next) {
  try {
    const { imageId, notes } = req.body;
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!collection) return res.status(404).json({ error: "Colección no encontrada" });

    const item = await prisma.collectionItem.create({
      data: { collectionId: req.params.id, imageId, notes },
      include: { image: true },
    });
    res.status(201).json({ item });
  } catch (err) {
    next(err);
  }
}

async function removeImageFromCollection(req, res, next) {
  try {
    await prisma.collectionItem.deleteMany({
      where: { collectionId: req.params.id, imageId: req.params.imageId },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addImageToCollection,
  removeImageFromCollection,
};
