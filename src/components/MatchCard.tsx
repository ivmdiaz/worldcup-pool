"use client";

import { formatTime, getCloseText } from "@/lib/datetime";
import { computeMatchStatus } from "@/lib/match";
import { C, LABEL, SCORE, SEP, FS, FW, SPACE } from "@/lib/tokens";
import FlagImg from "@/components/FlagImg";

type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";
type ComputedStatus = "PENDING" | "LOCKED" | "LIVE" | "FINISHED";

export type MatchCardMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  group: string | null;
  stage: string;
};

export type MatchCardPrediction = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
};

interface Props {
  match: MatchCardMatch;
  prediction?: MatchCardPrediction;
  now: number;
  onPredict?: (match: MatchCardMatch, prediction?: MatchCardPrediction) => void;
  style?: React.CSSProperties;
}

type Pill = { text: string; bg: string; color: string; border: string };

function getHeaderPill(computedStatus: ComputedStatus, prediction?: MatchCardPrediction): Pill {
  if (computedStatus === "FINISHED") {
    const pts = prediction ? (prediction.points ?? 0) : 0;
    if (pts === 3) return { text: "+3 pts", bg: C.successBg, color: C.successText, border: C.successBorder };
    if (pts === 1) return { text: "+1 pt",  bg: C.warningBg, color: C.warningText, border: C.warningBorder };
    return                 { text: "0 pts",  bg: C.neutralBg, color: C.neutralText, border: C.neutralBorder };
  }
  const map: Record<string, Pill> = {
    PENDING: { text: "Pendiente", bg: C.successBg, color: C.successText, border: C.successBorder },
    LOCKED:  { text: "Cerrado",   bg: C.warningBg, color: C.warningText, border: C.warningBorder },
    LIVE:    { text: "En vivo",   bg: C.dangerBg,  color: C.dangerText,  border: C.dangerBorder  },
  };
  return map[computedStatus];
}

export default function MatchCard({ match, prediction, now, onPredict, style }: Props) {
  const matchTime = new Date(match.scheduledAt).getTime();
  const computedStatus = computeMatchStatus(match.status, match.scheduledAt, now) as ComputedStatus;
  const isFinished = computedStatus === "FINISHED";
  const isLive     = computedStatus === "LIVE";
  const isLocked   = computedStatus === "LOCKED";
  const isPending  = computedStatus === "PENDING";
  const diffMs = isPending ? Math.max(0, matchTime - now) : 0;
  const diffMinutes = Math.floor(diffMs / 60000);

  const pill = getHeaderPill(computedStatus, prediction);

  const predDisplay = prediction
    ? `${prediction.homeScore}${SEP}${prediction.awayScore}`
    : "—";

  const realDisplay = match.homeScore !== null && match.awayScore !== null
    ? `${match.homeScore}${SEP}${match.awayScore}`
    : "—";

  const hasLiveScore = match.homeScore !== null && match.awayScore !== null;

  return (
    <div
      className="bg-white rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.10)] flex flex-col shrink-0 animate-entrance overflow-hidden"
      style={style}
    >
      {/* Header row */}
      <div className="px-4 pt-3 pb-3 flex items-center justify-between min-h-[44px]">
        <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>
          {match.group ? `Grupo ${match.group} · ` : ""}{formatTime(match.scheduledAt)}
        </span>
        <span
          className="rounded-full shrink-0"
          style={{
            fontSize: FS.caption, fontWeight: FW.extrabold,
            backgroundColor: pill.bg, color: pill.color,
            border: `1px solid ${pill.border}`,
            padding: SPACE.pill,
            minWidth: 56, textAlign: "center" as const,
          }}
        >
          {pill.text}
        </span>
      </div>

      {/* Teams row */}
      <div className="px-4 pt-1 pb-2 flex items-center gap-2">
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <FlagImg team={match.homeTeam} />
          <p style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textPrimary }} className="text-center leading-tight">{match.homeTeam}</p>
        </div>
        <div className="w-10 shrink-0 flex justify-center">
          <span style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textSecondary }}>vs</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <FlagImg team={match.awayTeam} />
          <p style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textPrimary }} className="text-center leading-tight">{match.awayTeam}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t" style={{ borderColor: C.divider }} />

      {/* Scoreboard container */}
      <div className="px-4 pt-3 pb-0">
        <div style={{ backgroundColor: C.scoreboardBg, border: `1px solid ${C.divider}`, borderRadius: 12, padding: SPACE.board }}>

          {/* PENDING */}
          {computedStatus === "PENDING" && (
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p style={LABEL}>Mi pronóstico</p>
                {prediction ? (
                  <p className="tabular-nums mt-1" style={SCORE}>{predDisplay}</p>
                ) : (
                  <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.textSecondary, lineHeight: 1.2 }}>Sin pronóstico</p>
                )}
              </div>
              <div className="text-right">
                <p style={LABEL}>Cierre</p>
                <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.textSecondary, lineHeight: 1.2 }}>
                  {getCloseText(match.scheduledAt, now)}
                </p>
              </div>
            </div>
          )}

          {/* LOCKED */}
          {computedStatus === "LOCKED" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={LABEL}>Mi pronóstico</p>
                <p className="tabular-nums mt-1" style={SCORE}>{predDisplay}</p>
              </div>
              <div className="text-right">
                <p style={LABEL}>Estado</p>
                <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.warningText, lineHeight: 1.2 }}>Cerrado</p>
              </div>
            </div>
          )}

          {/* LIVE */}
          {computedStatus === "LIVE" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={LABEL}>Mi pronóstico</p>
                <p className="tabular-nums mt-1" style={SCORE}>{predDisplay}</p>
              </div>
              <div className="text-right">
                <p style={LABEL}>{hasLiveScore ? "Marcador" : "Estado"}</p>
                {hasLiveScore ? (
                  <p className="tabular-nums mt-1" style={{ fontSize: FS.title, fontWeight: FW.medium, color: C.scoreText, lineHeight: 1.1 }}>
                    {realDisplay}
                  </p>
                ) : (
                  <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.dangerText, lineHeight: 1.2 }}>En vivo</p>
                )}
              </div>
            </div>
          )}

          {/* FINISHED */}
          {computedStatus === "FINISHED" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p style={LABEL}>Resultado</p>
                <p className="tabular-nums mt-1" style={SCORE}>{realDisplay}</p>
              </div>
              <div className="text-right">
                <p style={LABEL}>Mi pronóstico</p>
                <p className="tabular-nums mt-1" style={SCORE}>{predDisplay}</p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CTA — only for PENDING; solid only when ≤60 min */}
      {isPending ? (
        <div className="px-4 pt-2.5 pb-3">
          {!prediction ? (
            <button
              onClick={() => onPredict?.(match, undefined)}
              className="w-full h-10 rounded-[14px] text-sm cursor-pointer transition-opacity active:opacity-80"
              style={
                diffMinutes <= 60
                  ? { backgroundColor: C.primary, color: C.white, fontWeight: FW.bold }
                  : { border: `1px solid ${C.primary}`, color: C.primary, backgroundColor: "transparent", fontWeight: FW.bold }
              }
            >
              Pronosticar
            </button>
          ) : (
            <button
              onClick={() => onPredict?.(match, prediction)}
              className="w-full h-10 rounded-[14px] text-sm cursor-pointer active:opacity-80"
              style={{ border: `1px solid ${C.primary}`, color: C.primary, backgroundColor: "transparent", fontWeight: FW.bold }}
            >
              Editar pronóstico
            </button>
          )}
        </div>
      ) : (
        <div className="pb-2.5" />
      )}
    </div>
  );
}
