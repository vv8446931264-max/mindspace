"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { JournalEntryRequestSchema } from "@/schemas/journalEntry";
import {
  scanForCrisis,
  CRISIS_HELPLINES,
  CRISIS_MESSAGE,
} from "@/lib/crisisScanner";
import { readMoodHistory, writeMoodEntry, todayString } from "@/lib/storage";
import { computeMoodTrend, computeStreak } from "@/lib/moodEngine";
import { requestAnalysis } from "@/lib/analyzeClient";
import type {
  CrisisResponse,
  EmotionTag,
  ExamContext,
  MoodHistoryEntry,
  MoodLevel,
  WellnessAnalysis,
} from "@/types";

/** Maximum characters allowed in a journal entry. */
export const MAX_CHARS = 1000;

/** Submit debounce window — guards against double-submits. */
const SUBMIT_DEBOUNCE_MS = 300;

/** Finite-state machine describing what the results panel renders. */
export type AppState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "results"; analysis: WellnessAnalysis }
  | { status: "crisis"; response: CrisisResponse }
  | { status: "error"; message: string };

const buildCrisisResponse = (): CrisisResponse => ({
  crisisFlag: true,
  message: CRISIS_MESSAGE,
  helplines: [...CRISIS_HELPLINES],
});

/**
 * Owns all journal-form state and the submit pipeline:
 * client validation -> crisis scan -> API call -> localStorage update.
 * Kept separate from the view so the page stays a thin composition layer.
 */
export function useWellness() {
  const [examContext, setExamContext] = useState<ExamContext>("JEE");
  const [moodLevel, setMoodLevel] = useState<MoodLevel>(5);
  const [emotions, setEmotions] = useState<EmotionTag[]>([]);
  const [studyHours, setStudyHours] = useState<number>(8);
  const [journalText, setJournalText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [appState, setAppState] = useState<AppState>({ status: "idle" });
  const [moodHistory, setMoodHistory] = useState<MoodHistoryEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const submitRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Single batched localStorage read on mount + demo-mode detection.
  useEffect(() => {
    const history = readMoodHistory();
    setMoodHistory(history);
    setStreak(computeStreak(history));
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("demo") === "crisis"
    ) {
      setIsDemoMode(true);
    }
  }, []);

  const isAnalyzing = appState.status === "analyzing";

  const scrollToResults = useCallback(() => {
    setTimeout(
      () => resultsRef.current?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  }, []);

  const showCrisis = useCallback(
    (response: CrisisResponse) => {
      setAppState({ status: "crisis", response });
      scrollToResults();
    },
    [scrollToResults]
  );

  const doSubmit = useCallback(async () => {
    setFieldErrors({});

    // Demo mode surfaces the crisis card on demand for safe live pitching.
    if (isDemoMode) {
      showCrisis(buildCrisisResponse());
      return;
    }

    const validation = JournalEntryRequestSchema.safeParse({
      text: journalText,
      moodLevel,
      emotions,
      examContext,
      studyHoursToday: studyHours,
    });
    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    // Deterministic crisis scan BEFORE any AI call (client-side fast path).
    if (scanForCrisis(journalText).crisis) {
      showCrisis(buildCrisisResponse());
      return;
    }

    setAppState({ status: "analyzing" });

    const result = await requestAnalysis({
      text: journalText,
      moodLevel,
      emotions,
      examContext,
      studyHoursToday: studyHours,
    });

    if (!result.ok) {
      setAppState({ status: "error", message: result.message });
      return;
    }

    if (result.data.crisisFlag === true) {
      setAppState({ status: "crisis", response: result.data });
    } else {
      setAppState({ status: "results", analysis: result.data });
      writeMoodEntry({ date: todayString(), moodLevel, emotions, studyHours });
      const updated = readMoodHistory();
      setMoodHistory(updated);
      setStreak(computeStreak(updated));
    }
    scrollToResults();
  }, [
    journalText,
    moodLevel,
    emotions,
    examContext,
    studyHours,
    isDemoMode,
    showCrisis,
    scrollToResults,
  ]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isAnalyzing) return;
      if (submitRef.current) clearTimeout(submitRef.current);
      submitRef.current = setTimeout(() => {
        void doSubmit();
      }, SUBMIT_DEBOUNCE_MS);
    },
    [isAnalyzing, doSubmit]
  );

  const dismissError = useCallback(() => setAppState({ status: "idle" }), []);

  return {
    // form state
    examContext,
    setExamContext,
    moodLevel,
    setMoodLevel,
    emotions,
    setEmotions,
    studyHours,
    setStudyHours,
    journalText,
    setJournalText,
    fieldErrors,
    // derived / app state
    appState,
    isAnalyzing,
    isDemoMode,
    moodHistory,
    streak,
    trend: computeMoodTrend(moodHistory),
    resultsRef,
    // actions
    handleSubmit,
    dismissError,
  };
}
