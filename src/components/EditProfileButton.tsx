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
        <div className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.65)", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96a7.06 7.06 0 00-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.4 7.4 0 00-1.62.94l-2.39-.96a.48.48 0 00-.59.22L2.74 8.87a.47.47 0 00.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.36 1.04.67 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7.4 7.4 0 001.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 00-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
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
