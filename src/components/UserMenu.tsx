"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
  name: string;
  email: string;
  image?: string | null;
  userRole?: string;
}

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
        onError={() => setImgError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
      {initials}
    </div>
  );
}

export default function UserMenu({ name, email, image, userRole }: UserMenuProps) {
  const isAdmin = userRole === "ADMIN";
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); setConfirming(false); }}
        className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Avatar name={name} image={image} />
        <span className="text-slate-300 text-sm hidden sm:block max-w-36 truncate">{name}</span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50">
          {/* Nav links — mobile only */}
          <div className="sm:hidden border-b border-slate-100 p-2">
            <Link href="/matches" onClick={() => setOpen(false)} className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              Partidos
            </Link>
            <Link href="/ranking" onClick={() => setOpen(false)} className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              Ranking
            </Link>
            {isAdmin && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <p className="px-3 pt-1 pb-0.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin</p>
                <Link href="/admin/users" onClick={() => setOpen(false)} className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Usuarios
                </Link>
                <Link href="/admin/matches" onClick={() => setOpen(false)} className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                  Resultados
                </Link>
              </>
            )}
          </div>

          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
          </div>

          {/* Actions */}
          <div className="p-2">
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            ) : (
              <div className="px-3 py-2">
                <p className="text-sm text-slate-700 font-medium mb-2">¿Cerrar sesión?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex-1 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Sí, salir
                  </button>
                  <button
                    onClick={() => setConfirming(false)}
                    className="flex-1 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
