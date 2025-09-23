// src/components/Header.tsx
"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/config/config";
import Image from "next/image";
import { Bell, UserCircle } from "lucide-react";

export default function Header() {
  const { user, setRole } = useAuth();

  return (
    <header className="py-4 border-b  bg-white flex items-center justify-between px-15">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle placeholder */}
        <button
          className="md:hidden p-2 rounded hover:bg-slate-100"
          aria-label="Open menu"
        >
          ☰
        </button>

        <div className="flex items-center gap-2">
          <Image
            src="/5starslogo.svg"
            alt="5STARS Logo"
            width={40}
            height={40}
          />
          <h1 className="text-black text-lg font-bold">5STARS</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell and user profile icons */}
        <div className="flex items-center gap-4">
          <Bell className=" cursor-pointer" aria-label="Notifications" />
          <UserCircle className=" cursor-pointer" aria-label="Profile" />
        </div>
      </div>
    </header>
  );
}
