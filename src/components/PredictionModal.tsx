"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { type MatchCardMatch, type MatchCardPrediction } from "@/components/MatchCard";
import { savePrediction } from "@/app/(app)/matches/actions";
import { haptic } from "@/lib/haptic";
import { formatDateTime } from "@/lib/datetime";
import { C, FS, FW } from "@/lib/tokens";
import FlagImg from "@/components/FlagImg";

interface Props {
  match: MatchCardMatch;
  prediction?: MatchCardPrediction;
  now: number;
  onClose: () => void;
}

function TeamStepper({
  team, score, onMinus, onPlus, disabled,
}: {
  team: string; score: number;
  onMinus: () => void; onPlus: () => void; disabled: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <FlagImg team={team} size="sm" />
      {/* Name */}
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide text-center leading-tight">
        {team}
      </p>
      {/* Stepper */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMinus}
          disabled={disabled}
          className="w-10 h-10 rounded-full border flex items-center justify-center text-xl font-bold disabled:opacity-40 cursor-pointer active:bg-gray-50"
          style={{ borderColor: C.borderDefault, color: C.scoreText }}
        >−</button>
        <span className="w-10 text-center tabular-nums leading-none" style={{ fontSize: FS.hero, fontWeight: FW.bold, color: C.textPrimary }}>
          {score}
        </span>
        <button
          onClick={onPlus}
          disabled={disabled}
          className="w-10 h-10 rounded-full border flex items-center justify-center text-xl font-bold disabled:opacity-40 cursor-pointer active:bg-gray-50"
          style={{ borderColor: C.borderDefault, color: C.scoreText }}
        >+</button>
      </div>
    </div>
  );
}

export default function PredictionModal({ match, prediction, now, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [homeScore, setHomeScore] = useState(prediction?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(prediction?.awayScore ?? 0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { setMounted(true); }, []);

  const matchTime = new Date(match.scheduledAt).getTime();
  const isLocked = matchTime <= now;

  function handleSave() {
    if (isLocked) return;
    haptic("medium");
    startTransition(async () => {
      await savePrediction(match.id, homeScore, awayScore);
      onClose();
    });
  }

  if (!mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl animate-modal-in pb-8"
        style={{ maxHeight: "calc(100dvh - 80px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-gray-900" style={{ fontSize: FS.title, fontWeight: FW.extrabold }}>
              {prediction ? "Editar pronóstico" : "Pronosticar"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(match.scheduledAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 -mt-1 rounded-full active:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header divider */}
        <div className="border-t border-gray-100 mx-6 mb-6" />

        {/* Steppers — flag + name + controls in one column each */}
        <div className="px-6 flex items-start gap-3">
          <TeamStepper
            team={match.homeTeam}
            score={homeScore}
            onMinus={() => setHomeScore(Math.max(0, homeScore - 1))}
            onPlus={() => setHomeScore(Math.min(20, homeScore + 1))}
            disabled={isLocked}
          />

          <div className="flex flex-col items-center justify-center pt-10">
            <span className="text-sm font-bold text-gray-300">vs</span>
          </div>

          <TeamStepper
            team={match.awayTeam}
            score={awayScore}
            onMinus={() => setAwayScore(Math.max(0, awayScore - 1))}
            onPlus={() => setAwayScore(Math.min(20, awayScore + 1))}
            disabled={isLocked}
          />
        </div>

        {/* Lock message or helper text */}
        {isLocked ? (
          <div className="mx-6 mt-5 bg-orange-50 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-orange-700">
              Pronóstico cerrado. El partido ya inició.
            </p>
          </div>
        ) : (
          <p className="text-center text-[12px] font-semibold text-gray-400 mt-5 px-6">
            Editable hasta el inicio del partido.
          </p>
        )}

        {/* Actions */}
        <div className="px-6 mt-5">
          <button
            onClick={handleSave}
            disabled={isPending || isLocked}
            className="w-full text-white text-sm font-bold disabled:opacity-50 cursor-pointer active:opacity-90"
            style={{ backgroundColor: C.primary, height: 52, borderRadius: 16 }}
          >
            {isPending ? "Guardando..." : "Guardar pronóstico"}
          </button>
          <div className="flex justify-center mt-3">
            <button
              onClick={onClose}
              className="text-sm font-semibold cursor-pointer"
              style={{ color: C.textMuted }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
