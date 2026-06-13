import { describe, it, expect, vi, afterEach } from "vitest";
import {
  cacheGet,
  cacheSet,
  cacheKey,
  getInFlight,
  setInFlight,
} from "../lib/cache";
import type { WellnessAnalysis } from "../types";

function sampleAnalysis(tag = "x"): WellnessAnalysis {
  return {
    stressTriggers: [tag],
    emotionalPatterns: "pattern",
    copingStrategy: {
      title: "t",
      description: "d",
      durationMinutes: 5,
      examRelevance: "r",
    },
    mindfulnessExercise: {
      name: "n",
      steps: ["a", "b", "c"],
      durationMinutes: 5,
      type: "breathing",
    },
    motivationalMessage: "m",
    crisisFlag: false,
    disclaimer: "disc",
  };
}

// Unique keys per test avoid cross-contamination of the module-level store.
let counter = 0;
const freshKey = () => `key-${counter++}`;

afterEach(() => vi.useRealTimers());

describe("cacheKey", () => {
  it("is identical for same text + exam regardless of case/whitespace", () => {
    expect(cacheKey("  Hello World ", "JEE")).toBe(cacheKey("hello world", "JEE"));
  });

  it("differs across exam contexts", () => {
    expect(cacheKey("hello", "JEE")).not.toBe(cacheKey("hello", "NEET"));
  });

  it("truncates very long text to 200 chars", () => {
    const long = "a".repeat(500);
    expect(cacheKey(long, "CAT")).toBe(`CAT:${"a".repeat(200)}`);
  });
});

describe("cacheGet / cacheSet", () => {
  it("returns null for a missing key", () => {
    expect(cacheGet(freshKey())).toBeNull();
  });

  it("returns the stored value on hit", () => {
    const k = freshKey();
    const v = sampleAnalysis("hit");
    cacheSet(k, v);
    expect(cacheGet(k)?.stressTriggers[0]).toBe("hit");
  });

  it("expires entries after the 30-minute TTL", () => {
    vi.useFakeTimers();
    const k = freshKey();
    cacheSet(k, sampleAnalysis());
    vi.advanceTimersByTime(31 * 60 * 1000);
    expect(cacheGet(k)).toBeNull();
  });

  it("keeps entries alive just before TTL", () => {
    vi.useFakeTimers();
    const k = freshKey();
    cacheSet(k, sampleAnalysis());
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(cacheGet(k)).not.toBeNull();
  });
});

describe("in-flight coalescing", () => {
  it("stores and returns an in-flight promise", async () => {
    const k = freshKey();
    const p = Promise.resolve(sampleAnalysis("flight"));
    setInFlight(k, p);
    const tracked = getInFlight(k);
    expect(tracked).not.toBeNull();
    const result = await tracked!;
    expect(result.stressTriggers[0]).toBe("flight");
  });

  it("clears the in-flight entry after the promise settles", async () => {
    const k = freshKey();
    const p = Promise.resolve(sampleAnalysis());
    setInFlight(k, p);
    await p;
    // microtask flush so the .finally handler runs
    await Promise.resolve();
    expect(getInFlight(k)).toBeNull();
  });
});
