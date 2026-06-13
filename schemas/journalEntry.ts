import { z } from "zod";

export const EXAM_CONTEXTS = [
  "JEE",
  "NEET",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Board",
  "Other",
] as const;

export const EMOTION_TAGS = [
  "anxious",
  "overwhelmed",
  "hopeful",
  "focused",
  "burnt_out",
  "motivated",
  "lonely",
  "calm",
  "frustrated",
  "confident",
  "exhausted",
  "numb",
] as const;

export const JournalEntryRequestSchema = z.object({
  text: z
    .string()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Entry too long — max 1000 characters"),
  moodLevel: z
    .number()
    .int()
    .min(1, "Mood must be at least 1")
    .max(10, "Mood must be at most 10"),
  emotions: z
    .array(z.enum(EMOTION_TAGS))
    .min(1, "Select at least one emotion")
    .max(3, "Select at most 3 emotions"),
  examContext: z.enum(EXAM_CONTEXTS),
  studyHoursToday: z
    .number()
    .min(0, "Study hours cannot be negative")
    .max(18, "Study hours cannot exceed 18"),
});

export type JournalEntryRequestInput = z.infer<typeof JournalEntryRequestSchema>;
