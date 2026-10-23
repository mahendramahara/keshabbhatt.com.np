import React, { createContext, useContext, useState, useEffect } from "react";
import type { AdminUser } from "@keshab-bhatt/types";
import { apiLogin, setApiAuthToken } from "@/services/api";

interface AuthContextValue {
  admin: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  admin: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial verification check
    const initAuth = async () => {
      // Simulate splash time or restore
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    };
    initAuth();
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await apiLogin(identifier, pass);
    setAdmin(res.admin);
    setToken(res.token);
    setApiAuthToken(res.token);
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    setApiAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
