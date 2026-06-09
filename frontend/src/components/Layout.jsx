import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Compass, BookOpen, LogOut } from "lucide-react";
import { useAuthStore } from "../store/auth.store";

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-16 lg:w-56 bg-gray-900 border-r border-gray-800 flex flex-col py-4 px-2 lg:px-4">
        <div className="mb-8 px-2">
          <span className="hidden lg:block text-xl font-bold text-white">MindShore</span>
          <span className="lg:hidden text-xl font-bold text-white">M</span>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition ${
                isActive ? "bg-space-900 text-space-300" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            <Compass size={18} />
            <span className="hidden lg:block">Explorar</span>
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              `flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition ${
                isActive ? "bg-space-900 text-space-300" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`
            }
          >
            <BookOpen size={18} />
            <span className="hidden lg:block">Colecciones</span>
          </NavLink>
        </nav>
        <div className="border-t border-gray-800 pt-4 mt-4">
          <div className="flex items-center gap-2 px-2 mb-2">
            <div className="w-7 h-7 bg-space-700 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="hidden lg:block text-sm text-gray-300 truncate">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <LogOut size={18} />
            <span className="hidden lg:block">Salir</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
