"use client";

import { useState } from "react";
import { type RankingEntry } from "@/lib/ranking";
import { type UserDetail, getUserDetail } from "@/app/(app)/ranking/actions";
import { C, FS, FW } from "@/lib/tokens";
import { haptic } from "@/lib/haptic";
import RankingUserSheet from "@/components/RankingUserSheet";

const MEDAL_COLOR = ["#F59E0B", "#94A3B8", "#92400E"] as const;
const PEDESTAL_H  = [90, 65, 45] as const;
const FLOAT_DELAY = [0, 400, 800] as const; // stagger por posición

function CrownIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={color} className="drop-shadow-md">
      <path d="M2 19h20v2H2v-2zM2 6l5 6 5-8 5 6 5-6v11H2V6z" />
    </svg>
  );
}

function Avatar({ name, image, size = 48 }: { name: string; image: string | null; size?: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={name} style={{ width: size, height: size }} className="rounded-full object-cover ring-2 ring-stone-300 shrink-0" />;
  }
  return (
    <div
      className="rounded-full bg-stone-300 flex items-center justify-center ring-2 ring-white shrink-0"
      style={{ width: size, height: size }}
    >
      <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>
        {initials}
      </span>
    </div>
  );
}

function PodiumSlot({
  entry, position, isCurrent, onClick,
}: {
  entry: RankingEntry | null;
  position: 1 | 2 | 3;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const pedestalH = PEDESTAL_H[position - 1];
  const medalColor = MEDAL_COLOR[position - 1];
  const avatarSize = position === 1 ? 60 : 46;

  const floatDelay = FLOAT_DELAY[position - 1];

  if (!entry) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end">
        <div className="rounded-t-xl w-full" style={{ height: pedestalH, backgroundColor: `${medalColor}30` }} />
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0 cursor-pointer active:opacity-80 transition-opacity animate-podium-float"
      style={{ animationDelay: `${floatDelay}ms` }}
    >
      {/* Avatar con corona overlaid */}
      <div className="relative mb-1">
        <Avatar name={entry.name} image={entry.image} size={avatarSize} />
        {/* Corona centrada encima del avatar */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <CrownIcon color={medalColor} />
        </div>
      </div>

      {/* Name */}
      <p
        className="text-center leading-tight px-1 w-full truncate"
        style={{
          fontSize: FS.micro, fontWeight: FW.extrabold,
          color: isCurrent ? C.primary : C.textPrimary,
        }}
      >
        {entry.name.split(" ")[0]}
      </p>

      {/* Points */}
      <p style={{ fontSize: FS.micro, fontWeight: FW.semibold, color: C.textSecondary }}>
        {entry.totalPoints} pts
      </p>

      {/* Pedestal */}
      <div
        className="rounded-t-xl w-full mt-1"
        style={{ height: pedestalH, backgroundColor: `${medalColor}50`, border: `2px solid ${medalColor}80` }}
      />
    </button>
  );
}

interface Props {
  entries: RankingEntry[];
  currentUserId: string;
}

export default function RankingClient({ entries, currentUserId }: Props) {
  const [selectedEntry, setSelectedEntry]  = useState<RankingEntry | null>(null);
  const [selectedPosition, setSelectedPos] = useState(0);
  const [detail, setDetail]                = useState<UserDetail | null>(null);
  const [loading, setLoading]              = useState(false);

  const rest = entries.slice(3);

  async function handleSelect(entry: RankingEntry, position: number) {
    haptic("light");
    setSelectedEntry(entry);
    setSelectedPos(position);
    setDetail(null);
    setLoading(true);
    try {
      const d = await getUserDetail(entry.id);
      setDetail(d);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSelectedEntry(null);
    setDetail(null);
    setLoading(false);
  }

  return (
    <div className="flex flex-col animate-entrance" style={{ height: "100dvh" }}>

      {/* ── Podio ── */}
      <div className="flex-[4] min-h-0 overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50 flex flex-col px-5 pt-4 pb-0">
        <p
          className="shrink-0 mb-2"
          style={{ fontSize: FS.title, fontWeight: FW.extrabold, color: C.textPrimary }}
        >
          Ranking
        </p>

        {entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p style={{ fontSize: FS.body, color: C.textSecondary }}>Aún sin participantes.</p>
          </div>
        ) : (
          <div className="flex-1 flex items-end justify-center gap-3 min-h-0">
            {([2, 1, 3] as const).map((pos) => {
              const entry = entries[pos - 1] ?? null;
              return (
                <PodiumSlot
                  key={pos}
                  entry={entry}
                  position={pos}
                  isCurrent={entry?.id === currentUserId}
                  onClick={() => entry && handleSelect(entry, pos)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Lista (4th+) ── */}
      <div className="flex-[6] min-h-0 overflow-y-auto scrollbar-hide px-4 pt-3 pb-20 bg-gray-100">
        {rest.length === 0 && entries.length >= 3 ? (
          <p className="text-center py-6" style={{ fontSize: FS.body, color: C.textSecondary }}>
            Solo hay {entries.length} participante{entries.length !== 1 ? "s" : ""}.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {rest.map((entry, i) => {
              const position = i + 4;
              const isCurrent = entry.id === currentUserId;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry, position)}
                  className="w-full text-left cursor-pointer active:opacity-80 transition-opacity"
                >
                  <div
                    className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{
                      border: isCurrent ? `1.5px solid ${C.primary}` : `1px solid ${C.divider}`,
                      backgroundColor: isCurrent ? C.successBg : C.surface,
                    }}
                  >
                    <span
                      className="shrink-0 tabular-nums w-6 text-center"
                      style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}
                    >
                      {position}
                    </span>
                    <Avatar name={entry.name} image={entry.image} size={36} />
                    <p
                      className="flex-1 truncate"
                      style={{
                        fontSize: FS.body, fontWeight: FW.bold,
                        color: isCurrent ? C.primary : C.textPrimary,
                      }}
                    >
                      {entry.name}
                      {isCurrent && <span style={{ fontSize: FS.micro, fontWeight: FW.medium, color: C.primary }}> · tú</span>}
                    </p>
                    <p
                      className="shrink-0 tabular-nums"
                      style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textPrimary }}
                    >
                      {entry.totalPoints} pts
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Bottom sheet ── */}
      {selectedEntry && (
        <RankingUserSheet
          entry={selectedEntry}
          position={selectedPosition}
          detail={detail}
          loading={loading}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
