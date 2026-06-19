# Dark Redesign + Emotion Guardrails — Design Spec

**Date:** 2026-06-20  
**Author:** Claude (Brainstorming → Design)  
**Status:** Ready for implementation

---

## Summary

Extend MindSpace's premium dark twilight 3D aesthetic from the landing hero across the entire workspace (form, pickers, results, chart, crisis card). Simultaneously, add intelligent emotion-selection guardrails that prevent mutually-exclusive feelings from being picked together, paired with soft warnings for mood/emotion mismatch and overwork.

**Key design philosophy:** The app stays deterministic and pure TS (no AI for guardrails). The crisis scanner remains the top-priority safety net. All changes respect `prefers-reduced-motion` and pass `jest-axe` contrast tests.

---

## Part A: Dark Design System (Tokens & Colors)

### Background & Atmosphere
- **App-wide background:** Twilight gradient `#0E1430 → #161C44 → #20285C` (already in `globals.css` as `.hero-night`)
- **Ambient orbs:** Three drifting, blurred colored orbs behind all cards (already in workspace, extend throughout)
  - Blue orb: `rgba(91,141,239,0.28)` — `drift-a` animation
  - Sage orb: `rgba(82,201,160,0.22)` — `drift-b` animation
  - Violet orb: `rgba(123,111,232,0.2)` — `drift-c` animation
- **Shimmer skeleton:** Update from current light gray to dark: `#1B2550` → `rgba(255,255,255,0.08)`

### Card Surfaces & Borders
- **Card background:** `rgba(255,255,255,0.06)` + `backdrop-blur-lg` (frosted glass)
- **Card border:** `rgba(255,255,255,0.12)` (visible on dark; passes WCAG AA for borders)
- **Shadow:** `shadow-[0_8px_30px_rgba(0,0,0,0.4)]` (dark shadow on dark bg)

### Typography & Text
- **Primary text** (labels, headings): `#F1F4FF` (off-white)
  - Contrast ratio vs. card surface: **~15:1** ✓ (far exceeds AA 4.5:1)
- **Secondary text** (hints, helper text): `#B9C2E6` (light slate)
  - Contrast ratio vs. card surface: **~5.2:1** ✓ (meets AA)
- **Disabled text:** `#7A8AC4` with `opacity-50`
- **Error text:** `#FF6B6B` (bright red, **6.1:1** on dark card surface ✓)
- **Success text:** `#52C9A0` (sage green, **7.8:1** on dark surface ✓)

### Interactive Elements
- **Primary CTA:** White background + dark text (`#1B2150`)
  - Used for "Analyze my day →", "Start writing" buttons
  - Contrast: **19:1** ✓
- **Secondary CTA:** Dark glass border + white/light text hover
- **Icon colors:** Match semantic (periwinkle `#5B8DEF`, violet `#7B6FE8`, sage `#52C9A0`, red `#FF6B6B`)
- **Mood slider fill:** Color-coded by mood value (red → amber → green), visible on dark via gradient
- **Emotion tag selected state:** `bg-[#5B8DEF] text-white` (high contrast)
- **Emotion tag disabled state:** `bg-slate-700 text-slate-500 opacity-60` (clear visual hierarchy)

### Form Inputs
- **Input/textarea/select background:** `rgba(255,255,255,0.04)` glass
- **Input border (default):** `rgba(255,255,255,0.12)`
- **Input border (focus):** `rgba(91,141,239,0.6)` (glow on periwinkle)
- **Input text:** `#F1F4FF`
- **Input placeholder:** `rgba(255,255,255,0.4)` (**4.8:1** on dark input ✓)

### Crisis Card (Special Case)
- **Background:** Warm amber glass `rgba(251,191,36,0.12)` + `backdrop-blur` (distinct from calm dark)
- **Border:** `rgba(251,191,36,0.4)` (amber, stands out)
- **Text:** `#FEF3C7` primary (amber-50), `#F59E0B` secondary (amber-500)
- **Button:** `bg-amber-500 hover:bg-amber-600 text-white` (high contrast, action-oriented)
- **Contrast:** `#FEF3C7` on amber-glass ≈ **6.2:1** ✓

