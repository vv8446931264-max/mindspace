import { describe, it, expect } from "vitest";
import {
  EXAM_EVENTS,
  DECISION_SEASON_MONTHS,
  MAX_COUNSELLING_LIMBO_DAYS,
  PRE_RESULT_LEAD_DAYS,
  RESULT_DAY_TAIL_DAYS,
  getActiveRiskWindow,
  getEventById,
  getEvents,
  getUpcomingEvents,
  isHighRiskDay,
} from "../lib/examCalendar";
import type { ExamContext } from "../types";

const ALL_CONTEXTS: ExamContext[] = [
  "JEE",
  "NEET",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Board",
  "Other",
];

/** Contexts deliberately shipped without a researched schedule. */
const CONTEXTS_WITHOUT_DATA: ExamContext[] = ["CAT", "GATE", "UPSC", "Other"];

// Anchors used across the boundary tests.
const NEET_RESULT = "2026-07-16"; // verified
const JEE_MAIN_S1_RESULT = "2026-02-16"; // verified
const MCC_ROUND_1_ALLOTMENT = "2026-08-15"; // estimated

describe("EXAM_EVENTS data integrity", () => {
  it("has unique ids", () => {
    const ids = EXAM_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses YYYY-MM-DD dates everywhere", () => {
    for (const event of EXAM_EVENTS) {
      expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (event.endDate) {
        expect(event.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });

  it("never ends a window before it starts", () => {
    for (const event of EXAM_EVENTS) {
      if (event.endDate) {
        expect(event.endDate >= event.date).toBe(true);
      }
    }
  });

  it("explains every estimated date in a note", () => {
    const estimated = EXAM_EVENTS.filter((e) => e.confidence === "estimated");
    expect(estimated.length).toBeGreaterThan(0);
    for (const event of estimated) {
      expect(event.note && event.note.length > 0).toBe(true);
    }
  });

  it("marks every MCC counselling date as estimated", () => {
    // MCC had not published a 2026 UG schedule. Presenting these as fact
    // could cost someone a seat.
    const mcc = EXAM_EVENTS.filter((e) => e.id.startsWith("mcc-"));
    expect(mcc.length).toBeGreaterThan(0);
    for (const event of mcc) {
      expect(event.confidence).toBe("estimated");
    }
  });

  it("ships no guessed future result dates", () => {
    // An estimated exam date only informs planning. An estimated result date
    // would fire the result-day surface on a day nothing happens.
    const guessedResults = EXAM_EVENTS.filter(
      (e) => e.confidence === "estimated" && e.kind === "result"
    );
    for (const event of guessedResults) {
      expect(event.date < "2027-01-01").toBe(true);
    }
  });
});

describe("getEvents", () => {
  it("returns events sorted oldest first", () => {
    const dates = getEvents("NEET").map((e) => e.date);
    expect(dates.length).toBeGreaterThan(0);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1] <= dates[i]).toBe(true);
    }
  });

  it("only returns events for the requested context", () => {
    for (const event of getEvents("JEE")) {
      expect(event.examContext).toBe("JEE");
    }
  });

  it.each(CONTEXTS_WITHOUT_DATA)(
    "returns an empty list for %s, which has no researched schedule",
    (context) => {
      expect(getEvents(context)).toEqual([]);
    }
  );
});

describe("getEventById", () => {
  it("finds a known event", () => {
    expect(getEventById("neet-ug-2026-result")?.date).toBe(NEET_RESULT);
  });

  it("returns null for an unknown id", () => {
    expect(getEventById("no-such-event")).toBeNull();
  });
});

