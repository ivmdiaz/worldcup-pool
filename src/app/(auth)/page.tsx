import LoginPage from "@/components/LoginPage";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const isDev = process.env.NODE_ENV === "development";

  const devUsers = isDev
    ? await prisma.user.findMany({
        where: { role: { in: ["USER", "ADMIN"] } },
        select: { id: true, name: true, role: true },
        orderBy: { name: "asc" },
      })
    : [];

  return <LoginPage devUsers={devUsers} />;
}
