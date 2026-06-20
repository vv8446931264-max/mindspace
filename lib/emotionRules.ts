import type { EmotionTag } from "@/types";

// Feelings that can't honestly co-exist in the same moment. Symmetric:
// if A blocks B, B blocks A (enforced by a test).
export const EMOTION_CONFLICTS: Record<EmotionTag, EmotionTag[]> = {
  calm: ["anxious", "overwhelmed", "frustrated"],
  anxious: ["calm", "confident"],
  overwhelmed: ["calm", "focused", "confident"],
  focused: ["overwhelmed", "numb"],
  numb: ["focused", "motivated", "hopeful"],
  motivated: ["burnt_out", "numb"],
  burnt_out: ["motivated"],
  confident: ["anxious", "overwhelmed"],
  hopeful: ["numb"],
  frustrated: ["calm"],
  exhausted: [],
  lonely: [],
};

/** Every emotion that conflicts with anything currently selected. */
export function getDisabledEmotions(selected: EmotionTag[]): EmotionTag[] {
  const disabled = new Set<EmotionTag>();
  for (const tag of selected) {
    for (const c of EMOTION_CONFLICTS[tag] ?? []) disabled.add(c);
  }
  return [...disabled];
}

export function getConflictReason(a: EmotionTag, b: EmotionTag): string {
  const label: Record<EmotionTag, string> = {
    anxious: "anxious", overwhelmed: "overwhelmed", hopeful: "hopeful",
    focused: "focused", burnt_out: "burnt out", motivated: "motivated",
    lonely: "lonely", calm: "calm", frustrated: "frustrated",
    confident: "confident", exhausted: "exhausted", numb: "numb",
  };
  return `Hard to feel ${label[a]} and ${label[b]} at the same time.`;
}
