export default function Loading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-7 w-24 bg-slate-200 rounded-lg mb-8" />

      {/* Pendientes */}
      <div className="h-3 w-32 bg-slate-200 rounded mb-3" />
      <ul className="flex flex-col gap-2 mb-8">
        {[1, 2].map((i) => (
          <li key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 bg-slate-200 rounded-lg" />
              <div className="h-9 w-20 bg-slate-200 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>

      {/* Aprobados */}
      <div className="h-3 w-32 bg-slate-200 rounded mb-3" />
      <ul className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-48 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-14 bg-slate-200 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
