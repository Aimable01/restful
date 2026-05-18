import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./pages/Signup.tsx";
import LoginPage from "./pages/Login.tsx";
import { Toaster } from "sonner";
import ParkingsPage from "./pages/Parking.tsx";
import CarEntriesPage from "./pages/CarEntriesPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/parking", element: <ParkingsPage /> },
  { path: "/entries", element: <CarEntriesPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" />

    <RouterProvider router={router} />
  </StrictMode>,
);
