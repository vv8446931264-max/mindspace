// Deterministic crisis scanner — pure TS, no LLM, runs before every AI call.
//
// TWO TIERS, because one-word matching does not work on how students actually write.
//
//   UNAMBIGUOUS — explicit phrases that are almost never idiomatic
//                 ("kill myself"). Match on their own.
//   CONTEXTUAL  — words that are overwhelmingly idiomatic in student speech
//                 ("dying", "give up", "pointless", "hopeless"). Only count when
//                 they attach to the writer AND are not aimed at coursework.
//
// Why: an audit of the previous single-tier list flagged 11 of 12 ordinary
// journal lines as a crisis — "I'm dying to finish this chapter", "I give up on
// this integration problem", "rotational motion is pointless". Word boundaries
// stop "studied"/"deadline"; they do nothing about hyperbole. A crisis card that
// fires on a chemistry chapter teaches the student to dismiss the card on the
// night it matters, which is worse than not showing one.
//
// Recall is still the priority — we err toward flagging on the UNAMBIGUOUS tier,
// and the CONTEXTUAL tier is deliberately narrow rather than deleted.

/**
 * "severe"  — explicit self-harm / suicidal intent. Always shows helplines.
 * "distress" — strong hopelessness signals. Also shows helplines (conservative),
 *              but lets us word the response a touch more gently.
 */
type Severity = "severe" | "distress";

/** Phrases specific enough to stand alone. */
const UNAMBIGUOUS_TERMS: ReadonlyArray<{ phrase: string; severity: Severity }> = [
  // ── Explicit suicidal intent ─────────────────────────────
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

  // ── High distress / hopelessness (specific enough to stand alone) ──
  { phrase: "can't go on", severity: "distress" },
  { phrase: "cant go on", severity: "distress" },
  { phrase: "can't do this anymore", severity: "distress" },
  { phrase: "cant do this anymore", severity: "distress" },
  { phrase: "can't take it anymore", severity: "distress" },
  { phrase: "cant take it anymore", severity: "distress" },
  { phrase: "not worth living", severity: "distress" },
  { phrase: "life is not worth", severity: "distress" },
  { phrase: "better off without me", severity: "distress" },
  { phrase: "burden to everyone", severity: "distress" },
  { phrase: "everyone would be better", severity: "distress" },
  { phrase: "done with life", severity: "distress" },
];

/**
 * Words that are usually hyperbole in student writing. They only count when the
 * writer attaches them to THEMSELVES and is not talking about coursework.
 */
const CONTEXTUAL_TERMS: ReadonlyArray<{ phrase: string; severity: Severity }> = [
  { phrase: "die", severity: "severe" },
  { phrase: "dying", severity: "severe" },
  { phrase: "end it", severity: "severe" },
  { phrase: "give up", severity: "distress" },
  { phrase: "giving up", severity: "distress" },
  { phrase: "worthless", severity: "distress" },
  { phrase: "hopeless", severity: "distress" },
  { phrase: "pointless", severity: "distress" },
  { phrase: "nobody cares", severity: "distress" },
  { phrase: "done with everything", severity: "distress" },
];

/**
 * Self-reference near the term. Without this, "my phone is dying" reads as crisis.
 * Deliberately first-person only — a student writing about themselves.
 */
const SELF_REFERENCE =
  /\b(i|i'm|im|i am|i've|ive|me|my|myself|mera|meri|mujhe|main|everything|nothing|life|anymore)\b/i;

/**
 * Academic / object targets. If the term is aimed at one of these, it is about
 * the work, not the writer: "I give up on this problem", "my battery is dying".
 * ponytail: a keyword list, not a parser. Upgrade to dependency parsing only if
 * the regression suite shows this missing real cases.
 */
const ACADEMIC_OBJECT =
  /\b(question|questions|problem|problems|sum|sums|chapter|chapters|topic|topics|subject|syllabus|module|paper|mock|test|dpp|assignment|homework|lecture|class|batch|phone|battery|laptop|charge|boredom|hunger|thirst|marks?|rank|score|deadline|revision|integration|derivation|numericals?|exam|exams|mains|advanced|jee|neet|physics|chemistry|maths|math|biology|motion|formula|formulae|concept|concepts|theorem|theory|unit|units)\b/i;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compile(
  terms: ReadonlyArray<{ phrase: string; severity: Severity }>
): ReadonlyArray<{ phrase: string; severity: Severity; re: RegExp }> {
  return terms.map(({ phrase, severity }) => ({
    phrase,
    severity,
    re: new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i"),
  }));
}

const COMPILED_UNAMBIGUOUS = compile(UNAMBIGUOUS_TERMS);
const COMPILED_CONTEXTUAL = compile(CONTEXTUAL_TERMS);

/** Sentence containing the match — context is judged locally, not across the whole entry. */
function sentenceAround(text: string, re: RegExp): string {
  for (const sentence of text.split(/(?<=[.!?\n])\s+/)) {
    if (re.test(sentence)) return sentence;
  }
  return text;
}

export type ScanResult =
  | { crisis: false }
  | { crisis: true; matchedKeyword: string; severity: Severity };

export function scanForCrisis(text: string): ScanResult {
  // Tier 1 — explicit phrases always count.
  for (const { phrase, severity, re } of COMPILED_UNAMBIGUOUS) {
    if (re.test(text)) {
      return { crisis: true, matchedKeyword: phrase, severity };
    }
  }

  // Tier 2 — idiomatic words only count when aimed at the writer, not the work.
  for (const { phrase, severity, re } of COMPILED_CONTEXTUAL) {
    if (!re.test(text)) continue;

    const sentence = sentenceAround(text, re);
    if (!SELF_REFERENCE.test(sentence)) continue;
    if (ACADEMIC_OBJECT.test(sentence)) continue;

    return { crisis: true, matchedKeyword: phrase, severity };
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
