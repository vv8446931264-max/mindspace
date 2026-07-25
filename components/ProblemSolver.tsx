"use client";

import { useState } from "react";
import { STEPS, currentStepIndex, isStepAnswered, isComplete, progress } from "@/lib/problemSolving";
import type { Answers } from "@/lib/problemSolving";

const FOCUS_RING = "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1";

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
      <section
        className="leaf rounded-2xl p-6 space-y-4"
        style={{ borderColor: "var(--rule)" }}
        aria-label="Your plan"
      >
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>Your plan</h2>
        <dl className="space-y-3">
          {STEPS.map((s) => (
            <div key={s.id} className="pl-3 border-l-2" style={{ borderColor: "var(--margin-rule)" }}>
              <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--ink-dim)" }}>
                {s.question}
              </dt>
              <dd className="text-sm leading-relaxed mt-0.5" style={{ color: "var(--ink-second)" }}>
                {answers[s.id]}
              </dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={() => { setAnswers({}); setIndex(0); }}
          className={`min-h-[44px] text-sm underline rounded px-1 ${FOCUS_RING}`}
          style={{ color: "var(--ink-dim)" }}
        >
          Work through another one
        </button>
      </section>
    );
  }

  return (
    <section
      className="leaf rounded-2xl p-6 space-y-4"
      style={{ borderColor: "var(--rule)" }}
      aria-label="Work through a problem"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
          Work through one thing
        </h2>
        <span className="text-xs tabular-nums" style={{ color: "var(--ink-dim)" }} aria-live="polite">
          Step {index + 1} of {total}
          <span className="sr-only">, {done} answered</span>
        </span>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor={`ps-${step.id}`}
          className="block text-sm font-medium"
          style={{ color: "var(--ink-second)" }}
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
        <p id={`ps-hint-${step.id}`} className="text-xs" style={{ color: "var(--ink-dim)" }}>
          {step.hint}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {index > 0 && (
          <button
            type="button"
            onClick={back}
            className={`min-h-[48px] px-4 rounded-xl text-sm border ${FOCUS_RING}`}
            style={{ color: "var(--ink-second)", borderColor: "var(--rule)" }}
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          disabled={!canAdvance}
          className={`min-h-[48px] flex-1 px-4 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed ${FOCUS_RING}`}
          style={{ background: "var(--marker)", color: "var(--on-marker)" }}
        >
          {atLast ? "Done" : "Next"}
        </button>
      </div>
    </section>
  );
}
