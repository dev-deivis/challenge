const CAMERAS = {
  curiosity: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"],
  perseverance: ["EDL_RUCAM", "EDL_DDCAM", "FRONT_HAZCAM_LEFT_A", "NAVCAM_LEFT", "MCZ_LEFT"],
  opportunity: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
  spirit: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
};

export default function SearchFilters({ filters, onChange }) {
  const cameras = CAMERAS[filters.rover] || [];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Fecha (Earth Date)</label>
        <input
          type="date"
          value={filters.earth_date}
          onChange={(e) => onChange({ ...filters, earth_date: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-space-500"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Cámara</label>
        <select
          value={filters.camera}
          onChange={(e) => onChange({ ...filters, camera: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-space-500"
        >
          <option value="">Todas las cámaras</option>
          {cameras.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1.5">Página</label>
        <input
          type="number"
          min={1}
          value={filters.page}
          onChange={(e) => onChange({ ...filters, page: parseInt(e.target.value) || 1 })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-space-500"
        />
      </div>
    </div>
  );
}
