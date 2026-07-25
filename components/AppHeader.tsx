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
    <header
      className="sticky top-0 z-20 border-b"
      style={{ background: "var(--paper-raised)", borderColor: "var(--rule)" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="grid place-items-center w-9 h-9 rounded-xl"
            style={{ background: "var(--marker-wash)" }}
            aria-hidden="true"
          >
            <BrainIcon size={20} className="[color:var(--marker)]" />
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              MindSpace
            </h1>
            <p className="text-[11px] -mt-0.5 hidden sm:block" style={{ color: "var(--ink-dim)" }}>
              AI Wellness Companion
            </p>
          </div>
        </div>

        {isDemoMode && (
          <span
            className="text-[11px] px-2.5 py-1 rounded-full font-semibold border tracking-wide"
            style={{ background: "var(--marker-wash)", color: "var(--marker)", borderColor: "var(--rule)" }}
          >
            DEMO MODE
          </span>
        )}
      </div>
    </header>
  );
}
