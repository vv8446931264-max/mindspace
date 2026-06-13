import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { axe } from "jest-axe";

// Lets a component's mount effects/timers settle inside act() before asserting.
const flush = () =>
  act(async () => {
    await new Promise((r) => setTimeout(r, 50));
  });
import CrisisCard from "../components/CrisisCard";
import AnalysisCard from "../components/AnalysisCard";
import MoodChart from "../components/MoodChart";
import { CRISIS_HELPLINES, CRISIS_MESSAGE } from "../lib/crisisScanner";
import type { MoodHistoryEntry, WellnessAnalysis } from "../types";

const analysis: WellnessAnalysis = {
  stressTriggers: ["Exam pressure", "Long study hours"],
  emotionalPatterns: "You are feeling the weight of expectations.",
  copingStrategy: {
    title: "Grounding Pause",
    description: "Take a five-minute break and breathe.",
    durationMinutes: 5,
    examRelevance: "Short breaks improve retention.",
  },
  mindfulnessExercise: {
    name: "4-7-8 Breathing",
    steps: ["Breathe in for 4", "Hold for 7", "Exhale for 8"],
    durationMinutes: 5,
    type: "breathing",
  },
  motivationalMessage: "You showed up today — that matters.",
  crisisFlag: false,
  disclaimer:
    "This is an AI wellness companion, not a substitute for professional mental health care.",
};

const history: MoodHistoryEntry[] = [
  { date: "2026-06-10", moodLevel: 6, emotions: ["calm"], studyHours: 6 },
  { date: "2026-06-11", moodLevel: 4, emotions: ["anxious"], studyHours: 9 },
];

describe("accessibility (jest-axe)", () => {
  it("CrisisCard has no violations", async () => {
    const { container } = render(
      <CrisisCard message={CRISIS_MESSAGE} helplines={[...CRISIS_HELPLINES]} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("AnalysisCard has no violations", async () => {
    const { container } = render(<AnalysisCard analysis={analysis} />);
    await flush();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("MoodChart (with data) has no violations", async () => {
    const { container } = render(<MoodChart history={history} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("MoodChart (empty state) has no violations", async () => {
    const { container } = render(<MoodChart history={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
