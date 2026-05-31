import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      const publicRoutes = ["/auth/login", "/auth/signup"];

      if (!publicRoutes.includes(window.location.pathname)) {
        redirectToLogin();
      }
    }

    setIsLoading(false);
  }, []);

  const redirectToLogin = () => {
    if (window.location.pathname !== "/auth/login") {
      window.location.replace("/auth/login");
    }
  };

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    window.location.href = "/parking";
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    window.location.replace("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, token, login, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used withing an AuthProvider");
  }
  return context;
}
