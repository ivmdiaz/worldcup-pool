export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-28 bg-slate-200 rounded-lg mb-6" />

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[80, 72, 100].map((w) => (
          <div key={w} className="h-9 bg-slate-200 rounded-lg" style={{ width: w }} />
        ))}
      </div>

      {/* Day header */}
      <div className="h-4 w-48 bg-slate-200 rounded mb-3" />

      {/* Cards */}
      <ul className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <li key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-4">
            <div className="grid grid-cols-[1fr_48px_1fr] items-center gap-x-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
              <div className="flex justify-center">
                <div className="h-4 w-6 bg-slate-200 rounded" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
