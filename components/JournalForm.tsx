"use client";

import MoodPicker from "@/components/MoodPicker";
import EmotionPicker from "@/components/EmotionPicker";
import { EXAM_CONTEXTS } from "@/schemas/journalEntry";
import { MAX_CHARS } from "@/lib/useWellness";
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
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5"
      noValidate
    >
      <h2 className="text-base font-semibold text-slate-800">
        How&apos;s your day going?
      </h2>

      <div className="space-y-1.5">
        <label
          htmlFor="examContext"
          className="block text-sm font-medium text-slate-700"
        >
          I&apos;m preparing for
        </label>
        <select
          id="examContext"
          value={examContext}
          onChange={(e) => setExamContext(e.target.value as ExamContext)}
          disabled={isAnalyzing}
          className={`w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 disabled:opacity-50 ${FOCUS_RING}`}
        >
          {EXAM_CONTEXTS.map((ctx) => (
            <option key={ctx} value={ctx}>
              {ctx}
            </option>
          ))}
        </select>
      </div>

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

      <div className="space-y-1.5">
        <label
          htmlFor="studyHours"
          className="block text-sm font-medium text-slate-700"
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
          className={`w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 disabled:opacity-50 focus-visible:ring-offset-2 ${FOCUS_RING}`}
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
          className="block text-sm font-medium text-slate-700"
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
          aria-describedby="charCount journalHint"
          className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none disabled:opacity-50 ${FOCUS_RING}`}
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

      <button
        type="submit"
        disabled={isAnalyzing}
        className="w-full bg-[#5B8DEF] hover:bg-[#4a7de0] active:bg-[#3a6dd0] text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
