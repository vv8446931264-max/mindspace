"use client";

import MoodPicker from "@/components/MoodPicker";
import EmotionPicker from "@/components/EmotionPicker";
import { EXAM_CONTEXTS } from "@/schemas/journalEntry";
import { MAX_CHARS } from "@/lib/useWellness";
import { checkWellnessFlags } from "@/lib/wellnessFlags";
import type { EmotionTag, ExamContext, MoodLevel } from "@/types";

type Props = {
  examContext: ExamContext;
  setExamContext: (v: ExamContext) => void;
  moodLevel: MoodLevel;
  setMoodLevel: (v: MoodLevel) => void;
  emotions: EmotionTag[];
  setEmotions: (v: EmotionTag[]) => void;
  studyHours: number;
  setStudyHours: (v: number) => void;
  journalText: string;
  setJournalText: (v: string) => void;
  fieldErrors: Record<string, string[]>;
  isAnalyzing: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

const FOCUS_RING = "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1";

/** The full journaling form: exam, mood, emotions, study hours, and free text. */
export default function JournalForm({
  examContext,
  setExamContext,
  moodLevel,
  setMoodLevel,
  emotions,
  setEmotions,
  studyHours,
  setStudyHours,
  journalText,
  setJournalText,
  fieldErrors,
  isAnalyzing,
  onSubmit,
}: Props) {
  const flags = checkWellnessFlags(moodLevel, emotions, studyHours);

  return (
    <form
      onSubmit={onSubmit}
      className="leaf rounded-2xl p-6 space-y-5"
      noValidate
    >
      {/*
        Academic front door. Kota counselling data: students walk in saying
        "time management" (45%) and "low marks" (35%); only 17% ever raise
        suicidal thoughts, and only after entering through an academic door.
        A mood slider as the first field asks the student to self-identify as
        mentally unwell before they can use the app — which, where the available
        label is "pagal", excludes exactly the people most at risk.
        See docs/ROADMAP-v2.md P1.
      */}
      <div>
        <h2 className="text-lg font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Today&apos;s check-in
        </h2>
        <p className="text-xs mt-0.5" style={{ color: "var(--ink-dim)" }}>
          Start with the work. Nothing here is shared with anyone.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="examContext"
          className="block text-sm font-medium"
          style={{ color: "var(--ink-second)" }}
        >
          I&apos;m preparing for
        </label>
        <select
          id="examContext"
          value={examContext}
          onChange={(e) => setExamContext(e.target.value as ExamContext)}
          disabled={isAnalyzing}
          className={`field w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50 ${FOCUS_RING}`}
        >
          {EXAM_CONTEXTS.map((ctx) => (
            <option key={ctx} value={ctx}>
              {ctx}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="studyHours"
          className="block text-sm font-medium"
          style={{ color: "var(--ink-second)" }}
        >
          Study hours today:{" "}
          <span className="font-semibold" style={{ color: "var(--marker)" }}>{studyHours}h</span>
        </label>
        <input
          id="studyHours"
          type="range"
          min={0}
          max={18}
          step={0.5}
          value={studyHours}
          disabled={isAnalyzing}
          onChange={(e) => setStudyHours(Number(e.target.value))}
          aria-valuemin={0}
          aria-valuemax={18}
          aria-valuenow={studyHours}
          aria-valuetext={`${studyHours} hours`}
          className={`w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-50 focus-visible:ring-offset-2 ${FOCUS_RING}`}
          style={{ background: "var(--rule)" }}
        />
        <div className="flex justify-between text-xs" style={{ color: "var(--ink-dim)" }}>
          <span>0h</span>
          <span>9h</span>
          <span>18h</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="journalText"
          className="block text-sm font-medium"
          style={{ color: "var(--ink-second)" }}
        >
          What&apos;s on your mind?
        </label>
        <textarea
          id="journalText"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value.slice(0, MAX_CHARS))}
          disabled={isAnalyzing}
          placeholder="Write freely — how did today go? What's weighing on you? What went well?"
          rows={5}
          spellCheck={false}
          aria-describedby="charCount journalHint"
          className={`field w-full rounded-lg px-3 py-2 text-sm resize-none disabled:opacity-50 ${FOCUS_RING}`}
        />
        <div className="flex justify-between items-center">
          <p id="journalHint" className="text-xs" style={{ color: "var(--ink-dim)" }}>
            Be specific — more context means better insights
          </p>
          <span
            id="charCount"
            className="text-xs tabular-nums"
            style={{ color: journalText.length > 900 ? "var(--margin-rule)" : "var(--ink-dim)" }}
            aria-live="polite"
            aria-label={`${journalText.length} of ${MAX_CHARS} characters used`}
          >
            {journalText.length}/{MAX_CHARS}
          </span>
        </div>
        {fieldErrors.text && (
          <p className="text-xs" style={{ color: "var(--margin-rule)" }} role="alert">
            {fieldErrors.text[0]}
          </p>
        )}
      </div>

      {/*
        Feelings come last and are optional. Students disclose emotionally only
        after entering academically — requiring it up front is the barrier.
      */}
      <details
        className="group rounded-lg border"
        style={{ background: "var(--paper-sunk)", borderColor: "var(--rule)" }}
      >
        <summary
          className={`cursor-pointer list-none px-3 py-2.5 text-sm font-medium rounded-lg ${FOCUS_RING}`}
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
            Add how you&apos;re feeling
            <span className="text-xs font-normal" style={{ color: "var(--ink-dim)" }}>optional</span>
          </span>
        </summary>

        <div className="px-3 pb-3.5 pt-1 space-y-4">
          <MoodPicker value={moodLevel} onChange={setMoodLevel} disabled={isAnalyzing} />

          <div>
            <EmotionPicker
              selected={emotions}
              onChange={setEmotions}
              disabled={isAnalyzing}
            />
            {fieldErrors.emotions && (
              <p className="text-xs text-red-500 mt-1" role="alert">
                {fieldErrors.emotions[0]}
              </p>
            )}
          </div>
        </div>
      </details>

      {flags.map((flag) => (
        <div
          key={flag.type}
          role="status"
          aria-live="polite"
          className="text-xs px-3 py-2 rounded-lg border"
          style={{
            background: "var(--marker-wash)",
            borderColor: "var(--rule)",
            color: "var(--ink-second)",
          }}
        >
          {flag.message}
        </div>
      ))}

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full font-semibold py-3.5 px-4 rounded-xl transition-opacity duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[48px]"
        style={{ background: "var(--marker)", color: "var(--on-marker)" }}
        aria-busy={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Analyzing your day…</span>
          </>
        ) : (
          "Analyze my day →"
        )}
      </button>
    </form>
  );
}
