"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { updateProfile } from "@/app/(app)/home/actions";
import { haptic } from "@/lib/haptic";
import { C, FS, FW } from "@/lib/tokens";

// Agregá las mascotas acá cuando estén disponibles en /public/mascotas/
const MASCOTAS: string[] = [
  // "/mascotas/mascota-1.png",
  // "/mascotas/mascota-2.png",
  // "/mascotas/mascota-3.png",
];

interface Props {
  currentName: string;
  googleImage: string | null | undefined;
  currentImage: string | null | undefined;
  onClose: () => void;
}

export default function EditProfileModal({ currentName, googleImage, currentImage, onClose }: Props) {
  const [name, setName] = useState(currentName);
  const [selectedImage, setSelectedImage] = useState(currentImage ?? googleImage ?? "");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  function handleSave() {
    haptic("medium");
    startTransition(async () => {
      await updateProfile(name, selectedImage);
      onClose();
    });
  }

  const avatarOptions = [
    ...(googleImage ? [{ src: googleImage, label: "Foto de Google" }] : []),
    ...MASCOTAS.map((src, i) => ({ src, label: `Mascota ${i + 1}` })),
  ];

  if (!mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl animate-modal-in flex flex-col"
        style={{ maxHeight: "calc(100dvh - 60px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-4 border-b border-gray-100 shrink-0">
          <h2 style={{ fontSize: FS.title, fontWeight: FW.extrabold, color: C.textPrimary }}>Editar perfil</h2>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-full active:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-5 py-5 flex flex-col gap-5 overflow-y-auto flex-1">

          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": C.primary } as React.CSSProperties}
              placeholder="Tu nombre"
            />
          </div>

          {/* Foto de perfil */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Foto de perfil</label>

            {avatarOptions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                Las mascotas estarán disponibles próximamente.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map(({ src, label }) => (
                  <button
                    key={src}
                    onClick={() => setSelectedImage(src)}
                    className={`relative aspect-square rounded-xl overflow-hidden transition-all cursor-pointer ${
                      selectedImage === src ? "scale-105 shadow-md" : ""
                    }`}
                    style={{
                      border: selectedImage === src ? `2px solid ${C.primary}` : "2px solid transparent",
                    }}
                    title={label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={label} className="w-full h-full object-cover" />
                    {selectedImage === src && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(30,142,62,0.15)" }}>
                        <svg className="w-5 h-5 drop-shadow" fill="white" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Actions */}
        <div className="px-5 pb-8 pt-3 shrink-0">
          <button
            onClick={handleSave}
            disabled={isPending || !name.trim()}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold disabled:opacity-50 cursor-pointer active:opacity-90"
            style={{ backgroundColor: C.primary }}
          >
            {isPending ? "Guardando…" : "Guardar"}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 mt-2 text-sm font-semibold cursor-pointer"
            style={{ color: C.textSecondary }}
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
