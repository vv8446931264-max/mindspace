import type { ExamContext } from "@/types";

/**
 * Indian exam calendar and result-day risk windows (ROADMAP-v2 P2.1 / P2.3).
 *
 * Why this file exists: distress in this cohort is episodic and scheduled, not a
 * smooth daily curve. Documented patterns the calendar is built around:
 * - Fortnightly-test result days, not exam days, are when Kota deaths cluster.
 * - A Karnataka SSLC results helpline logged 452 of 532 total calls on results
 *   day itself, 49 before and 25 the day after.
 * - Peak months of documented aspirant deaths are September (16.5%) and August
 *   (12.7%) - the months when admission outcomes get settled and explained to
 *   family, not the months when exams happen.
 *
 * Every function here is pure and takes `today` as an argument. Nothing calls
 * `new Date()`, so behaviour on any calendar day is testable.
 *
 * Dates are `YYYY-MM-DD` strings, matching `MoodHistoryEntry["date"]`.
 *
 * DATE ACCURACY: every event carries a `confidence` field. `"verified"` means
 * the date was corroborated by multiple sources during research. `"estimated"`
 * means it was not confirmed by the conducting body - typically because that
 * body had not published a schedule yet. Never present an `"estimated"` date to
 * a user as fact, and prefer not to fire a hard intervention on one.
 */

/** Whether an event's date was corroborated by research or is a projection. */
export type DateConfidence = "verified" | "estimated";

/** What kind of calendar entry an event is. */
export type ExamEventKind =
  | "exam"
  | "answer_key"
  | "result"
  | "counselling_registration"
  | "seat_allotment"
  | "mop_up"
  | "supplementary_exam";

/** A single dated entry in the exam calendar. */
export type ExamEvent = {
  /** Stable slug. Safe to persist in local storage. */
  readonly id: string;
  readonly examContext: ExamContext;
  readonly kind: ExamEventKind;
  /** Plain-language name. Grade 6-8 reading level, no abbreviations-only labels. */
  readonly label: string;
  /** Start date, `YYYY-MM-DD`. Single-day events use only this. */
  readonly date: string;
  /** Last day, for events that run over a window. */
  readonly endDate?: string;
  readonly confidence: DateConfidence;
  /** Official page for this event, where one exists. */
  readonly source?: string;
  /** Caveats - why a date is estimated, or what changed. */
  readonly note?: string;
};

/**
 * Which documented high-risk period a day falls in.
 *
 * - `pre_result`  - the 72 hours before a scheduled result.
 * - `result_day`  - the announcement day, plus the day after. The Karnataka
 *   SSLC helpline logged 452 calls on results day and 25 the day after, so the
 *   tail day belongs in the same window.
 * - `counselling_limbo` - after a result, before the next admission step; the
 *   window where the dominant need is informational ("what are my options now").
 * - `decision_season` - August and September.
 */
export type RiskWindowKind =
  | "pre_result"
  | "result_day"
  | "counselling_limbo"
  | "decision_season";

/** A period of elevated risk that a given day falls inside. */
export type RiskWindow = {
  readonly kind: RiskWindowKind;
  readonly examContext: ExamContext;
  /** First day of the window, `YYYY-MM-DD`. */
  readonly startDate: string;
  /** Last day of the window, inclusive, `YYYY-MM-DD`. */
  readonly endDate: string;
  /** `"high"` drives `isHighRiskDay`. `"elevated"` does not. */
  readonly severity: "high" | "elevated";
  /** The event the window is anchored to. `null` for `decision_season`. */
  readonly event: ExamEvent | null;
  /** Plain factual sentence. Describes the window, makes no claim about the user. */
  readonly reason: string;
  /**
   * Lowest confidence of any date the window depends on. A window built on an
   * `"estimated"` date must be presented with that uncertainty attached.
   */
  readonly confidence: DateConfidence;
};

/** Days before a result that count as the pre-result window (72 hours). */
export const PRE_RESULT_LEAD_DAYS = 3;

/** Days after an announcement that still count as the result-day window. */
export const RESULT_DAY_TAIL_DAYS = 1;

/**
 * A result and the next admission step must be no further apart than this for
 * the wait between them to count as counselling limbo. A longer gap is an
 * ordinary wait for the next exam cycle, not an acute post-result state.
 */
