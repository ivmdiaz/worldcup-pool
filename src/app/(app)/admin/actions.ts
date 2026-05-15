"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { calculatePoints } from "@/lib/match";

export async function updateMatchResult(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const matchId  = formData.get("matchId") as string;
  const homeScore = parseInt(formData.get("homeScore") as string, 10);
  const awayScore = parseInt(formData.get("awayScore") as string, 10);

  if (!matchId || isNaN(homeScore) || isNaN(awayScore)) return;

  await prisma.match.update({
    where: { id: matchId },
    data: { homeScore, awayScore, status: "FINISHED" },
  });

  // Recalcular puntos para todas las predicciones de este partido
  const predictions = await prisma.prediction.findMany({ where: { matchId } });

  await Promise.all(
    predictions.map((pred) => {
      const points = calculatePoints(pred.homeScore, pred.awayScore, homeScore, awayScore);
      return prisma.prediction.update({ where: { id: pred.id }, data: { points } });
    })
  );

  revalidatePath("/admin");
  revalidatePath("/matches");
  revalidatePath("/home");
}

export async function updateMatchTeams(matchId: string, homeTeam: string, awayTeam: string) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;
  if (!matchId || !homeTeam.trim() || !awayTeam.trim()) return;

  await prisma.match.update({
    where: { id: matchId },
    data: { homeTeam: homeTeam.trim(), awayTeam: awayTeam.trim() },
  });

  revalidatePath("/admin");
  revalidatePath("/matches");
}
