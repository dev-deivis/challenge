const { Router } = require("express");
const authRoutes = require("./auth.routes");
const nasaRoutes = require("./nasa.routes");
const collectionRoutes = require("./collection.routes");
const imageRoutes = require("./image.routes");
const tagRoutes = require("./tag.routes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/nasa", nasaRoutes);
router.use("/collections", collectionRoutes);
router.use("/images", imageRoutes);
router.use("/tags", tagRoutes);

module.exports = router;
