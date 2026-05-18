import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const links = [
  { path: "/auth/signup", name: "Signup" },
  { path: "/auth/login", name: "Login" },
  { path: "/parking", name: "Parking" },
  { path: "/entries", name: "Car entries" },
  { path: "/reports", name: "Reports" },
];

export default function App() {
  const { logout } = useAuth();
  return (
    <div>
      <p>Welcome to the app</p>
      <div>
        {links.map((li, i) => (
          <Link key={i} to={li.path}>
            {li.name}
          </Link>
        ))}

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
