export type ExamContext =
  | "JEE"
  | "NEET"
  | "CUET"
  | "CAT"
  | "GATE"
  | "UPSC"
  | "Board"
  | "Other";

export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type EmotionTag =
  | "anxious"
  | "overwhelmed"
  | "hopeful"
  | "focused"
  | "burnt_out"
  | "motivated"
  | "lonely"
  | "calm"
  | "frustrated"
  | "confident"
  | "exhausted"
  | "numb";

export type JournalEntry = {
  text: string;
  moodLevel: MoodLevel;
  emotions: EmotionTag[];
  examContext: ExamContext;
  studyHoursToday: number;
  timestamp: string;
};

export type CopingStrategy = {
  title: string;
  description: string;
  durationMinutes: number;
  examRelevance: string;
};

export type MindfulnessExercise = {
  name: string;
  steps: string[];
  durationMinutes: number;
  type:
    | "breathing"
    | "grounding"
    | "visualization"
    | "body_scan"
    | "journaling_prompt";
};

export type WellnessAnalysis = {
  stressTriggers: string[];
  emotionalPatterns: string;
  copingStrategy: CopingStrategy;
  mindfulnessExercise: MindfulnessExercise;
  motivationalMessage: string;
  crisisFlag: false;
  disclaimer: string;
};

export type CrisisResponse = {
  crisisFlag: true;
  message: string;
  helplines: Helpline[];
};

export type Helpline = {
  name: string;
  number: string;
  hours: string;
};

export type ApiResponse = WellnessAnalysis | CrisisResponse;

export type JournalEntryRequest = {
  text: string;
  moodLevel: number;
  emotions: EmotionTag[];
  examContext: ExamContext;
  studyHoursToday: number;
};

export type MoodHistoryEntry = {
  date: string;
  moodLevel: MoodLevel;
  emotions: EmotionTag[];
  studyHours: number;
};

export type MoodTrend = {
  average: number;
  direction: "improving" | "declining" | "stable";
  streak: number;
  topEmotions: EmotionTag[];
  studyMoodCorrelation: "positive" | "negative" | "none";
};