describe("getUpcomingEvents", () => {
  it("includes an event happening today", () => {
    const ids = getUpcomingEvents("NEET", NEET_RESULT, 0).map((e) => e.id);
    expect(ids).toContain("neet-ug-2026-result");
  });

  it("treats the horizon as inclusive", () => {
    // MCC Round 1 registration is 16 days after the NEET result.
    const inRange = getUpcomingEvents("NEET", NEET_RESULT, 16).map((e) => e.id);
    expect(inRange).toContain("mcc-neet-ug-2026-r1-registration");
  });

  it("excludes an event one day past the horizon", () => {
    const outOfRange = getUpcomingEvents("NEET", NEET_RESULT, 15).map(
      (e) => e.id
    );
    expect(outOfRange).not.toContain("mcc-neet-ug-2026-r1-registration");
  });

  it("excludes events already in the past", () => {
    const ids = getUpcomingEvents("NEET", NEET_RESULT, 365).map((e) => e.id);
    expect(ids).not.toContain("neet-ug-2026-reexam");
  });

  it("returns results sorted oldest first", () => {
    const dates = getUpcomingEvents("JEE", "2026-01-01", 400).map((e) => e.date);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1] <= dates[i]).toBe(true);
    }
  });

  it("returns nothing for a negative window", () => {
    expect(getUpcomingEvents("NEET", NEET_RESULT, -1)).toEqual([]);
  });

  it("returns nothing for a malformed date", () => {
    expect(getUpcomingEvents("NEET", "16-07-2026", 30)).toEqual([]);
    expect(getUpcomingEvents("NEET", "2026-13-01", 30)).toEqual([]);
    expect(getUpcomingEvents("NEET", "2026-02-30", 30)).toEqual([]);
    expect(getUpcomingEvents("NEET", "", 30)).toEqual([]);
  });

  it.each(CONTEXTS_WITHOUT_DATA)(
    "returns nothing for %s, which has no researched schedule",
    (context) => {
      expect(getUpcomingEvents(context, "2026-07-25", 365)).toEqual([]);
    }
  );
});

describe("getActiveRiskWindow - result day boundaries", () => {
  it("returns result_day on the announcement day", () => {
    const window = getActiveRiskWindow("NEET", NEET_RESULT);
    expect(window?.kind).toBe("result_day");
    expect(window?.severity).toBe("high");
    expect(window?.event?.id).toBe("neet-ug-2026-result");
    expect(window?.startDate).toBe(NEET_RESULT);
  });

  it("still returns result_day the day after", () => {
    // 452 of 532 helpline calls landed on results day and 25 the day after.
    const window = getActiveRiskWindow("NEET", "2026-07-17");
    expect(window?.kind).toBe("result_day");
    expect(window?.event?.id).toBe("neet-ug-2026-result");
  });

  it("stops being result_day two days after, with nothing scheduled soon", () => {
    // JEE Main Session 1: the next admission step is JoSAA in June, far past
    // the limbo cap, so the day after the tail has no window at all.
    expect(getActiveRiskWindow("JEE", JEE_MAIN_S1_RESULT)?.kind).toBe(
      "result_day"
    );
    expect(getActiveRiskWindow("JEE", "2026-02-17")?.kind).toBe("result_day");
    expect(getActiveRiskWindow("JEE", "2026-02-18")).toBeNull();
  });

  it("treats a seat allotment as an announcement", () => {
    const window = getActiveRiskWindow("JEE", "2026-07-16");
    expect(window?.kind).toBe("result_day");
    expect(window?.event?.id).toBe("josaa-2026-round-5");
  });

  it("passes through the confidence of the anchoring event", () => {
    expect(getActiveRiskWindow("NEET", NEET_RESULT)?.confidence).toBe(
      "verified"
    );
    expect(getActiveRiskWindow("NEET", MCC_ROUND_1_ALLOTMENT)?.confidence).toBe(
      "estimated"
    );
  });

  it("spans exactly the announcement day plus the tail", () => {
    const window = getActiveRiskWindow("NEET", NEET_RESULT);
    expect(window?.startDate).toBe("2026-07-16");
    expect(window?.endDate).toBe("2026-07-17");
    expect(RESULT_DAY_TAIL_DAYS).toBe(1);
  });
});

