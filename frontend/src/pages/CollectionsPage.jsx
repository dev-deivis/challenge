import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderOpen } from "lucide-react";
import { collectionsApi } from "../services/api";
import EmptyState from "../components/EmptyState";
import CreateCollectionModal from "../components/CreateCollectionModal";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      const { data } = await collectionsApi.list();
      setCollections(data.collections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(collectionData) {
    const { data } = await collectionsApi.create(collectionData);
    setCollections([data.collection, ...collections]);
    setShowModal(false);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl h-40 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis Colecciones</h1>
          <p className="text-gray-400 text-sm mt-1">{collections.length} colecciones</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-space-600 hover:bg-space-500 text-white rounded-lg px-4 py-2 text-sm font-medium transition"
        >
          <Plus size={16} />
          Nueva colección
        </button>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          title="Sin colecciones"
          description="Creá tu primera colección para organizar tus imágenes favoritas."
          action={{ label: "Crear colección", onClick: () => setShowModal(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.id}`}
              className="group bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition"
            >
              <div className="flex items-start gap-3">
                <div className="bg-space-900 p-2 rounded-lg">
                  <FolderOpen size={20} className="text-space-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate group-hover:text-space-300 transition">
                    {col.name}
                  </h3>
                  {col.description && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{col.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">
                    {col._count?.items || 0} imágenes
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <CreateCollectionModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
