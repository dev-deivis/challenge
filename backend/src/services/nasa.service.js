const axios = require("axios");

const NASA_BASE = "https://api.nasa.gov";
const API_KEY = () => process.env.NASA_API_KEY || "DEMO_KEY";

// Mars Rover Photos — usa NASA Image Library (el endpoint mars-photos fue retirado de Heroku)
async function getMarsRoverPhotos({ rover = "curiosity", earth_date, camera, page = 1 }) {
  let query = `${rover} rover`;
  if (camera) query += ` ${camera} camera`;
  if (earth_date) query += ` ${earth_date}`;

  const params = { q: query, media_type: "image", page };
  const { data } = await axios.get("https://images-api.nasa.gov/search", { params });

  // Normalizar al formato que espera el frontend
  const items = (data.collection?.items || []).map((item) => {
    const meta = item.data?.[0] || {};
    const links = item.links || [];
    return {
      id: meta.nasa_id || item.href,
      nasaId: meta.nasa_id,
      title: meta.title,
      description: meta.description,
      earth_date: meta.date_created?.split("T")[0],
      img_src: links.find((l) => l.rel === "preview")?.href || links[0]?.href,
      rover: { name: rover.charAt(0).toUpperCase() + rover.slice(1) },
      camera: { name: camera || "N/A", full_name: meta.title },
      source: "NASA_LIBRARY",
    };
  });

  return items;
}

// Stub: el manifest API también fue retirado
async function getRoverManifest(rover = "curiosity") {
  return { name: rover, status: "active", total_photos: "N/A" };
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
