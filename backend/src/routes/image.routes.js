const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { externalApiLimiter } = require("../middleware/rateLimiter");
const { saveAndEnrichImage, getImage, suggestTags } = require("../controllers/image.controller");

const router = Router();
router.use(authenticate);

router.post("/enrich", externalApiLimiter, saveAndEnrichImage);
router.post("/suggest-tags", externalApiLimiter, suggestTags);
router.get("/:id", getImage);

module.exports = router;
