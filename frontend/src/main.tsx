import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./pages/Signup.tsx";
import LoginPage from "./pages/Login.tsx";
import { Toaster } from "sonner";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/login", element: <LoginPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" />

    <RouterProvider router={router} />
  </StrictMode>,
);
