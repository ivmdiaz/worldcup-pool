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

// ── Mock detail data (alineado con MOCK_MODE en ranking/page.tsx) ─────────────
const MOCK_NAMES: Record<string, string> = {
  m1: "Ivan Diaz", m2: "Natalia Gomez", m3: "Luis Rodriguez",
  m4: "Sofia Perez", m5: "Carlos Ruiz", m6: "Valentina Torres",
  m7: "Andres Castro", m8: "Camila Vargas", m9: "Felipe Mora",
};

const MOCK_PREDS: PredictionDetail[] = [
  { matchId:"p1", homeTeam:"México",    awayTeam:"Sudáfrica", scheduledAt:"2026-06-11T14:00:00Z", group:"A", homeScore:0, awayScore:3, predHome:0, predAway:3, points:3 },
  { matchId:"p2", homeTeam:"Brasil",    awayTeam:"Argentina", scheduledAt:"2026-06-11T17:00:00Z", group:"B", homeScore:2, awayScore:1, predHome:1, predAway:0, points:1 },
  { matchId:"p3", homeTeam:"España",    awayTeam:"Francia",   scheduledAt:"2026-06-12T14:00:00Z", group:"C", homeScore:1, awayScore:1, predHome:1, predAway:1, points:3 },
  { matchId:"p4", homeTeam:"Alemania",  awayTeam:"Italia",    scheduledAt:"2026-06-12T17:00:00Z", group:"D", homeScore:3, awayScore:0, predHome:2, predAway:1, points:0 },
  { matchId:"p5", homeTeam:"Colombia",  awayTeam:"Uruguay",   scheduledAt:"2026-06-13T14:00:00Z", group:"E", homeScore:1, awayScore:2, predHome:1, predAway:2, points:3 },
  { matchId:"p6", homeTeam:"Portugal",  awayTeam:"Bélgica",   scheduledAt:"2026-06-13T17:00:00Z", group:"F", homeScore:2, awayScore:0, predHome:1, predAway:0, points:1 },
];

function mockDetail(userId: string): UserDetail {
  const name = MOCK_NAMES[userId] ?? "Usuario";
  const seed = parseInt(userId.replace("m", "")) || 1;
  // Each mock user gets a subset of predictions to vary results
  const preds = MOCK_PREDS.slice(0, Math.max(1, 6 - (seed % 4))).map((p, i) => ({
    ...p,
    points: [3, 1, 0, 3, 1, 3][((seed + i) % 3) * 2] ?? p.points,
  }));
  return { id: userId, name, image: null, predictions: preds };
}
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserDetail(userId: string): Promise<UserDetail> {
  if (userId.startsWith("m")) return mockDetail(userId);

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
