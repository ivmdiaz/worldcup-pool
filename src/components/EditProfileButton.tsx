"use client";

import { useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";

interface Props {
  currentName: string;
  googleImage: string | null | undefined;
  currentImage: string | null | undefined;
  initials: string;
}

export default function EditProfileButton({ currentName, googleImage, currentImage, initials }: Props) {
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative shrink-0 w-[90px] h-[90px] cursor-pointer active:opacity-80 transition-opacity"
        title="Editar perfil"
      >
        {currentImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentImage} alt={currentName} onError={() => setImgError(true)} className={`w-full h-full rounded-full ring-2 ring-stone-300 ${currentImage.startsWith("/mascotas/") ? "object-contain bg-gray-50" : "object-cover"}`} />
        ) : (
          <div className="w-full h-full rounded-full bg-stone-500 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full bg-white shadow-md flex items-center justify-center" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
          <svg className="w-4 h-4 text-stone-700" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </div>
      </button>

      {open && (
        <EditProfileModal
          currentName={currentName}
          googleImage={googleImage}
          currentImage={currentImage}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