export const MAX_COUNSELLING_LIMBO_DAYS = 60;

/** Calendar months (1-indexed) treated as decision season. */
export const DECISION_SEASON_MONTHS: readonly number[] = [8, 9];

/** Event kinds that announce an outcome. These anchor result-day handling. */
const RESULT_LIKE_KINDS: readonly ExamEventKind[] = ["result", "seat_allotment"];

/** Event kinds that represent an admission step still to come. */
const COUNSELLING_KINDS: readonly ExamEventKind[] = [
  "counselling_registration",
  "seat_allotment",
  "mop_up",
];

const MS_PER_DAY = 86_400_000;

/**
 * Known Indian exam events.
 *
 * `CAT`, `GATE`, `UPSC` and `Other` deliberately have no entries: no schedule
 * for them was verified during research, and a guessed national date is worse
 * than no date. Callers must handle an empty list for any context.
 *
 * No estimated *result* dates are listed for 2027. A result-day surface firing
 * on a guessed date is a failure mode worth avoiding; estimated *exam* dates
 * are listed because they only inform planning.
 */
export const EXAM_EVENTS: readonly ExamEvent[] = Object.freeze([
  // ---------------------------------------------------------------- JEE ----
  {
    id: "jee-main-2026-s1-exam",
    examContext: "JEE",
    kind: "exam",
    label: "JEE Main 2026 Session 1 exam",
    date: "2026-01-21",
    endDate: "2026-01-30",
    confidence: "verified",
    source: "https://jeemain.nta.nic.in/",
  },
  {
    id: "jee-main-2026-s1-result",
    examContext: "JEE",
    kind: "result",
    label: "JEE Main 2026 Session 1 result",
    date: "2026-02-16",
    confidence: "verified",
    source: "https://jeemain.nta.nic.in/",
  },
  {
    id: "jee-main-2026-s2-exam",
    examContext: "JEE",
    kind: "exam",
    label: "JEE Main 2026 Session 2 exam",
    date: "2026-04-02",
    endDate: "2026-04-08",
    confidence: "verified",
    source: "https://jeemain.nta.nic.in/",
  },
  {
    id: "jee-main-2026-s2-result",
    examContext: "JEE",
    kind: "result",
    label: "JEE Main 2026 Session 2 result",
    date: "2026-04-20",
    confidence: "verified",
    source: "https://jeemain.nta.nic.in/",
    note: "The better of your two session scores is the one that counts.",
  },
  {
    id: "jee-advanced-2026-exam",
    examContext: "JEE",
    kind: "exam",
    label: "JEE Advanced 2026 exam",
    date: "2026-05-17",
    confidence: "verified",
    source: "https://jeeadv.ac.in/",
  },
  {
    id: "jee-advanced-2026-result",
    examContext: "JEE",
    kind: "result",
    label: "JEE Advanced 2026 result",
    date: "2026-06-01",
    confidence: "verified",
    source: "https://jeeadv.ac.in/",
  },
  {
    id: "josaa-2026-registration",
    examContext: "JEE",
    kind: "counselling_registration",
    label: "JoSAA 2026 registration and choice filling",
    date: "2026-06-02",
    endDate: "2026-06-11",
    confidence: "verified",
    source: "https://josaa.nic.in/",
  },
  {
    id: "josaa-2026-round-1",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "JoSAA 2026 Round 1 seat allotment",
    date: "2026-06-13",
    confidence: "verified",
    source: "https://josaa.nic.in/",
  },
  {
    id: "josaa-2026-round-2",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "JoSAA 2026 Round 2 seat allotment",
    date: "2026-06-30",
    confidence: "verified",
    source: "https://josaa.nic.in/",
  },
  {
    id: "josaa-2026-round-3",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "JoSAA 2026 Round 3 seat allotment",
    date: "2026-07-06",
    confidence: "verified",
    source: "https://josaa.nic.in/",
  },
  {
    id: "josaa-2026-round-4",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "JoSAA 2026 Round 4 seat allotment",
    date: "2026-07-10",
    confidence: "verified",
    source: "https://josaa.nic.in/",
  },
  {
    id: "josaa-2026-round-5",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "JoSAA 2026 Round 5 seat allotment (final JoSAA round)",
    date: "2026-07-16",
    confidence: "verified",
    source: "https://josaa.nic.in/",
    note: "Seats left empty after this round move to the CSAB special rounds.",
  },
  {
    id: "csab-2026-registration",
    examContext: "JEE",
    kind: "counselling_registration",
    label: "CSAB special rounds 2026 registration",
    date: "2026-07-28",
    confidence: "estimated",
    source: "https://csab.nic.in/csab-special/",
    note:
      "CSAB published a 2026 schedule as a downloadable PDF; the date could not be read off the official page and comes from secondary reporting. Confirm on csab.nic.in. CSAB needs a fresh registration - JoSAA choices do not carry over.",
  },
  {
    id: "csab-2026-special-round-1",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "CSAB special round 1 seat allotment",
    date: "2026-08-05",
    confidence: "estimated",
    source: "https://csab.nic.in/csab-special/",
    note:
      "Inferred from secondary reports of an early-August reporting window. Not an announced date.",
  },
  {
    id: "csab-2026-special-round-2",
    examContext: "JEE",
    kind: "seat_allotment",
    label: "CSAB special round 2 seat allotment",
    date: "2026-08-12",
    confidence: "estimated",
    source: "https://csab.nic.in/csab-special/",
    note:
      "Inferred from secondary reports of a mid-August reporting window. Not an announced date.",
  },
  {
    id: "jee-main-2027-s1-exam",
    examContext: "JEE",
    kind: "exam",
    label: "JEE Main 2027 Session 1 exam",
    date: "2027-01-21",
    endDate: "2027-01-31",
    confidence: "estimated",
    source: "https://jeemain.nta.nic.in/",
    note:
      "NTA had not released the 2027 schedule as of July 2026. Session 1 has run in the last week of January in recent years. The notification is usually out in late October.",
  },

  // --------------------------------------------------------------- NEET ----
  {
    id: "neet-ug-2026-exam-cancelled",
    examContext: "NEET",
    kind: "exam",
    label: "NEET UG 2026 exam (cancelled)",
    date: "2026-05-03",
    confidence: "verified",
    source: "https://neet.nta.nic.in/",
    note:
      "This paper was cancelled after a leak. A re-exam was held on 21 June 2026 and a CBI investigation was registered.",
  },
  {
    id: "neet-ug-2026-reexam",
    examContext: "NEET",
    kind: "exam",
    label: "NEET UG 2026 re-exam",
    date: "2026-06-21",
    confidence: "verified",
    source: "https://neet.nta.nic.in/",
  },
  {
    id: "neet-ug-2026-answer-key",
    examContext: "NEET",
    kind: "answer_key",
    label: "NEET UG 2026 provisional answer key",
    date: "2026-06-25",
    confidence: "verified",
    source: "https://neet.nta.nic.in/",
    note:
      "The challenge window on the provisional key is the only way to dispute marks. NTA does not re-check or re-evaluate NEET answer sheets after the result.",
  },
  {
    id: "neet-ug-2026-result",
    examContext: "NEET",
    kind: "result",
    label: "NEET UG 2026 result",
    date: "2026-07-16",
    confidence: "verified",
    source: "https://neet.nta.nic.in/",
  },
  {
    id: "mcc-neet-ug-2026-r1-registration",
    examContext: "NEET",
    kind: "counselling_registration",
    label: "MCC counselling Round 1 registration (All India Quota)",
    date: "2026-08-01",
    endDate: "2026-08-10",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note:
      "MCC had not published the 2026 UG counselling schedule as of 25 July 2026. This is a projection from previous cycles, shifted for the June re-exam. Check mcc.nic.in before acting on it.",
  },
  {
    id: "mcc-neet-ug-2026-r1-allotment",
    examContext: "NEET",
    kind: "seat_allotment",
    label: "MCC counselling Round 1 seat allotment",
    date: "2026-08-15",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note: "Projected. MCC had not announced the 2026 schedule.",
  },
  {
    id: "mcc-neet-ug-2026-r2-registration",
    examContext: "NEET",
    kind: "counselling_registration",
    label: "MCC counselling Round 2 registration",
    date: "2026-08-22",
    endDate: "2026-08-30",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note: "Projected. MCC had not announced the 2026 schedule.",
  },
  {
    id: "mcc-neet-ug-2026-r2-allotment",
    examContext: "NEET",
    kind: "seat_allotment",
    label: "MCC counselling Round 2 seat allotment",
    date: "2026-09-05",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note: "Projected. MCC had not announced the 2026 schedule.",
  },
  {
    id: "mcc-neet-ug-2026-mop-up",
    examContext: "NEET",
    kind: "mop_up",
    label: "MCC mop-up round",
    date: "2026-09-15",
    endDate: "2026-09-20",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note:
      "Projected. The mop-up round fills seats still empty after Rounds 1 and 2.",
  },
  {
    id: "mcc-neet-ug-2026-stray-vacancy",
    examContext: "NEET",
    kind: "mop_up",
    label: "MCC stray vacancy round",
    date: "2026-10-05",
    confidence: "estimated",
    source: "https://mcc.nic.in/ug-medical-counselling/",
    note:
      "Projected, and usually October. This is the last central round; colleges and states run it.",
  },
  {
    id: "neet-ug-2027-exam",
    examContext: "NEET",
    kind: "exam",
    label: "NEET UG 2027 exam",
    date: "2027-05-02",
    confidence: "estimated",
    source: "https://neet.nta.nic.in/",
    note:
      "NTA had not released the 2027 date. NEET UG normally runs on the first Sunday of May.",
  },

  // --------------------------------------------------------------- CUET ----
  {
    id: "cuet-ug-2026-exam",
    examContext: "CUET",
    kind: "exam",
    label: "CUET UG 2026 exam window",
    date: "2026-05-11",
    endDate: "2026-05-31",
    confidence: "verified",
    source: "https://cuet.nta.nic.in/",
    note: "Some candidates were given dates in early June.",
  },
  {
    id: "cuet-ug-2026-provisional-answer-key",
    examContext: "CUET",
    kind: "answer_key",
    label: "CUET UG 2026 provisional answer key",
    date: "2026-06-09",
    confidence: "verified",
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "cuet-ug-2026-final-answer-key",
    examContext: "CUET",
    kind: "answer_key",
    label: "CUET UG 2026 final answer key",
    date: "2026-06-21",
    confidence: "verified",
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "cuet-ug-2026-result",
    examContext: "CUET",
    kind: "result",
    label: "CUET UG 2026 result",
    date: "2026-06-23",
    confidence: "verified",
    source: "https://cuet.nta.nic.in/",
  },
  {
    id: "du-csas-2026-registration",
    examContext: "CUET",
    kind: "counselling_registration",
    label: "Delhi University CSAS registration opens",
    date: "2026-06-26",
    confidence: "verified",
    source: "https://ugadmission.uod.ac.in/",
    note:
      "There is no single national CUET counselling. Each university runs its own rounds on its own dates.",
  },
  {
    id: "du-csas-2026-round-1",
    examContext: "CUET",
    kind: "seat_allotment",
    label: "Delhi University CSAS Round 1 allocation",
    date: "2026-07-16",
    confidence: "verified",
    source: "https://ugadmission.uod.ac.in/",
  },
  {
    id: "du-csas-2026-round-2",
    examContext: "CUET",
    kind: "seat_allotment",
    label: "Delhi University CSAS Round 2 allocation",
    date: "2026-07-25",
    confidence: "verified",
    source: "https://ugadmission.uod.ac.in/",
  },

  // -------------------------------------------------------------- Board ----
  {
    id: "cbse-2026-class-10-phase-1-result",
    examContext: "Board",
    kind: "result",
    label: "CBSE Class 10 Phase 1 result",
    date: "2026-04-15",
    confidence: "verified",
    source: "https://results.cbse.nic.in/",
    note: "From 2026, CBSE Class 10 runs in two phases in the same year.",
  },
  {
    id: "cisce-2026-result",
    examContext: "Board",
    kind: "result",
    label: "ICSE Class 10 and ISC Class 12 result",
    date: "2026-04-30",
    confidence: "verified",
    source: "https://cisce.org/",
  },
  {
    id: "cbse-2026-class-12-result",
    examContext: "Board",
    kind: "result",
    label: "CBSE Class 12 result",
    date: "2026-05-13",
    confidence: "verified",
    source: "https://results.cbse.nic.in/",
  },
  {
    id: "cbse-2026-class-10-phase-2-result",
    examContext: "Board",
    kind: "result",
    label: "CBSE Class 10 Phase 2 result",
    date: "2026-07-18",
    confidence: "verified",
    source: "https://results.cbse.nic.in/",
  },
  {
    id: "cbse-2026-class-12-compartment-exam",
    examContext: "Board",
    kind: "supplementary_exam",
    label: "CBSE Class 12 compartment exam",
    date: "2026-07-28",
    confidence: "verified",
    source: "https://www.cbse.gov.in/",
    note:
      "CBSE moved this from an earlier 15 July date. The application window closed on 8 July 2026.",
  },
  {
    id: "cbse-2026-compartment-result",
    examContext: "Board",
    kind: "result",
    label: "CBSE compartment result",
    date: "2026-08-14",
    confidence: "estimated",
    source: "https://results.cbse.nic.in/",
    note:
      "CBSE had not announced this date. Estimated from the 2025 gap between compartment exam and result (about two and a half weeks). Confirm on cbse.gov.in.",
  },
]);

