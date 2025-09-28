"use client";
import Link from "next/link";
import { NAV_ITEMS } from "@/config/config";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role ?? "team";
  const nav = NAV_ITEMS[role];
  const pathname = usePathname() ?? "/";

  const normalize = (p: string) =>
    p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

  const current = normalize(pathname);

  // compute match-length for each nav item (exact match or prefix match)
  const matches = nav.map((item) => {
    const href = normalize(item.href);
    if (href === current) return { id: item.id, len: href.length }; // exact
    // allow prefix match only when current starts with href + '/'
    if (href !== "/" && current.startsWith(href + "/"))
      return { id: item.id, len: href.length };
    return { id: item.id, len: 0 };
  });

  // longest match wins
  const maxLen = Math.max(...matches.map((m) => m.len));
  const bestMatchIds = new Set(
    matches.filter((m) => m.len === maxLen && m.len > 0).map((m) => m.id)
  );

  return (
    <aside className="w-64 border-r p-4 hidden md:block bg-white">
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const isActive = bestMatchIds.has(item.id);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`py-2 px-3 rounded font-semibold ${
                isActive ? "bg-[#ED1E25] text-white" : "hover:bg-slate-50"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
