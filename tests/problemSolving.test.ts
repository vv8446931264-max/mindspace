import { describe, it, expect } from "vitest";
import {
  STEPS,
  currentStepIndex,
  isStepAnswered,
  isComplete,
  progress,
} from "../lib/problemSolving";
import type { Answers } from "../lib/problemSolving";

const full: Answers = Object.fromEntries(
  STEPS.map((s) => [s.id, "x".repeat(s.minLength)])
);

describe("problemSolving", () => {
  it("has a linear, non-branching step list", () => {
    expect(STEPS.length).toBeGreaterThan(0);
    expect(new Set(STEPS.map((s) => s.id)).size).toBe(STEPS.length);
  });

  it("treats whitespace-only answers as unanswered", () => {
    expect(isStepAnswered({ define: "        " }, "define")).toBe(false);
  });

  it("requires the step minimum length", () => {
    const s = STEPS[0];
    expect(isStepAnswered({ [s.id]: "x".repeat(s.minLength - 1) }, s.id)).toBe(false);
    expect(isStepAnswered({ [s.id]: "x".repeat(s.minLength) }, s.id)).toBe(true);
  });

  it("points at the first unanswered step", () => {
    expect(currentStepIndex({})).toBe(0);
    const firstDone = { [STEPS[0].id]: "x".repeat(STEPS[0].minLength) };
    expect(currentStepIndex(firstDone)).toBe(1);
  });

  it("clamps to the last step when everything is answered", () => {
    expect(currentStepIndex(full)).toBe(STEPS.length - 1);
  });

  it("is complete only when every step is answered", () => {
    expect(isComplete({})).toBe(false);
    expect(isComplete(full)).toBe(true);
  });

  it("reports progress that never exceeds the total", () => {
    const p = progress(full);
    expect(p.done).toBe(p.total);
    expect(progress({}).done).toBe(0);
  });

  it("uses no motivational filler in prompts", () => {
    const banned = /you've got this|you can do it|believe in yourself|stay positive|don't worry/i;
    for (const s of STEPS) {
      expect(banned.test(s.question), s.question).toBe(false);
      expect(banned.test(s.hint), s.hint).toBe(false);
    }
  });
});
