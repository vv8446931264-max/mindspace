"use client";

import type { EmotionTag } from "@/types";

const EMOTIONS: { tag: EmotionTag; label: string; emoji: string }[] = [
  { tag: "anxious", label: "Anxious", emoji: "😰" },
  { tag: "overwhelmed", label: "Overwhelmed", emoji: "😵" },
  { tag: "hopeful", label: "Hopeful", emoji: "🌱" },
  { tag: "focused", label: "Focused", emoji: "🎯" },
  { tag: "burnt_out", label: "Burnt out", emoji: "🔥" },
  { tag: "motivated", label: "Motivated", emoji: "💪" },
  { tag: "lonely", label: "Lonely", emoji: "🌧️" },
  { tag: "calm", label: "Calm", emoji: "🌊" },
  { tag: "frustrated", label: "Frustrated", emoji: "😤" },
  { tag: "confident", label: "Confident", emoji: "⭐" },
  { tag: "exhausted", label: "Exhausted", emoji: "😴" },
  { tag: "numb", label: "Numb", emoji: "❄️" },
];

type Props = {
  selected: EmotionTag[];
  onChange: (tags: EmotionTag[]) => void;
  disabled?: boolean;
};

export default function EmotionPicker({ selected, onChange, disabled }: Props) {
  const maxReached = selected.length >= 3;

  function toggle(tag: EmotionTag) {
    if (disabled) return;
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else if (!maxReached) {
      onChange([...selected, tag]);
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-slate-700">
        How you&apos;re feeling{" "}
        <span className="text-slate-400 font-normal">
          (pick 1–3)
        </span>
        {maxReached && (
          <span className="ml-2 text-xs text-amber-600 font-normal">
            Max 3 selected
          </span>
        )}
      </legend>

      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
        role="group"
        aria-label="Emotion tags"
      >
        {EMOTIONS.map(({ tag, label, emoji }) => {
          const isSelected = selected.includes(tag);
          const isDisabled = disabled || (!isSelected && maxReached);

          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              disabled={isDisabled}
              onClick={() => toggle(tag)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(tag);
                }
              }}
              className={[
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-1",
                "border",
                isSelected
                  ? "bg-[#5B8DEF] text-white border-[#5B8DEF] shadow-sm"
                  : isDisabled
                  ? "bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed"
                  : "bg-white text-slate-700 border-slate-200 hover:border-[#5B8DEF] hover:text-[#5B8DEF] cursor-pointer",
              ].join(" ")}
            >
              <span aria-hidden="true">{emoji}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
