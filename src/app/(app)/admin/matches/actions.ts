"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function calcPoints(
  predHome: number,
  predAway: number,
  realHome: number,
  realAway: number
): number {
  if (predHome === realHome && predAway === realAway) return 3;

  const predResult = Math.sign(predHome - predAway);
  const realResult = Math.sign(realHome - realAway);
  if (predResult === realResult) return 1;

  return 0;
}

export async function updateMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
    return { error: "Marcador inválido." };
  }

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Partido no encontrado." };
  if (new Date(match.scheduledAt) > new Date()) {
    return { error: "El partido aún no ha comenzado." };
  }

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, status: "FINISHED" },
  });

  const predictions = await prisma.prediction.findMany({
    where: { matchId },
  });

  if (predictions.length > 0) {
    await prisma.$transaction(
      predictions.map((p) =>
        prisma.prediction.update({
          where: { id: p.id },
          data: {
            points: calcPoints(p.homeScore, p.awayScore, homeScore, awayScore),
          },
        })
      )
    );
  }

  revalidatePath("/admin/matches");
  revalidatePath("/matches");
  revalidatePath("/ranking", "layout");
}
