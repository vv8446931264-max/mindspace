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
        // tabIndex -1 makes this programmatically focusable without adding it to
        // the tab order, so focus can follow the result after submit.
        tabIndex={-1}
        aria-live="polite"
        aria-busy={isAnalyzing}
        aria-label="Analysis results"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-3xl"
      >
        {appState.status === "idle" && (
          <div
            className="leaf rounded-2xl p-8 text-center"
            style={{ borderColor: "var(--rule)" }}
          >
            <div
              className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-xl"
              style={{ background: "var(--marker-wash)" }}
              aria-hidden="true"
            >
              <LeafIcon size={28} className="[color:var(--marker)]" />
            </div>
            <h2 className="font-semibold text-lg" style={{ color: "var(--ink)" }}>
              Your insights will appear here
            </h2>
            <p className="text-sm max-w-xs mx-auto mt-2 leading-relaxed" style={{ color: "var(--ink-dim)" }}>
              Write a few honest lines about your day. Nothing here is scored or shared.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Stress triggers", "Coping plan", "A clear next step"].map((chip) => (
                <span
                  key={chip}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full border"
                  style={{ color: "var(--ink-dim)", borderColor: "var(--rule)", background: "var(--paper-sunk)" }}
                >
                  {chip}
                </span>
              ))}
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
            className="rounded-2xl border p-6 text-center space-y-2"
            style={{ background: "var(--paper-sunk)", borderColor: "var(--margin-rule)" }}
          >
            <span
              className="grid place-items-center w-11 h-11 mx-auto rounded-full"
              style={{ background: "var(--marker-wash)", color: "var(--margin-rule)" }}
              aria-hidden="true"
            >
              <AlertIcon size={22} />
            </span>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {appState.message}
            </p>
            <button
              onClick={onDismissError}
              className="text-xs underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded px-1"
              style={{ color: "var(--ink-dim)" }}
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/*
        Mood history is opt-in and collapsed by default. Self-monitoring of mood
        reliably induces rumination in a subset of users, and for a student already
        being ranked daily, a line with a downward slope is one more thing grading
        them. Available on request, never pushed. See docs/ROADMAP-v2.md P0.3.
      */}
      {moodHistory.length > 0 && (
        <details
          className="leaf rounded-2xl p-5 group"
          style={{ borderColor: "var(--rule)" }}
        >
          <summary
            className="cursor-pointer list-none text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
            style={{ color: "var(--ink-second)" }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                className="transition-transform group-open:rotate-90"
                style={{ color: "var(--ink-dim)" }}
                aria-hidden="true"
              >
                ›
              </span>
              Show my past entries
            </span>
          </summary>
          <div className="mt-4">
            <MoodChart history={moodHistory} />
          </div>
        </details>
      )}

      <div
        className="leaf rounded-2xl p-4"
        style={{ borderColor: "var(--rule)" }}
      >
        <p
          className="text-[11px] font-semibold mb-3 uppercase tracking-wide"
          style={{ color: "var(--ink-dim)" }}
        >
          Mental health support · India
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "tel:14416", label: "Call Tele-MANAS at 14416, free, 24/7", name: "Tele-MANAS", number: "14416" },
            { href: "tel:9152987821", label: "Call iCall at 9152987821", name: "iCall", number: "9152987821" },
            { href: "tel:9999666555", label: "Call Vandrevala at 9999666555, 24/7", name: "Vandrevala", number: "9999666555" },
          ].map((h) => (
            <a
              key={h.number}
              href={h.href}
              className="flex items-center gap-1.5 min-h-[48px] text-xs px-3 py-1.5 rounded-lg border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ color: "var(--ink-second)", borderColor: "var(--rule)", background: "var(--paper-sunk)" }}
              aria-label={h.label}
            >
              <PhoneIcon size={13} className="[color:var(--marker)]" />
              {h.name} <strong className="font-semibold">{h.number}</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ResultsPanel;
