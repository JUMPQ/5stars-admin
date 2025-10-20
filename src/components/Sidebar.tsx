"use client";
import { useAuth } from "@/context/AuthContext";
import { NAV_ITEMS } from "@/config/config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 border-r border-r-yellow-400 p-4 bg-gray-900 text-white z-50 md:static md:block ${
          isOpen
            ? "fixed inset-y-0 left-0 translate-x-0"
            : "fixed -translate-x-full"
        } transition-transform duration-300 md:translate-x-0`}
      >
        <div className="p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Football League Admin
            </h2>
            <p className="text-sm text-gray-200 mt-1">Administration Panel</p>
          </div>
          <button
            className="md:hidden text-white hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`py-2 px-3 rounded font-semibold text-white hover:text-gray-800 hover:bg-gray-100 transition ${
                  isActive ? "bg-red-500" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
                {item.icon && <item.icon className="inline ml-2 w-5 h-5" />}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
