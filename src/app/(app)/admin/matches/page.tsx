import { prisma } from "@/lib/prisma";
import AdminMatchesList from "@/components/AdminMatchesList";

export default async function AdminMatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Resultados</h1>
      <AdminMatchesList
        matches={matches.map((m) => ({ ...m, scheduledAt: m.scheduledAt.toISOString() }))}
        now={Date.now()}
      />
    </div>
  );
}
