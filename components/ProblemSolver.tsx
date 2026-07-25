"use client";

import { useState } from "react";
import { STEPS, currentStepIndex, isStepAnswered, isComplete, progress } from "@/lib/problemSolving";
import type { Answers } from "@/lib/problemSolving";

const FOCUS_RING =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

/**
 * Guided problem-solving, one question at a time.
 *
 * Linear by design — branching flows fail under distress because decision
 * fatigue is the failure mode. Progress is always visible: hiding how many
 * steps remain is where users with ADHD-pattern attention abandon, and
 * undiagnosed ADHD is common and unlabelled in this cohort.
 *
 * Nothing here is scored, ranked, or persisted across days.
 */
export default function ProblemSolver() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);

  const step = STEPS[index];
  const value = answers[step.id] ?? "";
  const canAdvance = isStepAnswered(answers, step.id);
  const { done, total } = progress(answers);
  const atLast = index === STEPS.length - 1;
  const finished = atLast && isComplete(answers);

  function set(v: string) {
    setAnswers((a) => ({ ...a, [step.id]: v }));
  }

  function next() {
    if (!canAdvance) return;
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  if (finished) {
    return (
      <section className="glass rounded-3xl p-6 space-y-4" aria-label="Your plan">
        <h2 className="text-lg font-extrabold text-white tracking-tight">Your plan</h2>
        <dl className="space-y-3">
          {STEPS.map((s) => (
            <div key={s.id}>
              <dt className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {s.question}
              </dt>
              <dd className="text-sm text-slate-200 leading-relaxed mt-0.5">
                {answers[s.id]}
              </dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setIndex(0);
          }}
          className={`min-h-[44px] text-sm text-slate-300 underline hover:text-white rounded px-1 ${FOCUS_RING}`}
        >
          Work through another one
        </button>
      </section>
    );
  }

  return (
    <section className="glass rounded-3xl p-6 space-y-4" aria-label="Work through a problem">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-extrabold text-white tracking-tight">
          Work through one thing
        </h2>
        {/* Always-visible step count — never hide the length of a multi-step flow. */}
        <span className="text-xs text-slate-400 tabular-nums" aria-live="polite">
          Step {index + 1} of {total}
          <span className="sr-only">, {done} answered</span>
        </span>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`ps-${step.id}`}
          className="block text-sm font-medium text-slate-200"
        >
          {step.question}
        </label>
        <textarea
          id={`ps-${step.id}`}
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={step.placeholder}
          rows={3}
          spellCheck={false}
          aria-describedby={`ps-hint-${step.id}`}
          className={`field w-full rounded-lg px-3 py-2 text-sm resize-none ${FOCUS_RING}`}
        />
        <p id={`ps-hint-${step.id}`} className="text-xs text-slate-400">
          {step.hint}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {index > 0 && (
          <button
            type="button"
            onClick={back}
            className={`min-h-[48px] px-4 rounded-xl text-sm text-slate-300 border border-white/10 hover:border-white/25 ${FOCUS_RING}`}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={!canAdvance}
          className={`min-h-[48px] flex-1 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#5B8DEF] to-[#7B6FE8] disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS_RING}`}
        >
          {atLast ? "Done" : "Next"}
        </button>
      </div>
    </section>
  );
}
