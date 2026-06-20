"use client";

import type { CSSProperties, ComponentType } from "react";
import type { WellnessAnalysis } from "@/types";
import {
  TargetIcon,
  SearchIcon,
  CompassIcon,
  SparkleIcon,
  ClockIcon,
  BulbIcon,
  WindIcon,
  LeafIcon,
} from "@/components/icons";

type Props = {
  analysis: WellnessAnalysis;
};

const EXERCISE_ICONS: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  breathing: WindIcon,
  grounding: LeafIcon,
  visualization: SparkleIcon,
  body_scan: CompassIcon,
  journaling_prompt: BulbIcon,
};

/** Per-section stagger so the analysis appears to "think through" the entry. */
function delay(index: number): CSSProperties {
  return { animationDelay: `${index * 110}ms` };
}

export default function AnalysisCard({ analysis }: Props) {
  const { mindfulnessExercise: ex } = analysis;
  const ExerciseIcon = EXERCISE_ICONS[ex.type] ?? CompassIcon;

  return (
    <article className="tilt card-enter glass rounded-3xl overflow-hidden">
      {/* Stress Triggers */}
      <section className="reveal p-5 border-b border-white/10" style={delay(0)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <TargetIcon size={14} className="text-[#5B8DEF]" /> Stress Triggers Identified
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
              <span className="text-slate-200 text-sm leading-snug">
                {trigger}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Emotional Patterns */}
      <section className="reveal p-5 border-b border-white/10" style={delay(1)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <SearchIcon size={14} className="text-[#5B8DEF]" /> What I&apos;m Noticing
        </h3>
        <p className="text-slate-200 text-sm leading-relaxed">
          {analysis.emotionalPatterns}
        </p>
      </section>

      {/* Coping Strategy */}
      <section className="reveal p-5 border-b border-white/10" style={delay(2)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <CompassIcon size={14} className="text-[#5B8DEF]" /> Coping Strategy for You
        </h3>
        <div className="bg-gradient-to-br from-[#5B8DEF]/15 to-[#7B6FE8]/10 rounded-2xl p-4 space-y-2.5 border border-[#5B8DEF]/25">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-white">
              {analysis.copingStrategy.title}
            </p>
            <span className="flex items-center gap-1 text-xs font-medium text-[#9db8ff] bg-white/10 px-2.5 py-1 rounded-full border border-white/15 whitespace-nowrap">
              <ClockIcon size={12} /> {analysis.copingStrategy.durationMinutes} min
            </span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {analysis.copingStrategy.description}
          </p>
          <p className="flex items-start gap-1.5 text-xs text-blue-100 bg-[#5B8DEF]/15 px-3 py-2 rounded-xl leading-relaxed">
            <BulbIcon size={14} className="mt-0.5 flex-shrink-0" />
            <span>{analysis.copingStrategy.examRelevance}</span>
          </p>
        </div>
      </section>

      {/* Mindfulness Exercise */}
      <section className="reveal p-5 border-b border-white/10" style={delay(3)}>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ExerciseIcon size={14} className="text-[#52C9A0]" />{" "}
          {ex.durationMinutes}-Minute Practice
        </h3>
        <div className="bg-gradient-to-br from-[#52C9A0]/15 to-[#52C9A0]/5 rounded-2xl p-4 space-y-3 border border-[#52C9A0]/25">
          <p className="font-bold text-white">{ex.name}</p>
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
          <SparkleIcon size={14} className="text-[#5B8DEF]" /> A Message for You
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
      <div className="px-5 py-3 bg-white/5 border-t border-white/10">
        <p className="text-[11px] text-slate-400 italic text-center leading-relaxed">
          {analysis.disclaimer}
        </p>
      </div>
    </article>
  );
}
