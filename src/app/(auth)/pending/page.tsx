import { signOut } from "@/lib/auth";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-slate-900">Acceso pendiente</h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Tu solicitud está siendo revisada.<br />Te avisamos cuando tengas acceso.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
