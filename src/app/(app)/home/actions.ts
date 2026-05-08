"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string, image: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim() || "Usuario",
      image,
    },
  });

  revalidatePath("/home");
}
