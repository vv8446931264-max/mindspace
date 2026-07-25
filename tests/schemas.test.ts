import { describe, it, expect } from "vitest";
import { JournalEntryRequestSchema } from "../schemas/journalEntry";
import {
  WellnessAnalysisSchema,
  MoodHistorySchema,
} from "../schemas/wellnessAnalysis";

const validRequest = {
  text: "I am feeling stressed about my upcoming exam.",
  moodLevel: 5,
  emotions: ["anxious"],
  examContext: "JEE",
  studyHoursToday: 8,
};

describe("JournalEntryRequestSchema", () => {
  it("accepts a valid request", () => {
    expect(JournalEntryRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejects text under 10 characters", () => {
    const r = JournalEntryRequestSchema.safeParse({ ...validRequest, text: "short" });
    expect(r.success).toBe(false);
  });

  it("rejects text over 1000 characters", () => {
    const r = JournalEntryRequestSchema.safeParse({
      ...validRequest,
      text: "a".repeat(1001),
    });
    expect(r.success).toBe(false);
  });

  it("rejects mood level out of 1-10 range", () => {
    expect(
      JournalEntryRequestSchema.safeParse({ ...validRequest, moodLevel: 0 }).success
    ).toBe(false);
    expect(
      JournalEntryRequestSchema.safeParse({ ...validRequest, moodLevel: 11 }).success
    ).toBe(false);
  });

  it("rejects non-integer mood level", () => {
    expect(
      JournalEntryRequestSchema.safeParse({ ...validRequest, moodLevel: 5.5 }).success
    ).toBe(false);
  });

  // Emotions are optional by design — requiring one forces the student to
  // self-identify as unwell before entering. See docs/ROADMAP-v2.md P1.
  it("accepts an entry with no emotions selected", () => {
    expect(
      JournalEntryRequestSchema.safeParse({ ...validRequest, emotions: [] }).success
    ).toBe(true);
  });

  it("defaults emotions to an empty array when omitted", () => {
    const { emotions: _omitted, ...withoutEmotions } = validRequest;
    const r = JournalEntryRequestSchema.safeParse(withoutEmotions);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.emotions).toEqual([]);
  });

  it("rejects more than 3 emotions", () => {
    const r = JournalEntryRequestSchema.safeParse({
      ...validRequest,
      emotions: ["anxious", "calm", "hopeful", "focused"],
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown emotion tags", () => {
    const r = JournalEntryRequestSchema.safeParse({
      ...validRequest,
      emotions: ["ecstatic"],
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown exam contexts", () => {
    const r = JournalEntryRequestSchema.safeParse({
      ...validRequest,
      examContext: "SAT",
    });
    expect(r.success).toBe(false);
  });

  it("rejects study hours above 18", () => {
    expect(
      JournalEntryRequestSchema.safeParse({ ...validRequest, studyHoursToday: 19 })
        .success
    ).toBe(false);
  });
});

const validAi = {
  stressTriggers: ["Exam pressure"],
  emotionalPatterns: "You are under pressure.",
  copingStrategy: {
    title: "Breathe",
    description: "Take a break.",
    durationMinutes: 5,
    examRelevance: "Helps focus.",
  },
  mindfulnessExercise: {
    name: "Box Breathing",
    steps: ["in", "hold", "out"],
    durationMinutes: 5,
    type: "breathing",
  },
  motivationalMessage: "You can do this.",
  crisisFlag: false,
};

describe("WellnessAnalysisSchema", () => {
  it("accepts well-formed AI output", () => {
    expect(WellnessAnalysisSchema.safeParse(validAi).success).toBe(true);
  });

  it("always forces crisisFlag to false (even if AI sets true)", () => {
    const r = WellnessAnalysisSchema.parse({ ...validAi, crisisFlag: true });
    expect(r.crisisFlag).toBe(false);
  });

  it("succeeds when crisisFlag is omitted entirely", () => {
    const { crisisFlag, ...withoutFlag } = validAi;
    void crisisFlag;
    const r = WellnessAnalysisSchema.parse(withoutFlag);
    expect(r.crisisFlag).toBe(false);
  });

  it("truncates an over-long motivational message instead of rejecting", () => {
    const r = WellnessAnalysisSchema.parse({
      ...validAi,
      motivationalMessage: "x".repeat(500),
    });
    expect(r.motivationalMessage.length).toBeLessThanOrEqual(200);
  });

  it("caps stress triggers to 3 items", () => {
    const r = WellnessAnalysisSchema.parse({
      ...validAi,
      stressTriggers: ["a", "b", "c", "d", "e"],
    });
    expect(r.stressTriggers.length).toBe(3);
  });

  it("caps mindfulness steps to 5", () => {
    const r = WellnessAnalysisSchema.parse({
      ...validAi,
      mindfulnessExercise: {
        ...validAi.mindfulnessExercise,
        steps: ["1", "2", "3", "4", "5", "6", "7"],
      },
    });
    expect(r.mindfulnessExercise.steps.length).toBeLessThanOrEqual(5);
  });

  it("coerces an unknown exercise type to 'breathing'", () => {
    const r = WellnessAnalysisSchema.parse({
      ...validAi,
      mindfulnessExercise: { ...validAi.mindfulnessExercise, type: "dancing" },
    });
    expect(r.mindfulnessExercise.type).toBe("breathing");
  });

  it("rounds non-integer durations", () => {
    const r = WellnessAnalysisSchema.parse({
      ...validAi,
      copingStrategy: { ...validAi.copingStrategy, durationMinutes: 5.7 },
    });
    expect(Number.isInteger(r.copingStrategy.durationMinutes)).toBe(true);
  });

  it("rejects when stress triggers are empty", () => {
    expect(
      WellnessAnalysisSchema.safeParse({ ...validAi, stressTriggers: [] }).success
    ).toBe(false);
  });

  it("rejects when mindfulness has fewer than 3 steps", () => {
    expect(
      WellnessAnalysisSchema.safeParse({
        ...validAi,
        mindfulnessExercise: { ...validAi.mindfulnessExercise, steps: ["one"] },
      }).success
    ).toBe(false);
  });
});

describe("MoodHistorySchema", () => {
  it("accepts a valid history array", () => {
    const r = MoodHistorySchema.safeParse([
      { date: "2026-06-10", moodLevel: 7, emotions: ["calm"], studyHours: 6 },
    ]);
    expect(r.success).toBe(true);
  });

  it("rejects malformed dates", () => {
    const r = MoodHistorySchema.safeParse([
      { date: "10-06-2026", moodLevel: 7, emotions: [], studyHours: 6 },
    ]);
    expect(r.success).toBe(false);
  });
});
