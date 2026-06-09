const PDFDocument = require("pdfkit");
const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function exportCollectionPDF(req, res, next) {
  try {
    const collection = await prisma.collection.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        items: {
          include: {
            image: { include: { tags: { include: { tag: true } } } },
          },
          orderBy: { addedAt: "asc" },
        },
      },
    });

    if (!collection) return res.status(404).json({ error: "Colección no encontrada" });

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(collection.name)}.pdf"`);
    doc.pipe(res);

    // Portada
    doc.fontSize(28).fillColor("#5a63ff").text("MindShore", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(20).fillColor("#ffffff").text(collection.name, { align: "center" });
    if (collection.description) {
      doc.moveDown(0.5);
      doc.fontSize(12).fillColor("#9ca3af").text(collection.description, { align: "center" });
    }
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#6b7280")
      .text(`${collection.items.length} imágenes • Generado el ${new Date().toLocaleDateString("es-AR")}`, { align: "center" });

    // Imágenes
    for (const item of collection.items) {
      const img = item.image;
      doc.addPage();

      // Intentar descargar imagen
      try {
        const response = await axios.get(img.imageUrl, { responseType: "arraybuffer", timeout: 8000 });
        const buffer = Buffer.from(response.data);
        const imgWidth = doc.page.width - 100;
        doc.image(buffer, 50, 50, { width: imgWidth, fit: [imgWidth, 300] });
        doc.moveDown(1);
      } catch {
        doc.moveDown(1);
        doc.fontSize(10).fillColor("#6b7280").text("[Imagen no disponible]", { align: "center" });
        doc.moveDown(0.5);
      }

      const y = doc.y + 10;
      doc.fontSize(16).fillColor("#f9fafb").text(img.title || "Sin título", 50, y);
      doc.moveDown(0.5);

      const meta = [img.rover, img.camera, img.earthDate].filter(Boolean).join(" · ");
      if (meta) {
        doc.fontSize(10).fillColor("#9ca3af").text(meta);
        doc.moveDown(0.5);
      }

      if (img.aiDescription) {
        doc.fontSize(11).fillColor("#d1d5db").text(img.aiDescription, { lineGap: 4 });
        doc.moveDown(0.5);
      }

      const curiousFacts = img.aiCuriousFacts
        ? (typeof img.aiCuriousFacts === "string" ? JSON.parse(img.aiCuriousFacts) : img.aiCuriousFacts)
        : [];

      if (curiousFacts.length > 0) {
        doc.fontSize(11).fillColor("#7b90ff").text("Datos curiosos:");
        doc.moveDown(0.2);
        for (const fact of curiousFacts) {
          doc.fontSize(10).fillColor("#d1d5db").text(`• ${fact}`, { indent: 10, lineGap: 3 });
        }
        doc.moveDown(0.5);
      }

      const tags = img.tags?.map((t) => t.tag?.name).filter(Boolean) || [];
      if (tags.length > 0) {
        doc.fontSize(10).fillColor("#5a63ff").text("Tags: " + tags.join(", "));
      }

      if (item.notes) {
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor("#9ca3af").text(`Nota: ${item.notes}`, { oblique: true });
      }
    }

    doc.end();
  } catch (err) {
    next(err);
  }
}

module.exports = { exportCollectionPDF };
