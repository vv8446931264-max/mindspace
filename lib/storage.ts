import { MoodHistorySchema } from "@/schemas/wellnessAnalysis";
import type { MoodHistoryEntry, MoodLevel, EmotionTag } from "@/types";

const STORAGE_KEY = "moodHistory:v1";
const MAX_ENTRIES = 90;
const RETENTION_DAYS = 90;

export function readMoodHistory(): MoodHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = MoodHistorySchema.safeParse(parsed);
    if (!result.success) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return result.data.map((e) => ({
      date: e.date,
      moodLevel: e.moodLevel as MoodLevel,
      emotions: e.emotions as EmotionTag[],
      studyHours: e.studyHours,
    }));
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function writeMoodEntry(entry: MoodHistoryEntry): void {
  if (typeof window === "undefined") return;
  const history = readMoodHistory();

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const filtered = history.filter(
    (e) => e.date >= cutoffStr && e.date !== entry.date
  );

  filtered.push(entry);
  filtered.sort((a, b) => a.date.localeCompare(b.date));

  const trimmed = filtered.slice(-MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}
