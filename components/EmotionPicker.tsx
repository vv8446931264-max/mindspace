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
      <legend className="text-sm font-medium" style={{ color: "var(--ink-second)" }}>
        How you&apos;re feeling{" "}
        <span className="font-normal" style={{ color: "var(--ink-dim)" }}>
          (up to 3, or skip)
        </span>
        {maxReached && (
          <span className="ml-2 text-xs font-normal" style={{ color: "var(--marker)" }}>
            Max 3 selected
          </span>
        )}
      </legend>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3" role="group" aria-label="Emotion tags">
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
              title={conflictSource ? getConflictReason(tag, conflictSource) : undefined}
              onClick={() => toggle(tag)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(tag); }
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={
                isSelected
                  ? { background: "var(--marker)", color: "var(--on-marker)", borderColor: "var(--marker)" }
                  : isDisabled
                  ? { background: "var(--paper-sunk)", color: "var(--ink-dim)", borderColor: "var(--rule)", cursor: "not-allowed", opacity: 0.5 }
                  : { background: "var(--paper-sunk)", color: "var(--ink-second)", borderColor: "var(--rule)", cursor: "pointer" }
              }
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
