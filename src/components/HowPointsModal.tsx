"use client";

import { createPortal } from "react-dom";
import { C } from "@/lib/tokens";

interface Props {
  onClose: () => void;
}

const ITEMS = [
  { label: "Exacto",     sub: "Resultado exacto",         value: "+3 pts", color: "text-green-700 bg-green-50"  },
  { label: "Ganador",    sub: "Acertás ganador o empate",  value: "+1 pt",  color: "text-amber-700 bg-amber-50"  },
  { label: "Sin puntos", sub: "Resultado incorrecto",      value: "0 pts",  color: "text-gray-500 bg-gray-100"   },
];

export default function HowPointsModal({ onClose }: Props) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl animate-modal-in pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="px-6 pt-2 pb-4">
          <h2 className="text-lg font-bold text-gray-900">Cómo ganas puntos</h2>
        </div>
        <div className="px-6 divide-y divide-gray-100">
          {ITEMS.map(({ label, sub, value, color }) => (
            <div key={label} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
              <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${color}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="px-6 mt-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-white text-sm font-bold cursor-pointer active:opacity-90"
            style={{ backgroundColor: C.primary }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
