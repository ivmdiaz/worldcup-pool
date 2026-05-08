"use client";

import { useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";

interface Props {
  currentName: string;
  googleImage: string | null | undefined;
  currentImage: string | null | undefined;
}

export default function EditProfileButton({ currentName, googleImage, currentImage }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-black/15 hover:bg-black/25 transition-colors cursor-pointer"
        title="Editar perfil"
      >
        <svg className="w-5 h-5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
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
