import { X, Tag } from "lucide-react";

export default function ImageDetailModal({ photo, onClose }) {
  const imageUrl = photo.img_src || photo.imageUrl;
  const title = photo.camera?.full_name || photo.title || `Foto ${photo.id}`;
  const curiousFacts = photo.aiCuriousFacts
    ? (typeof photo.aiCuriousFacts === "string" ? JSON.parse(photo.aiCuriousFacts) : photo.aiCuriousFacts)
    : [];
  const tags = photo.tags?.map((t) => t.tag || t) || [];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="font-semibold text-white truncate flex-1 mr-4">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-square object-cover lg:rounded-bl-2xl"
          />
          <div className="p-5 space-y-4 overflow-y-auto">
            {photo.aiDescription ? (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-space-400 mb-2">Descripción IA</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{photo.aiDescription}</p>
                </div>
                {curiousFacts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-space-400 mb-2">Datos curiosos</h3>
                    <ul className="space-y-1.5">
                      {curiousFacts.map((fact, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300">
                          <span className="text-space-400 flex-shrink-0">✦</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {photo.aiAnalysis && (
                  <div>
                    <h3 className="text-sm font-semibold text-space-400 mb-2">Análisis técnico</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{photo.aiAnalysis}</p>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Descripción</h3>
                <p className="text-gray-300 text-sm">{photo.description || "Sin descripción disponible."}</p>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-space-400 mb-2 flex items-center gap-1">
                  <Tag size={14} /> Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag.id || tag.name}
                      className="bg-space-900/60 border border-space-800 text-space-300 text-xs px-2 py-0.5 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-800">
              {photo.rover?.name && <p>Rover: {photo.rover.name}</p>}
              {photo.camera?.name && <p>Cámara: {photo.camera.name}</p>}
              {(photo.earth_date || photo.earthDate) && <p>Fecha: {photo.earth_date || photo.earthDate}</p>}
              {photo.sol && <p>Sol: {photo.sol}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
