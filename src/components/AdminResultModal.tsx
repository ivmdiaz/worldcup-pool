"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { type MatchCardMatch } from "@/components/MatchCard";
import { updateMatchResult, updateMatchTeams } from "@/app/(app)/admin/actions";
import { haptic } from "@/lib/haptic";
import { formatDateTime } from "@/lib/datetime";
import { C, FS, FW } from "@/lib/tokens";
import FlagImg from "@/components/FlagImg";
import { TEAM_NAMES, flagUrl } from "@/lib/countrycodes";

interface Props {
  match: MatchCardMatch;
  onClose: () => void;
}

function StepperButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-10 h-10 rounded-full border flex items-center justify-center text-xl font-bold cursor-pointer active:bg-gray-50"
      style={{ borderColor: C.borderDefault, color: C.scoreText }}
    >
      {children}
    </button>
  );
}

function TeamPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const filtered = query.length > 0
    ? TEAM_NAMES.filter(t => t.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  function select(team: string) {
    onChange(team);
    setQuery(team);
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-1.5 relative">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-gray-50" style={{ borderColor: value ? C.primary : C.borderDefault }}>
        {value && <img src={flagUrl(value) ?? ""} alt="" className="w-6 h-4 object-cover rounded-sm shrink-0" />}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(""); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar equipo..."
          className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
          style={{ color: C.textPrimary }}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white rounded-xl shadow-lg border mt-1 overflow-hidden" style={{ borderColor: C.divider }}>
          {filtered.map(team => (
            <button
              key={team}
              type="button"
              onMouseDown={() => select(team)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-left active:bg-gray-50 hover:bg-gray-50"
            >
              <img src={flagUrl(team) ?? ""} alt="" className="w-6 h-4 object-cover rounded-sm shrink-0" />
              <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{team}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const PLACEHOLDER_PREFIXES = ["Ganador", "Subcampeón", "Mejor", "Perdedor"];
const isPlaceholder = (name: string) => PLACEHOLDER_PREFIXES.some(p => name.startsWith(p));

export default function AdminResultModal({ match, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0);
  const [homeTeam, setHomeTeam] = useState(isPlaceholder(match.homeTeam) ? "" : match.homeTeam);
  const [awayTeam, setAwayTeam] = useState(isPlaceholder(match.awayTeam) ? "" : match.awayTeam);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { setMounted(true); }, []);

  const [teamsMode, setTeamsMode] = useState(
    isPlaceholder(match.homeTeam) || isPlaceholder(match.awayTeam)
  );

  function handleSave() {
    haptic("medium");
    startTransition(async () => {
      if (teamsMode) {
        await updateMatchTeams(match.id, homeTeam, awayTeam);
      } else {
        const fd = new FormData();
        fd.append("matchId", match.id);
        fd.append("homeScore", String(homeScore));
        fd.append("awayScore", String(awayScore));
        await updateMatchResult(fd);
      }
      onClose();
    });
  }

  if (!mounted) return null;

  const isEdit = match.status === "FINISHED";

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
              {teamsMode ? "Confirmar equipos" : isEdit ? "Editar resultado" : "Confirmar resultado"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(match.scheduledAt)}</p>
            {!teamsMode && (
              <button
                type="button"
                onClick={() => setTeamsMode(true)}
                className="text-xs font-semibold mt-1 cursor-pointer"
                style={{ color: C.primary }}
              >
                Editar equipos
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 -mr-1.5 -mt-1 rounded-full active:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mx-6 mb-6" />

        {teamsMode ? (
          /* ── Modo equipos ── */
          <div className="px-6 flex flex-col gap-4">
            <TeamPicker
              label={match.homeTeam}
              value={homeTeam}
              onChange={setHomeTeam}
            />
            <TeamPicker
              label={match.awayTeam}
              value={awayTeam}
              onChange={setAwayTeam}
            />
            <p className="text-[12px] font-semibold text-gray-400 text-center">
              Al confirmar el partido aparece disponible para pronosticar.
            </p>
          </div>
        ) : (
          /* ── Modo resultado ── */
          <>
            <div className="px-6 flex items-start gap-3">
              <div className="flex-1 flex flex-col items-center gap-2">
                <FlagImg team={match.homeTeam} />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide text-center">
                  {match.homeTeam}
                </p>
                <div className="flex items-center gap-3">
                  <StepperButton onClick={() => setHomeScore(Math.max(0, homeScore - 1))}>−</StepperButton>
                  <span className="w-10 text-center tabular-nums leading-none" style={{ fontSize: FS.hero, fontWeight: FW.bold, color: C.textPrimary }}>
                    {homeScore}
                  </span>
                  <StepperButton onClick={() => setHomeScore(Math.min(20, homeScore + 1))}>+</StepperButton>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center pt-10">
                <span className="text-sm font-bold text-gray-300">vs</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2">
                <FlagImg team={match.awayTeam} />
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide text-center">
                  {match.awayTeam}
                </p>
                <div className="flex items-center gap-3">
                  <StepperButton onClick={() => setAwayScore(Math.max(0, awayScore - 1))}>−</StepperButton>
                  <span className="w-10 text-center tabular-nums leading-none" style={{ fontSize: FS.hero, fontWeight: FW.bold, color: C.textPrimary }}>
                    {awayScore}
                  </span>
                  <StepperButton onClick={() => setAwayScore(Math.min(20, awayScore + 1))}>+</StepperButton>
                </div>
              </div>
            </div>
            <p className="text-center text-[12px] font-semibold text-gray-400 mt-5 px-6">
              Al guardar se recalculan los puntos de todos los jugadores.
            </p>
          </>
        )}

        {/* Actions */}
        <div className="px-6 mt-5">
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || (teamsMode && (!TEAM_NAMES.includes(homeTeam) || !TEAM_NAMES.includes(awayTeam)))}
            className="w-full text-white text-sm font-bold disabled:opacity-50 cursor-pointer active:opacity-90"
            style={{ backgroundColor: C.primary, height: 52, borderRadius: 16 }}
          >
            {isPending ? "Guardando..." : teamsMode ? "Confirmar equipos" : "Guardar resultado"}
          </button>
          <div className="flex justify-center mt-3">
            <button
              type="button"
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
