// ── Match status ──────────────────────────────────────────────────────────────

export type ComputedMatchStatus = "PENDING" | "LOCKED" | "LIVE" | "FINISHED";

export function computeMatchStatus(
  status: string,
  scheduledAt: string | Date,
  now: number
): ComputedMatchStatus {
  if (status === "FINISHED") return "FINISHED";
  if (status === "LIVE") return "LIVE";
  const matchTime = new Date(scheduledAt).getTime();
  if (status === "SCHEDULED" && matchTime <= now) return "LOCKED";
  return "PENDING";
}

// ── Points calculation ────────────────────────────────────────────────────────

const STAGE_POINTS: Record<string, { exact: number; winner: number }> = {
  group:        { exact: 3,  winner: 1 },
  round_of_32:  { exact: 3,  winner: 1 },
  round_of_16:  { exact: 5,  winner: 2 },
  quarter:      { exact: 5,  winner: 2 },
  semi:         { exact: 5,  winner: 2 },
  third_place:  { exact: 5,  winner: 2 },
  final:        { exact: 10, winner: 5 },
};

export function calculatePoints(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number,
  stage = "group"
): number {
  const { exact, winner } = STAGE_POINTS[stage] ?? STAGE_POINTS.group;
  if (predHome === realHome && predAway === realAway) return exact;
  const realDiff = realHome - realAway;
  const predDiff = predHome - predAway;
  if (
    (realDiff > 0 && predDiff > 0) ||
    (realDiff < 0 && predDiff < 0) ||
    (realDiff === 0 && predDiff === 0)
  ) return winner;
  return 0;
}

// ── Prediction stats ──────────────────────────────────────────────────────────

export function getPredictionStats(predictions: { points: number | null }[]) {
  return {
    exactCount: predictions.filter((p) => p.points === 3).length,
    winCount:   predictions.filter((p) => p.points === 1).length,
    missCount:  predictions.filter((p) => p.points === 0).length,
    total:      predictions.length,
  };
}
