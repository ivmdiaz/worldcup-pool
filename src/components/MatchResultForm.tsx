"use client";

import { updateMatchResult } from "@/app/(app)/admin/matches/actions";
import { useState } from "react";

interface MatchResultFormProps {
  matchId: string;
  currentHomeScore?: number | null;
  currentAwayScore?: number | null;
}

export default function MatchResultForm({
  matchId,
  currentHomeScore,
  currentAwayScore,
}: MatchResultFormProps) {
  const [editing, setEditing] = useState(
    currentHomeScore == null || currentAwayScore == null
  );
  const [error, setError] = useState<string | null>(null);

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
      >
        Editar
      </button>
    );
  }

  async function handleSubmit(formData: FormData) {
    const home = parseInt(formData.get("homeScore") as string, 10);
    const away = parseInt(formData.get("awayScore") as string, 10);
    if (isNaN(home) || isNaN(away) || home < 0 || away < 0) return;
    setError(null);
    const result = await updateMatchResult(matchId, home, away);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {error && <p className="text-xs text-red-600">{error}</p>}
    <form action={handleSubmit} className="flex items-center gap-2">
      <input
        type="number"
        name="homeScore"
        min={0}
        defaultValue={currentHomeScore ?? ""}
        className="w-14 px-2 py-1.5 text-center text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
      <span className="text-slate-400 text-sm">-</span>
      <input
        type="number"
        name="awayScore"
        min={0}
        defaultValue={currentAwayScore ?? ""}
        className="w-14 px-2 py-1.5 text-center text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="0"
      />
      <button
        type="submit"
        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Guardar
      </button>
    </form>
    </div>
  );
}
