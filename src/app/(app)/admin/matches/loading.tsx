export default function Loading() {
  return (
    <div className="max-w-2xl animate-pulse">
      <div className="h-7 w-28 bg-slate-200 rounded-lg mb-6" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <div className="h-9 w-32 bg-slate-200 rounded-lg" />
        <div className="h-9 w-20 bg-slate-200 rounded-lg" />
      </div>

      {/* Rows */}
      <ul className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <li key={i} className="bg-white border border-slate-200 rounded-xl px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-200 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
