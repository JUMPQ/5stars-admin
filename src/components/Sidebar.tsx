// src/components/Sidebar.tsx
'use client';
import Link from 'next/link';
import { NAV_ITEMS } from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role ?? 'team';
  const nav = NAV_ITEMS[role];
  const pathname = usePathname() ?? '/';

  return (
    // hidden on small screens — you can add a mobile drawer later
    <aside className="w-64 border-r p-4 hidden md:block bg-white">
      

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`py-2 px-3 rounded font-semibold ${isActive ? 'bg-[#ED1E25]' : 'hover:bg-slate-50'}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
