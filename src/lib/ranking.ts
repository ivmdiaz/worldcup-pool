import { prisma } from "@/lib/prisma";

export type RankingEntry = {
  id: string;
  name: string;
  totalPoints: number;
  predictionsCount: number;
  exactCount: number;
};

export async function getRanking(): Promise<RankingEntry[]> {
  const [users, totals, exacts] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["USER", "ADMIN"] } },
      select: { id: true, name: true },
    }),
    prisma.prediction.groupBy({
      by: ["userId"],
      where: { points: { not: null } },
      _sum: { points: true },
      _count: { _all: true },
    }),
    prisma.prediction.groupBy({
      by: ["userId"],
      where: { points: 3 },
      _count: { _all: true },
    }),
  ]);

  const totalsMap = new Map(totals.map((r) => [r.userId, r]));
  const exactsMap = new Map(exacts.map((r) => [r.userId, r._count._all]));

  return users
    .map((u) => ({
      id: u.id,
      name: u.name ?? "Sin nombre",
      totalPoints:      totalsMap.get(u.id)?._sum.points  ?? 0,
      predictionsCount: totalsMap.get(u.id)?._count._all  ?? 0,
      exactCount:       exactsMap.get(u.id)               ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.exactCount - a.exactCount);
}
