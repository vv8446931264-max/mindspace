import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MoodPicker from "../components/MoodPicker";
import EmotionPicker from "../components/EmotionPicker";
import type { EmotionTag, MoodLevel } from "../types";

// ── MoodPicker ──────────────────────────────────────────────────────────────
function MoodHarness() {
  const [v, setV] = useState<MoodLevel>(5);
  return <MoodPicker value={v} onChange={setV} />;
}

describe("MoodPicker", () => {
  it("exposes correct slider ARIA attributes", () => {
    render(<MoodHarness />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "1");
    expect(slider).toHaveAttribute("aria-valuemax", "10");
    expect(slider).toHaveAttribute("aria-valuenow", "5");
  });

  it("increments value with ArrowRight key", async () => {
    const user = userEvent.setup();
    render(<MoodHarness />);
    const slider = screen.getByRole("slider");
    slider.focus();
    await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "6");
  });

  it("decrements value with ArrowLeft key", async () => {
    const user = userEvent.setup();
    render(<MoodHarness />);
    const slider = screen.getByRole("slider");
    slider.focus();
    await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "4");
  });

  it("clamps at the maximum of 10", async () => {
    const user = userEvent.setup();
    render(<MoodHarness />);
    const slider = screen.getByRole("slider");
    slider.focus();
    for (let i = 0; i < 8; i++) await user.keyboard("{ArrowRight}");
    expect(slider).toHaveAttribute("aria-valuenow", "10");
  });

  it("clamps at the minimum of 1", async () => {
    const user = userEvent.setup();
    render(<MoodHarness />);
    const slider = screen.getByRole("slider");
    slider.focus();
    for (let i = 0; i < 8; i++) await user.keyboard("{ArrowLeft}");
    expect(slider).toHaveAttribute("aria-valuenow", "1");
  });
});

// ── EmotionPicker ───────────────────────────────────────────────────────────
function EmotionHarness({ onChange }: { onChange?: (t: EmotionTag[]) => void }) {
  const [tags, setTags] = useState<EmotionTag[]>([]);
  return (
    <EmotionPicker
      selected={tags}
      onChange={(t) => {
        setTags(t);
        onChange?.(t);
      }}
    />
  );
}

describe("EmotionPicker", () => {
  it("selects an emotion on click (aria-pressed toggles)", async () => {
    const user = userEvent.setup();
    render(<EmotionHarness />);
    const anxious = screen.getByRole("button", { name: /anxious/i });
    expect(anxious).toHaveAttribute("aria-pressed", "false");
    await user.click(anxious);
    expect(anxious).toHaveAttribute("aria-pressed", "true");
  });

  it("deselects an already-selected emotion", async () => {
    const user = userEvent.setup();
    render(<EmotionHarness />);
    const calm = screen.getByRole("button", { name: /calm/i });
    await user.click(calm);
    expect(calm).toHaveAttribute("aria-pressed", "true");
    await user.click(calm);
    expect(calm).toHaveAttribute("aria-pressed", "false");
  });

  it("enforces a maximum of 3 selections", async () => {
    const user = userEvent.setup();
    render(<EmotionHarness />);
    // Non-conflicting trio so all three actually select.
    for (const name of [/anxious/i, /focused/i, /lonely/i]) {
      await user.click(screen.getByRole("button", { name }));
    }
    // Exhausted conflicts with none of them, so it's disabled purely by the max-3 rule.
    const fourth = screen.getByRole("button", { name: /exhausted/i });
    expect(fourth).toBeDisabled();
    await user.click(fourth);
    expect(fourth).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the selected tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<EmotionHarness onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /motivated/i }));
    expect(onChange).toHaveBeenCalledWith(["motivated"]);
  });
});
