import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const links = [
  { path: "/parking", name: "Parking" },
  { path: "/entries", name: "Car entries" },
  { path: "/reports", name: "Reports" },
];

export default function App() {
  const { logout } = useAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/auth/login" || location.pathname === "/auth/signup";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md border-r border-gray-200 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Parking App</h1>

          <nav className="flex flex-col gap-3">
            {links.map((li, i) => (
              <Link
                key={i}
                to={li.path}
                className={`px-4 py-2 rounded-lg transition ${
                  location.pathname === li.path
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {li.name}
              </Link>
            ))}
          </nav>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
