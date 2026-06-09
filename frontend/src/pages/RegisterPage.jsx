import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.name);
      navigate("/explore");
    } catch {}
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">MindShore</h1>
          <p className="text-gray-400 mt-2">Exploración espacial con IA</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl p-8 space-y-4">
          <h2 className="text-xl font-semibold text-white">Crear cuenta</h2>
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { clearError(); setForm({ ...form, name: e.target.value }); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-space-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => { clearError(); setForm({ ...form, email: e.target.value }); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-space-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => { clearError(); setForm({ ...form, password: e.target.value }); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-space-500 transition"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-space-600 hover:bg-space-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
          <p className="text-center text-gray-400 text-sm">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-space-400 hover:text-space-300">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
