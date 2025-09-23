// src/components/RootClientShell.tsx
"use client";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function RootClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
