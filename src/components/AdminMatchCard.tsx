"use client";

import { formatTime } from "@/lib/datetime";
import { computeMatchStatus } from "@/lib/match";
import { C, LABEL, SCORE, SEP, FS, FW, SPACE } from "@/lib/tokens";
import { type MatchCardMatch } from "@/components/MatchCard";
import FlagImg from "@/components/FlagImg";

interface Props {
  match: MatchCardMatch;
  now: number;
  onEdit?: (match: MatchCardMatch) => void;
  style?: React.CSSProperties;
}

const STATUS_BADGE_STYLE = {
  FINISHED: { backgroundColor: C.neutralBg,  color: C.neutralText,  border: `1px solid ${C.neutralBorder}`  },
  LIVE:     { backgroundColor: C.dangerBg,   color: C.dangerText,   border: `1px solid ${C.dangerBorder}`   },
  LOCKED:   { backgroundColor: C.warningBg,  color: C.warningText,  border: `1px solid ${C.warningBorder}`  },
  PENDING:  { backgroundColor: C.successBg,  color: C.successText,  border: `1px solid ${C.successBorder}`  },
} as const;

const STATUS_LABEL = { FINISHED: "Finalizado", LIVE: "En vivo", LOCKED: "Cerrado", PENDING: "Pendiente" } as const;

export default function AdminMatchCard({ match, now, onEdit, style }: Props) {
  const computedStatus = computeMatchStatus(match.status, match.scheduledAt, now);
  const canEdit = computedStatus !== "LIVE";

  const resultDisplay = match.homeScore !== null && match.awayScore !== null
    ? `${match.homeScore}${SEP}${match.awayScore}`
    : null;

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
          style={{ ...STATUS_BADGE_STYLE[computedStatus], fontSize: FS.caption, fontWeight: FW.extrabold, padding: SPACE.pill, minWidth: 56, textAlign: "center" as const }}
        >
          {STATUS_LABEL[computedStatus]}
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

      {/* Scoreboard */}
      <div className="px-4 pt-3 pb-0">
        <div style={{ backgroundColor: C.scoreboardBg, border: `1px solid ${C.divider}`, borderRadius: 12, padding: SPACE.board }}>
          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <p style={LABEL}>Resultado</p>
              {resultDisplay ? (
                <p className="tabular-nums mt-1" style={SCORE}>{resultDisplay}</p>
              ) : (
                <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.textSecondary, lineHeight: 1.2 }}>
                  Sin resultado
                </p>
              )}
            </div>
            <div className="text-right">
              <p style={LABEL}>Estado</p>
              <p className="mt-1" style={{ fontSize: FS.body, fontWeight: FW.medium, color: C.textSecondary, lineHeight: 1.2 }}>
                {STATUS_LABEL[computedStatus]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      {canEdit ? (
        <div className="px-4 pt-2.5 pb-3">
          <button
            onClick={() => onEdit?.(match)}
            className="w-full h-10 rounded-[14px] text-sm font-bold cursor-pointer transition-opacity active:opacity-80"
            style={{ border: `1px solid ${C.primary}`, color: C.primary, backgroundColor: "transparent" }}
          >
            {computedStatus === "FINISHED" ? "Editar resultado" : "Confirmar resultado"}
          </button>
        </div>
      ) : (
        <div className="pb-2.5" />
      )}
    </div>
  );
}
