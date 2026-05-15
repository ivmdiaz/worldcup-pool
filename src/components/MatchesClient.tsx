"use client";

import { useState, useRef, useEffect } from "react";
import MatchCard, { type MatchCardMatch, type MatchCardPrediction } from "@/components/MatchCard";
import PredictionModal from "@/components/PredictionModal";
import { getDayKey, formatTabLabel, formatDayHeader } from "@/lib/datetime";
import { C } from "@/lib/tokens";

interface Props {
  matches: MatchCardMatch[];
  predictions: MatchCardPrediction[];
  now: number;
}

type ActivePrediction = { match: MatchCardMatch; prediction?: MatchCardPrediction };

export default function MatchesClient({ matches, predictions, now }: Props) {
  const dates = [...new Set(matches.map((m) => getDayKey(m.scheduledAt)))].sort();
  const todayKey = getDayKey(new Date(now));
  const defaultDate = dates.includes(todayKey) ? todayKey : (dates[0] ?? "");
  const [selected, setSelected] = useState(defaultDate);
  const [activePred, setActivePred] = useState<ActivePrediction | null>(null);

  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    btnRefs.current[selected]?.scrollIntoView({
      behavior: "smooth", inline: "center", block: "nearest",
    });
  }, [selected]);

  const predMap = new Map(predictions.map((p) => [p.matchId, p]));
  const dayMatches = matches
    .filter((m) => getDayKey(m.scheduledAt) === selected)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  const isToday = selected === todayKey;

  return (
    <>
      <div className="flex flex-col">

        {/* Date tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 shrink-0">
          {dates.map((key) => (
            <button
              key={key}
              ref={(el) => { btnRefs.current[key] = el; }}
              onClick={() => setSelected(key)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer border ${
                selected === key
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-gray-500 border-gray-200 shadow-sm"
              }`}
            >
              {formatTabLabel(key)}
              {key === todayKey && selected !== key && (
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-amber-400 inline-block mb-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Day header */}
        <p className="mt-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest capitalize shrink-0">
          {isToday ? "Hoy · " : ""}{formatDayHeader(selected)}
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          {dayMatches.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Sin partidos este día.</p>
          ) : (
            dayMatches.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                prediction={predMap.get(match.id)}
                now={now}
                onPredict={(m, p) => setActivePred({ match: m, prediction: p })}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))
          )}
        </div>
      </div>

      {activePred && (
        <PredictionModal
          match={activePred.match}
          prediction={activePred.prediction}
          now={now}
          onClose={() => setActivePred(null)}
        />
      )}
    </>
  );
}
