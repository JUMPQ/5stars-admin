"use client";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function RootClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/login";
  const isPublicRoute = pathname === "/" || pathname === "/unauthorized";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isLoginPage || !user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
