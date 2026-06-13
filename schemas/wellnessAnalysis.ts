import { z } from "zod";

const CopingStrategySchema = z.object({
  title: z.string().max(50),
  description: z.string().max(200),
  durationMinutes: z.number().int().min(1).max(30),
  examRelevance: z.string().max(100),
});

const MindfulnessExerciseSchema = z.object({
  name: z.string().max(50),
  steps: z.array(z.string().max(100)).min(3).max(5),
  durationMinutes: z.number().int().min(2).max(15),
  type: z.enum([
    "breathing",
    "grounding",
    "visualization",
    "body_scan",
    "journaling_prompt",
  ]),
});

export const WellnessAnalysisSchema = z.object({
  stressTriggers: z.array(z.string().max(80)).min(1).max(3),
  emotionalPatterns: z.string().max(300),
  copingStrategy: CopingStrategySchema,
  mindfulnessExercise: MindfulnessExerciseSchema,
  motivationalMessage: z.string().max(150),
  crisisFlag: z.literal(false),
  disclaimer: z.string().optional(),
});

export const MoodHistoryEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moodLevel: z.number().int().min(1).max(10),
  emotions: z.array(z.string()),
  studyHours: z.number().min(0).max(18),
});

export const MoodHistorySchema = z.array(MoodHistoryEntrySchema);

export type WellnessAnalysisOutput = z.infer<typeof WellnessAnalysisSchema>;
