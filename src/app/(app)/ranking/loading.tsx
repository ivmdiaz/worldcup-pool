export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-7 w-28 bg-slate-200 rounded-lg mb-6" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl px-4 py-3.5 flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
            <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-4 bg-slate-200 rounded w-32" />
              <div className="h-3 bg-slate-200 rounded w-24" />
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="h-5 w-8 bg-slate-200 rounded" />
              <div className="h-3 w-6 bg-slate-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
