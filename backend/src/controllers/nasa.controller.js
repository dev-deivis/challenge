const { validationResult } = require("express-validator");
const nasaService = require("../services/nasa.service");

async function searchRoverPhotos(req, res, next) {
  try {
    const { rover = "curiosity", sol, earth_date, camera, page } = req.query;
    const photos = await nasaService.getMarsRoverPhotos({ rover, sol, earth_date, camera, page });
    res.json({ photos, total: photos.length });
  } catch (err) {
    next(err);
  }
}

async function getRoverManifest(req, res, next) {
  try {
    const manifest = await nasaService.getRoverManifest(req.params.rover);
    res.json({ manifest });
  } catch (err) {
    next(err);
  }
}

async function getAPOD(req, res, next) {
  try {
    const { date, start_date, end_date, count } = req.query;
    const apod = await nasaService.getAPOD({ date, start_date, end_date, count });
    res.json({ apod });
  } catch (err) {
    next(err);
  }
}

async function searchLibrary(req, res, next) {
  try {
    const { q, media_type, year_start, year_end, page } = req.query;
    if (!q) return res.status(400).json({ error: "Parámetro q requerido" });
    const collection = await nasaService.searchNasaLibrary({ q, media_type, year_start, year_end, page });
    res.json({ collection });
  } catch (err) {
    next(err);
  }
}

module.exports = { searchRoverPhotos, getRoverManifest, getAPOD, searchLibrary };
