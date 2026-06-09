const OpenAI = require("openai");
const logger = require("../utils/logger");

let openai;
function getClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

const MODEL = "gpt-4o-mini";

async function enrichImageWithAI(image) {
  const client = getClient();
  if (!client) {
    logger.warn("OpenAI no configurado — usando descripción de NASA como fallback");
    return {
      description: image.description || image.title,
      curiousFacts: [],
      tags: [],
    };
  }

  const prompt = `Eres un experto en astronomía y exploración espacial. Analiza esta imagen de NASA:

Título: ${image.title}
Fecha: ${image.date}
${image.rover ? `Rover: ${image.rover}` : ""}
${image.camera ? `Cámara: ${image.camera}` : ""}
Descripción original: ${image.description || "No disponible"}

Responde en JSON con exactamente estas claves:
{
  "description": "descripción atractiva y educativa en español (2-3 párrafos)",
  "curiousFacts": ["hecho curioso 1", "hecho curioso 2", "hecho curioso 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "analysis": "análisis técnico breve sobre lo que se ve en la imagen"
}`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    logger.error("Error al enriquecer imagen con IA:", err.message);
    throw err;
  }
}

async function suggestTagsForImage(imageData) {
  const client = getClient();
  if (!client) return [];

  const prompt = `Sugiere 5-8 tags relevantes para esta imagen espacial de NASA en español.
Título: ${imageData.title}
Descripción: ${imageData.description || ""}
Responde solo con un JSON: { "tags": ["tag1", "tag2", ...] }`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });
    const result = JSON.parse(response.choices[0].message.content);
    return result.tags || [];
  } catch (err) {
    logger.error("Error al sugerir tags:", err.message);
    return [];
  }
}

module.exports = { enrichImageWithAI, suggestTagsForImage };
