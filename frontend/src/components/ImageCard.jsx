import { useState } from "react";
import { Sparkles, Plus, Trash2, Tag } from "lucide-react";
import { imagesApi, collectionsApi } from "../services/api";
import AddToCollectionModal from "./AddToCollectionModal";
import ImageDetailModal from "./ImageDetailModal";

export default function ImageCard({ photo, collectionId, notes, onRemove }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState(null);

  const imageUrl = photo.img_src || photo.imageUrl;
  const title = photo.camera?.full_name || photo.title || `Foto ${photo.id}`;
  const date = photo.earth_date || photo.earthDate || photo.date;

  async function handleEnrich() {
    setEnriching(true);
    try {
      const { data } = await imagesApi.enrich({
        nasaId: String(photo.id || photo.nasaId),
        title,
        description: photo.description || "",
        imageUrl,
        thumbUrl: photo.img_src || imageUrl,
        date: date || new Date().toISOString(),
        source: photo.rover ? "MARS_ROVER" : "NASA_LIBRARY",
        rover: photo.rover?.name,
        camera: photo.camera?.name,
        sol: photo.sol,
        earthDate: photo.earth_date,
      });
      setEnrichedData(data.image);
      setShowDetail(true);
    } catch (err) {
      console.error("Error al enriquecer:", err);
    } finally {
      setEnriching(false);
    }
  }

  async function handleRemove() {
    if (!collectionId) return;
    await collectionsApi.removeImage(collectionId, photo.id || photo.nasaId);
    onRemove?.();
  }

  return (
    <>
      <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition">
        <div
          className="aspect-square overflow-hidden cursor-pointer"
          onClick={() => setShowDetail(true)}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        </div>

        <div className="p-3">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          {date && <p className="text-xs text-gray-500 mt-0.5">{date}</p>}
          {photo.rover?.name && (
            <p className="text-xs text-space-400 mt-0.5">{photo.rover.name}</p>
          )}
          {notes && <p className="text-xs text-gray-400 mt-1 italic line-clamp-1">"{notes}"</p>}
        </div>

        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleEnrich}
            disabled={enriching}
            className="bg-gray-900/90 backdrop-blur hover:bg-space-700 text-white p-1.5 rounded-lg transition"
            title="Enriquecer con IA"
          >
            <Sparkles size={14} className={enriching ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-900/90 backdrop-blur hover:bg-green-700 text-white p-1.5 rounded-lg transition"
            title="Agregar a colección"
          >
            <Plus size={14} />
          </button>
          {collectionId && (
            <button
              onClick={handleRemove}
              className="bg-gray-900/90 backdrop-blur hover:bg-red-700 text-white p-1.5 rounded-lg transition"
              title="Quitar de colección"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {showDetail && (
        <ImageDetailModal
          photo={enrichedData || photo}
          onClose={() => setShowDetail(false)}
        />
      )}

      {showAddModal && (
        <AddToCollectionModal
          photo={photo}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}
