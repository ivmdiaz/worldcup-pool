"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { haptic } from "@/lib/haptic";

const ITEMS = [
  {
    href: "/home",
    label: "Inicio",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-6 h-6 transition-colors ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <polyline points="9 21 9 12 15 12 15 21" />
      </svg>
    ),
  },
  {
    href: "/matches",
    label: "Pronosticar",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-6 h-6 transition-colors ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/ranking",
    label: "Ranking",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" className={`w-6 h-6 transition-colors ${active ? "text-green-700" : "text-gray-400"}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 9a6 6 0 0012 0" />
        <line x1="12" y1="15" x2="12" y2="19" />
        <line x1="8" y1="19" x2="16" y2="19" />
        <path d="M6 2H4a2 2 0 00-2 2v1a5 5 0 005 5" />
        <path d="M18 2h2a2 2 0 012 2v1a5 5 0 01-5 5" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 flex items-center">
      <div className="flex w-full max-w-sm mx-auto">
        {ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => haptic("light")}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 active:opacity-70 transition-opacity"
            >
              <span className={`transition-transform duration-200 ${active ? "scale-110" : "scale-100"}`}>
                {icon(active)}
              </span>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? "text-green-700" : "text-gray-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
