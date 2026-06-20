"use client";

import type { EmotionTag } from "@/types";
import { getDisabledEmotions, getConflictReason } from "@/lib/emotionRules";

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
  const conflicting = getDisabledEmotions(selected);

  /** First selected emotion that conflicts with `tag` — for the tooltip. */
  function blockedBy(tag: EmotionTag): EmotionTag | undefined {
    return selected.find((s) => getDisabledEmotions([s]).includes(tag));
  }

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
      <legend className="text-sm font-medium text-slate-200">
        How you&apos;re feeling{" "}
        <span className="text-slate-400 font-normal">
          (pick 1–3)
        </span>
        {maxReached && (
          <span className="ml-2 text-xs text-amber-300 font-normal">
            Max 3 selected
          </span>
        )}
      </legend>

      <div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
        role="group"
        aria-label="Emotion tags"
      >
        {EMOTIONS.map(({ tag, label, emoji }) => {
          const isSelected = selected.includes(tag);
          const isConflict = !isSelected && conflicting.includes(tag);
          const isDisabled = disabled || (!isSelected && (maxReached || isConflict));
          const conflictSource = isConflict ? blockedBy(tag) : undefined;

          return (
            <button
              key={tag}
              type="button"
              aria-pressed={isSelected}
              disabled={isDisabled}
              title={
                conflictSource ? getConflictReason(tag, conflictSource) : undefined
              }
              onClick={() => toggle(tag)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(tag);
                }
              }}
              className={[
                "flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-1",
                "border",
                isSelected
                  ? "bg-[#5B8DEF] text-white border-[#5B8DEF] shadow-sm"
                  : isDisabled
                  ? "bg-white/[0.03] text-slate-500 border-white/10 cursor-not-allowed"
                  : "bg-white/5 text-slate-200 border-white/12 hover:border-[#5B8DEF] hover:text-[#9db8ff] cursor-pointer",
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
