"use client";

import Link from "next/link";
import UserMenu from "@/components/UserMenu";

interface NavbarProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
  userRole: string;
}

export default function Navbar({ userName, userEmail, userImage, userRole }: NavbarProps) {
  const isAdmin = userRole === "ADMIN";

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        <div className="flex items-center gap-6">
          <Link href="/matches" className="text-white font-bold text-sm whitespace-nowrap">
            ⚽ Polla 2026
          </Link>

          {/* Desktop links */}
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/matches" className="text-slate-400 hover:text-white text-sm transition-colors">
              Partidos
            </Link>
            <Link href="/ranking" className="text-slate-400 hover:text-white text-sm transition-colors">
              Ranking
            </Link>
            {isAdmin && (
              <>
                <span className="text-slate-700 text-sm select-none">|</span>
                <Link href="/admin/users" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Usuarios
                </Link>
                <Link href="/admin/matches" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Resultados
                </Link>
              </>
            )}
          </div>
        </div>

        <UserMenu name={userName} email={userEmail} image={userImage} userRole={userRole} />
      </div>
    </header>
  );
}
