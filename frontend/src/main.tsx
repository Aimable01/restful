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
import ReportsPage from "./pages/Reports.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/auth/signup", element: <SignupPage /> },
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/parking", element: <ParkingsPage /> },
  { path: "/entries", element: <CarEntriesPage /> },
  { path: "/reports", element: <ReportsPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster position="top-right" />

    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
