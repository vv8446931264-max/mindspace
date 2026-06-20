import type { MoodTrend } from "@/types";
import { BrainIcon, FlameIcon } from "@/components/icons";

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
    <header className="sticky top-0 z-20 bg-[#0e1430]/60 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B8DEF] to-[#7B6FE8] text-white shadow-md shadow-blue-200"
            aria-hidden="true"
          >
            <BrainIcon size={20} />
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-extrabold text-white tracking-tight">
              MindSpace
            </h1>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              AI Wellness Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {isDemoMode && (
            <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold border border-amber-400/40 tracking-wide">
              DEMO MODE
            </span>
          )}
          {streak > 0 && (
            <div
              className="flex items-center gap-1 text-sm bg-orange-500/15 border border-orange-400/30 px-2.5 py-1 rounded-full"
              title={`${streak}-day logging streak`}
            >
              <FlameIcon size={14} className="text-orange-500" />
              <span className="font-bold text-orange-500">{streak}</span>
              <span className="text-slate-400 text-xs hidden sm:inline">
                day{streak > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {hasHistory && (
            <div className="flex items-center gap-1.5 text-sm bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
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