---

## Part B: Component Conversion (Surfaces)

### App-wide
- `app/globals.css` — extend `.hero-night` to `<body>`, add dark shimmer skeleton, orb layer utilities
- `app/layout.tsx` — no change (already sets dark theme meta)
- `app/page.tsx` — orb layer already added; ensure it spans full viewport

### AppHeader
- Change: `bg-white/70 backdrop-blur` → `bg-slate-900/40 backdrop-blur` (dark glass)
- Border: `border-white/60` → `border-white/12`
- Text: `text-slate-800` → `#F1F4FF`, subtext `text-slate-400` → `#B9C2E6`
- Badge (demo mode): Keep amber but adjust: `bg-amber-900/30 text-amber-300`
- Streak badge: `bg-orange-900/20 text-orange-300`
- Avg mood badge: color-coded text keeps working (red/amber/green stay legible)

### JournalForm
- Wrapper: `bg-white/90` → `bg-slate-900/30` glass (matches ResultsPanel)
- `select` / `textarea`: Dark glass inputs per Form Inputs spec above
- Mood slider gradient: Already color-coded; just ensure it renders on dark (it does via `background: linear-gradient(...)`)
- Range slider thumb: Keep `#5B8DEF` (periwinkle), shadow `0 2px 6px rgba(91,141,239,0.6)` (glow effect)
- Buttons: `from-[#5B8DEF] to-[#7B6FE8]` stays (purple gradient is readable on dark); text stays white
- CTA button: Already styled for hero; no change needed

### MoodPicker
- Wrapper: `bg-slate-50/80` → `bg-slate-800/30` glass
- Border: `border-slate-100` → `border-white/12`
- Slider: Gradient already works on dark; text labels adjust to `#B9C2E6`
- Emoji: Content (no change)

### EmotionPicker
- Fieldset legend: `text-slate-700` → `#F1F4FF`, helper text `text-slate-400` → `#B9C2E6`
- Button enabled (not selected): `bg-white text-slate-700 border-slate-200` → `bg-slate-800/40 text-#F1F4FF border-white/12`
- Button enabled (hover): `border-[#5B8DEF] text-[#5B8DEF]` stays (periwinkle accent)
- Button selected: `bg-[#5B8DEF] text-white border-[#5B8DEF]` stays
- **Button disabled (new guardrail):** `bg-slate-700/60 text-slate-500 border-slate-600 cursor-not-allowed`
  - Add `title` or `aria-label` with reason: e.g., "Calm conflicts with Anxious"

### ResultsPanel
- All cards: `bg-white/80` → `bg-slate-900/30`, borders as above
- Idle state card: Icon stays (leaf emoji); add `bob` float class + shadow glow
- Error card: `bg-red-50` → `bg-red-950/30` glass, `border-red-200` → `border-red-400/30`, text adjusts
- Support card: `bg-white/60` → `bg-slate-900/20` glass
- Support links: `text-slate-600 border-slate-100` → `text-#B9C2E6 border-white/12`, hover keeps periwinkle

### AnalysisCard
- Wrapper: Already has `bg-white/90` — change to `bg-slate-900/30` glass
- Section dividers: `border-slate-100` → `border-white/8`
- Stress triggers / patterns / strategy / exercise sections: Headers `text-slate-400` → `#9DB8FF` (light periwinkle)
- List text: `text-slate-700` → `#F1F4FF`
- Coping strategy box: `from-blue-50 to-indigo-50` → `from-blue-900/20 to-indigo-900/20` glass
- Coping title: `text-slate-800` → `#F1F4FF`
- Exam relevance tip: `text-blue-800 bg-blue-100/70` → `text-blue-200 bg-blue-900/30`
- Mindfulness exercise box: `from-emerald-50 to-teal-50` → `from-emerald-900/20 to-teal-900/20` glass
- Motivational message blockquote: `from-[#5B8DEF] to-[#7B6FE8]` gradient stays (high contrast white text)
- Disclaimer: `bg-slate-50/80 border-slate-100` → `bg-slate-800/20 border-white/8`, text → `#9DB8FF`

