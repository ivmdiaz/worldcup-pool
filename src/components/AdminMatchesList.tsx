"use client";

import { useState } from "react";
import MatchResultForm from "@/components/MatchResultForm";

type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "CANCELLED";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: string;
  group: string | null;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
};

const TZ = "America/Bogota";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
    timeZone: TZ,
  });
}

const STATUS_LABEL: Record<MatchStatus, string> = {
  SCHEDULED: "Programado",
  LIVE:      "En vivo",
  FINISHED:  "Finalizado",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<MatchStatus, string> = {
  SCHEDULED: "text-slate-500 bg-slate-100",
  LIVE:      "text-green-700 bg-green-50",
  FINISHED:  "text-blue-700 bg-blue-50",
  CANCELLED: "text-red-700 bg-red-50",
};

function MatchRow({ match }: { match: Match }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {match.homeTeam} vs {match.awayTeam}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatDate(match.scheduledAt)} · Grupo {match.group}
            {match.status === "FINISHED" && (
              <span className="ml-2 font-semibold text-slate-600">
                {match.homeScore} – {match.awayScore}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLOR[match.status]}`}>
            {STATUS_LABEL[match.status]}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-slate-100 pt-3">
          <MatchResultForm
            matchId={match.id}
            currentHomeScore={match.homeScore}
            currentAwayScore={match.awayScore}
          />
        </div>
      )}
    </li>
  );
}

type Tab = "pending" | "all";

export default function AdminMatchesList({ matches, now }: { matches: Match[]; now: number }) {
  const [tab, setTab] = useState<Tab>("pending");

  const pending = matches.filter(
    (m) => (m.status === "SCHEDULED" || m.status === "LIVE") && new Date(m.scheduledAt).getTime() <= now
  );

  const displayed = tab === "pending" ? pending : matches;

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tab === "pending" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Por ingresar
          {pending.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
            tab === "all" ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Todos
        </button>
      </div>

      {displayed.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-10">
          No hay partidos pendientes de resultado.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {displayed.map((match) => (
            <MatchRow key={match.id} match={match} />
          ))}
        </ul>
      )}
    </div>
  );
}
