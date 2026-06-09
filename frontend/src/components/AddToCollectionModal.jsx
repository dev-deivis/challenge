import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { collectionsApi, imagesApi } from "../services/api";

export default function AddToCollectionModal({ photo, onClose }) {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    collectionsApi.list().then(({ data }) => setCollections(data.collections));
  }, []);

  async function handleAdd() {
    if (!selected) return;
    setLoading(true);
    try {
      // Primero cachear la imagen en la DB
      const imageData = {
        nasaId: String(photo.id || photo.nasaId),
        title: photo.camera?.full_name || photo.title || `Foto ${photo.id}`,
        description: photo.description || "",
        imageUrl: photo.img_src || photo.imageUrl,
        thumbUrl: photo.img_src || photo.imageUrl,
        date: photo.earth_date || photo.date || new Date().toISOString(),
        source: photo.rover ? "MARS_ROVER" : "NASA_LIBRARY",
        rover: photo.rover?.name,
        camera: photo.camera?.name,
        sol: photo.sol,
        earthDate: photo.earth_date,
      };

      const { data: imgData } = await imagesApi.enrich(imageData);

      await collectionsApi.addImage(selected, {
        imageId: imgData.image.id,
        notes: notes || undefined,
      });
      setSuccess(true);
      setTimeout(onClose, 800);
    } catch (err) {
      alert(err.response?.data?.error || "Error al agregar imagen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-semibold text-white">Agregar a colección</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {collections.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No tenés colecciones creadas.</p>
          ) : (
            collections.map((col) => (
              <button
                key={col.id}
                onClick={() => setSelected(col.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition text-sm ${
                  selected === col.id
                    ? "border-space-500 bg-space-900/40 text-white"
                    : "border-gray-800 hover:border-gray-600 text-gray-300"
                }`}
              >
                {col.name}
                <span className="text-gray-500 ml-2 text-xs">({col._count?.items || 0})</span>
              </button>
            ))
          )}

          {selected && (
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nota opcional..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-space-500 transition"
            />
          )}

          <button
            onClick={handleAdd}
            disabled={!selected || loading || success}
            className="w-full bg-space-600 hover:bg-space-500 disabled:opacity-50 text-white rounded-lg py-2.5 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            {success ? (
              <><Check size={16} /> Agregada</>
            ) : loading ? (
              "Agregando..."
            ) : (
              "Agregar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
