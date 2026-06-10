import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

const NEBULA_BG =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&auto=format&fit=crop";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register, loading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.name);
      navigate("/explore");
    } catch {}
  }

  function handleChange(field) {
    return (e) => {
      clearError();
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden antialiased">
      {/* Fondo nebulosa */}
      <img
        src={NEBULA_BG}
        alt="Galaxy Background"
        className="fixed inset-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
      />
      {/* Overlay oscuro */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "#0a0f1e", opacity: 0.75, zIndex: -1 }}
      />

      {/* Header */}
      <header className="w-full flex justify-between items-center px-5 md:px-16 py-4 z-50">
        <div className="flex items-center gap-2 font-semibold text-xl tracking-tight text-white">
          <span
            className="material-symbols-outlined text-white/80"
            style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}
          >
            stars
          </span>
          <span>MindShore</span>
        </div>
        <button
          className="text-white/60 hover:text-white transition-colors duration-200"
          aria-label="Ayuda"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            help_outline
          </span>
        </button>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow flex items-center justify-center px-5 md:px-16 py-16 z-10">
        <div className="glass-panel w-full max-w-[400px] p-8 md:p-10">
          <div className="flex flex-col gap-6">
            {/* Branding */}
            <div className="text-center space-y-2 mb-2">
              <div className="flex justify-center mb-4">
                <span
                  className="material-symbols-outlined text-white/90"
                  style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}
                >
                  rocket_launch
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Create your account
              </h1>
              <p className="text-sm text-white/50">
                Start exploring the universe with AI
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="sr-only" htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="input-glass"
                  required
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="input-glass"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  value={form.password}
                  onChange={handleChange("password")}
                  className="input-glass"
                  minLength={6}
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-violet mt-4"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Footer del card */}
            <div className="text-center mt-2">
              <p className="text-sm text-white/50">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-violet-400 transition-colors ml-1 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-5 md:px-16 py-4 mt-auto z-50">
        <div className="text-xs text-white/40 mb-4 md:mb-0">
          © 2024 MindShore. All rights reserved.
        </div>
        <nav className="flex gap-6">
          {["Legal", "Privacy", "Support"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
