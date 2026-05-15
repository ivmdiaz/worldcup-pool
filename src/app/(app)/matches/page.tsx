import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MatchesClient from "@/components/MatchesClient";
import MatchesInfoButton from "@/components/MatchesInfoButton";
import type { MatchCardMatch, MatchCardPrediction } from "@/components/MatchCard";


export default async function MatchesPage() {
  const session = await auth();
  const userId = session!.user!.id;

  const [rawMatches, rawPredictions] = await Promise.all([
    prisma.match.findMany({ orderBy: { scheduledAt: "asc" } }),
    prisma.prediction.findMany({ where: { userId } }),
  ]);

  const now = Date.now();

  const matches: MatchCardMatch[] = rawMatches.map((m) => ({
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

  const predictions: MatchCardPrediction[] = rawPredictions.map((p) => ({
    matchId: p.matchId,
    homeScore: p.homeScore,
    awayScore: p.awayScore,
    points: p.points,
  }));

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>

      {/* ── Header full-width ── */}
      <div className="nav-card h-36 w-full shrink-0 vt-partidos">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/partidos.png')" }}
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
