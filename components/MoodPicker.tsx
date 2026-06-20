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
      <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
        How are you feeling today?
      </label>

      <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
        <span
          className="text-3xl select-none transition-transform"
          aria-hidden="true"
        >
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
            className="w-full h-2.5 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${moodColor(value)} ${fillPct}%, rgba(255,255,255,0.12) ${fillPct}%)`,
            }}
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] text-slate-400">Low</span>
            <span
              className="text-xs font-semibold"
              style={{ color: moodColor(value) }}
            >
              {MOOD_LABEL[value]}
            </span>
            <span className="text-[11px] text-slate-400">Great</span>
          </div>
        </div>

        <span
          className="grid place-items-center w-9 h-9 rounded-xl text-white text-sm font-bold shadow-sm"
          style={{ backgroundColor: moodColor(value) }}
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
    </div>
  );
}
