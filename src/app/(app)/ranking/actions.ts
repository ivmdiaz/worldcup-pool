"use server";

import { prisma } from "@/lib/prisma";

export type PredictionDetail = {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  scheduledAt: string;
  group: string | null;
  homeScore: number;
  awayScore: number;
  predHome: number;
  predAway: number;
  points: number;
};

export type UserDetail = {
  id: string;
  name: string | null;
  image: string | null;
  predictions: PredictionDetail[];
};

export async function getUserDetail(userId: string): Promise<UserDetail> {
  const [user, predictions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, image: true },
    }),
    prisma.prediction.findMany({
      where: { userId, points: { not: null } },
      include: {
        match: {
          select: {
            homeTeam: true, awayTeam: true,
            homeScore: true, awayScore: true,
            scheduledAt: true, group: true,
          },
        },
      },
      orderBy: { match: { scheduledAt: "desc" } },
    }),
  ]);

  return {
    id: user?.id ?? userId,
    name: user?.name ?? null,
    image: user?.image ?? null,
    predictions: predictions.map((p) => ({
      matchId:     p.matchId,
      homeTeam:    p.match.homeTeam,
      awayTeam:    p.match.awayTeam,
      scheduledAt: p.match.scheduledAt.toISOString(),
      group:       p.match.group,
      homeScore:   p.match.homeScore ?? 0,
      awayScore:   p.match.awayScore ?? 0,
      predHome:    p.homeScore,
      predAway:    p.awayScore,
      points:      p.points ?? 0,
    })),
  };
}
