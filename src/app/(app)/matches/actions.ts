"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function savePrediction(matchId: string, homeScore: number, awayScore: number) {
  const session = await auth();
  if (!session?.user?.id) return;
  if (session.user.role !== "USER" && session.user.role !== "ADMIN") return;

  if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) return;

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return;
  if (match.status !== "SCHEDULED") return;
  if (match.scheduledAt <= new Date()) return;

  await prisma.prediction.upsert({
    where: { userId_matchId: { userId: session.user.id, matchId } },
    create: { userId: session.user.id, matchId, homeScore, awayScore },
    update: { homeScore, awayScore },
  });

  revalidatePath("/matches");
}
