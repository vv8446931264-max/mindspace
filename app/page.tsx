"use client";

import AppHeader from "@/components/AppHeader";
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

        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
          <section aria-label="Journal entry form" id="journal-form">
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

          <ResultsPanel
            ref={w.resultsRef}
            appState={w.appState}
            isAnalyzing={w.isAnalyzing}
            moodHistory={w.moodHistory}
            onDismissError={w.dismissError}
          />
        </div>
      </main>
    </>
  );
}
