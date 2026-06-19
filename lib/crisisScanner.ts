// Deterministic crisis scanner — pure TS, no LLM, runs before every AI call.
// Conservative: err toward false positives to protect vulnerable users.
//
// Matching uses WORD BOUNDARIES, not raw substring includes. This lets us
// safely catch short, high-signal words like "die" / "dying" without
// false-triggering on "studied", "diet", "dies", or "deadline".

/**
 * "severe"  — explicit self-harm / suicidal intent. Always shows helplines.
 * "distress" — strong hopelessness signals. Also shows helplines (conservative),
 *              but lets us word the response a touch more gently.
 */
type Severity = "severe" | "distress";

const CRISIS_TERMS: ReadonlyArray<{ phrase: string; severity: Severity }> = [
  // ── Explicit suicidal intent ─────────────────────────────
  { phrase: "die", severity: "severe" },
  { phrase: "dying", severity: "severe" },
  { phrase: "want to die", severity: "severe" },
  { phrase: "wish i was dead", severity: "severe" },
  { phrase: "wish i were dead", severity: "severe" },
  { phrase: "want to be dead", severity: "severe" },
  { phrase: "better off dead", severity: "severe" },
  { phrase: "rather be dead", severity: "severe" },
  { phrase: "suicide", severity: "severe" },
  { phrase: "suicidal", severity: "severe" },
  { phrase: "kill myself", severity: "severe" },
  { phrase: "killing myself", severity: "severe" },
  { phrase: "kill me", severity: "severe" },
  { phrase: "take my life", severity: "severe" },
  { phrase: "take my own life", severity: "severe" },
  { phrase: "end my life", severity: "severe" },
  { phrase: "ending my life", severity: "severe" },
  { phrase: "end it", severity: "severe" },
  { phrase: "end it all", severity: "severe" },
  { phrase: "end everything", severity: "severe" },

  // ── Self-harm ────────────────────────────────────────────
  { phrase: "hurt myself", severity: "severe" },
  { phrase: "hurting myself", severity: "severe" },
  { phrase: "harm myself", severity: "severe" },
  { phrase: "harming myself", severity: "severe" },
  { phrase: "self harm", severity: "severe" },
  { phrase: "self-harm", severity: "severe" },
  { phrase: "cut myself", severity: "severe" },
  { phrase: "cutting myself", severity: "severe" },
  { phrase: "overdose", severity: "severe" },

  // ── Not wanting to exist / live ──────────────────────────
  { phrase: "don't want to exist", severity: "severe" },
  { phrase: "dont want to exist", severity: "severe" },
  { phrase: "don't want to be here", severity: "severe" },
  { phrase: "dont want to be here", severity: "severe" },
  { phrase: "don't want to live", severity: "severe" },
  { phrase: "dont want to live", severity: "severe" },
  { phrase: "no reason to live", severity: "severe" },
  { phrase: "nothing to live for", severity: "severe" },
  { phrase: "no point in living", severity: "severe" },
  { phrase: "no point living", severity: "severe" },
  { phrase: "tired of living", severity: "severe" },
  { phrase: "want to disappear", severity: "severe" },

  // ── High distress / hopelessness ─────────────────────────
  { phrase: "give up", severity: "distress" },
  { phrase: "giving up", severity: "distress" },
  { phrase: "can't go on", severity: "distress" },
  { phrase: "cant go on", severity: "distress" },
  { phrase: "can't do this anymore", severity: "distress" },
  { phrase: "cant do this anymore", severity: "distress" },
  { phrase: "can't take it anymore", severity: "distress" },
  { phrase: "cant take it anymore", severity: "distress" },
  { phrase: "not worth living", severity: "distress" },
  { phrase: "life is not worth", severity: "distress" },
  { phrase: "worthless", severity: "distress" },
  { phrase: "nobody cares", severity: "distress" },
  { phrase: "better off without me", severity: "distress" },
  { phrase: "burden to everyone", severity: "distress" },
  { phrase: "everyone would be better", severity: "distress" },
  { phrase: "hopeless", severity: "distress" },
  { phrase: "pointless", severity: "distress" },
  { phrase: "done with everything", severity: "distress" },
  { phrase: "done with life", severity: "distress" },
];

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Precompile one word-boundary regex per phrase.
const COMPILED: ReadonlyArray<{ phrase: string; severity: Severity; re: RegExp }> =
  CRISIS_TERMS.map(({ phrase, severity }) => ({
    phrase,
    severity,
    re: new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i"),
  }));

export type ScanResult =
  | { crisis: false }
  | { crisis: true; matchedKeyword: string; severity: Severity };

export function scanForCrisis(text: string): ScanResult {
  for (const { phrase, severity, re } of COMPILED) {
    if (re.test(text)) {
      return { crisis: true, matchedKeyword: phrase, severity };
    }
  }
  return { crisis: false };
}

export const CRISIS_HELPLINES = [
  {
    name: "Tele-MANAS (Govt of India)",
    number: "14416",
    hours: "24/7 · free · 20+ languages",
  },
  {
    name: "iCall (TISS)",
    number: "9152987821",
    hours: "Mon–Sat, 8am–10pm IST",
  },
  {
    name: "Vandrevala Foundation",
    number: "9999666555",
    hours: "24/7 · call or WhatsApp",
  },
] as const;

export const CRISIS_MESSAGE =
  "What you're feeling right now is real — and it can ease, even if it doesn't feel that way tonight. No exam, rank, or result is worth more than you are. Please reach out right now; trained, caring people are ready to listen, free and confidential.";
