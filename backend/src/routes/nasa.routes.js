const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { externalApiLimiter } = require("../middleware/rateLimiter");
const { searchRoverPhotos, getRoverManifest, getAPOD, searchLibrary } = require("../controllers/nasa.controller");

const router = Router();

router.use(authenticate);
router.use(externalApiLimiter);

router.get("/rovers/:rover/photos", searchRoverPhotos);
router.get("/rovers/:rover/manifest", getRoverManifest);
router.get("/apod", getAPOD);
router.get("/search", searchLibrary);

module.exports = router;
