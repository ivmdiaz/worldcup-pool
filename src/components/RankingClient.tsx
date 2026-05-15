"use client";

import { useState, useRef, useEffect } from "react";
import { type RankingEntry } from "@/lib/ranking";
import { type UserDetail, getUserDetail } from "@/app/(app)/ranking/actions";
import { C, FS, FW } from "@/lib/tokens";
import { haptic } from "@/lib/haptic";
import RankingUserSheet from "@/components/RankingUserSheet";

// ── Medal config ──────────────────────────────────────────────────────────────
const MEDAL_COLOR = ["#F59E0B", "#64748B", "#C2782A"] as const;

const BLOCK_H: Record<1 | 2 | 3, string> = {
  1: "clamp(100px, 16dvh, 145px)",
  2: "clamp(87px,  14dvh, 120px)",
  3: "clamp(75px,  12dvh, 100px)",
};


// ── Components ────────────────────────────────────────────────────────────────
function CrownIcon({ color }: { color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "white", boxShadow: `0 2px 8px rgba(0,0,0,0.18)` }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={0.5} strokeLinejoin="round">
        <path d="M2 19h20v2H2v-2zM2 6l5 6 5-8 5 6 5-6v11H2V6z" />
      </svg>
    </div>
  );
}

function PodiumAvatar({
  name, image, size, medalColor,
}: {
  name: string; image: string | null; size: number; medalColor: string;
}) {
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth === 0) setErr(true);
  }, []);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const ring: React.CSSProperties = {
    boxShadow: `0 0 0 3px ${medalColor}`,
    borderRadius: "50%",
    width: size,
    height: size,
    objectFit: "cover" as const,
    flexShrink: 0,
  };
  if (image && !err) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} src={image} alt="" style={ring} onError={() => setErr(true)} />;
  }
  return (
    <div className="bg-stone-200 flex items-center justify-center shrink-0" style={ring}>
      <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>{initials}</span>
    </div>
  );
}

function ListAvatar({ name, image }: { name: string; image: string | null }) {
  const [err, setErr] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth === 0) setErr(true);
  }, []);
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (image && !err) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img ref={ref} src={image} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" onError={() => setErr(true)} />;
  }
  return (
    <div className="w-11 h-11 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
      <span style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}>{initials}</span>
    </div>
  );
}

function PodiumSlot({
  entry, position, onClick,
}: {
  entry: RankingEntry | null;
  position: 1 | 2 | 3;
  onClick: () => void;
}) {
  const medalColor = MEDAL_COLOR[position - 1];
  const avatarSize = 76;
  const blockH = BLOCK_H[position];

  if (!entry) return <div className="flex-1" />;

  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col justify-end items-center cursor-pointer active:opacity-75 transition-opacity"
    >
      <CrownIcon color={medalColor} />

      <PodiumAvatar name={entry.name} image={entry.image} size={avatarSize} medalColor={medalColor} />

      {/* Pedestal — nombre y pts conectan directo con el avatar */}
      <div
        className="w-full rounded-t-2xl flex flex-col items-center justify-center gap-0.5 px-2 pt-2 pb-3"
        style={{ height: blockH, backgroundColor: medalColor }}
      >
        <p
          className="text-center leading-tight w-full truncate"
          style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: "white" }}
        >
          {entry.name.split(" ")[0]}
        </p>
        <p style={{ fontSize: FS.caption, fontWeight: FW.semibold, color: "rgba(255,255,255,0.85)" }}>
          {entry.totalPoints} pts
        </p>
        <span
          className="mt-1 w-6 h-6 rounded-full flex items-center justify-center bg-white"
          style={{ fontSize: "11px", fontWeight: FW.extrabold, color: medalColor }}
        >
          {position}
        </span>
      </div>
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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
      <div
        className="relative flex-[4] min-h-0 overflow-hidden flex flex-col px-5 pt-4 pb-0"
        style={{ backgroundImage: "url('/ranking-background.png')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Fireworks — 3 bursts */}
        <div className="fw-burst" />
        <div className="fw-burst fw-burst-2" />
        <div className="fw-burst fw-burst-3" />

        {entries.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p style={{ fontSize: FS.body, color: C.textSecondary }}>Aún sin participantes.</p>
          </div>
        ) : (
          <div className="relative z-10 flex-1 flex items-end gap-2 min-h-0">
            {([2, 1, 3] as const).map((pos) => (
              <PodiumSlot
                key={pos}
                entry={entries[pos - 1] ?? null}
                position={pos}
                onClick={() => {
                  const e = entries[pos - 1];
                  if (e) handleSelect(e, pos);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Lista (4th+) ── */}
      <div className="flex-[6] min-h-0 overflow-y-auto scrollbar-hide bg-white px-5 pt-2 pb-20">
        {rest.length === 0 ? (
          <p className="text-center py-6" style={{ fontSize: FS.body, color: C.textSecondary }}>
            Solo hay {entries.length} participante{entries.length !== 1 ? "s" : ""}.
          </p>
        ) : (
          <div className="flex flex-col">
            {rest.map((entry, i) => {
              const position = i + 4;
              const isCurrent = entry.id === currentUserId;
              return (
                <button
                  key={entry.id}
                  onClick={() => handleSelect(entry, position)}
                  className="w-full text-left cursor-pointer active:opacity-70 transition-opacity"
                >
                  <div className="flex items-center gap-3 py-3.5">
                    <span
                      className="shrink-0 w-5 text-center tabular-nums"
                      style={{ fontSize: FS.caption, fontWeight: FW.bold, color: C.textSecondary }}
                    >
                      {position}
                    </span>
                    <ListAvatar name={entry.name} image={entry.image} />
                    <p
                      className="flex-1 truncate"
                      style={{ fontSize: FS.body, fontWeight: FW.bold, color: isCurrent ? C.primary : C.textPrimary }}
                    >
                      {entry.name}
                      {isCurrent && (
                        <span style={{ fontSize: FS.micro, fontWeight: FW.medium, color: C.primary }}> · tú</span>
                      )}
                    </p>
                    <p className="shrink-0 tabular-nums" style={{ fontSize: FS.body, fontWeight: FW.extrabold, color: C.textPrimary }}>
                      {entry.totalPoints} pts
                    </p>
                  </div>
                  {i < rest.length - 1 && (
                    <div className="ml-[60px] border-t" style={{ borderColor: C.divider }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

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