describe("getActiveRiskWindow - pre-result boundaries", () => {
  it("is not active four days before the result", () => {
    expect(getActiveRiskWindow("NEET", "2026-07-12")).toBeNull();
  });

  it("opens exactly 72 hours before the result", () => {
    const window = getActiveRiskWindow("NEET", "2026-07-13");
    expect(window?.kind).toBe("pre_result");
    expect(window?.severity).toBe("high");
    expect(window?.startDate).toBe("2026-07-13");
    expect(window?.endDate).toBe("2026-07-15");
    expect(PRE_RESULT_LEAD_DAYS).toBe(3);
  });

  it("stays open on the day before the result", () => {
    const window = getActiveRiskWindow("NEET", "2026-07-15");
    expect(window?.kind).toBe("pre_result");
    expect(window?.reason).toContain("tomorrow");
  });

  it("yields to result_day on the day itself", () => {
    expect(getActiveRiskWindow("NEET", NEET_RESULT)?.kind).toBe("result_day");
  });

  it("describes the gap in plain days", () => {
    expect(getActiveRiskWindow("NEET", "2026-07-14")?.reason).toContain(
      "2 days"
    );
  });

  it("fires for an estimated allotment but flags the confidence", () => {
    const window = getActiveRiskWindow("NEET", "2026-08-14");
    expect(window?.kind).toBe("pre_result");
    expect(window?.confidence).toBe("estimated");
  });
});

describe("getActiveRiskWindow - counselling limbo", () => {
  it("activates once the result-day tail has passed", () => {
    const window = getActiveRiskWindow("NEET", "2026-07-18");
    expect(window?.kind).toBe("counselling_limbo");
    expect(window?.severity).toBe("high");
    expect(window?.startDate).toBe("2026-07-17");
    expect(window?.endDate).toBe("2026-07-31");
  });

  it("names the result behind it and the step ahead of it", () => {
    const window = getActiveRiskWindow("NEET", "2026-07-25");
    expect(window?.reason).toContain("NEET UG 2026 result");
    expect(window?.reason).toContain("MCC counselling Round 1 registration");
  });

  it("downgrades confidence to estimated when the next step is a projection", () => {
    // The result is verified, the MCC date is not. The window must report the
    // weaker of the two.
    expect(getActiveRiskWindow("NEET", "2026-07-25")?.confidence).toBe(
      "estimated"
    );
  });

  it("ends the day before the next step", () => {
    expect(getActiveRiskWindow("NEET", "2026-07-31")?.kind).toBe(
      "counselling_limbo"
    );
  });

  it("covers the JoSAA-to-CSAB gap", () => {
    const window = getActiveRiskWindow("JEE", "2026-07-25");
    expect(window?.kind).toBe("counselling_limbo");
    expect(window?.reason).toContain("CSAB");
  });

  it("does not fire when the next step is more than the cap away", () => {
    // JEE Main Session 1 result to JoSAA registration is over 100 days.
    expect(MAX_COUNSELLING_LIMBO_DAYS).toBe(60);
    expect(getActiveRiskWindow("JEE", "2026-03-15")).toBeNull();
  });

  it("does not fire once the last round is over", () => {
    expect(getActiveRiskWindow("NEET", "2026-12-15")).toBeNull();
  });
});

