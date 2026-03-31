import { getRanking } from "@/lib/ranking";
import Link from "next/link";

const MEDAL = ["🥇", "🥈", "🥉"];

const PODIUM_CARD: Record<number, string> = {
  1: "bg-amber-50  border-amber-300",
  2: "bg-zinc-100  border-zinc-400",
  3: "bg-orange-50 border-orange-300",
};

const PODIUM_NAME: Record<number, string> = {
  1: "text-amber-900",
  2: "text-zinc-800",
  3: "text-orange-900",
};

const PODIUM_PTS: Record<number, string> = {
  1: "text-amber-600",
  2: "text-zinc-600",
  3: "text-orange-600",
};

const PODIUM_AVATAR: Record<number, string> = {
  1: "bg-amber-400",
  2: "bg-zinc-500",
  3: "bg-orange-400",
};

export default async function RankingPage() {
  const ranking = await getRanking();
  const hasPoints = ranking.some((r) => r.totalPoints > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Ranking</h1>

      {!hasPoints ? (
        <div className="mt-10 text-center">
          <p className="text-slate-400 text-lg">Todavía no hay puntos calculados.</p>
          <p className="text-slate-400 text-sm mt-1">El ranking se actualiza cuando finalizan los partidos.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ranking.map((entry, index) => {
            const position  = index + 1;
            const isPodium  = position <= 3;
            const initials  = entry.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

            const cardClass   = isPodium ? PODIUM_CARD[position]   : "bg-white border-slate-200";
            const nameClass   = isPodium ? PODIUM_NAME[position]   : "text-slate-900";
            const ptsClass    = isPodium ? PODIUM_PTS[position]    : "text-slate-900";
            const avatarClass = isPodium ? PODIUM_AVATAR[position] : "bg-green-600";

            return (
              <Link
                key={entry.id}
                href={`/ranking/${entry.id}`}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors hover:brightness-95 ${cardClass}`}
              >
                <div className="shrink-0 w-8 text-center">
                  {isPodium ? (
                    <span className="text-xl">{MEDAL[index]}</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-400">{position}</span>
                  )}
                </div>

                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${avatarClass}`}>
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${nameClass}`}>{entry.name}</p>
                  <p className="text-xs text-slate-400">
                    {entry.predictionsCount} predicciones · {entry.exactCount} exactas
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold ${ptsClass}`}>{entry.totalPoints}</p>
                  <p className="text-xs text-slate-400">pts</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
