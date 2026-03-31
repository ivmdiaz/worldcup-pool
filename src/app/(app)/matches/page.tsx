import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import MatchesByGroup from "@/components/MatchesByGroup";

export default async function MatchesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [matches, predictions] = await Promise.all([
    prisma.match.findMany({
      orderBy: { scheduledAt: "asc" },
    }),
    userId
      ? prisma.prediction.findMany({ where: { userId } })
      : Promise.resolve([]),
  ]);

  const now = Date.now();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Partidos</h1>
      <MatchesByGroup
        matches={matches}
        predictions={predictions.map((p) => ({
          matchId: p.matchId,
          homeScore: p.homeScore,
          awayScore: p.awayScore,
          points: p.points,
        }))}
        now={now}
      />
    </div>
  );
}