describe("getActiveRiskWindow - decision season", () => {
  it("covers August and September", () => {
    expect(DECISION_SEASON_MONTHS).toEqual([8, 9]);
  });

  it("is not active on 31 July", () => {
    expect(getActiveRiskWindow("CAT", "2026-07-31")).toBeNull();
  });

  it("opens on 1 August", () => {
    const window = getActiveRiskWindow("CAT", "2026-08-01");
    expect(window?.kind).toBe("decision_season");
    expect(window?.startDate).toBe("2026-08-01");
    expect(window?.endDate).toBe("2026-09-30");
  });

  it("is active in the middle of the season", () => {
    expect(getActiveRiskWindow("CAT", "2026-08-20")?.kind).toBe(
      "decision_season"
    );
    expect(getActiveRiskWindow("GATE", "2026-09-14")?.kind).toBe(
      "decision_season"
    );
  });

  it("stays open on 30 September", () => {
    expect(getActiveRiskWindow("CAT", "2026-09-30")?.kind).toBe(
      "decision_season"
    );
  });

  it("closes on 1 October", () => {
    expect(getActiveRiskWindow("CAT", "2026-10-01")).toBeNull();
  });

  it("carries no anchoring event and is only elevated, not high", () => {
    const window = getActiveRiskWindow("CAT", "2026-08-20");
    expect(window?.event).toBeNull();
    expect(window?.severity).toBe("elevated");
  });

  it("uses the year of the day being checked", () => {
    expect(getActiveRiskWindow("CAT", "2027-08-20")?.startDate).toBe(
      "2027-08-01"
    );
  });

  it("loses to a dated window for the same day", () => {
    // 15 August is inside decision season, but it is also an allotment day.
    expect(getActiveRiskWindow("NEET", MCC_ROUND_1_ALLOTMENT)?.kind).toBe(
      "result_day"
    );
  });
});

describe("getActiveRiskWindow - contexts with no schedule", () => {
  it.each(CONTEXTS_WITHOUT_DATA)(
    "returns null for %s outside decision season",
    (context) => {
      expect(getActiveRiskWindow(context, "2026-07-25")).toBeNull();
      expect(getActiveRiskWindow(context, "2026-01-05")).toBeNull();
    }
  );

  it.each(CONTEXTS_WITHOUT_DATA)(
    "still returns decision season for %s in August",
    (context) => {
      expect(getActiveRiskWindow(context, "2026-08-20")?.kind).toBe(
        "decision_season"
      );
    }
  );
});

describe("getActiveRiskWindow - invalid input", () => {
  it("returns null rather than throwing on a malformed date", () => {
    expect(getActiveRiskWindow("NEET", "16-07-2026")).toBeNull();
    expect(getActiveRiskWindow("NEET", "2026-13-45")).toBeNull();
    expect(getActiveRiskWindow("NEET", "2026-02-30")).toBeNull();
    expect(getActiveRiskWindow("NEET", "")).toBeNull();
  });
});

describe("isHighRiskDay", () => {
  it("is true on a result day", () => {
    expect(isHighRiskDay("NEET", NEET_RESULT)).toBe(true);
  });

  it("is true the day after a result", () => {
    expect(isHighRiskDay("NEET", "2026-07-17")).toBe(true);
  });

  it("is true inside the 72-hour pre-result window", () => {
    expect(isHighRiskDay("NEET", "2026-07-13")).toBe(true);
    expect(isHighRiskDay("NEET", "2026-07-15")).toBe(true);
  });

  it("is false four days out", () => {
    expect(isHighRiskDay("NEET", "2026-07-12")).toBe(false);
  });

  it("is true in counselling limbo", () => {
    expect(isHighRiskDay("NEET", "2026-07-25")).toBe(true);
    expect(isHighRiskDay("JEE", "2026-07-25")).toBe(true);
  });

  it("is false for decision season alone", () => {
    // Two months is too broad to treat every day as acute. Callers that want
    // the softer signal read getActiveRiskWindow instead.
    expect(getActiveRiskWindow("CAT", "2026-08-20")?.kind).toBe(
      "decision_season"
    );
    expect(isHighRiskDay("CAT", "2026-08-20")).toBe(false);
  });

  it("is false on an ordinary day", () => {
    expect(isHighRiskDay("NEET", "2026-12-15")).toBe(false);
    expect(isHighRiskDay("JEE", "2026-03-15")).toBe(false);
  });

  it("is false for every context on a malformed date", () => {
    for (const context of ALL_CONTEXTS) {
      expect(isHighRiskDay(context, "not-a-date")).toBe(false);
    }
  });
});
