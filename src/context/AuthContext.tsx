// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';
import type { Role } from '@/config/config';

type User = { id: string; name: string; role: Role } | null;

type AuthShape = {
  user: User;
  setRole: (r: Role) => void;
};

const AuthContext = createContext<AuthShape | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // default to admin so you can preview — change as needed
  const [user, setUser] = useState<User>({ id: '1', name: 'Demo User', role: 'team' });

  const setRole = (role: Role) => {
    setUser((u) => (u ? { ...u, role } : { id: '0', name: 'Demo User', role }));
  };

  return <AuthContext.Provider value={{ user, setRole }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
