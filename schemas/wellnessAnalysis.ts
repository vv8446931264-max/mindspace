import { z } from "zod";

// Truncate helper — LLM output can slightly exceed limits; trim rather than reject
const trimmed = (max: number) => z.string().transform((s) => s.slice(0, max));

const CopingStrategySchema = z.object({
  title: trimmed(50),
  description: trimmed(200),
  durationMinutes: z.number().min(1).max(30).transform(Math.round),
  examRelevance: trimmed(100),
});

const MindfulnessExerciseSchema = z.object({
  name: trimmed(50),
  steps: z.array(trimmed(120)).min(3).max(7).transform((s) => s.slice(0, 5)),
  durationMinutes: z.number().min(1).max(20).transform(Math.round),
  type: z
    .string()
    .transform((v) =>
      ["breathing", "grounding", "visualization", "body_scan", "journaling_prompt"].includes(v)
        ? v
        : "breathing"
    ) as z.ZodType<"breathing" | "grounding" | "visualization" | "body_scan" | "journaling_prompt">,
});

export const WellnessAnalysisSchema = z
  .object({
    stressTriggers: z.array(trimmed(120)).min(1).transform((a) => a.slice(0, 3)),
    emotionalPatterns: trimmed(400),
    copingStrategy: CopingStrategySchema,
    mindfulnessExercise: MindfulnessExerciseSchema,
    motivationalMessage: trimmed(200),
    // AI may omit crisisFlag or set it wrong — server always forces false
    crisisFlag: z.any().optional(),
    disclaimer: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    crisisFlag: false as const,
  }));

export const MoodHistoryEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moodLevel: z.number().int().min(1).max(10),
  emotions: z.array(z.string()),
  studyHours: z.number().min(0).max(18),
});

export const MoodHistorySchema = z.array(MoodHistoryEntrySchema);

export type WellnessAnalysisOutput = z.infer<typeof WellnessAnalysisSchema>;
