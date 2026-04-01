"use client";

import { useState } from "react";
import { savePrediction } from "@/app/(app)/matches/actions";
import { flag } from "@/lib/flags";

type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: Date | string;
  group: string | null;
  stage: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
};

type Prediction = {
  matchId: string;
  homeScore: number;
  awayScore: number;
  points: number | null;
};

interface Props {
  matches: Match[];
  predictions: Prediction[];
  now: number; // timestamp — evita problemas de serialización de Date entre server y client
}

const TZ = "America/Bogota";
const bogotaFmt = new Intl.DateTimeFormat("en", {
  timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
});

function bogotaParts(d: Date | string): { year: string; month: string; day: string } {
  const parts = bogotaFmt.formatToParts(new Date(d));
  return {
    year:  parts.find((p) => p.type === "year")!.value,
    month: parts.find((p) => p.type === "month")!.value,
    day:   parts.find((p) => p.type === "day")!.value,
  };
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: TZ,
  });
}

function formatDayHeader(date: Date): string {
  return new Date(date).toLocaleDateString("es", {
    weekday: "long", day: "numeric", month: "long",
    timeZone: TZ,
  });
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-bold flex items-center justify-center transition-colors cursor-pointer select-none"
      >
        −
      </button>
      <span className="w-6 text-center text-lg font-bold text-slate-900 tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-bold flex items-center justify-center transition-colors cursor-pointer select-none"
      >
        +
      </button>
    </div>
  );
}