// ---------------------------------------------------------------------------
// Date helpers. All arithmetic is in UTC so results do not shift with locale.
// ---------------------------------------------------------------------------

function parseIsoDate(iso: string): number | null {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(5, 7));
  const day = Number(iso.slice(8, 10));
  const ts = Date.UTC(year, month - 1, day);
  const d = new Date(ts);
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() !== month - 1 ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return ts;
}

function formatIsoDate(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

function shiftDays(iso: string, days: number): string {
  const ts = parseIsoDate(iso);
  if (ts === null) return iso;
  return formatIsoDate(ts + days * MS_PER_DAY);
}

function dayGap(fromIso: string, toIso: string): number | null {
  const a = parseIsoDate(fromIso);
  const b = parseIsoDate(toIso);
  if (a === null || b === null) return null;
  return Math.round((b - a) / MS_PER_DAY);
}

function monthOf(iso: string): number | null {
  const ts = parseIsoDate(iso);
  if (ts === null) return null;
  return new Date(ts).getUTCMonth() + 1;
}

function lowestConfidence(...values: DateConfidence[]): DateConfidence {
  return values.includes("estimated") ? "estimated" : "verified";
}

function byDateAscending(a: ExamEvent, b: ExamEvent): number {
  return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * All known events for one exam context, sorted oldest first.
 *
 * Returns an empty array for contexts with no researched schedule
 * (`CAT`, `GATE`, `UPSC`, `Other`). Callers must handle that.
 *
 * @param examContext - The exam the student is preparing for.
 */
export function getEvents(examContext: ExamContext): ExamEvent[] {
  return EXAM_EVENTS.filter((e) => e.examContext === examContext).sort(
    byDateAscending
  );
}

/**
 * Look up a single event by its stable id.
 *
 * @param id - The `ExamEvent["id"]` slug.
 * @returns The event, or `null` if no event has that id.
 */
export function getEventById(id: string): ExamEvent | null {
  return EXAM_EVENTS.find((e) => e.id === id) ?? null;
}

/**
 * Events falling between `today` and `today + withinDays`, inclusive on both
 * ends, sorted oldest first. Today's own events are included, so a caller can
 * render "today" and "coming up" from one call.
 *
 * @param examContext - The exam the student is preparing for.
 * @param today - Reference day as `YYYY-MM-DD`.
 * @param withinDays - How far ahead to look. Negative values return nothing.
 */
export function getUpcomingEvents(
  examContext: ExamContext,
  today: string,
  withinDays: number
): ExamEvent[] {
  if (parseIsoDate(today) === null) return [];
  if (!Number.isFinite(withinDays) || withinDays < 0) return [];

  const horizon = shiftDays(today, Math.floor(withinDays));
  return getEvents(examContext).filter(
    (e) => e.date >= today && e.date <= horizon
  );
}

/**
 * Which documented high-risk window `today` falls in, or `null`.
 *
 * Windows are checked in priority order and the first match wins:
 * 1. `result_day` - an outcome was announced today or within the last
 *    {@link RESULT_DAY_TAIL_DAYS} days.
 * 2. `pre_result` - an outcome lands within the next {@link PRE_RESULT_LEAD_DAYS} days.
 * 3. `counselling_limbo` - between an outcome and the next admission step, when
 *    the two are less than {@link MAX_COUNSELLING_LIMBO_DAYS} apart.
 * 4. `decision_season` - August or September.
 *
 * A seat allotment counts as a result: an allotment list is an announcement
 * with the same shape as a result.
 *
 * Check `window.confidence` before acting. A window anchored to an
 * `"estimated"` event is a guess about the calendar, not a fact.
 *
 * @param examContext - The exam the student is preparing for.
 * @param today - Reference day as `YYYY-MM-DD`.
 */
export function getActiveRiskWindow(
  examContext: ExamContext,
  today: string
): RiskWindow | null {
  if (parseIsoDate(today) === null) return null;

  const events = getEvents(examContext);
  const resultLike = events.filter((e) => RESULT_LIKE_KINDS.includes(e.kind));

  // 1. Result day, and the day after it.
  const justAnnounced = resultLike
    .filter((e) => {
      const gap = dayGap(e.date, today);
      return gap !== null && gap >= 0 && gap <= RESULT_DAY_TAIL_DAYS;
    })
    .sort(byDateAscending)
    .pop();

  if (justAnnounced) {
    const elapsed = dayGap(justAnnounced.date, today) ?? 0;
    return {
      kind: "result_day",
      examContext,
      startDate: justAnnounced.date,
      endDate: shiftDays(justAnnounced.date, RESULT_DAY_TAIL_DAYS),
      severity: "high",
      event: justAnnounced,
      reason:
        elapsed === 0
          ? `${justAnnounced.label} is today.`
          : `${justAnnounced.label} was yesterday.`,
      confidence: justAnnounced.confidence,
    };
  }

  // 2. Pre-result, the 72 hours before an announcement.
  const upcomingResult = resultLike
    .filter((e) => {
      const gap = dayGap(today, e.date);
      return gap !== null && gap >= 1 && gap <= PRE_RESULT_LEAD_DAYS;
    })
    .sort(byDateAscending)[0];

  if (upcomingResult) {
    const gap = dayGap(today, upcomingResult.date) ?? PRE_RESULT_LEAD_DAYS;
    return {
      kind: "pre_result",
      examContext,
      startDate: shiftDays(upcomingResult.date, -PRE_RESULT_LEAD_DAYS),
      endDate: shiftDays(upcomingResult.date, -1),
      severity: "high",
      event: upcomingResult,
      reason:
        gap === 1
          ? `${upcomingResult.label} is tomorrow.`
          : `${upcomingResult.label} is in ${gap} days.`,
      confidence: upcomingResult.confidence,
    };
  }

  // 3. Counselling limbo: an outcome has landed, the next step has not.
  const lastResult = resultLike.filter((e) => e.date < today).pop();
  const nextStep = events
    .filter((e) => COUNSELLING_KINDS.includes(e.kind) && e.date > today)
    .sort(byDateAscending)[0];

  if (lastResult && nextStep) {
    const stepGap = dayGap(lastResult.date, nextStep.date);
    if (stepGap !== null && stepGap <= MAX_COUNSELLING_LIMBO_DAYS) {
      return {
        kind: "counselling_limbo",
        examContext,
        startDate: shiftDays(lastResult.date, 1),
        endDate: shiftDays(nextStep.date, -1),
        severity: "high",
        event: nextStep,
        reason: `Between ${lastResult.label} and ${nextStep.label}. Nothing new is decided until then.`,
        confidence: lowestConfidence(
          lastResult.confidence,
          nextStep.confidence
        ),
      };
    }
  }

  // 4. Decision season.
  const month = monthOf(today);
  if (month !== null && DECISION_SEASON_MONTHS.includes(month)) {
    const year = today.slice(0, 4);
    return {
      kind: "decision_season",
      examContext,
      startDate: `${year}-08-01`,
      endDate: `${year}-09-30`,
      severity: "elevated",
      event: null,
      reason:
        "August and September. Results are done and admission decisions are being settled.",
      confidence: "verified",
    };
  }

  return null;
}

/**
 * Whether `today` is a day the result-day surface should arm itself.
 *
 * True for `result_day`, `pre_result` and `counselling_limbo`. False for
 * `decision_season` on its own - two months is too broad a span to treat every
 * day inside it as acute. Read the window from
 * {@link getActiveRiskWindow} when you need that softer signal.
 *
 * @param examContext - The exam the student is preparing for.
 * @param today - Reference day as `YYYY-MM-DD`.
 */
export function isHighRiskDay(
  examContext: ExamContext,
  today: string
): boolean {
  return getActiveRiskWindow(examContext, today)?.severity === "high";
}
