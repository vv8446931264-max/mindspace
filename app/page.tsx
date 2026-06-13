"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MoodPicker from "@/components/MoodPicker";
import EmotionPicker from "@/components/EmotionPicker";
import AnalysisCard from "@/components/AnalysisCard";
import CrisisCard from "@/components/CrisisCard";
import MoodChart from "@/components/MoodChart";
import { JournalEntryRequestSchema } from "@/schemas/journalEntry";
import { scanForCrisis, CRISIS_HELPLINES, CRISIS_MESSAGE } from "@/lib/crisisScanner";
import { readMoodHistory, writeMoodEntry, todayString } from "@/lib/storage";
import { computeMoodTrend, computeStreak } from "@/lib/moodEngine";
import type {
  ApiResponse,
  EmotionTag,
  ExamContext,
  MoodHistoryEntry,
  MoodLevel,
  WellnessAnalysis,
  CrisisResponse,
} from "@/types";
import { EXAM_CONTEXTS } from "@/schemas/journalEntry";

type AppState =
  | { status: "idle" }
  | { status: "analyzing" }
  | { status: "results"; analysis: WellnessAnalysis }
  | { status: "crisis"; response: CrisisResponse }
  | { status: "error"; message: string };

const MAX_CHARS = 1000;

export default function HomePage() {
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

  useEffect(() => {
    const history = readMoodHistory();
    setMoodHistory(history);
    setStreak(computeStreak(history));
    // Demo mode: ?demo=1 in URL shows crisis card without real scan
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "crisis") {
      setIsDemoMode(true);
    }
  }, []);

  const isAnalyzing = appState.status === "analyzing";

  const doSubmit = useCallback(async () => {
    setFieldErrors({});

    // Demo mode: immediately show crisis card without scan
    if (isDemoMode) {
      setAppState({
        status: "crisis",
        response: { crisisFlag: true, message: CRISIS_MESSAGE, helplines: [...CRISIS_HELPLINES] },
      });
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
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

    const scanResult = scanForCrisis(journalText);
    if (scanResult.crisis) {
      setAppState({
        status: "crisis",
        response: {
          crisisFlag: true,
          message: CRISIS_MESSAGE,
          helplines: [...CRISIS_HELPLINES],
        },
      });
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      return;
    }

    setAppState({ status: "analyzing" });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: journalText,
          moodLevel,
          emotions,
          examContext,
          studyHoursToday: studyHours,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        const errData = data as { error?: string };
        if (res.status === 429) {
          setAppState({ status: "error", message: "Too many requests — please wait a moment before trying again." });
        } else {
          setAppState({ status: "error", message: errData.error ?? "Something went wrong. Please try again." });
        }
        return;
      }

      if (data.crisisFlag === true) {
        setAppState({ status: "crisis", response: data as CrisisResponse });
      } else {
        const analysis = data as WellnessAnalysis;
        setAppState({ status: "results", analysis });
        const entry: MoodHistoryEntry = {
          date: todayString(),
          moodLevel,
          emotions,
          studyHours,
        };
        writeMoodEntry(entry);
        const updated = readMoodHistory();
        setMoodHistory(updated);
        setStreak(computeStreak(updated));
      }

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setAppState({ status: "error", message: "Connection issue — please check your network and try again." });
    }
  }, [journalText, moodLevel, emotions, examContext, studyHours, isDemoMode]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isAnalyzing) return;
      if (submitRef.current) clearTimeout(submitRef.current);
      submitRef.current = setTimeout(() => { void doSubmit(); }, 300);
    },
    [isAnalyzing, doSubmit]
  );

  const trend = computeMoodTrend(moodHistory);

  return (
    <main className="min-h-screen bg-[#F0F4F8]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🧠</span>
            <h1 className="text-lg font-bold text-slate-800">MindSpace</h1>
            <span className="text-xs text-slate-400 hidden sm:block">AI Wellness Companion</span>
          </div>
          <div className="flex items-center gap-4">
            {isDemoMode && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium border border-amber-200">
                DEMO MODE
              </span>
            )}
            {streak > 0 && (
              <div className="flex items-center gap-1 text-sm" title={`${streak}-day logging streak`}>
                <span aria-hidden="true">🔥</span>
                <span className="font-semibold text-orange-500">{streak}</span>
                <span className="text-slate-400 hidden sm:block">day streak</span>
              </div>
            )}
            {moodHistory.length > 0 && (
              <div className="text-sm text-slate-500">
                Avg:{" "}
                <span className="font-semibold" style={{ color: trend.average <= 3 ? "#F87171" : trend.average <= 6 ? "#FBBF24" : "#52C9A0" }}>
                  {trend.average}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section aria-label="Journal entry form">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-5" noValidate>
            <h2 className="text-base font-semibold text-slate-800">How&apos;s your day going?</h2>

            <div className="space-y-1.5">
              <label htmlFor="examContext" className="block text-sm font-medium text-slate-700">I&apos;m preparing for</label>
              <select id="examContext" value={examContext} onChange={(e) => setExamContext(e.target.value as ExamContext)} disabled={isAnalyzing} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-1 disabled:opacity-50">
                {EXAM_CONTEXTS.map((ctx) => <option key={ctx} value={ctx}>{ctx}</option>)}
              </select>
            </div>

            <MoodPicker value={moodLevel} onChange={setMoodLevel} disabled={isAnalyzing} />

            <div>
              <EmotionPicker selected={emotions} onChange={setEmotions} disabled={isAnalyzing} />
              {fieldErrors.emotions && <p className="text-xs text-red-500 mt-1" role="alert">{fieldErrors.emotions[0]}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="studyHours" className="block text-sm font-medium text-slate-700">
                Study hours today: <span className="font-bold text-[#5B8DEF]">{studyHours}h</span>
              </label>
              <input id="studyHours" type="range" min={0} max={18} step={0.5} value={studyHours} disabled={isAnalyzing} onChange={(e) => setStudyHours(Number(e.target.value))} aria-valuemin={0} aria-valuemax={18} aria-valuenow={studyHours} aria-valuetext={`${studyHours} hours`} className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 disabled:opacity-50" />
              <div className="flex justify-between text-xs text-slate-400"><span>0h</span><span>9h</span><span>18h</span></div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="journalText" className="block text-sm font-medium text-slate-700">What&apos;s on your mind?</label>
              <textarea id="journalText" value={journalText} onChange={(e) => setJournalText(e.target.value.slice(0, MAX_CHARS))} disabled={isAnalyzing} placeholder="Write freely — how did today go? What's weighing on you? What went well?" rows={5} aria-describedby="charCount journalHint" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-1 disabled:opacity-50" />
              <div className="flex justify-between items-center">
                <p id="journalHint" className="text-xs text-slate-400">Be specific — more context means better insights</p>
                <span id="charCount" className={`text-xs tabular-nums ${journalText.length > 900 ? "text-amber-500" : "text-slate-400"}`} aria-live="polite" aria-label={`${journalText.length} of ${MAX_CHARS} characters used`}>{journalText.length}/{MAX_CHARS}</span>
              </div>
              {fieldErrors.text && <p className="text-xs text-red-500" role="alert">{fieldErrors.text[0]}</p>}
            </div>

            <button type="submit" disabled={isAnalyzing} className="w-full bg-[#5B8DEF] hover:bg-[#4a7de0] active:bg-[#3a6dd0] text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2" aria-busy={isAnalyzing}>
              {isAnalyzing ? (
                <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><span>Analyzing your day…</span></>
              ) : "Analyze my day →"}
            </button>
          </form>
        </section>

        <section aria-label="Wellness insights" className="space-y-6">
          <div ref={resultsRef} aria-live="polite" aria-busy={isAnalyzing} aria-label="Analysis results">
            {appState.status === "idle" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center space-y-3">
                <span className="text-5xl block" aria-hidden="true">🌱</span>
                <h2 className="font-semibold text-slate-700">Your insights will appear here</h2>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Fill in how you&apos;re feeling and write a journal entry to get personalized wellness support.</p>
              </div>
            )}
            {appState.status === "analyzing" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-8 text-center space-y-3">
                <div className="flex justify-center"><svg className="animate-spin h-8 w-8 text-[#5B8DEF]" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>
                <p className="text-sm text-slate-500">Analyzing your day…</p>
                <p className="text-xs text-slate-400">Identifying patterns and preparing your insights</p>
              </div>
            )}
            {appState.status === "results" && <AnalysisCard analysis={appState.analysis} />}
            {appState.status === "crisis" && <CrisisCard message={appState.response.message} helplines={appState.response.helplines} />}
            {appState.status === "error" && (
              <div role="alert" className="rounded-2xl bg-red-50 border border-red-200 p-5 text-center space-y-2">
                <p className="text-sm font-medium text-red-700">{appState.message}</p>
                <button onClick={() => setAppState({ status: "idle" })} className="text-xs text-red-500 underline hover:text-red-700">Dismiss</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <MoodChart history={moodHistory} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">Mental health support (India)</p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:9152987821" className="text-xs text-slate-500 hover:text-[#5B8DEF] transition-colors" aria-label="Call iCall helpline at 9152987821">📞 iCall: <strong>9152987821</strong></a>
              <a href="tel:18602662345" className="text-xs text-slate-500 hover:text-[#5B8DEF] transition-colors" aria-label="Call Vandrevala Foundation at 1860-2662-345">📞 Vandrevala: <strong>1860-2662-345</strong></a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
