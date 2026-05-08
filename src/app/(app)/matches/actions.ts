"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePrediction(matchId: string, homeScore: number, awayScore: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };
  if (session.user.role !== "USER" && session.user.role !== "ADMIN") return { error: "No autorizado" };

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
    return { error: "Marcador inválido" };
  }

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { error: "Partido no encontrado" };
  if (match.status !== "SCHEDULED") return { error: "El partido no está programado" };
  if (match.scheduledAt <= new Date()) return { error: "El partido ya comenzó" };

  await prisma.prediction.upsert({
    where: { userId_matchId: { userId: session.user.id, matchId } },
    create: { userId: session.user.id, matchId, homeScore, awayScore },
    update: { homeScore, awayScore },
  });

  revalidatePath("/matches");
}
