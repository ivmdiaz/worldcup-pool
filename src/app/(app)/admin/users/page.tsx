export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { GRADIENT } from "@/lib/tokens";
import { approveUser, rejectUser } from "./actions";
import UserAvatar from "@/components/UserAvatar";
import { C } from "@/lib/tokens";

export default async function AdminUsersPage() {
  const [pendingUsers, approvedUsers] = await Promise.all([
    prisma.user.findMany({ where: { role: "PENDING" }, orderBy: { createdAt: "asc" } }),
    prisma.user.findMany({ where: { role: "USER" }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>

      {/* Hero */}
      <div
        className="relative h-36 w-full shrink-0"
        style={{ background: GRADIENT.adminHero }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="relative z-10 h-full flex items-end px-5 pb-5">
          <p className="text-white font-bold text-4xl tracking-wide drop-shadow-lg">Usuarios</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-24 flex flex-col gap-6">

        {/* Pendientes */}
        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
            Pendientes ({pendingUsers.length})
          </p>
          {pendingUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin usuarios pendientes.</p>
          ) : (
            pendingUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.10)] px-4 py-3 flex items-center gap-3"
              >
                <UserAvatar name={user.name} email={user.email} image={user.image} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? "—"}</p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={approveUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-xl text-sm font-bold text-white cursor-pointer active:opacity-80"
                      style={{ backgroundColor: C.primary }}
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer active:opacity-80 border"
                      style={{ borderColor: C.dangerBorder, color: C.dangerText, backgroundColor: C.dangerBg }}
                    >
                      Rechazar
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Aprobados */}
        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">
            Aprobados ({approvedUsers.length})
          </p>
          {approvedUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin usuarios aprobados aún.</p>
          ) : (
            approvedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl shadow-[0_6px_14px_rgba(0,0,0,0.10)] px-4 py-3 flex items-center gap-3"
              >
                <UserAvatar name={user.name} email={user.email} image={user.image} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? "—"}</p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                </div>
                <span
                  className="text-[12px] font-bold px-3 py-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: C.successBg, color: C.successText, border: `1px solid ${C.successBorder}` }}
                >
                  Activo
                </span>
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
}
