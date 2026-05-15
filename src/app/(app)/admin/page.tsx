export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { approveUser, rejectUser } from "./users/actions";
import AdminMatchesClient from "@/components/AdminMatchesClient";
import UserAvatar from "@/components/UserAvatar";
import type { MatchCardMatch } from "@/components/MatchCard";
import { C } from "@/lib/tokens";
import Link from "next/link";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab ?? "resultados";

  const [pendingUsers, approvedUsers, rawMatches] = await Promise.all([
    prisma.user.findMany({ where: { role: "PENDING" }, orderBy: { createdAt: "asc" } }),
    prisma.user.findMany({ where: { role: "USER" },    orderBy: { createdAt: "asc" } }),
    prisma.match.findMany({ orderBy: { scheduledAt: "asc" } }),
  ]);

  const matches: MatchCardMatch[] = rawMatches.map((m) => ({
    id: m.id,
    homeTeam: m.homeTeam,
    awayTeam: m.awayTeam,
    scheduledAt: m.scheduledAt.toISOString(),
    status: m.status as MatchCardMatch["status"],
    homeScore: m.homeScore,
    awayScore: m.awayScore,
    group: m.group,
    stage: m.stage,
  }));

  const now = Date.now();

  return (
    <div className="flex flex-col overflow-y-auto scrollbar-hide" style={{ height: "100dvh" }}>

      {/* Hero */}
      <div className="nav-card h-36 w-full shrink-0">
        <div
          className="card-bg absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/admin.png')",
            "--kb-duration": "12s",
            "--kb-delay": "-3s",
          } as React.CSSProperties}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 h-full flex items-end px-5 pb-5">
          <p className="text-white font-bold text-4xl tracking-wide drop-shadow-lg">Admin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-3 pb-1 shrink-0 bg-gray-100">
        {[
          { id: "usuarios",   label: `Usuarios (${pendingUsers.length})` },
          { id: "resultados", label: "Resultados" },
        ].map(({ id, label }) => (
          <Link
            key={id}
            href={`/admin?tab=${id}`}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === id ? "text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
            style={tab === id ? { backgroundColor: C.primary } : {}}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pt-3 pb-24 bg-gray-100 flex flex-col gap-4">

        {/* ── Tab: Usuarios ── */}
        {tab === "usuarios" && (
          <>
            <section className="flex flex-col gap-2">
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                Pendientes ({pendingUsers.length})
              </p>
              {pendingUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Sin usuarios pendientes.</p>
              ) : (
                pendingUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.10)] px-4 py-3 flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} image={user.image} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? "—"}</p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <form action={approveUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="h-9 px-4 rounded-xl text-sm font-bold text-white cursor-pointer active:opacity-80" style={{ backgroundColor: C.primary }}>
                          Aprobar
                        </button>
                      </form>
                      <form action={rejectUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" className="h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer active:opacity-80 border" style={{ borderColor: C.dangerBorder, color: C.dangerText, backgroundColor: C.dangerBg }}>
                          Rechazar
                        </button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </section>

            <section className="flex flex-col gap-2">
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
                Aprobados ({approvedUsers.length})
              </p>
              {approvedUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Sin usuarios aprobados aún.</p>
              ) : (
                approvedUsers.map((user) => (
                  <div key={user.id} className="bg-white rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.10)] px-4 py-3 flex items-center gap-3">
                    <UserAvatar name={user.name} email={user.email} image={user.image} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? "—"}</p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <span className="text-[12px] font-bold px-3 py-1.5 rounded-full shrink-0" style={{ backgroundColor: C.successBg, color: C.successText, border: `1px solid ${C.successBorder}` }}>
                      Activo
                    </span>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* ── Tab: Resultados ── */}
        {tab === "resultados" && (
          <AdminMatchesClient matches={matches} now={now} />
        )}

      </div>
    </div>
  );
}
