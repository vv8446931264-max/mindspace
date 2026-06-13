import type { MoodTrend } from "@/types";

type Props = {
  streak: number;
  isDemoMode: boolean;
  hasHistory: boolean;
  trend: MoodTrend;
};

function moodColor(avg: number): string {
  if (avg <= 3) return "#F87171";
  if (avg <= 6) return "#FBBF24";
  return "#52C9A0";
}

/** Sticky top bar: brand, demo badge, logging streak, and 7-day average mood. */
export default function AppHeader({ streak, isDemoMode, hasHistory, trend }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-lg border-b border-white/60">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#7B6FE8] text-lg shadow-md shadow-blue-200"
            aria-hidden="true"
          >
            🧠
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">
              MindSpace
            </h1>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              AI Wellness Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isDemoMode && (
            <span className="text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-200 tracking-wide">
              DEMO MODE
            </span>
          )}
          {streak > 0 && (
            <div
              className="flex items-center gap-1 text-sm bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full"
              title={`${streak}-day logging streak`}
            >
              <span aria-hidden="true">🔥</span>
              <span className="font-bold text-orange-500">{streak}</span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                day{streak > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {hasHistory && (
            <div className="flex items-center gap-1.5 text-sm bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">
              <span className="text-slate-400 text-xs">Avg</span>
              <span
                className="font-bold"
                style={{ color: moodColor(trend.average) }}
              >
                {trend.average}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
