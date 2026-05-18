import { Link } from "react-router-dom";

const links = [
  { path: "/auth/signup", name: "Signup" },
  { path: "/auth/login", name: "Login" },
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
