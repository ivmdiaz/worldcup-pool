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
        className="relative shrink-0 w-[72px] h-[72px] cursor-pointer active:opacity-80 transition-opacity"
        title="Editar perfil"
      >
        {currentImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentImage} alt={currentName} onError={() => setImgError(true)} className="w-full h-full rounded-full object-cover ring-2 ring-stone-300" />
        ) : (
          <div className="w-full h-full rounded-full bg-stone-500 flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full bg-white shadow flex items-center justify-center">
          <svg className="w-3 h-3 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
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
