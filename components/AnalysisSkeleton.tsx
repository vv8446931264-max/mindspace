/** Shimmering placeholder shown while the AI composes the analysis. */
export default function AnalysisSkeleton() {
  return (
    <div
      className="card-enter glass rounded-3xl overflow-hidden"
      role="status"
      aria-label="Analyzing your day"
    >
      <div className="p-5 border-b border-white/10 space-y-3">
        <div className="skeleton h-3 w-40 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-3/4 rounded-full" />
      </div>
      <div className="p-5 border-b border-white/10 space-y-3">
        <div className="skeleton h-3 w-32 rounded-full" />
        <div className="skeleton h-3 w-full rounded-full" />
        <div className="skeleton h-3 w-5/6 rounded-full" />
      </div>
      <div className="p-5 border-b border-white/10">
        <div className="skeleton h-24 w-full rounded-2xl" />
      </div>
      <div className="p-5">
        <div className="skeleton h-16 w-full rounded-2xl" />
      </div>
      <div className="px-5 py-3 bg-white/5 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#5B8DEF] animate-bounce [animation-delay:-0.3s]" />
        <span className="inline-block w-2 h-2 rounded-full bg-[#5B8DEF] animate-bounce [animation-delay:-0.15s]" />
        <span className="inline-block w-2 h-2 rounded-full bg-[#5B8DEF] animate-bounce" />
        <span className="text-xs text-slate-400 ml-1">
          Understanding your day…
        </span>
      </div>
    </div>
  );
}
