export default function Loading() {
  return (
    <div className="max-w-xl animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded mb-6" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0" />
        <div className="flex flex-col gap-2">
          <div className="h-5 w-40 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col items-center gap-1.5">
            <div className="h-6 w-8 bg-slate-200 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* List */}
      <ul className="flex flex-col gap-2">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 w-48 bg-slate-200 rounded" />
              <div className="h-5 w-12 bg-slate-200 rounded-full" />
            </div>
            <div className="h-3 w-32 bg-slate-200 rounded mt-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}
