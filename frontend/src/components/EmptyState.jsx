import { Link } from "react-router-dom";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🌌</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm mt-2 max-w-sm">{description}</p>
      {action && (
        action.href ? (
          <Link
            to={action.href}
            className="mt-4 bg-space-600 hover:bg-space-500 text-white font-medium rounded-lg px-5 py-2 text-sm transition"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-4 bg-space-600 hover:bg-space-500 text-white font-medium rounded-lg px-5 py-2 text-sm transition"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
