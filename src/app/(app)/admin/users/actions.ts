"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function approveUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const userId = formData.get("userId") as string;
  await prisma.user.update({ where: { id: userId }, data: { role: "USER" } });
  revalidatePath("/admin/users");
}

export async function rejectUser(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return;

  const userId = formData.get("userId") as string;
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}
