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

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-1";

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
      className="tilt glass rounded-3xl p-6 space-y-5"
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
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Today&apos;s check-in
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Start with the work. Nothing here is shared with anyone.
        </p>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="examContext"
          className="block text-sm font-medium text-slate-200"
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
          className="block text-sm font-medium text-slate-200"
        >
          Study hours today:{" "}
          <span className="font-bold text-[#5B8DEF]">{studyHours}h</span>
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
          className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 disabled:opacity-50 focus-visible:ring-offset-2 ${FOCUS_RING}`}
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>0h</span>
          <span>9h</span>
          <span>18h</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="journalText"
          className="block text-sm font-medium text-slate-200"
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
          // Romanised Hindi has no fixed spelling, so a spellchecker underlines
          // most of an honest Hinglish sentence in red. Variance is the norm
          // here, not error. See docs/ROADMAP-v2.md P3.2.
          spellCheck={false}
          aria-describedby="charCount journalHint"
          className={`field w-full rounded-lg px-3 py-2 text-sm resize-none disabled:opacity-50 ${FOCUS_RING}`}
        />
        <div className="flex justify-between items-center">
          <p id="journalHint" className="text-xs text-slate-400">
            Be specific — more context means better insights
          </p>
          <span
            id="charCount"
            className={`text-xs tabular-nums ${
              journalText.length > 900 ? "text-amber-500" : "text-slate-400"
            }`}
            aria-live="polite"
            aria-label={`${journalText.length} of ${MAX_CHARS} characters used`}
          >
            {journalText.length}/{MAX_CHARS}
          </span>
        </div>
        {fieldErrors.text && (
          <p className="text-xs text-red-500" role="alert">
            {fieldErrors.text[0]}
          </p>
        )}
      </div>

      {/*
        Feelings come last and are optional. Students disclose emotionally only
        after entering academically — requiring it up front is the barrier.
      */}
      <details className="group rounded-lg border border-white/10 bg-white/5">
        <summary
          className={`cursor-pointer list-none px-3 py-2.5 text-sm font-medium text-slate-200 rounded-lg ${FOCUS_RING}`}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="text-slate-500 transition-transform group-open:rotate-90"
              aria-hidden="true"
            >
              ›
            </span>
            Add how you&apos;re feeling
            <span className="text-xs font-normal text-slate-400">optional</span>
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
          className={`text-xs px-3 py-2 rounded-lg border ${
            flag.severity === "caution"
              ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
              : "bg-[#5B8DEF]/15 border-[#5B8DEF]/40 text-blue-200"
          }`}
        >
          {flag.message}
        </div>
      ))}

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full bg-gradient-to-r from-[#5B8DEF] to-[#7B6FE8] hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
        aria-busy={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
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
