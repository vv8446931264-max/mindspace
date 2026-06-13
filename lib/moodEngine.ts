import type { EmotionTag, MoodHistoryEntry, MoodTrend } from "@/types";

export function computeMoodTrend(history: MoodHistoryEntry[]): MoodTrend {
  const recent = getRecentDays(history, 7);

  const average =
    recent.length === 0
      ? 5
      : Math.round(
          (recent.reduce((sum, e) => sum + e.moodLevel, 0) / recent.length) *
            10
        ) / 10;

  const direction = computeDirection(recent);
  const streak = computeStreak(history);
  const topEmotions = computeTopEmotions(recent);
  const studyMoodCorrelation = computeCorrelation(recent);

  return { average, direction, streak, topEmotions, studyMoodCorrelation };
}

function getRecentDays(
  history: MoodHistoryEntry[],
  days: number
): MoodHistoryEntry[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  return history.filter((e) => e.date >= cutoffStr);
}

function computeDirection(
  recent: MoodHistoryEntry[]
): "improving" | "declining" | "stable" {
  if (recent.length < 2) return "stable";

  const sorted = [...recent].sort((a, b) => a.date.localeCompare(b.date));
  const half = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, half);
  const secondHalf = sorted.slice(sorted.length - half);

  if (firstHalf.length === 0 || secondHalf.length === 0) return "stable";

  const firstAvg =
    firstHalf.reduce((s, e) => s + e.moodLevel, 0) / firstHalf.length;
  const secondAvg =
    secondHalf.reduce((s, e) => s + e.moodLevel, 0) / secondHalf.length;
  const diff = secondAvg - firstAvg;

  if (diff >= 0.5) return "improving";
  if (diff <= -0.5) return "declining";
  return "stable";
}

export function computeStreak(history: MoodHistoryEntry[]): number {
  if (history.length === 0) return 0;

  const dates = new Set(history.map((e) => e.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    if (dates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function computeTopEmotions(
  entries: MoodHistoryEntry[]
): EmotionTag[] {
  const freq: Partial<Record<EmotionTag, number>> = {};
  for (const entry of entries) {
    for (const emotion of entry.emotions) {
      freq[emotion as EmotionTag] = (freq[emotion as EmotionTag] ?? 0) + 1;
    }
  }
  return (Object.entries(freq) as [EmotionTag, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);
}

function computeCorrelation(
  entries: MoodHistoryEntry[]
): "positive" | "negative" | "none" {
  if (entries.length < 3) return "none";

  const n = entries.length;
  const xs = entries.map((e) => e.studyHours);
  const ys = entries.map((e) => e.moodLevel);
  const meanX = xs.reduce((s, x) => s + x, 0) / n;
  const meanY = ys.reduce((s, y) => s + y, 0) / n;

  const num = xs.reduce((s, x, i) => s + (x - meanX) * (ys[i] - meanY), 0);
  const denX = Math.sqrt(xs.reduce((s, x) => s + (x - meanX) ** 2, 0));
  const denY = Math.sqrt(ys.reduce((s, y) => s + (y - meanY) ** 2, 0));

  if (denX === 0 || denY === 0) return "none";
  const r = num / (denX * denY);

  if (r >= 0.3) return "positive";
  if (r <= -0.3) return "negative";
  return "none";
}

export function getChartData(
  history: MoodHistoryEntry[]
): { date: string; label: string; mood: number }[] {
  const days: { date: string; label: string; mood: number }[] = [];
  const historyMap = new Map(history.map((e) => [e.date, e.moodLevel]));
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = dayLabels[d.getDay()];
    const mood = historyMap.get(dateStr) ?? 0;
    days.push({ date: dateStr, label, mood });
  }

  return days;
}
