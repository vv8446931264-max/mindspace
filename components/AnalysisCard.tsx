"use client";

import type { CSSProperties } from "react";
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

/** Per-section stagger so the analysis appears to "think through" the entry. */
function delay(index: number): CSSProperties {
  return { animationDelay: `${index * 110}ms` };
}

export default function AnalysisCard({ analysis }: Props) {
  const { mindfulnessExercise: ex } = analysis;

  return (
    <article className="card-enter rounded-3xl bg-white/90 backdrop-blur border border-white shadow-[0_8px_30px_rgba(91,141,239,0.12)] overflow-hidden">
      {/* Stress Triggers */}
      <section className="reveal p-5 border-b border-slate-100" style={delay(0)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span aria-hidden="true">🎯</span> Stress Triggers Identified
        </h3>
        <ul className="space-y-2.5">
          {analysis.stressTriggers.map((trigger, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-lg bg-gradient-to-br from-[#5B8DEF] to-[#7BA4F5] text-white text-[10px] flex items-center justify-center font-bold"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-slate-700 text-sm leading-snug">
                {trigger}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Emotional Patterns */}
      <section className="reveal p-5 border-b border-slate-100" style={delay(1)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span aria-hidden="true">🔍</span> What I&apos;m Noticing
        </h3>
        <p className="text-slate-700 text-sm leading-relaxed">
          {analysis.emotionalPatterns}
        </p>
      </section>

      {/* Coping Strategy */}
      <section className="reveal p-5 border-b border-slate-100" style={delay(2)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span aria-hidden="true">💪</span> Coping Strategy for You
        </h3>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 space-y-2.5 border border-blue-100/60">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-slate-800">
              {analysis.copingStrategy.title}
            </p>
            <span className="text-xs font-medium text-[#5B8DEF] bg-white px-2.5 py-1 rounded-full border border-blue-100 whitespace-nowrap">
              ⏱ {analysis.copingStrategy.durationMinutes} min
            </span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed">
            {analysis.copingStrategy.description}
          </p>
          <p className="text-xs text-blue-800 bg-blue-100/70 px-3 py-2 rounded-xl leading-relaxed">
            💡 {analysis.copingStrategy.examRelevance}
          </p>
        </div>
      </section>

      {/* Mindfulness Exercise */}
      <section className="reveal p-5 border-b border-slate-100" style={delay(3)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span aria-hidden="true">{EXERCISE_ICONS[ex.type] ?? "🧘"}</span>{" "}
          {ex.durationMinutes}-Minute Practice
        </h3>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 space-y-3 border border-emerald-100/60">
          <p className="font-bold text-slate-800">{ex.name}</p>
          <ol className="space-y-2">
            {ex.steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug"
              >
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#52C9A0] to-[#6BD4B0] text-white text-xs flex items-center justify-center font-bold shadow-sm"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Motivational Message */}
      <section className="reveal p-5" style={delay(4)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span aria-hidden="true">✨</span> A Message for You
        </h3>
        <blockquote className="pulse-once relative rounded-2xl bg-gradient-to-br from-[#5B8DEF] to-[#7B6FE8] p-4 text-white shadow-lg shadow-blue-200">
          <span
            className="absolute top-1 left-3 text-3xl text-white/30 leading-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <p className="relative text-[15px] font-medium leading-relaxed pl-4">
            {analysis.motivationalMessage}
          </p>
        </blockquote>
      </section>

      {/* Disclaimer */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100">
        <p className="text-[11px] text-slate-400 italic text-center leading-relaxed">
          {analysis.disclaimer}
        </p>
      </div>
    </article>
  );
}
