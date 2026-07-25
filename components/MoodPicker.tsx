"use client";

import { useCallback, useId } from "react";
import type { MoodLevel } from "@/types";

type Props = {
  value: MoodLevel;
  onChange: (v: MoodLevel) => void;
  disabled?: boolean;
};

const MOOD_EMOJI: Record<number, string> = {
  1: "😔",
  2: "😟",
  3: "😕",
  4: "😐",
  5: "🙂",
  6: "😊",
  7: "😄",
  8: "😁",
  9: "🤩",
  10: "🌟",
};

const MOOD_LABEL: Record<number, string> = {
  1: "Really low",
  2: "Low",
  3: "Struggling",
  4: "Meh",
  5: "Okay",
  6: "Decent",
  7: "Good",
  8: "Great",
  9: "Amazing",
  10: "On top of the world",
};

function moodColor(v: number): string {
  if (v <= 3) return "#F87171";
  if (v <= 6) return "#FBBF24";
  return "#52C9A0";
}

export default function MoodPicker({ value, onChange, disabled }: Props) {
  const id = useId();

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange(Math.min(10, value + 1) as MoodLevel);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange(Math.max(1, value - 1) as MoodLevel);
      }
    },
    [value, onChange]
  );

  const fillPct = (value - 1) * (100 / 9);

  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: "var(--ink-second)" }}>
        How are you feeling today?
      </label>

      <div
        className="flex items-center gap-3 rounded-xl border p-3"
        style={{ background: "var(--paper-sunk)", borderColor: "var(--rule)" }}
      >
        <span className="text-3xl select-none" aria-hidden="true">
          {MOOD_EMOJI[value]}
        </span>

        <div className="flex-1">
          <input
            id={id}
            type="range"
            min={1}
            max={10}
            step={1}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(Number(e.target.value) as MoodLevel)}
            onKeyDown={handleKey}
            role="slider"
            aria-valuemin={1}
            aria-valuemax={10}
            aria-valuenow={value}
            aria-valuetext={`Mood ${value} out of 10 — ${MOOD_LABEL[value]}`}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(to right, var(--marker) ${fillPct}%, var(--rule) ${fillPct}%)`,
            }}
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px]" style={{ color: "var(--ink-dim)" }}>Low</span>
            <span className="text-xs font-semibold" style={{ color: "var(--marker)" }}>
              {MOOD_LABEL[value]}
            </span>
            <span className="text-[11px]" style={{ color: "var(--ink-dim)" }}>Great</span>
          </div>
        </div>

        <span
          className="grid place-items-center w-9 h-9 rounded-lg text-sm font-semibold"
          style={{ background: "var(--marker-wash)", color: "var(--marker)" }}
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
    </div>
  );
}
