import { describe, it, expect } from "vitest";
import {
  computeMoodTrend,
  computeStreak,
  computeTopEmotions,
  getChartData,
} from "../lib/moodEngine";
import type { MoodHistoryEntry } from "../types";

function makeEntry(daysAgo: number, mood: number, emotions: string[] = [], studyHours = 8): MoodHistoryEntry {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return {
    date: d.toISOString().slice(0, 10),
    moodLevel: mood as MoodHistoryEntry["moodLevel"],
    emotions: emotions as MoodHistoryEntry["emotions"],
    studyHours,
  };
}

describe("computeStreak", () => {
  it("returns 0 for empty history", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("returns 1 for only today", () => {
    expect(computeStreak([makeEntry(0, 5)])).toBe(1);
  });

  it("returns 3 for 3 consecutive days ending today", () => {
    const history = [makeEntry(0, 5), makeEntry(1, 6), makeEntry(2, 7)];
    expect(computeStreak(history)).toBe(3);
  });

  it("breaks streak on gap", () => {
    const history = [makeEntry(0, 5), makeEntry(2, 6)];
    expect(computeStreak(history)).toBe(1);
  });

  it("returns 0 if no entry today and yesterday missing", () => {
    const history = [makeEntry(2, 5), makeEntry(3, 6)];
    expect(computeStreak(history)).toBe(0);
  });
});

describe("computeTopEmotions", () => {
  it("returns empty for no entries", () => {
    expect(computeTopEmotions([])).toEqual([]);
  });

  it("returns most frequent emotion first", () => {
    const entries = [
      makeEntry(0, 5, ["anxious"]),
      makeEntry(1, 5, ["anxious"]),
      makeEntry(2, 5, ["calm"]),
    ];
    const top = computeTopEmotions(entries);
    expect(top[0]).toBe("anxious");
  });

  it("returns at most 3 emotions", () => {
    const entries = [
      makeEntry(0, 5, ["anxious", "overwhelmed", "frustrated"]),
      makeEntry(1, 5, ["hopeful", "motivated", "confident"]),
    ];
    expect(computeTopEmotions(entries).length).toBeLessThanOrEqual(3);
  });
});

describe("computeMoodTrend", () => {
  it("returns stable for empty history", () => {
    const trend = computeMoodTrend([]);
    expect(trend.direction).toBe("stable");
    expect(trend.average).toBe(5);
    expect(trend.streak).toBe(0);
  });

  it("detects improving trend", () => {
    const history = [
      makeEntry(6, 3),
      makeEntry(5, 3),
      makeEntry(4, 3),
      makeEntry(3, 8),
      makeEntry(2, 9),
      makeEntry(1, 9),
      makeEntry(0, 9),
    ];
    const trend = computeMoodTrend(history);
    expect(trend.direction).toBe("improving");
  });

  it("detects declining trend", () => {
    const history = [
      makeEntry(6, 9),
      makeEntry(5, 9),
      makeEntry(4, 9),
      makeEntry(3, 3),
      makeEntry(2, 2),
      makeEntry(1, 2),
      makeEntry(0, 2),
    ];
    const trend = computeMoodTrend(history);
    expect(trend.direction).toBe("declining");
  });

  it("computes average correctly", () => {
    const history = [makeEntry(0, 6), makeEntry(1, 8), makeEntry(2, 4)];
    const trend = computeMoodTrend(history);
    expect(trend.average).toBe(6);
  });
});

describe("getChartData", () => {
  it("always returns exactly 7 entries", () => {
    expect(getChartData([]).length).toBe(7);
    expect(getChartData([makeEntry(0, 5)]).length).toBe(7);
  });

  it("fills today with mood when present", () => {
    const data = getChartData([makeEntry(0, 7)]);
    const today = data[data.length - 1];
    expect(today.mood).toBe(7);
  });

  it("fills missing days with mood 0", () => {
    const data = getChartData([]);
    expect(data.every((d) => d.mood === 0)).toBe(true);
  });

  it("each entry has date, label, mood", () => {
    const data = getChartData([]);
    for (const d of data) {
      expect(typeof d.date).toBe("string");
      expect(typeof d.label).toBe("string");
      expect(typeof d.mood).toBe("number");
    }
  });
});
