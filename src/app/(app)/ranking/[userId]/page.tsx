import { prisma } from "@/lib/prisma";
import { getRanking } from "@/lib/ranking";
import { notFound } from "next/navigation";
import Link from "next/link";
import { flag } from "@/lib/flags";

const TZ = "America/Bogota";

function formatDate(date: Date) {
  return date.toLocaleDateString("es", {
    day: "numeric", month: "short", timeZone: TZ,
  });
}

export default async function UserPicksPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  const [user, ranking] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        predictions: {
          include: { match: true },
        },
      },
    }),
    getRanking(),
  ]);

  if (!user || (user.role !== "USER" && user.role !== "ADMIN")) notFound();

  const position = ranking.findIndex((r) => r.id === userId) + 1;

  const finishedPreds = user.predictions
    .filter((p) => p.match.status === "FINISHED")
    .sort((a, b) => new Date(a.match.scheduledAt).getTime() - new Date(b.match.scheduledAt).getTime());

  const totalPts   = finishedPreds.reduce((s, p) => s + (p.points ?? 0), 0);
  const exactCount = finishedPreds.filter((p) => p.points === 3).length;
  const winCount   = finishedPreds.filter((p) => p.points === 1).length;
  const missCount  = finishedPreds.filter((p) => p.points === 0).length;

  const initials = (user.name ?? "?")
    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div className="max-w-xl">
      <Link href="/ranking" className="text-sm text-slate-500 hover:text-slate-700 transition-colors mb-6 inline-block">
        ← Ranking
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{user.name ?? "Sin nombre"}</h1>
          <p className="text-sm text-slate-400">Posición #{position}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "Puntos",   value: totalPts,   color: "text-slate-900" },
          { label: "Exactos",  value: exactCount, color: "text-green-600" },
          { label: "Ganador",  value: winCount,   color: "text-amber-600" },
          { label: "Fallidos", value: missCount,  color: "text-slate-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <p className={`text-xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Predictions list */}
      {finishedPreds.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">Sin predicciones en partidos finalizados.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {finishedPreds.map((pred) => {
            const m = pred.match;
            const pts = pred.points ?? 0;
            return (
              <li key={pred.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 text-xs font-semibold text-slate-800">
                    <span className="text-base shrink-0">{flag(m.homeTeam)}</span>
                    <span className="truncate">{m.homeTeam}</span>
                    <span className="font-bold text-slate-900 shrink-0">{m.homeScore}–{m.awayScore}</span>
                    <span className="truncate">{m.awayTeam}</span>
                    <span className="text-base shrink-0">{flag(m.awayTeam)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-400">{pred.homeScore}–{pred.awayScore}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      pts === 3 ? "bg-green-50 text-green-700" :
                      pts === 1 ? "bg-amber-50 text-amber-700" :
                      "bg-slate-100 text-slate-500"
                    }`}>{pts}pts</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">{formatDate(new Date(m.scheduledAt))} · Grupo {m.group}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
