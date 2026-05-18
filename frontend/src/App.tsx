import { Link } from "react-router-dom";

const links = [
  { path: "/auth/signup", name: "Signup" },
  { path: "/auth/login", name: "Login" },
  { path: "/parking", name: "Parking" },
  { path: "/entries", name: "Car entries" },
  { path: "/reports", name: "Reports" },
];

export default function App() {
  return (
    <div>
      <p>Welcome to the app</p>
      <div>
        {links.map((li, i) => (
          <Link key={i} to={li.path}>
            {li.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
