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

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        How are you feeling today?
        <span className="ml-1 text-slate-400 font-normal">
          (1 = very low, 10 = great)
        </span>
      </label>

      <div className="flex items-center gap-3">
        <span className="text-2xl select-none" aria-hidden="true">
          {MOOD_EMOJI[value]}
        </span>

        <div className="flex-1 relative">
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
            aria-valuetext={`Mood ${value} out of 10 — ${MOOD_EMOJI[value]}`}
            className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${moodColor(value)} ${(value - 1) * (100 / 9)}%, #E2E8F0 ${(value - 1) * (100 / 9)}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1 px-0.5">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <span
          className="text-lg font-bold min-w-[2ch] text-right"
          style={{ color: moodColor(value) }}
          aria-hidden="true"
        >
          {value}
        </span>
      </div>
    </div>
  );
}
