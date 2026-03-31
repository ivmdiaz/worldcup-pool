/**
 * seed-mocks.ts — datos temporales para probar ranking y usuarios.
 * Eliminar con: npm run seed:mocks:clean
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function calcPoints(pH: number, pA: number, rH: number, rA: number): number {
  if (pH === rH && pA === rA) return 3;
  return Math.sign(pH - pA) === Math.sign(rH - rA) ? 1 : 0;
}

async function main() {
  // ── 1. Limpiar datos de prueba anteriores ──────────────────────────────
  await prisma.prediction.deleteMany();
  await prisma.match.updateMany({
    data: { status: "SCHEDULED", homeScore: null, awayScore: null },
  });
  // Borrar solo usuarios mock (sin cuenta OAuth vinculada)
  await prisma.user.deleteMany({ where: { accounts: { none: {} } } });
  console.log("Limpieza completa.");

  // ── 2. Usuarios mock ───────────────────────────────────────────────────
  const [carlos, maria, juan, ana] = await Promise.all([
    prisma.user.create({ data: { name: "Carlos García",  email: "carlos@mock.com", role: "USER" } }),
    prisma.user.create({ data: { name: "María López",    email: "maria@mock.com",  role: "USER" } }),
    prisma.user.create({ data: { name: "Juan Martínez",  email: "juan@mock.com",   role: "USER" } }),
    prisma.user.create({ data: { name: "Ana Rodríguez",  email: "ana@mock.com",    role: "USER" } }),
  ]);
  console.log("Usuarios mock creados.");

  // ── 3. Primeros 6 partidos → FINISHED ─────────────────────────────────
  const matches = await prisma.match.findMany({
    where: { stage: "group" },
    orderBy: { scheduledAt: "asc" },
    take: 6,
  });

  const results = [
    { homeScore: 2, awayScore: 1 }, // México 2-1 Sudáfrica         (Jun 11)
    { homeScore: 0, awayScore: 0 }, // EE.UU. 0-0 Paraguay          (Jun 12)
    { homeScore: 3, awayScore: 1 }, // Corea del Sur 3-1 Rep. UEFA D (Jun 12)
    { homeScore: 1, awayScore: 2 }, // Canadá 1-2 Rep. UEFA A       (Jun 12)
    { homeScore: 4, awayScore: 0 }, // Australia 4-0 Rep. UEFA C    (Jun 13)
    { homeScore: 0, awayScore: 2 }, // Qatar 0-2 Suiza               (Jun 13)
  ];

  for (let i = 0; i < matches.length; i++) {
    await prisma.match.update({
      where: { id: matches[i].id },
      data: { status: "FINISHED", ...results[i] },
    });
  }
  console.log("6 partidos marcados como FINISHED.");

  // ── 4. Predicciones ────────────────────────────────────────────────────
  // Carlos: 3+3+1+1+1+3 = 12pts (buen predictor)
  // Ana:    3+1+3+1+1+1 = 10pts
  // María:  1+0+1+0+1+1 =  4pts
  // Juan:   0+0+0+0+0+0 =  0pts
  const preds: Record<string, { homeScore: number; awayScore: number }[]> = {
    carlos: [
      { homeScore: 2, awayScore: 1 }, // exacto  → 3pts
      { homeScore: 0, awayScore: 0 }, // exacto  → 3pts
      { homeScore: 2, awayScore: 1 }, // ganador → 1pt
      { homeScore: 0, awayScore: 1 }, // ganador → 1pt
      { homeScore: 3, awayScore: 0 }, // ganador → 1pt
      { homeScore: 1, awayScore: 2 }, // exacto  → 3pts
    ],
    ana: [
      { homeScore: 2, awayScore: 1 }, // exacto       → 3pts
      { homeScore: 1, awayScore: 1 }, // resultado ok → 1pt
      { homeScore: 3, awayScore: 1 }, // exacto       → 3pts
      { homeScore: 0, awayScore: 3 }, // ganador      → 1pt
      { homeScore: 2, awayScore: 0 }, // ganador      → 1pt
      { homeScore: 0, awayScore: 2 }, // ganador      → 1pt
    ],
    maria: [
      { homeScore: 1, awayScore: 0 }, // ganador → 1pt
      { homeScore: 1, awayScore: 0 }, // errado  → 0pts
      { homeScore: 2, awayScore: 0 }, // ganador → 1pt
      { homeScore: 1, awayScore: 1 }, // errado  → 0pts
      { homeScore: 2, awayScore: 1 }, // ganador → 1pt
      { homeScore: 0, awayScore: 1 }, // ganador → 1pt
    ],
    juan: [
      { homeScore: 0, awayScore: 1 }, // errado → 0pts
      { homeScore: 2, awayScore: 1 }, // errado → 0pts
      { homeScore: 1, awayScore: 2 }, // errado → 0pts
      { homeScore: 2, awayScore: 0 }, // errado → 0pts
      { homeScore: 1, awayScore: 1 }, // errado → 0pts
      { homeScore: 2, awayScore: 0 }, // errado → 0pts
    ],
  };

  const userMap = { carlos, ana, maria, juan };

  for (const [key, user] of Object.entries(userMap)) {
    for (let i = 0; i < matches.length; i++) {
      const p = preds[key][i];
      const r = results[i];
      await prisma.prediction.create({
        data: {
          userId: user.id,
          matchId: matches[i].id,
          homeScore: p.homeScore,
          awayScore: p.awayScore,
          points: calcPoints(p.homeScore, p.awayScore, r.homeScore, r.awayScore),
        },
      });
    }
  }

  console.log("Predicciones y puntos cargados.");
  console.log("Ranking esperado: Carlos 12pts · Ana 10pts · María 4pts · Juan 0pts");
}

main().catch(console.error).finally(() => prisma.$disconnect());
