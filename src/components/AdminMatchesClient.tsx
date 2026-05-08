"use client";

import { useState, useRef, useEffect } from "react";
import AdminMatchCard from "@/components/AdminMatchCard";
import AdminResultModal from "@/components/AdminResultModal";
import { type MatchCardMatch } from "@/components/MatchCard";
import { getDayKey, formatTabLabel, formatDayHeader } from "@/lib/datetime";
import { C } from "@/lib/tokens";

interface Props {
  matches: MatchCardMatch[];
  now: number;
}

export default function AdminMatchesClient({ matches, now }: Props) {
  const dates = [...new Set(matches.map((m) => getDayKey(m.scheduledAt)))].sort();
  const todayKey = getDayKey(new Date(now));
  const defaultDate = dates.includes(todayKey) ? todayKey : (dates[0] ?? "");
  const [selected, setSelected] = useState(defaultDate);
  const [activeMatch, setActiveMatch] = useState<MatchCardMatch | null>(null);

  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    btnRefs.current[selected]?.scrollIntoView({
      behavior: "smooth", inline: "center", block: "nearest",
    });
  }, [selected]);

  const dayMatches = matches
    .filter((m) => getDayKey(m.scheduledAt) === selected)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Date chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 shrink-0">
          {dates.map((key) => (
            <button
              key={key}
              ref={(el) => { btnRefs.current[key] = el; }}
              onClick={() => setSelected(key)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer border ${
                selected === key
                  ? "text-white"
                  : "bg-white text-gray-500 border-gray-200 shadow-sm"
              }`}
              style={selected === key ? { backgroundColor: C.primary, borderColor: C.primary } : {}}
            >
              {formatTabLabel(key)}
            </button>
          ))}
        </div>

        {/* Day header */}
        <p className="mt-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest capitalize shrink-0">
          {formatDayHeader(selected)}
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
          {dayMatches.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin partidos este día.</p>
          ) : (
            dayMatches.map((match, i) => (
              <AdminMatchCard
                key={match.id}
                match={match}
                now={now}
                onEdit={(m) => setActiveMatch(m)}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))
          )}
        </div>
      </div>

      {activeMatch && (
        <AdminResultModal
          match={activeMatch}
          onClose={() => setActiveMatch(null)}
        />
      )}
    </>
  );
}
