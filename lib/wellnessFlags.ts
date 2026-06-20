import type { EmotionTag } from "@/types";

export type WellnessFlag = {
  type: "mood_emotion_mismatch" | "overwork";
  message: string;
  severity: "info" | "caution";
};

const NEGATIVE: EmotionTag[] = [
  "anxious", "overwhelmed", "burnt_out", "frustrated", "numb", "lonely", "exhausted",
];
const POSITIVE: EmotionTag[] = ["calm", "focused", "confident", "hopeful", "motivated"];

/** Soft, non-blocking nudges. Deterministic — never the LLM. */
export function checkWellnessFlags(
  moodLevel: number,
  emotions: EmotionTag[],
  studyHours: number
): WellnessFlag[] {
  const flags: WellnessFlag[] = [];
  const has = emotions.length > 0;

  if (moodLevel >= 7 && has && emotions.every((e) => NEGATIVE.includes(e))) {
    flags.push({
      type: "mood_emotion_mismatch",
      message: "Your mood is high but your feelings read heavy — just checking that's right?",
      severity: "info",
    });
  }
  if (moodLevel <= 3 && has && emotions.every((e) => POSITIVE.includes(e))) {
    flags.push({
      type: "mood_emotion_mismatch",
      message: "Your mood is low but your feelings sound upbeat — just making sure?",
      severity: "info",
    });
  }
  if (studyHours >= 14) {
    flags.push({
      type: "overwork",
      message: "That's a long study day. Rest is part of preparation too.",
      severity: "caution",
    });
  }
  return flags;
}
