import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MatchesClient from "@/components/MatchesClient";
import MatchesInfoButton from "@/components/MatchesInfoButton";
import type { MatchCardMatch, MatchCardPrediction } from "@/components/MatchCard";

// ─── Preview mock — set false to revert ──────────────────────────────────────
const MOCK_FINISHED = false;
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_RESULTS = [
  { homeScore: 2, awayScore: 1 },  // match 0 → pred exacta → +3
  { homeScore: 1, awayScore: 1 },  // match 1 → pred correcto empate → +1
  { homeScore: 3, awayScore: 0 },  // match 2 → pred incorrecta → 0
];

const MOCK_PREDS = [
  { homeScore: 2, awayScore: 1, points: 3 },
  { homeScore: 0, awayScore: 1, points: 1 },
  { homeScore: 1, awayScore: 2, points: 0 },
];

export default async function MatchesPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [rawMatches, rawPredictions] = await Promise.all([
    prisma.match.findMany({ orderBy: { scheduledAt: "asc" } }),
    prisma.prediction.findMany({ where: { userId } }),
  ]);

  const now = Date.now();

  // Map to clean typed objects first
  const baseMatches: MatchCardMatch[] = rawMatches.map((m) => ({
    id: m.id,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    scheduledAt: m.scheduledAt.toISOString(),
    status: m.status as MatchCardMatch["status"],
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    group: m.group,
    stage: m.stage,
  }));

  const basePredictions: MatchCardPrediction[] = rawPredictions.map((p) => ({
    matchId: p.matchId,
    homeScore: p.homeScore,
    awayScore: p.awayScore,
    points: p.points,
  }));

  // Apply mock: override first 3 matches as FINISHED
  const matches: MatchCardMatch[] = MOCK_FINISHED
    ? baseMatches.map((m, i) =>
        i < 3
          ? { ...m, status: "FINISHED", homeScore: MOCK_RESULTS[i].homeScore, awayScore: MOCK_RESULTS[i].awayScore }
          : m
      )
    : baseMatches;

  const mockedIds = MOCK_FINISHED ? baseMatches.slice(0, 3).map((m) => m.id) : [];

  const predictions: MatchCardPrediction[] = MOCK_FINISHED
    ? [
        ...basePredictions.filter((p) => !mockedIds.includes(p.matchId)),
        ...mockedIds.map((matchId, i) => ({ matchId, ...MOCK_PREDS[i] })),
      ]
    : basePredictions;

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>

      {/* ── Header full-width ── */}
      <div className="nav-card h-36 w-full shrink-0 vt-partidos">
        <div
          className="card-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/partidos.png')",
            "--kb-duration": "12s",
            "--kb-delay": "-3s",
          } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 h-full flex items-end justify-between px-5 pb-5">
          <p className="text-white font-bold text-4xl tracking-wide drop-shadow-lg">Pronosticar</p>
          <MatchesInfoButton />
        </div>
      </div>

      {/* ── Dates + cards ── */}
      <div className="flex-1 min-h-0 mt-4 px-4">
        <MatchesClient matches={matches} predictions={predictions} now={now} />
      </div>
    </div>
  );
}
