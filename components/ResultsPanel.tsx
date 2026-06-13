"use client";

import { forwardRef } from "react";
import AnalysisCard from "@/components/AnalysisCard";
import CrisisCard from "@/components/CrisisCard";
import MoodChart from "@/components/MoodChart";
import Spinner from "@/components/Spinner";
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
    <section aria-label="Wellness insights" className="space-y-6">
      <div
        ref={ref}
        aria-live="polite"
        aria-busy={isAnalyzing}
        aria-label="Analysis results"
      >
        {appState.status === "idle" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center space-y-3">
            <span className="text-5xl block" aria-hidden="true">
              🌱
            </span>
            <h2 className="font-semibold text-slate-700">
              Your insights will appear here
            </h2>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Fill in how you&apos;re feeling and write a journal entry to get
              personalized wellness support.
            </p>
          </div>
        )}

        {appState.status === "analyzing" && (
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center space-y-3">
            <div className="flex justify-center">
              <Spinner className="h-8 w-8 text-[#5B8DEF]" />
            </div>
            <p className="text-sm text-slate-500">Analyzing your day…</p>
            <p className="text-xs text-slate-400">
              Identifying patterns and preparing your insights
            </p>
          </div>
        )}

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
            className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center space-y-2"
          >
            <p className="text-sm font-medium text-red-700">
              {appState.message}
            </p>
            <button
              onClick={onDismissError}
              className="text-xs text-red-500 underline hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <MoodChart history={moodHistory} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 font-medium mb-2">
          Mental health support (India)
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="tel:9152987821"
            className="text-xs text-slate-500 hover:text-[#5B8DEF] transition-colors"
            aria-label="Call iCall helpline at 9152987821"
          >
            📞 iCall: <strong>9152987821</strong>
          </a>
          <a
            href="tel:18602662345"
            className="text-xs text-slate-500 hover:text-[#5B8DEF] transition-colors"
            aria-label="Call Vandrevala Foundation at 1860-2662-345"
          >
            📞 Vandrevala: <strong>1860-2662-345</strong>
          </a>
        </div>
      </div>
    </section>
  );
});

export default ResultsPanel;