### CrisisCard
- Wrapper: Already distinct amber glass (no change, it's the one "warm" card for safety)
- Icon: Add container shadow: `shadow-lg shadow-amber-500/20`
- Helpline buttons: Already styled for crisis (dark card context)

### MoodChart
- Title: `text-slate-500` → `#B9C2E6`
- SVG grid lines: `#F1F5F9` → `rgba(255,255,255,0.08)` (visible on dark)
- SVG axis labels: `#94A3B8` → `#9DB8FF` (light periwinkle)
- SVG chart line: `#5B8DEF` stays (accent color)
- SVG area fill opacity: `fillOpacity={0.08}` stays (subtle on dark)
- Empty state: `bg-slate-50 border-slate-100` → `bg-slate-800/30 border-white/12`, text → `#B9C2E6`

### AnalysisSkeleton
- Skeleton: `bg-#e8edf5` → `bg-slate-800/40` (dark shimmer)
- Shimmer gradient: Already defined in `globals.css`; no component-level change needed

---

## Part C: Guardrail Engine (Emotion & Wellness Flags)

### 1. Emotion Conflict Matrix (`lib/emotionRules.ts`)

**New file.** Deterministic, pure TS. No LLM involvement.

```typescript
export type EmotionTag = /* from types */;

export const EMOTION_CONFLICTS: Record<EmotionTag, EmotionTag[]> = {
  "calm": ["anxious", "overwhelmed", "frustrated"],
  "anxious": ["calm", "confident"],
  "overwhelmed": ["calm", "focused", "confident"],
  "focused": ["overwhelmed", "numb"],
  "numb": ["focused", "motivated", "hopeful"],
  "motivated": ["burnt_out"],
  "burnt_out": ["motivated"],
  "confident": ["anxious", "overwhelmed"],
  "hopeful": ["numb"],
  "frustrated": ["calm"],
  "exhausted": [],  // no direct conflicts
  "lonely": [],     // no direct conflicts
};

export function getDisabledEmotions(
  selected: EmotionTag[]
): EmotionTag[] {
  const disabled = new Set<EmotionTag>();
  for (const tag of selected) {
    EMOTION_CONFLICTS[tag]?.forEach(conflict => disabled.add(conflict));
  }
  return Array.from(disabled);
}

export function getConflictReason(
  tag: EmotionTag,
  conflictsWith: EmotionTag
): string {
  // User-friendly explanation
  const reasons: Record<string, string> = {
    "calm|anxious": "Calm and anxious are hard to feel at the same time.",
    "focused|overwhelmed": "When overwhelmed, it's hard to be deeply focused.",
    // ... more
  };
  const key = [tag, conflictsWith].sort().join("|");
  return reasons[key] ?? "This conflicts with another feeling you picked.";
}
```

**Usage in `EmotionPicker`:**
- After user picks a tag, call `getDisabledEmotions(selected)` to get the list
- Grey out disabled buttons with `opacity-60 cursor-not-allowed`
- On hover/focus of a disabled button, show the reason via `title` attribute or `aria-describedby`
- Internally, `onChange` is a no-op if the user tries to click a disabled button (already done via `disabled` prop)

**Tests (`tests/emotionRules.test.ts`):**
- `calm` disables `anxious`, `overwhelmed`, `frustrated`
- `anxious` disables `calm`, `confident`
- Symmetry: if `A` disables `B`, then `B` should disable `A` (or have good reason not to)
- Selecting `anxious` then `calm` → `calm` button is disabled
- Selecting `exhausted` → no conflicts (enables all others)

---

### 2. Wellness Flags (`lib/wellnessFlags.ts`)

**New file.** Soft warnings (non-blocking) for mood/emotion mismatch and overwork.

```typescript
export type WellnessFlag = {
  type: "mood_emotion_mismatch" | "overwork";
  message: string;
  severity: "info" | "caution";
};

export function checkWellnessFlags(
  moodLevel: number,
  emotions: EmotionTag[],
  studyHours: number
): WellnessFlag[] {
  const flags: WellnessFlag[] = [];

  // Mood-emotion mismatch: mood is high (≥7) but emotions are all negative
  const negativeEmotions = ["anxious", "overwhelmed", "burnt_out", "frustrated", "numb", "lonely", "exhausted"];
  const allNegative = emotions.length > 0 && emotions.every(e => negativeEmotions.includes(e));
  if (moodLevel >= 7 && allNegative) {
    flags.push({
      type: "mood_emotion_mismatch",
      message: "Your mood is high, but your feelings are heavy — just checking if that's right?",
      severity: "info",
    });
  }

  // Mood is low (≤3) but emotions are all positive
  const positiveEmotions = ["calm", "focused", "confident", "hopeful", "motivated"];
  const allPositive = emotions.length > 0 && emotions.every(e => positiveEmotions.includes(e));
  if (moodLevel <= 3 && allPositive) {
    flags.push({
      type: "mood_emotion_mismatch",
      message: "Your mood is low, but your feelings sound positive — just making sure?",
      severity: "info",
    });
  }

  // Overwork: ≥14 study hours
  if (studyHours >= 14) {
    flags.push({
      type: "overwork",
      message: "That's a long study day. Remember: rest is part of preparation too.",
      severity: "caution",
    });
  }

  return flags;
}
```

**Usage in `JournalForm`:**
- After each change to mood/emotions/hours, call `checkWellnessFlags(moodLevel, emotions, studyHours)`
- Render flags as inline notes above the CTA button:
  ```jsx
  {flags.map(flag => (
    <div
      key={flag.type}
      className={`text-xs px-3 py-2 rounded-lg border ${
        flag.severity === "caution"
          ? "bg-amber-900/20 border-amber-400/40 text-amber-200"
          : "bg-blue-900/20 border-blue-400/40 text-blue-200"
      }`}
      role="status"
      aria-live="polite"
    >
      {flag.message}
    </div>
  ))}
  ```
- Flags do NOT prevent submission; they're purely informational (`aria-live="polite"`).

**Tests (`tests/wellnessFlags.test.ts`):**
- Mood 8 + all negative emotions → flag triggered
- Mood 2 + all positive emotions → flag triggered
- Mood 8 + mixed emotions → no flag
- Study hours 14+ → overwork flag triggered
- Study hours 13.5 → no flag

---

## Part D: Crisis Scanner (Already Hardened)

No changes needed. Existing `lib/crisisScanner.ts`:
- Word-boundary matching (catches `die`/`dying`, doesn't false-trigger on `studied`/`diet`)
- Expanded keyword list (kill me, take my life, overdose, etc.)
- **Helpline updates** (already applied):
  - Tele-MANAS `14416` (24/7, government)
  - iCall `9152987821`
  - Vandrevala `9999666555` (corrected)

Crisis message: "What you're feeling right now is real — and it can ease, even if it doesn't feel that way tonight. No exam, rank, or result is worth more than you are. Please reach out right now."

---

## Part E: Testing & QA

### Unit Tests
1. **`tests/emotionRules.test.ts`** (new)
   - Conflict matrix symmetry
   - Selected tag disables correct conflicts
   - Disabled tags remain disabled through multiple selections
   - Non-conflicting tags can coexist

2. **`tests/wellnessFlags.test.ts`** (new)
   - Mood/emotion mismatch thresholds (≥7 high mood + all negative, ≤3 low mood + all positive)
   - Overwork threshold (≥14 hours)
   - Flags only returned when conditions met

3. **`tests/components.test.tsx`** (update)
   - Emotion max-3 test: switch from current (possibly conflicting) trio to non-conflicting trio (e.g., calm + focused + hopeful)

### Integration Tests
- `jest-axe` contrast audit on dark theme:
  - Text `#F1F4FF` on card `rgba(255,255,255,0.06)`: **15:1** ✓
  - Text `#B9C2E6` on card: **5.2:1** ✓
  - Error `#FF6B6B` on card: **6.1:1** ✓
  - Focus rings: Keep `ring-2 ring-periwinkle` (2px periwinkle on dark ✓)

### Screenshot Verification
- **Light theme** (doesn't exist yet, but if added, would be a future toggle):
  - Not part of this spec; focus on dark
- **Dark theme (primary):**
  - Hero + workspace transition (no hard line)
  - Form filled + mood slider + emotion picker (with one disabled)
  - Results panel with idle/error/crisis states
  - Analysis card full flow
  - Mood chart with data
  - Narrow mobile + wide desktop responsiveness
- **Dark theme + reduced-motion:**
  - Orbs frozen, `float-in` / `tilt` / `bob` animations disabled
  - Content readable (no layout shift)

### Build & Deployment
- `npm run build` → no TypeScript errors
- `npm run lint` → eslint clean
- `npx vitest run` → all tests pass (99+2 new = 101 expected)
- Preview on localhost before pushing

---

## Part F: Implementation Sequencing

1. **Colors & tokens** → `globals.css` (background, orbs, skeleton, focus rings)
2. **Component templates** → Convert each surface (AppHeader, inputs, cards)
3. **Emotion guardrails** → `emotionRules.ts` + tests + `EmotionPicker` integration
4. **Wellness flags** → `wellnessFlags.ts` + tests + `JournalForm` integration
5. **Accessibility pass** → `jest-axe`, focus states, `aria-live`, keyboard nav
6. **Screenshot & manual QA** → Dark theme, reduced-motion, narrow/wide viewports
7. **Commit & push** → GitHub + deploy to GCP

---

## Part G: Success Criteria

✓ Entire app renders on dark twilight background with floating orbs  
✓ All text meets WCAG AA contrast (4.5:1 minimum)  
✓ All interactive elements (buttons, inputs, cards) support dark glass aesthetic  
✓ Emotion guardrails prevent conflicting feelings from being selected together  
✓ Soft warnings appear for mood/emotion mismatch and overwork (non-blocking)  
✓ Crisis scanner remains the top safety net (unchanged logic, updated helplines)  
✓ All 99 existing tests pass + 2 new test suites pass (23 tests)  
✓ `jest-axe` contrast audit passes on dark theme  
✓ Reduced-motion respected (no layout shift, all animations disabled)  
✓ Responsive on mobile (375px) and desktop (1440px)  
✓ Pushed to GitHub + deployed on GCP without errors  

---

## Glossary

- **Glassmorphism:** Frosted glass effect via `backdrop-blur` + semi-transparent bg
- **Word-boundary matching:** Regex `\bword\b` to avoid false-triggers (e.g., "die" in "studied")
- **Guardrail:** Deterministic rule (no AI) that prevents invalid states (conflicting emotions, extreme overwork)
- **Soft warning:** Non-blocking advisory (shown but doesn't prevent action)
- **Hard block:** Disables UI control entirely (disabled emotion buttons)
- **Orbs:** Ambient background elements (blur, glow, drift animations) that create depth
- **`jest-axe`:** Accessibility testing library that scans for contrast, alt text, focus, etc.

---

**Ready for implementation review.** Once you approve this spec, I'll invoke `writing-plans` to create the detailed implementation roadmap, then start coding.
