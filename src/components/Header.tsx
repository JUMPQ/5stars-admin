"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="py-4 border-b border-b-yellow-400 bg-gray-900 flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-white hover:text-yellow-400 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/5starslogo.svg"
            alt="5STARS Logo"
            width={28}
            height={28}
          />
          <h1 className="text-gray-200 text-lg font-bold">5STARS</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Bell
          className="text-white cursor-pointer hover:text-yellow-400 transition-colors"
          aria-label="Notifications"
        />
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-200 text-sm font-medium">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-gray-800 text-sm font-semibold px-3 py-1 rounded-md hover:bg-yellow-500 transition-all"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="text-gray-200 text-sm hover:text-yellow-400 transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}
