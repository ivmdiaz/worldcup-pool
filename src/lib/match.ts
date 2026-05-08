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

// ── Points calculation (3-1-0 rule) ──────────────────────────────────────────

export function calculatePoints(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number
): number {
  if (predHome === realHome && predAway === realAway) return 3;
  const realDiff = realHome - realAway;
  const predDiff = predHome - predAway;
  if (
    (realDiff > 0 && predDiff > 0) ||
    (realDiff < 0 && predDiff < 0) ||
    (realDiff === 0 && predDiff === 0)
  ) return 1;
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
