import { describe, it, expect } from "vitest";
import { checkWellnessFlags } from "../lib/wellnessFlags";

const has = (flags: ReturnType<typeof checkWellnessFlags>, t: string) =>
  flags.some((f) => f.type === t);

describe("checkWellnessFlags", () => {
  it("flags high mood + all-negative feelings", () => {
    expect(has(checkWellnessFlags(8, ["anxious", "overwhelmed"], 5), "mood_emotion_mismatch")).toBe(true);
  });

  it("flags low mood + all-positive feelings", () => {
    expect(has(checkWellnessFlags(2, ["calm", "hopeful"], 5), "mood_emotion_mismatch")).toBe(true);
  });

  it("does not flag mixed feelings", () => {
    expect(has(checkWellnessFlags(8, ["anxious", "calm"], 5), "mood_emotion_mismatch")).toBe(false);
  });

  it("does not flag when no feelings picked", () => {
    expect(has(checkWellnessFlags(9, [], 5), "mood_emotion_mismatch")).toBe(false);
  });

  it("flags overwork at exactly 14h", () => {
    expect(has(checkWellnessFlags(5, ["focused"], 14), "overwork")).toBe(true);
  });

  it("does not flag overwork below 14h", () => {
    expect(has(checkWellnessFlags(5, ["focused"], 13.5), "overwork")).toBe(false);
  });

  it("can return both flags at once", () => {
    const f = checkWellnessFlags(8, ["anxious", "burnt_out"], 15);
    expect(f.length).toBe(2);
  });
});
