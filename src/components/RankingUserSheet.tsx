"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { type RankingEntry } from "@/lib/ranking";
import { type UserDetail } from "@/app/(app)/ranking/actions";
import { C, FS, FW, SEP, LABEL } from "@/lib/tokens";
import { formatTime } from "@/lib/datetime";

const MEDAL = ["🥇", "🥈", "🥉"];

function Avatar({ name, image, size = 56 }: { name: string; image: string | null; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover shrink-0" />;
  }
  return (
    <div
      className="rounded-full bg-stone-200 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>
        {initials}
      </span>
    </div>
  );
}

function PointsPill({ pts }: { pts: number }) {
  const styles =
    pts === 3 ? { bg: C.successBg, text: C.successText, border: C.successBorder, label: "+3 pts" } :
    pts === 1 ? { bg: C.warningBg, text: C.warningText, border: C.warningBorder, label: "+1 pt"  } :
                { bg: C.neutralBg, text: C.neutralText, border: C.neutralBorder, label: "0 pts"  };
  return (
    <span
      className="rounded-full shrink-0"
      style={{
        fontSize: FS.caption, fontWeight: FW.extrabold,
        backgroundColor: styles.bg, color: styles.text,
        border: `1px solid ${styles.border}`,
        padding: "4px 10px",
      }}
    >
      {styles.label}
    </span>
  );
}

interface Props {
  entry: RankingEntry;
  position: number;
  detail: UserDetail | null;
  loading: boolean;
  onClose: () => void;
}

export default function RankingUserSheet({ entry, position, detail, loading, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const medal = position <= 3 ? MEDAL[position - 1] : null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl animate-modal-in flex flex-col"
        style={{ maxHeight: "calc(100dvh - 60px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 px-5 pt-3 pb-4 border-b border-gray-100 shrink-0">
          <Avatar name={entry.name} image={entry.image} size={52} />
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: FS.title, fontWeight: FW.extrabold, color: C.textPrimary }} className="leading-tight truncate">
              {medal && <span className="mr-1">{medal}</span>}{entry.name}
            </p>
            <p style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }} className="mt-0.5">
              #{position} · {entry.totalPoints} pts · {entry.exactCount} exactos
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full active:bg-gray-100 cursor-pointer shrink-0">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {loading ? (
            <p className="text-center py-8" style={{ fontSize: FS.body, color: C.textSecondary }}>Cargando...</p>
          ) : !detail || detail.predictions.length === 0 ? (
            <p className="text-center py-8" style={{ fontSize: FS.body, color: C.textSecondary }}>Sin pronósticos finalizados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {detail.predictions.map((p) => (
                <div
                  key={p.matchId}
                  className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-col gap-2"
                  style={{ border: `1px solid ${C.divider}` }}
                >
                  {/* Match header */}
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>
                      {p.group ? `Grupo ${p.group} · ` : ""}{formatTime(p.scheduledAt)}
                    </span>
                    <PointsPill pts={p.points} />
                  </div>
                  {/* Teams + scores */}
                  <div className="flex items-center justify-between">
                    <p style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textPrimary }} className="truncate">
                      {p.homeTeam} vs {p.awayTeam}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p style={LABEL}>Resultado</p>
                      <p className="tabular-nums mt-0.5" style={{ fontSize: FS.title, fontWeight: FW.medium, color: C.scoreText }}>
                        {p.homeScore}{SEP}{p.awayScore}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={LABEL}>Pronóstico</p>
                      <p className="tabular-nums mt-0.5" style={{ fontSize: FS.title, fontWeight: FW.medium, color: C.scoreText }}>
                        {p.predHome}{SEP}{p.predAway}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
