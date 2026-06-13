// Deterministic crisis scanner — pure TS, no LLM, runs before every AI call.
// Conservative: err toward false positives to protect vulnerable users.

const CRISIS_KEYWORDS: readonly string[] = [
  "give up",
  "giving up",
  "end it",
  "end my life",
  "end everything",
  "don't want to exist",
  "dont want to exist",
  "don't want to be here",
  "dont want to be here",
  "can't go on",
  "cant go on",
  "can't do this anymore",
  "cant do this anymore",
  "want to die",
  "want to disappear",
  "suicide",
  "suicidal",
  "kill myself",
  "hurt myself",
  "hurting myself",
  "harm myself",
  "harming myself",
  "self harm",
  "self-harm",
  "no reason to live",
  "not worth living",
  "life is not worth",
  "worthless",
  "nobody cares",
  "better off without me",
  "burden to everyone",
  "everyone would be better",
  "nothing to live for",
  "hopeless",
  "pointless",
  "can't take it anymore",
  "cant take it anymore",
  "done with everything",
  "done with life",
];

export type ScanResult =
  | { crisis: false }
  | { crisis: true; matchedKeyword: string };

export function scanForCrisis(text: string): ScanResult {
  const normalized = text.toLowerCase().trim();
  for (const keyword of CRISIS_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return { crisis: true, matchedKeyword: keyword };
    }
  }
  return { crisis: false };
}

export const CRISIS_HELPLINES = [
  {
    name: "iCall",
    number: "9152987821",
    hours: "Mon–Sat, 8am–10pm IST",
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    hours: "24/7",
  },
] as const;

export const CRISIS_MESSAGE =
  "You don't have to face this alone. Reaching out takes courage — please talk to someone who can truly help.";
