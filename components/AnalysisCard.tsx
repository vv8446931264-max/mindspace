"use client";

import { useEffect, useState } from "react";
import type { WellnessAnalysis } from "@/types";

type Props = {
  analysis: WellnessAnalysis;
};

const EXERCISE_ICONS: Record<string, string> = {
  breathing: "🌬️",
  grounding: "🌿",
  visualization: "🌅",
  body_scan: "🧘",
  journaling_prompt: "✍️",
};

export default function AnalysisCard({ analysis }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger CSS transition
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const baseClass = prefersReducedMotion
    ? "opacity-100"
    : `transition-all duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`;

  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${baseClass}`}
    >
      {/* Stress Triggers */}
      <section className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          🎯 Stress Triggers Identified
        </h3>
        <ul className="space-y-2">
          {analysis.stressTriggers.map((trigger, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#5B8DEF] flex-shrink-0"
                aria-hidden="true"
              />
              <span className="text-slate-700 text-sm">{trigger}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Emotional Patterns */}
      <section className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
          🔍 What I&apos;m Noticing
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed">
          {analysis.emotionalPatterns}
        </p>
      </section>

      {/* Coping Strategy */}
      <section className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          💪 Coping Strategy for You
        </h3>
        <div className="bg-blue-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-800">
              {analysis.copingStrategy.title}
            </p>
            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full border">
              {analysis.copingStrategy.durationMinutes} min
            </span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            {analysis.copingStrategy.description}
          </p>
          <p className="text-xs text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
            💡 {analysis.copingStrategy.examRelevance}
          </p>
        </div>
      </section>

      {/* Mindfulness Exercise */}
      <section className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          {EXERCISE_ICONS[analysis.mindfulnessExercise.type] ?? "🧘"}{" "}
          {analysis.mindfulnessExercise.durationMinutes}-Minute Practice
        </h3>
        <div className="space-y-2">
          <p className="font-semibold text-slate-800">
            {analysis.mindfulnessExercise.name}
          </p>
          <ol className="space-y-1.5">
            {analysis.mindfulnessExercise.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-[#52C9A0] text-white text-xs flex items-center justify-center font-medium"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Motivational Message */}
      <section className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
          ✨ A Message for You
        </h3>
        <p className="text-base font-medium text-[#5B8DEF] leading-relaxed">
          &ldquo;{analysis.motivationalMessage}&rdquo;
        </p>
      </section>

      {/* Disclaimer */}
      <div className="px-5 py-3 bg-slate-50">
        <p className="text-xs text-slate-400 italic text-center">
          {analysis.disclaimer}
        </p>
      </div>
    </div>
  );
}