function MatchCard({ match, pred, nowDate }: { match: Match; pred: Prediction | undefined; nowDate: Date }) {
  const [homeScore, setHomeScore] = useState(pred?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(pred?.awayScore ?? 0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const canPredict = match.status === "SCHEDULED" && new Date(match.scheduledAt) > nowDate;
  const isFinished = match.status === "FINISHED";
  const isLive = match.status === "LIVE";

  async function handleSave() {
    setSaveStatus("saving");
    await savePrediction(match.id, homeScore, awayScore);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 1500);
  }

  return (
    <li className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      {/* Teams grid — flag · name · [stepper] symmetric */}
      <div className="grid grid-cols-[1fr_48px_1fr] items-center gap-x-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl leading-none">{flag(match.homeTeam)}</span>
          <span className="text-xs font-semibold text-slate-800 text-center leading-tight">{match.homeTeam}</span>
          {canPredict && (
            <div className="mt-2">
              <Stepper value={homeScore} onChange={(v) => { setHomeScore(v); setSaveStatus("idle"); }} />
            </div>
          )}
        </div>

        {/* Center */}
        <div className="flex flex-col items-center justify-center self-start pt-1">
          {isFinished || isLive ? (
            <span className={`text-lg font-bold tabular-nums ${isLive ? "text-red-500" : "text-slate-900"}`}>
              {match.homeScore}–{match.awayScore}
            </span>
          ) : (
            <span className="text-xs font-medium text-slate-400 mt-4">vs</span>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl leading-none">{flag(match.awayTeam)}</span>
          <span className="text-xs font-semibold text-slate-800 text-center leading-tight">{match.awayTeam}</span>
          {canPredict && (
            <div className="mt-2">
              <Stepper value={awayScore} onChange={(v) => { setAwayScore(v); setSaveStatus("idle"); }} />
            </div>
          )}
        </div>
      </div>

      {/* Save button */}
      {canPredict && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`px-6 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
              saveStatus === "saved"
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white hover:bg-slate-700"
            }`}
          >
            {saveStatus === "saving" ? "Guardando…" : saveStatus === "saved" ? "✓ Guardado" : "Guardar"}
          </button>
        </div>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-xs text-slate-400">{formatDate(match.scheduledAt)}</span>
        {isLive && (
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">En vivo</span>
        )}
        {isFinished && pred && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            pred.points === 3 ? "text-green-700 bg-green-50" :
            pred.points === 1 ? "text-amber-700 bg-amber-50" :
            "text-slate-500 bg-slate-100"
          }`}>
            {pred.homeScore}–{pred.awayScore} · {pred.points ?? "?"}pts
          </span>
        )}
        {!isFinished && !isLive && pred && (
          <span className="text-xs text-emerald-600 font-semibold">✓ {pred.homeScore}–{pred.awayScore}</span>
        )}
      </div>
    </li>
  );
}


const KNOCKOUT_ROUNDS: { key: string; label: string }[] = [
  { key: "round_of_32",  label: "Fase de 32" },
  { key: "round_of_16",  label: "Octavos" },
  { key: "quarterfinal", label: "Cuartos" },
  { key: "semifinal",    label: "Semis" },
  { key: "third_place",  label: "3er puesto" },
  { key: "final",        label: "Final" },
];


function KnockoutView({ matches, predMap, nowDate }: { matches: Match[]; predMap: Map<string, Prediction>; nowDate: Date }) {
  const availableRounds = KNOCKOUT_ROUNDS.filter((r) => matches.some((m) => m.stage === r.key));
  const [activeRound, setActiveRound] = useState(availableRounds[0]?.key ?? "");

  if (availableRounds.length === 0) {
    return (
      <div className="mt-10 text-center">
        <p className="text-slate-400 text-sm">Los partidos de eliminatorias se mostrarán cuando finalice la fase de grupos.</p>
      </div>
    );
  }

  const roundMatches = matches.filter((m) => m.stage === activeRound);

  return (
    <div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {availableRounds.map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveRound(r.key)}
            className={`px-3 h-9 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeRound === r.key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {roundMatches.map((match) => (
          <MatchCard key={match.id} match={match} pred={predMap.get(match.id)} nowDate={nowDate} />
        ))}
      </ul>
    </div>
  );
}

type PickFilter = "all" | "exact" | "winner" | "miss";

function MyPicksView({ matches, predMap }: { matches: Match[]; predMap: Map<string, Prediction> }) {
  const [segment, setSegment] = useState<"finished" | "pending">("finished");
  const [filter, setFilter] = useState<PickFilter>("all");

  const myMatches = matches.filter((m) => predMap.has(m.id));
  const finished = myMatches.filter((m) => m.status === "FINISHED");
  const pending  = myMatches.filter((m) => m.status !== "FINISHED");

  const totalPts  = finished.reduce((s, m) => s + (predMap.get(m.id)?.points ?? 0), 0);
  const exactCount  = finished.filter((m) => predMap.get(m.id)?.points === 3).length;
  const winnerCount = finished.filter((m) => predMap.get(m.id)?.points === 1).length;
  const missCount   = finished.filter((m) => predMap.get(m.id)?.points === 0).length;

  const FILTERS: { key: PickFilter; label: string; count: number }[] = [
    { key: "all",    label: "Todos",    count: finished.length },
    { key: "exact",  label: "Exactos",  count: exactCount },
    { key: "winner", label: "Ganador",  count: winnerCount },
    { key: "miss",   label: "Fallidos", count: missCount },
  ];

  const filteredFinished = finished.filter((m) => {
    if (filter === "all") return true;
    const pts = predMap.get(m.id)?.points;
    if (filter === "exact")  return pts === 3;
    if (filter === "winner") return pts === 1;
    if (filter === "miss")   return pts === 0;
    return false;
  });

  if (myMatches.length === 0) {
    return <p className="text-sm text-slate-400 mt-6 text-center">Aún no tienes predicciones guardadas.</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Puntos", value: totalPts, color: "text-slate-900" },
          { label: "Exactos", value: exactCount, color: "text-green-600" },
          { label: "Ganador", value: winnerCount, color: "text-amber-600" },
          { label: "Fallidos", value: missCount, color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Segment toggle */}
      <div className="flex gap-2">
        {(["finished", "pending"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSegment(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              segment === s ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "finished" ? `Finalizados (${finished.length})` : `Pendientes (${pending.length})`}
          </button>
        ))}
      </div>

      {/* Filter chips — only for finished */}
      {segment === "finished" && (
        <div className="flex gap-1.5 flex-wrap -mt-2">
          {FILTERS.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === key
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label} {count > 0 && <span className="opacity-70">· {count}</span>}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {segment === "finished" ? (
        filteredFinished.length === 0
          ? <p className="text-sm text-slate-400 text-center mt-4">Sin resultados para este filtro.</p>
          : <ul className="flex flex-col gap-3">
              {filteredFinished.map((m) => {
                const pred = predMap.get(m.id)!;
                const pts = pred.points ?? 0;
                return (
                  <li key={m.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{flag(m.homeTeam)}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{m.homeTeam}</span>
                        <span className="text-sm font-bold text-slate-900 shrink-0">{m.homeScore}–{m.awayScore}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{m.awayTeam}</span>
                        <span className="text-lg shrink-0">{flag(m.awayTeam)}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400">{pred.homeScore}–{pred.awayScore}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          pts === 3 ? "bg-green-50 text-green-700" :
                          pts === 1 ? "bg-amber-50 text-amber-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>{pts}pts</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{formatDate(new Date(m.scheduledAt))} · Grupo {m.group}</p>
                  </li>
                );
              })}
            </ul>
      ) : (
        pending.length === 0
          ? <p className="text-sm text-slate-400 text-center mt-4">No tienes predicciones pendientes.</p>
          : <ul className="flex flex-col gap-3">
              {pending.map((m) => {
                const pred = predMap.get(m.id)!;
                return (
                  <li key={m.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{flag(m.homeTeam)}</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{m.homeTeam}</span>
                        <span className="text-xs text-slate-400 shrink-0">vs</span>
                        <span className="text-xs font-semibold text-slate-800 truncate">{m.awayTeam}</span>
                        <span className="text-lg shrink-0">{flag(m.awayTeam)}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 shrink-0">✓ {pred.homeScore}–{pred.awayScore}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{formatDate(new Date(m.scheduledAt))} · Grupo {m.group}</p>
                  </li>
                );
              })}
            </ul>
      )}
    </div>
  );
}

type Stage = "today" | "week" | "knockout" | "mypicks";

function isSameDay(a: Date | string, b: Date | string) {
  const pa = bogotaParts(a);
  const pb = bogotaParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

function utcDayKey(d: Date | string) {
  const { year, month, day } = bogotaParts(d);
  return `${year}-${month}-${day}`;
}

function TodayView({ matches, predMap, nowDate }: { matches: Match[]; predMap: Map<string, Prediction>; nowDate: Date }) {
  // Ventana de 2 días: hoy + mañana en hora Colombia
  const tomorrow = new Date(nowDate.getTime() + 24 * 60 * 60 * 1000);

  const windowMatches = matches.filter((m) => {
    const d = new Date(m.scheduledAt);
    return isSameDay(d, nowDate) || isSameDay(d, tomorrow);
  });

  // Si la ventana está vacía, buscar la próxima jornada disponible
  const displayMatches = windowMatches.length > 0 ? windowMatches : (() => {
    const upcoming = matches
      .filter((m) => new Date(m.scheduledAt) > nowDate)
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    if (!upcoming[0]) return [];
    const firstDay = new Date(upcoming[0].scheduledAt);
    const secondDay = new Date(firstDay.getTime() + 24 * 60 * 60 * 1000);
    return upcoming.filter((m) => {
      const d = new Date(m.scheduledAt);
      return isSameDay(d, firstDay) || isSameDay(d, secondDay);
    });
  })();

  if (displayMatches.length === 0) {
    return <p className="text-sm text-slate-400 mt-6 text-center">No hay partidos programados próximamente.</p>;
  }

  const isFuture = windowMatches.length === 0;

  // Agrupar por día para mostrar header de fecha
  const byDay = new Map<string, Match[]>();
  for (const m of displayMatches) {
    const key = utcDayKey(new Date(m.scheduledAt));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(m);
  }

  return (
    <div className="flex flex-col gap-6">
      {isFuture && (
        <p className="text-xs text-slate-400 uppercase tracking-widest -mb-2">
          Próxima jornada
        </p>
      )}
      {Array.from(byDay.values()).map((dayMatches) => {
        const date = new Date(dayMatches[0].scheduledAt);
        return (
          <div key={utcDayKey(date)}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              {formatDayHeader(date)}
            </p>
            <ul className="flex flex-col gap-3">
              {dayMatches.map((match) => (
                <MatchCard key={match.id} match={match} pred={predMap.get(match.id)} nowDate={nowDate} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function WeekView({ matches, predMap, nowDate }: { matches: Match[]; predMap: Map<string, Prediction>; nowDate: Date }) {
  const weekEnd = new Date(nowDate);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

  const weekMatches = matches
    .filter((m) => {
      const d = new Date(m.scheduledAt);
      return d >= nowDate && d <= weekEnd;
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  if (weekMatches.length === 0) {
    return <p className="text-sm text-slate-400 mt-6 text-center">No hay partidos en los próximos 7 días.</p>;
  }

  // Group by day
  const byDay = new Map<string, Match[]>();
  for (const m of weekMatches) {
    const key = utcDayKey(new Date(m.scheduledAt));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(m);
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(byDay.values()).map((dayMatches) => {
        const date = new Date(dayMatches[0].scheduledAt);
        return (
          <div key={utcDayKey(date)}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              {formatDayHeader(date)}
            </p>
            <ul className="flex flex-col gap-3">
              {dayMatches.map((match) => (
                <MatchCard key={match.id} match={match} pred={predMap.get(match.id)} nowDate={nowDate} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function MatchesByGroup({ matches, predictions, now }: Props) {
  const nowDate = new Date(now);
  const predMap = new Map(predictions.map((p) => [p.matchId, p]));
  const knockoutMatches = matches.filter((m) => m.stage !== "group");
  const hasKnockout = knockoutMatches.length > 0;

  const [activeStage, setActiveStage] = useState<Stage>("today");

  const hasPredictions = predictions.length > 0;

  const tabs: { key: Stage; label: string }[] = [
    { key: "today", label: "Hoy" },
    { key: "week", label: "Semana" },
    ...(hasKnockout ? [{ key: "knockout" as Stage, label: "Eliminatorias" }] : []),
    ...(hasPredictions ? [{ key: "mypicks" as Stage, label: "Mis picks" }] : []),
  ];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveStage(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeStage === t.key
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeStage === "today" && <TodayView matches={matches} predMap={predMap} nowDate={nowDate} />}
      {activeStage === "week" && <WeekView matches={matches} predMap={predMap} nowDate={nowDate} />}
      {activeStage === "knockout" && <KnockoutView matches={knockoutMatches} predMap={predMap} nowDate={nowDate} />}
      {activeStage === "mypicks" && <MyPicksView matches={matches} predMap={predMap} />}
    </div>
  );
}
