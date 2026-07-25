/**
 * Guided problem-solving — the evidence-backed core of the product.
 *
 * Why this and not meditation: the measured deficit in Kota students is coping
 * *style*. A comparative study found ~50% avoidance coping in both coaching and
 * non-coaching groups — nobody taught them to approach problems. Sangath's PRIDE
 * programme, the only Indian-validated adolescent intervention at scale, targets
 * exactly this with brief problem-solving and reports d=1.47 on problem severity.
 * Mindfulness is the default Western import and does not touch avoidance coping.
 *
 * Structure is deliberately linear (define -> options -> choose -> act -> review).
 * Branching flows fail under distress: decision fatigue is the failure mode, not
 * boredom. One question at a time, one obvious next action.
 *
 * ponytail: plain state machine, no library. Steps are data, so the order can
 * change without touching the component.
 */

export type StepId = "define" | "options" | "choose" | "act" | "review";

export type Step = {
  id: StepId;
  /** Shown as the single question on screen. */
  question: string;
  /** Placeholder — concrete, exam-context flavoured, never aspirational. */
  placeholder: string;
  /** One line under the input. Practical, not encouraging. */
  hint: string;
  /** Minimum characters before the user can advance. Low on purpose. */
  minLength: number;
};

export const STEPS: readonly Step[] = [
  {
    id: "define",
    question: "What's the one thing bothering you most right now?",
    placeholder: "Physics backlog is three chapters deep and the next test is Sunday.",
    hint: "One thing, not everything. The most concrete version you can write.",
    minLength: 15,
  },
  {
    id: "options",
    question: "What could you actually do about it? List a few.",
    placeholder:
      "Skip rotational motion for now. Ask Rohit for his notes. Tell sir I'm behind. Do past-year questions only.",
    hint: "Bad options count. Write them anyway — the point is having more than one.",
    minLength: 15,
  },
  {
    id: "choose",
    question: "Which one will you try first?",
    placeholder: "Past-year questions only, for rotational motion.",
    hint: "Pick the one you could start today, not the one that sounds best.",
    minLength: 5,
  },
  {
    id: "act",
    question: "What's the first small step, and when?",
    placeholder: "Tonight after dinner, 40 minutes, 2019 and 2020 papers.",
    hint: "Small enough that you'd be embarrassed to fail at it.",
    minLength: 8,
  },
  {
    id: "review",
    question: "How will you know if it worked?",
    placeholder: "If I can do a rotational motion question without opening the module.",
    hint: "Something you can actually check. Not a feeling.",
    minLength: 8,
  },
] as const;

export type Answers = Partial<Record<StepId, string>>;

export type Session = {
  /** YYYY-MM-DD, matches MoodHistoryEntry. */
  date: string;
  answers: Answers;
  /** Set when the user reaches the end. Unfinished sessions are normal, not failures. */
  completed: boolean;
};

/** Index of the step to show, given what's answered so far. */
export function currentStepIndex(answers: Answers): number {
  const i = STEPS.findIndex((s) => !isStepAnswered(answers, s.id));
  return i === -1 ? STEPS.length - 1 : i;
}

export function isStepAnswered(answers: Answers, id: StepId): boolean {
  const step = STEPS.find((s) => s.id === id);
  const value = answers[id]?.trim() ?? "";
  return step ? value.length >= step.minLength : false;
}

export function isComplete(answers: Answers): boolean {
  return STEPS.every((s) => isStepAnswered(answers, s.id));
}

/**
 * Progress as a fraction. Exposed for an always-visible step indicator —
 * multi-step flows must never hide how long they are, which is where users
 * with ADHD-pattern attention abandon.
 *
 * Note this only ever rises within a session and is never persisted across
 * days, so it cannot become a streak-like number that falls when someone
 * stops showing up. See docs/ROADMAP-v2.md P0.2.
 */
export function progress(answers: Answers): { done: number; total: number } {
  return {
    done: STEPS.filter((s) => isStepAnswered(answers, s.id)).length,
    total: STEPS.length,
  };
}
