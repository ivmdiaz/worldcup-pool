import { prisma } from "@/lib/prisma";
import { approveUser, rejectUser } from "./actions";

export default async function AdminUsersPage() {
  const [pendingUsers, approvedUsers] = await Promise.all([
    prisma.user.findMany({ where: { role: "PENDING" }, orderBy: { createdAt: "asc" } }),
    prisma.user.findMany({ where: { role: "USER" }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Usuarios</h1>

      <section className="mb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Pendientes ({pendingUsers.length})
        </h2>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-400">
            No hay usuarios pendientes.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {pendingUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <form action={approveUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                    >
                      Aprobar
                    </button>
                  </form>
                  <form action={rejectUser}>
                    <input type="hidden" name="userId" value={user.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      Rechazar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Aprobados ({approvedUsers.length})
        </h2>

        {approvedUsers.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-400">
            No hay usuarios aprobados aún.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {approvedUsers.map((user) => (
              <li
                key={user.id}
                className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 truncate">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                </div>
                <span className="ml-4 shrink-0 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  Activo
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
