"use client";

import AppHeader from "@/components/AppHeader";
import Hero from "@/components/Hero";
import JournalForm from "@/components/JournalForm";
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
        <AppHeader
          streak={w.streak}
          isDemoMode={w.isDemoMode}
          hasHistory={w.moodHistory.length > 0}
          trend={w.trend}
        />

        <Hero />

        <div id="how-it-works" className="relative scroll-mt-20">
          {/* Ambient floating orbs — glow through the frosted cards */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="orb drift-a w-72 h-72 left-[-4%] top-[6%]"
              style={{ background: "rgba(91,141,239,0.28)" }}
            />
            <span
              className="orb drift-b w-80 h-80 right-[-6%] top-[24%]"
              style={{ background: "rgba(82,201,160,0.22)" }}
            />
            <span
              className="orb drift-c w-64 h-64 left-[30%] bottom-[4%]"
              style={{ background: "rgba(123,111,232,0.2)" }}
            />
          </div>

          <div className="relative max-w-5xl mx-auto px-4 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
          <section
            aria-label="Journal entry form"
            id="journal-form"
            className="scroll-mt-24 float-in"
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

          <div className="float-in" style={{ animationDelay: "120ms" }}>
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
