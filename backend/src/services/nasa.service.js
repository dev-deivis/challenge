const axios = require("axios");

const NASA_BASE = "https://api.nasa.gov";
const API_KEY = () => process.env.NASA_API_KEY || "DEMO_KEY";

// Mars Rover Photos
async function getMarsRoverPhotos({ rover = "curiosity", sol, earth_date, camera, page = 1 }) {
  const params = { api_key: API_KEY(), page };
  if (sol) params.sol = sol;
  if (earth_date) params.earth_date = earth_date;
  if (camera) params.camera = camera;

  const { data } = await axios.get(
    `${NASA_BASE}/mars-photos/api/v1/rovers/${rover}/photos`,
    { params }
  );
  return data.photos;
}

// Manifest del rover (info de misión y sols disponibles)
async function getRoverManifest(rover = "curiosity") {
  const { data } = await axios.get(
    `${NASA_BASE}/mars-photos/api/v1/manifests/${rover}`,
    { params: { api_key: API_KEY() } }
  );
  return data.photo_manifest;
}

// APOD - Astronomy Picture of the Day
async function getAPOD({ date, start_date, end_date, count, thumbs = true } = {}) {
  const params = { api_key: API_KEY(), thumbs };
  if (date) params.date = date;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (count) params.count = count;

  const { data } = await axios.get(`${NASA_BASE}/planetary/apod`, { params });
  return data;
}

// NASA Image and Video Library — búsqueda general
async function searchNasaLibrary({ q, media_type = "image", year_start, year_end, page = 1 }) {
  const params = { q, media_type, page };
  if (year_start) params.year_start = year_start;
  if (year_end) params.year_end = year_end;

  const { data } = await axios.get("https://images-api.nasa.gov/search", { params });
  return data.collection;
}

module.exports = { getMarsRoverPhotos, getRoverManifest, getAPOD, searchNasaLibrary };
