// src/context/AuthContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Role } from "@/config/config";
import api from "@/utils/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin"; 
} | null;

type LoginCredentials = {
  email: string;
  password: string;
};

type AuthShape = {
  user: User;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setRole: (r: Role) => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthShape | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Use localStorage directly
      const token = localStorage.getItem("token");
      if (token) {
        // Verify token is still valid by fetching profile
        const response = await api.get("/auth/profile");
        setUser({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      }
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user: userData } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set user in state
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed";
      // setError(errorMessage);
      console.log("LOGIN ERROR:", err.response?.data);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  const setRole = (role: Role) => {
    setUser((u) => (u ? { ...u, role } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        setRole,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
