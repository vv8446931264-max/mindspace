import { describe, it, expect } from "vitest";
import {
  EMOTION_CONFLICTS,
  getDisabledEmotions,
  getConflictReason,
} from "../lib/emotionRules";
import type { EmotionTag } from "../types";

describe("getDisabledEmotions", () => {
  it("calm blocks anxious, overwhelmed, frustrated", () => {
    const d = getDisabledEmotions(["calm"]);
    expect(d).toEqual(expect.arrayContaining(["anxious", "overwhelmed", "frustrated"]));
  });

  it("allows anxious + focused together (the cleaner map)", () => {
    expect(getDisabledEmotions(["anxious"])).not.toContain("focused");
    expect(getDisabledEmotions(["focused"])).not.toContain("anxious");
  });

  it("exhausted and lonely block nothing", () => {
    expect(getDisabledEmotions(["exhausted"])).toEqual([]);
    expect(getDisabledEmotions(["lonely"])).toEqual([]);
  });

  it("accumulates and de-dupes across multiple selections", () => {
    const d = getDisabledEmotions(["overwhelmed", "numb"]);
    // overwhelmed → calm, focused, confident ; numb → focused, motivated, hopeful
    expect(d).toEqual(expect.arrayContaining(["calm", "focused", "confident", "motivated", "hopeful"]));
    expect(new Set(d).size).toBe(d.length);
  });

  it("empty selection disables nothing", () => {
    expect(getDisabledEmotions([])).toEqual([]);
  });
});

describe("EMOTION_CONFLICTS", () => {
  it("is symmetric", () => {
    for (const [tag, list] of Object.entries(EMOTION_CONFLICTS)) {
      for (const other of list) {
        expect(EMOTION_CONFLICTS[other as EmotionTag]).toContain(tag as EmotionTag);
      }
    }
  });
});

describe("getConflictReason", () => {
  it("returns a human sentence naming both feelings", () => {
    const r = getConflictReason("calm", "anxious");
    expect(r).toContain("calm");
    expect(r).toContain("anxious");
  });
});
