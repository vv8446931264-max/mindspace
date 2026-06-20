"use client";

import { forwardRef } from "react";
import AnalysisCard from "@/components/AnalysisCard";
import CrisisCard from "@/components/CrisisCard";
import MoodChart from "@/components/MoodChart";
import AnalysisSkeleton from "@/components/AnalysisSkeleton";
import { LeafIcon, AlertIcon, PhoneIcon } from "@/components/icons";
import type { AppState } from "@/lib/useWellness";
import type { MoodHistoryEntry } from "@/types";

type Props = {
  appState: AppState;
  isAnalyzing: boolean;
  moodHistory: MoodHistoryEntry[];
  onDismissError: () => void;
};

/** Right column: live analysis results, mood chart, and persistent helplines. */
const ResultsPanel = forwardRef<HTMLDivElement, Props>(function ResultsPanel(
  { appState, isAnalyzing, moodHistory, onDismissError },
  ref
) {
  return (
    <section aria-label="Wellness insights" className="space-y-5">
      <div
        ref={ref}
        aria-live="polite"
        aria-busy={isAnalyzing}
        aria-label="Analysis results"
      >
        {appState.status === "idle" && (
          <div className="tilt glass rounded-3xl p-8 text-center">
            <div
              className="bob mx-auto mb-4 grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B8DEF]/20 to-[#52C9A0]/20 text-[#7fe6c4] shadow-lg shadow-black/30"
              aria-hidden="true"
            >
              <LeafIcon size={32} />
            </div>
            <h2 className="font-bold text-white text-lg">
              Your insights will appear here
            </h2>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2 leading-relaxed">
              Share how you&apos;re feeling and write a few honest lines — your
              personalized wellness support appears in seconds.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Stress triggers", "Coping plan", "Mindfulness", "Encouragement"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="text-[11px] font-medium text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {appState.status === "analyzing" && <AnalysisSkeleton />}

        {appState.status === "results" && (
          <AnalysisCard analysis={appState.analysis} />
        )}

        {appState.status === "crisis" && (
          <CrisisCard
            message={appState.response.message}
            helplines={appState.response.helplines}
          />
        )}

        {appState.status === "error" && (
          <div
            role="alert"
            className="rounded-3xl bg-red-500/10 border border-red-400/30 p-6 text-center space-y-2"
          >
            <span className="grid place-items-center w-11 h-11 mx-auto rounded-full bg-red-500/20 text-red-300" aria-hidden="true">
              <AlertIcon size={22} />
            </span>
            <p className="text-sm font-semibold text-red-200">
              {appState.message}
            </p>
            <button
              onClick={onDismissError}
              className="text-xs text-red-300 underline hover:text-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded px-1"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="tilt glass rounded-3xl p-5">
        <MoodChart history={moodHistory} />
      </div>

      <div className="tilt glass-soft rounded-2xl p-4">
        <p className="text-[11px] text-slate-400 font-semibold mb-2 uppercase tracking-wide">
          Mental health support · India
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="tel:14416"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#9db8ff] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
            aria-label="Call Tele-MANAS government helpline at 14416, available 24/7"
          >
            <PhoneIcon size={14} /> Tele-MANAS <strong className="font-bold">14416</strong>
          </a>
          <a
            href="tel:9152987821"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#9db8ff] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
            aria-label="Call iCall helpline at 9152987821"
          >
            <PhoneIcon size={14} /> iCall <strong className="font-bold">9152987821</strong>
          </a>
          <a
            href="tel:9999666555"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#9db8ff] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
            aria-label="Call Vandrevala Foundation at 9999666555, available 24/7"
          >
            <PhoneIcon size={14} /> Vandrevala <strong className="font-bold">9999666555</strong>
          </a>
        </div>
      </div>
    </section>
  );
});

export default ResultsPanel;
