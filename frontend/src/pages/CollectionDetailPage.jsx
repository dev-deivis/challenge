import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { collectionsApi } from "../services/api";
import ImageCard from "../components/ImageCard";
import EmptyState from "../components/EmptyState";

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadCollection();
  }, [id]);

  async function loadCollection() {
    try {
      const { data } = await collectionsApi.get(id);
      setCollection(data.collection);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleExportPDF() {
    setExporting(true);
    try {
      const res = await fetch(`/api/v1/collections/${id}/export/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("mindshore-auth")}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${collection.name}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Error al exportar PDF");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-800 rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return <EmptyState title="Colección no encontrada" description="La colección no existe o fue eliminada." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/collections" className="text-gray-400 hover:text-white transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{collection.name}</h1>
          {collection.description && (
            <p className="text-gray-400 text-sm mt-1">{collection.description}</p>
          )}
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting || collection.items.length === 0}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-300 rounded-lg px-4 py-2 text-sm transition"
        >
          <Download size={16} />
          {exporting ? "Exportando..." : "Exportar PDF"}
        </button>
      </div>

      {collection.items.length === 0 ? (
        <EmptyState
          title="Colección vacía"
          description="Explorá imágenes y agregalas a esta colección."
          action={{ label: "Explorar", href: "/explore" }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {collection.items.map((item) => (
            <ImageCard
              key={item.id}
              photo={item.image}
              collectionId={id}
              notes={item.notes}
              onRemove={loadCollection}
            />
          ))}
        </div>
      )}
    </div>
  );
}
