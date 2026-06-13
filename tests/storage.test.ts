import { describe, it, expect, beforeEach } from "vitest";
import {
  readMoodHistory,
  writeMoodEntry,
  todayString,
} from "../lib/storage";
import type { MoodHistoryEntry } from "../types";

const KEY = "moodHistory:v1";

function entry(date: string, mood = 5): MoodHistoryEntry {
  return {
    date,
    moodLevel: mood as MoodHistoryEntry["moodLevel"],
    emotions: ["anxious"],
    studyHours: 8,
  };
}

describe("readMoodHistory", () => {
  beforeEach(() => localStorage.clear());

  it("returns empty array when nothing stored", () => {
    expect(readMoodHistory()).toEqual([]);
  });

  it("returns parsed entries when valid data stored", () => {
    localStorage.setItem(KEY, JSON.stringify([entry("2026-06-10")]));
    const result = readMoodHistory();
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe("2026-06-10");
  });

  it("clears and returns empty on corrupt JSON", () => {
    localStorage.setItem(KEY, "{not valid json");
    expect(readMoodHistory()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("clears and returns empty on schema-invalid data", () => {
    localStorage.setItem(KEY, JSON.stringify([{ date: "bad", moodLevel: 99 }]));
    expect(readMoodHistory()).toEqual([]);
    expect(localStorage.getItem(KEY)).toBeNull();
  });

  it("rejects entries with out-of-range mood level", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([{ date: "2026-06-10", moodLevel: 15, emotions: [], studyHours: 8 }])
    );
    expect(readMoodHistory()).toEqual([]);
  });
});

describe("writeMoodEntry", () => {
  beforeEach(() => localStorage.clear());

  it("persists a new entry", () => {
    writeMoodEntry(entry("2026-06-10"));
    expect(readMoodHistory()).toHaveLength(1);
  });

  it("overwrites an entry for the same date (no duplicates)", () => {
    writeMoodEntry(entry("2026-06-10", 5));
    writeMoodEntry(entry("2026-06-10", 9));
    const result = readMoodHistory();
    expect(result).toHaveLength(1);
    expect(result[0].moodLevel).toBe(9);
  });

  it("keeps entries sorted by date ascending", () => {
    writeMoodEntry(entry("2026-06-12"));
    writeMoodEntry(entry("2026-06-10"));
    writeMoodEntry(entry("2026-06-11"));
    const dates = readMoodHistory().map((e) => e.date);
    expect(dates).toEqual(["2026-06-10", "2026-06-11", "2026-06-12"]);
  });

  it("prunes entries older than 90 days", () => {
    const old = new Date();
    old.setDate(old.getDate() - 120);
    const oldStr = old.toISOString().slice(0, 10);
    localStorage.setItem(KEY, JSON.stringify([entry(oldStr)]));

    writeMoodEntry(entry(todayString()));
    const dates = readMoodHistory().map((e) => e.date);
    expect(dates).not.toContain(oldStr);
    expect(dates).toContain(todayString());
  });

  it("never stores raw journal text", () => {
    writeMoodEntry(entry("2026-06-10"));
    const raw = localStorage.getItem(KEY) ?? "";
    expect(raw).not.toMatch(/text|journal/i);
  });
});

describe("todayString", () => {
  it("returns an ISO YYYY-MM-DD date", () => {
    expect(todayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
