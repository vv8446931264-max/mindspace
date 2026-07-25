"use client";

import type { ComponentType } from "react";
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

/** Section label in the margin style */
function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3
      className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5"
      style={{ color: "var(--ink-dim)" }}
    >
      {icon}
      {children}
    </h3>
  );
}

export default function AnalysisCard({ analysis }: Props) {
  const { mindfulnessExercise: ex } = analysis;
  const ExerciseIcon = EXERCISE_ICONS[ex.type] ?? CompassIcon;

  return (
    <article
      className="rise leaf rounded-2xl overflow-hidden"
      style={{ borderColor: "var(--rule)" }}
    >
      {/* Stress Triggers */}
      <section className="p-5 border-b" style={{ borderColor: "var(--rule)" }}>
        <SectionLabel icon={<TargetIcon size={13} className="[color:var(--marker)]" />}>
          Stress Triggers
        </SectionLabel>
        <ul className="space-y-2">
          {analysis.stressTriggers.map((trigger, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md text-[10px] flex items-center justify-center font-semibold"
                style={{ background: "var(--marker-wash)", color: "var(--marker)" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-sm leading-snug" style={{ color: "var(--ink)" }}>
                {trigger}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Emotional Patterns — rendered as marginalia */}
      <section className="p-5 border-b" style={{ borderColor: "var(--rule)" }}>
        <SectionLabel icon={<SearchIcon size={13} className="[color:var(--marker)]" />}>
          What I&apos;m Noticing
        </SectionLabel>
        {/* Marginalia: smaller, second ink, left border in margin-rule colour */}
        <p
          className="text-sm leading-relaxed pl-3 border-l-2"
          style={{ color: "var(--ink-second)", borderColor: "var(--margin-rule)" }}
        >
          {analysis.emotionalPatterns}
        </p>
      </section>

      {/* Coping Strategy */}
      <section className="p-5 border-b" style={{ borderColor: "var(--rule)" }}>
        <SectionLabel icon={<CompassIcon size={13} className="[color:var(--marker)]" />}>
          Coping Strategy
        </SectionLabel>
        <div
          className="rounded-xl p-4 space-y-2 border"
          style={{ background: "var(--marker-wash)", borderColor: "var(--rule)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold" style={{ color: "var(--ink)" }}>
              {analysis.copingStrategy.title}
            </p>
            <span
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap"
              style={{ color: "var(--ink-dim)", borderColor: "var(--rule)", background: "var(--paper-raised)" }}
            >
              <ClockIcon size={12} /> {analysis.copingStrategy.durationMinutes} min
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink-second)" }}>
            {analysis.copingStrategy.description}
          </p>
          <p
            className="flex items-start gap-1.5 text-xs px-3 py-2 rounded-lg leading-relaxed border"
            style={{ color: "var(--ink-second)", borderColor: "var(--rule)", background: "var(--paper-sunk)" }}
          >
            <BulbIcon size={13} className="mt-0.5 flex-shrink-0 [color:var(--marker)]" />
            <span>{analysis.copingStrategy.examRelevance}</span>
          </p>
        </div>
      </section>

      {/* Mindfulness Exercise */}
      <section className="p-5 border-b" style={{ borderColor: "var(--rule)" }}>
        <SectionLabel icon={<ExerciseIcon size={13} className="[color:var(--marker)]" />}>
          {ex.durationMinutes}-Minute Practice
        </SectionLabel>
        <div
          className="rounded-xl p-4 space-y-3 border"
          style={{ background: "var(--paper-sunk)", borderColor: "var(--rule)" }}
        >
          <p className="font-semibold" style={{ color: "var(--ink)" }}>{ex.name}</p>
          <ol className="space-y-2">
            {ex.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-snug">
                <span
                  className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-semibold"
                  style={{ background: "var(--marker-wash)", color: "var(--marker)" }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="pt-0.5" style={{ color: "var(--ink-second)" }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* A note for you — plain, no affirmation blockquote */}
      <section className="p-5" style={{ borderColor: "var(--rule)" }}>
        <SectionLabel icon={<SparkleIcon size={13} className="[color:var(--marker)]" />}>
          A note
        </SectionLabel>
        <p
          className="text-sm leading-relaxed pl-3 border-l-2"
          style={{ color: "var(--ink-second)", borderColor: "var(--margin-rule)" }}
        >
          {analysis.motivationalMessage}
        </p>
      </section>

      {/* Disclaimer */}
      <div className="px-5 py-3 border-t" style={{ background: "var(--paper-sunk)", borderColor: "var(--rule)" }}>
        <p className="text-[11px] italic text-center leading-relaxed" style={{ color: "var(--ink-dim)" }}>
          {analysis.disclaimer}
        </p>
      </div>
    </article>
  );
}
