import { BrainIcon } from "@/components/icons";

type Props = {
  isDemoMode: boolean;
};

/**
 * Sticky top bar: brand and demo badge only.
 *
 * Deliberately displays no streak and no average-mood score. Both are numbers
 * that fall when a student stops logging — and the days they stop are their
 * worst days, so the app would answer their worst week with a visible drop.
 * See docs/ROADMAP-v2.md P0.2. Rule: no number in the UI may decrease as a
 * consequence of user inaction.
 */
export default function AppHeader({ isDemoMode }: Props) {
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
        </div>
      </div>
    </header>
  );
}
