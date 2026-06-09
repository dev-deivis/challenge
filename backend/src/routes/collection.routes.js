const { Router } = require("express");
const { body } = require("express-validator");
const { authenticate } = require("../middleware/auth");
const {
  listCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addImageToCollection,
  removeImageFromCollection,
} = require("../controllers/collection.controller");
const { exportCollectionPDF } = require("../controllers/export.controller");

const router = Router();
router.use(authenticate);

router.get("/", listCollections);
router.post(
  "/",
  [body("name").trim().notEmpty().withMessage("Nombre requerido")],
  createCollection
);
router.get("/:id", getCollection);
router.put("/:id", updateCollection);
router.delete("/:id", deleteCollection);
router.post("/:id/images", addImageToCollection);
router.delete("/:id/images/:imageId", removeImageFromCollection);
router.get("/:id/export/pdf", exportCollectionPDF);

module.exports = router;
