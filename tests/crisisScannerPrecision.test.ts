import { describe, it, expect } from "vitest";
import { scanForCrisis } from "../lib/crisisScanner";

/**
 * Precision regression suite.
 *
 * The original single-tier keyword list flagged 11 of these 12 benign lines as a
 * crisis. A crisis card that fires on a chemistry chapter trains students to
 * dismiss it on the night it matters, so precision here is a safety property,
 * not a polish item. Recall cases below must never regress to buy precision.
 */

const BENIGN = [
  "I'm dying to finish this organic chemistry chapter today.",
  "My phone battery is dying and I still have two lectures left.",
  "I'm dying of boredom in this coaching lecture yaar.",
  "Rotational motion is pointless, I don't think it even comes in mains.",
  "I give up on this integration problem, moving to the next one.",
  "I felt hopeless about my rank but then I solved 20 questions.",
  "This mock test made me feel worthless at physics specifically.",
  "Nobody cares about my attendance in dummy school, only coaching marks matter.",
  "I want to end it and just start the revision module fresh.",
  "I'm so done with everything on today's DPP.",
  "Sir said if you give up now the last 2 years die with it.",
  "Slept well, ate properly, finished 40 questions. Good day.",
];

const CRISIS = [
  "I don't want to live anymore, nothing is working.",
  "I keep thinking about how to kill myself after the result.",
  "Everyone would be better off without me here.",
  "I want to die.",
  "I have no reason to live after this rank.",
  "I've been thinking about hurting myself.",
  "I can't take it anymore, every day is the same.",
  "I feel like such a burden to everyone at home.",
  "Papa took a loan for this. I am worthless and I want to disappear.",
];

describe("crisis scanner — precision", () => {
  for (const line of BENIGN) {
    it(`does not flag: "${line.slice(0, 45)}..."`, () => {
      const r = scanForCrisis(line);
      expect(r.crisis, r.crisis ? `matched "${r.matchedKeyword}"` : "").toBe(false);
    });
  }
});

describe("crisis scanner — recall (must never regress)", () => {
  for (const line of CRISIS) {
    it(`flags: "${line.slice(0, 45)}..."`, () => {
      expect(scanForCrisis(line).crisis).toBe(true);
    });
  }
});

describe("crisis scanner — context rules", () => {
  it("flags an idiomatic word when aimed at the writer", () => {
    expect(scanForCrisis("I feel completely hopeless about everything.").crisis).toBe(true);
  });

  it("ignores the same word aimed at coursework", () => {
    expect(scanForCrisis("This chapter is hopeless, I'll revisit it later.").crisis).toBe(false);
  });

  it("judges context per sentence, not per entry", () => {
    // Benign academic sentence must not launder a genuine one elsewhere.
    const mixed = "I give up on this problem. I don't want to live anymore.";
    expect(scanForCrisis(mixed).crisis).toBe(true);
  });

  it("still catches explicit phrases even next to academic words", () => {
    expect(scanForCrisis("After this mock test I want to kill myself.").crisis).toBe(true);
  });
});
