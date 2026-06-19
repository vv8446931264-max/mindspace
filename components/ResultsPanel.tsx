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
          <div className="tilt rounded-3xl bg-white/80 backdrop-blur border border-white shadow-[0_8px_30px_rgba(91,141,239,0.08)] p-8 text-center">
            <div
              className="bob mx-auto mb-4 grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 text-[#52C9A0] shadow-lg shadow-emerald-100"
              aria-hidden="true"
            >
              <LeafIcon size={32} />
            </div>
            <h2 className="font-bold text-slate-700 text-lg">
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
                    className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full"
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
            className="rounded-3xl bg-red-50 border border-red-200 p-6 text-center space-y-2"
          >
            <span className="grid place-items-center w-11 h-11 mx-auto rounded-full bg-red-100 text-red-500" aria-hidden="true">
              <AlertIcon size={22} />
            </span>
            <p className="text-sm font-semibold text-red-700">
              {appState.message}
            </p>
            <button
              onClick={onDismissError}
              className="text-xs text-red-500 underline hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded px-1"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="tilt rounded-3xl bg-white/80 backdrop-blur border border-white shadow-[0_8px_30px_rgba(91,141,239,0.08)] p-5">
        <MoodChart history={moodHistory} />
      </div>

      <div className="tilt rounded-2xl bg-white/60 backdrop-blur border border-white/80 p-4">
        <p className="text-[11px] text-slate-400 font-semibold mb-2 uppercase tracking-wide">
          Mental health support · India
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="tel:14416"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-600 bg-white border border-slate-100 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#5B8DEF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
            aria-label="Call Tele-MANAS government helpline at 14416, available 24/7"
          >
            <PhoneIcon size={14} /> Tele-MANAS <strong className="font-bold">14416</strong>
          </a>
          <a
            href="tel:9152987821"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-600 bg-white border border-slate-100 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#5B8DEF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
            aria-label="Call iCall helpline at 9152987821"
          >
            <PhoneIcon size={14} /> iCall <strong className="font-bold">9152987821</strong>
          </a>
          <a
            href="tel:9999666555"
            className="flex items-center gap-1.5 min-h-[44px] text-xs text-slate-600 bg-white border border-slate-100 px-3 py-1.5 rounded-full hover:border-[#5B8DEF] hover:text-[#5B8DEF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF]"
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
