import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { nasaApi } from "../services/api";
import ImageCard from "../components/ImageCard";
import SearchFilters from "../components/SearchFilters";
import EmptyState from "../components/EmptyState";
import LoadingGrid from "../components/LoadingGrid";

const ROVERS = ["curiosity", "perseverance", "opportunity", "spirit"];

export default function ExplorePage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({
    rover: "curiosity",
    earth_date: "",
    camera: "",
    page: 1,
  });
  const [showFilters, setShowFilters] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const { data } = await nasaApi.getRoverPhotos(filters.rover, {
        earth_date: filters.earth_date || undefined,
        camera: filters.camera || undefined,
        page: filters.page,
      });
      setPhotos(data.photos);
    } catch (err) {
      setError("Error al buscar imágenes. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Explorar</h1>
          <p className="text-gray-400 text-sm mt-1">Imágenes de Marte y el universo en tiempo real</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm transition"
        >
          <Filter size={16} />
          Filtros
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <select
            value={filters.rover}
            onChange={(e) => setFilters({ ...filters, rover: e.target.value })}
            className="bg-transparent text-white py-3 flex-1 focus:outline-none"
          >
            {ROVERS.map((r) => (
              <option key={r} value={r} className="bg-gray-800 capitalize">
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-space-600 hover:bg-space-500 disabled:opacity-50 text-white font-medium rounded-xl px-6 transition"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {showFilters && (
        <SearchFilters filters={filters} onChange={setFilters} />
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {loading && <LoadingGrid />}

      {!loading && searched && photos.length === 0 && (
        <EmptyState
          title="Sin resultados"
          description="No se encontraron imágenes con esos filtros. Probá otra fecha o cámara."
        />
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>
      )}

      {!loading && !searched && (
        <EmptyState
          title="Explorá Marte"
          description="Seleccioná un rover y hacé clic en Buscar para ver las últimas imágenes."
        />
      )}
    </div>
  );
}
