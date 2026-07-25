"use client";

import AppHeader from "@/components/AppHeader";
import Hero from "@/components/Hero";
import JournalForm from "@/components/JournalForm";
import ProblemSolver from "@/components/ProblemSolver";
import ResultsPanel from "@/components/ResultsPanel";
import { useWellness } from "@/lib/useWellness";

export default function HomePage() {
  const w = useWellness();

  return (
    <>
      <a
        href="#journal-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-md focus:text-[#5B8DEF] focus:font-medium"
      >
        Skip to journal form
      </a>

      <main className="min-h-screen">
        <AppHeader isDemoMode={w.isDemoMode} />

        <Hero />

        <div id="how-it-works" className="relative scroll-mt-20" style={{ background: "var(--paper)" }}>
          {/* Margin rule — extends from Hero down through the content zone */}
          <div
            className="pointer-events-none absolute left-8 sm:left-12 top-0 bottom-0 w-px hidden sm:block"
            style={{ background: "var(--margin-rule)", opacity: 0.4 }}
            aria-hidden="true"
          />

          <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
          <section
            aria-label="Journal entry form"
            id="journal-form"
            className="scroll-mt-24 rise"
          >
            <JournalForm
              examContext={w.examContext}
              setExamContext={w.setExamContext}
              moodLevel={w.moodLevel}
              setMoodLevel={w.setMoodLevel}
              emotions={w.emotions}
              setEmotions={w.setEmotions}
              studyHours={w.studyHours}
              setStudyHours={w.setStudyHours}
              journalText={w.journalText}
              setJournalText={w.setJournalText}
              fieldErrors={w.fieldErrors}
              isAnalyzing={w.isAnalyzing}
              onSubmit={w.handleSubmit}
            />
          </section>

          {/*
            Problem-solving sits alongside the journal, not behind it. It is the
            evidence-backed core (PRIDE, d=1.47) and the answer to the measured
            deficit — ~50% avoidance coping. See docs/ROADMAP-v2.md P1.2.
          */}
          <div className="md:col-start-1 rise">
            <ProblemSolver />
          </div>

          <div className="rise">
            <ResultsPanel
              ref={w.resultsRef}
              appState={w.appState}
              isAnalyzing={w.isAnalyzing}
              moodHistory={w.moodHistory}
              onDismissError={w.dismissError}
            />
          </div>
          </div>
        </div>
      </main>
    </>
  );
}
