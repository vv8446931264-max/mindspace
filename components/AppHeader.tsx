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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🧠
          </span>
          <h1 className="text-lg font-bold text-slate-800">MindSpace</h1>
          <span className="text-xs text-slate-400 hidden sm:block">
            AI Wellness Companion
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isDemoMode && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium border border-amber-200">
              DEMO MODE
            </span>
          )}
          {streak > 0 && (
            <div
              className="flex items-center gap-1 text-sm"
              title={`${streak}-day logging streak`}
            >
              <span aria-hidden="true">🔥</span>
              <span className="font-semibold text-orange-500">{streak}</span>
              <span className="text-slate-400 hidden sm:block">day streak</span>
            </div>
          )}
          {hasHistory && (
            <div className="text-sm text-slate-500">
              Avg:{" "}
              <span
                className="font-semibold"
                style={{ color: moodColor(trend.average) }}
              >
                {trend.average}/10
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
