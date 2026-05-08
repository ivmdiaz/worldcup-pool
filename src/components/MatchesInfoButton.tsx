"use client";

import { useState, useEffect } from "react";
import HowPointsModal from "@/components/HowPointsModal";

export default function MatchesInfoButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center cursor-pointer active:bg-white/30"
      >
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </button>
      {mounted && open && <HowPointsModal onClose={() => setOpen(false)} />}
    </>
  );
}
