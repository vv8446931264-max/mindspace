# Registers — MindSpace design system

**This is the page nobody grades.**

Every sheet of paper in this student's life — OMR sheets, rank lists, cutoff tables, red-pen corrections — is an instrument of evaluation. The ruled copy they write in for themselves is the one surface that isn't. The app is that surface.

What that rules out, by construction, not by preference:

- no dashboards, no score rings, no progress bars
- no red-as-status
- no charts on the default surface
- no celebration animation — nothing here rewards the user for using the app
- no `backdrop-filter`, anywhere

Everything lives in `app/globals.css`. There is no second stylesheet.

---

## Why the old theme went

1. **Readability.** Positive polarity (dark on light) is read faster and more accurately. Astigmatism affects 30–60% of people and high-contrast negative polarity causes halation. `backdrop-filter` under light-on-dark is a halation generator, and long study hours make it worse.
2. **Cost.** `backdrop-filter` is among the most expensive things you can ask a budget GPU to do. Our users are on 4–8 GB vivo/realme/Xiaomi devices.
3. **It said nothing.** It was the house style of every AI wellness app since 2023.

---

## Two registers

| | `paper` (day) | `lamplight` (night) |
|---|---|---|
| Polarity | dark ink on warm cream | warm ink on lamp-lit dark |
| Selected by | `<html data-theme="paper">` | `<html data-theme="lamplight">` |
| Default | when no `data-theme` and `prefers-color-scheme: light` | when no `data-theme` and `prefers-color-scheme: dark` |

`lamplight` is not a fashionable dark mode. Ink is capped at a warm off-white (`#ede4d4`), never pure white — halation scales with absolute luminance, so the cap is the mitigation. Hues are warm throughout so the screen reads as a lamp on paper rather than a backlit panel.

---

## Tokens

Every token is `color-mix(in oklab, <lit> (1−dim), <dark>)`. `<lit>` is the value at `--dim: 0`, `<dark>` at `--dim: 1`.

### `paper` (day)

| Token | dim 0 | dim 0.5 | dim 1 |
|---|---|---|---|
| `--paper` | `#fbf8f1` | `#e0dbd0` | `#c6bfb0` |
| `--paper-raised` | `#fefcf7` | `#e8e3d9` | `#d2cbbc` |
| `--paper-sunk` | `#f3efe4` | `#d7d2c5` | `#bcb5a6` |
| `--rule` | `#e2dccd` | `#c9c2b2` | `#b0a897` |
| `--margin-rule` | `#a25a2c` | `#874a22` | `#6c3a18` |
| `--ink` | `#16181d` | `#111317` | `#0c0e11` |
| `--ink-dim` | `#5c5749` | `#4e493e` | `#403c33` |
| `--ink-second` | `#4a463c` | `#3c3931` | `#2f2c26` |
| `--marker` | `#8a5512` | `#74470e` | `#5e390b` |
| `--on-marker` | `#fdfbf6` | `#f7f4ec` | `#f2ede2` |

### `lamplight` (night)

| Token | dim 0 | dim 0.5 | dim 1 |
|---|---|---|---|
| `--paper` | `#221d17` | `#16130f` | `#0a0908` |
| `--paper-raised` | `#2c261e` | `#1f1b17` | `#131110` |
| `--paper-sunk` | `#1a1611` | `#0f0d0a` | `#060505` |
| `--rule` | `#3c332a` | `#2e2821` | `#211d19` |
| `--margin-rule` | `#c98a55` | `#d19561` | `#d9a06d` |
| `--ink` | `#ede4d4` | `#ded4c4` | `#cfc5b4` |
| `--ink-dim` | `#afa391` | `#a59a89` | `#9c9182` |
| `--ink-second` | `#c9bda9` | `#beb2a0` | `#b4a897` |
| `--marker` | `#e6bc7c` | `#dfb574` | `#d9ae6c` |
| `--on-marker` | `#1a1409` | `#171107` | `#140f06` |

`--marker-wash` is derived at runtime: `color-mix(in oklab, var(--marker) 22%, var(--paper))`. **22% is the verified ceiling** — past it, `--ink` on the wash drops under 7:1 at one end of the dimmer or the other.

### Roles

| Token | Use for | Never use for |
|---|---|---|
| `--paper` | the sheet, the page ground | — |
| `--paper-raised` | a leaf sitting on the sheet, buttons | anything that needs a shadow to read |
| `--paper-sunk` | input wells, static placeholders | body ground |
| `--rule` | ruled lines, hairline dividers, borders | text of any kind |
| `--margin-rule` | the vertical margin rule, the crisis tab | decoration elsewhere |
| `--ink` | all body text | — |
| `--ink-dim` | timestamps, labels, metadata | body text, marginalia |
| `--ink-second` | **AI output, and only AI output** | anything the student wrote |
| `--marker` | focus rings, link underlines, the one filled button | status, alarm, "error" |
| `--on-marker` | text on a `--marker` fill | anything else |

`--ink-second` is load-bearing. It is the second pen. If AI text renders in `--ink`, the distinction the whole design rests on is gone.

---

## Measured contrast

Sampled at **201 positions** across `--dim` 0→1 for every pair, not inferred from the endpoints. `min` is the worst ratio anywhere in the range; the dimmer position where it occurs is in brackets. Method: WCAG 2.x relative luminance, with `color-mix(in oklab, …)` reimplemented (sRGB → linear → LMS → Oklab → lerp → back). No gamut clipping occurs anywhere in either range.

Floors: **body ≥ 7:1** (AAA), **everything else ≥ 4.5:1**.

### `paper` (day)

| Pair | Floor | Min | Max | Worst case |
|---|---|---|---|---|
| `--ink` / `--paper` | 7:1 | **10.57** (1.0) | 16.74 | `#0c0e11` on `#c6bfb0` |
| `--ink` / `--paper-raised` | 7:1 | **11.97** (1.0) | 17.32 | `#0c0e11` on `#d2cbbc` |
| `--ink` / `--paper-sunk` | 7:1 | **9.48** (1.0) | 15.46 | `#0c0e11` on `#bcb5a6` |
| `--ink-second` / `--paper` | 7:1 | **7.61** (1.0) | 8.87 | `#2f2c26` on `#c6bfb0` |
| `--ink-second` / `--paper-raised` | 7:1 | **8.62** (1.0) | 9.17 | `#2f2c26` on `#d2cbbc` |
| `--ink-dim` / `--paper` | 4.5:1 | **6.00** (1.0) | 6.79 | `#403c33` on `#c6bfb0` |
| `--ink-dim` / `--paper-raised` | 4.5:1 | **6.80** (1.0) | 7.03 | `#403c33` on `#d2cbbc` |
| `--marker` / `--paper` | 4.5:1 | **5.56** (1.0) | 5.84 | `#5e390b` on `#c6bfb0` |
| `--marker` / `--paper-raised` | 4.5:1 | **6.04** (0.0) | 6.30 | `#8a5512` on `#fefcf7` |
| `--margin-rule` / `--paper` | 4.5:1 | **4.91** (0.0) | 5.09 | `#a25a2c` on `#fbf8f1` |
| `--margin-rule` / `--paper-raised` | 4.5:1 | **5.08** (0.0) | 5.77 | `#a25a2c` on `#fefcf7` |
| `--on-marker` / `--marker` | 4.5:1 | **5.99** (0.0) | 8.71 | `#fdfbf6` on `#8a5512` |
| `--ink` / `--marker-wash` | 7:1 | **7.56** (1.0) | — | `#0c0e11` on `#afa08b` |
| `--ink-second` / `--marker-wash` | 4.5:1 | **5.44** (1.0) | — | `#2f2c26` on `#afa08b` |
| `--rule` / `--paper` | *decorative* | 1.29 | 1.29 | ruled lines are meant to be faint |

### `lamplight` (night)

| Pair | Floor | Min | Max | Worst case |
|---|---|---|---|---|
| `--ink` / `--paper` | 7:1 | **11.65** (1.0) | 13.25 | `#cfc5b4` on `#0a0908` |
| `--ink` / `--paper-raised` | 7:1 | **11.03** (1.0) | 11.87 | `#cfc5b4` on `#131110` |
| `--ink` / `--paper-sunk` | 7:1 | **11.92** (1.0) | 14.27 | `#cfc5b4` on `#060505` |
| `--ink-second` / `--paper` | 7:1 | **8.52** (1.0) | 9.04 | `#b4a897` on `#0a0908` |
| `--ink-second` / `--paper-raised` | 7:1 | **8.06** (1.0) | 8.22 | `#b4a897` on `#131110` |
| `--ink-dim` / `--paper` | 4.5:1 | **6.43** (1.0) | 6.76 | `#9c9182` on `#0a0908` |
| `--ink-dim` / `--paper-raised` | 4.5:1 | **6.04** (0.0) | 6.17 | `#afa391` on `#2c261e` |
| `--marker` / `--paper` | 4.5:1 | **9.43** (0.0) | 9.76 | `#e6bc7c` on `#221d17` |
| `--marker` / `--paper-raised` | 4.5:1 | **8.44** (0.0) | 9.16 | `#e6bc7c` on `#2c261e` |
| `--margin-rule` / `--paper` | 4.5:1 | **5.77** (0.0) | 8.72 | `#c98a55` on `#221d17` |
| `--margin-rule` / `--paper-raised` | 4.5:1 | **5.17** (0.0) | 8.25 | `#c98a55` on `#2c261e` |
| `--on-marker` / `--marker` | 4.5:1 | **9.29** (1.0) | 10.32 | `#140f06` on `#d9ae6c` |
| `--ink` / `--marker-wash` | 7:1 | **8.55** (0.0) | — | `#ede4d4` on `#483c2b` |
| `--ink-second` / `--marker-wash` | 4.5:1 | **5.82** (0.0) | — | `#c9bda9` on `#483c2b` |
| `--rule` / `--paper` | *decorative* | 1.19 | 1.35 | ruled lines are meant to be faint |

**The tightest number in the system is 4.91:1** (`--margin-rule` on `--paper`, day, dim 0). Everything else has margin. The roadmap constraint "body contrast ≥ 7:1 at every dimmer position" is met with a worst case of **7.61:1** for marginalia and **9.48:1** for primary body text.

> **Never apply `opacity` to a tokenised colour.** It silently invalidates every ratio in these tables. If you need a lighter ink, there is a token for it. The only `opacity` in the system is on `:disabled` and on `.pending`, neither of which carries body text.

---

## The dimmer

`--dim` is a **continuous luminance control**, not a light/dark toggle. The register (`paper` | `lamplight`) is the other axis. All ten surface and ink tokens derive from `--dim` via `color-mix()`, so changing one number re-tones the entire UI.

It is registered so it type-checks and can be animated:

```css
@property --dim { syntax: "<number>"; inherits: true; initial-value: 0; }
```

### The design position, stated plainly

**The contrast floor wins.** Turning the dimmer up darkens the ground almost to black — a **78% drop in surface luminance** in lamplight, **44%** in paper — but only dims the ink as far as 7:1 allows, then clamps. You cannot dim your way into unreadable text. This is deliberate: the shared-hostel-room problem is solved by lowering emitted light, and emitted light is dominated by the ground, not the glyphs.

Across the full chain (paper @ dim 0 → lamplight @ dim 1) surface luminance falls from **0.940 to 0.0028** — a 99.7% reduction.

### How the app should set it

One user-facing slider, `0..1`. It crosses from `paper` into `lamplight` at 0.6. Both sides stay contrast-safe; there is no unsafe blend across the boundary because the boundary is a swap, not a mix.

```ts
// lib/luminance.ts
const CROSSOVER = 0.6;

/** v: 0 = brightest daylight paper, 1 = darkest lamplight. */
export function setLuminance(v: number) {
  const el = document.documentElement;
  const clamped = Math.min(1, Math.max(0, v));
  if (clamped <= CROSSOVER) {
    el.dataset.theme = "paper";
    el.style.setProperty("--dim", String(clamped / CROSSOVER));
  } else {
    el.dataset.theme = "lamplight";
    el.style.setProperty("--dim", String((clamped - CROSSOVER) / (1 - CROSSOVER)));
  }
  localStorage.setItem("ms-lum", String(clamped));
}
```

Apply it **before first paint** to avoid a flash. In `app/layout.tsx`, inside `<head>`:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){try{var v=localStorage.getItem('ms-lum');if(v===null)return;v=+v;var c=0.6,e=document.documentElement;if(v<=c){e.dataset.theme='paper';e.style.setProperty('--dim',String(v/c))}else{e.dataset.theme='lamplight';e.style.setProperty('--dim',String((v-c)/(1-c)))}}catch(e){}})()`,
  }}
/>
```

With no stored preference, nothing is set and `prefers-color-scheme` picks the register. That is the correct default.

Do **not** put a CSS transition on `--dim`. It repaints every surface on every frame; on the target hardware that is a poor trade for a decorative fade.

Markup for the control:

```html
<label for="lum">Screen brightness</label>
<input id="lum" class="dimmer" type="range" min="0" max="1" step="0.02" />
```

Label it in the user's words — *screen brightness*, *स्क्रीन की रोशनी* — never "dimmer", never "theme".

---

## Typography

**Hind** (ITF), harmonised Devanagari + Latin in one family. Two weights, 400 and 600. There is no third.

### Scale

All sizes in `rem`. The root size is the user's browser setting and is **never** overridden.

| Token | rem | px | Use |
|---|---|---|---|
| `--t-micro` | 0.8125 | 13 | timestamps, legal. **Never body.** |
| `--t-small` | 0.9375 | 15 | marginalia, labels |
| `--t-body` | 1.0625 | **17** | all body text (floor is 16) |
| `--t-lead` | 1.1875 | 19 | `.entry` — the student's own writing |
| `--t-head` | 1.375 | 22 | `h2` |
| `--t-title` | 1.75 | 28 | `h1` — fits 360px with room |

- Measure capped at `62ch` (`--measure`). Set on `p, ul, ol` and available as `.measure`.
- Left-aligned. **Never justified** — rivers in Latin, and worse in Devanagari where the शिरोरेखा makes gaps far more visible.
- `hyphens: none` globally. Devanagari must not be hyphenated.
- `overflow-wrap: break-word` so a long token cannot create horizontal scroll at 200% zoom.

### Leading is per script

| Script | `--lh` | `--lh-tight` |
|---|---|---|
| Latin / Hinglish | 1.6 | 1.3 |
| Devanagari | 1.78 | 1.5 |

Selected with **attribute selectors, not `:lang()`**:

```css
[lang|="hi"]:not([lang="hi-Latn"]) { --lh: 1.78; letter-spacing: 0; }
[lang="hi-Latn"]                   { --lh: 1.6; }
```

`:lang(hi)` also matches `hi-Latn` under CSS language-range matching, which would hand Hinglish the Devanagari leading. The attribute form says what we mean.

**Devanagari is never letter-spaced.** Positive tracking breaks the शिरोरेखा, the headline that joins the characters of a word. `.text-spacious` (the accessibility accommodation) is scoped away from Devanagari for exactly this reason.

No OpenDyslexic. The research does not support it — it does not improve reading speed or accuracy and can slow both. The accommodation offered is increased letter-spacing and leading on Latin, which does have support.

`--rule-step` (the ruled-line pitch) is `--t-body × --lh`, so ruled lines re-space themselves when the language changes and text keeps sitting on the lines.

### Fonts: what still needs doing

`@font-face` is written and correct. The files are not in the repo.

Add to `public/fonts/`:

| File | Approx |
|---|---|
| `hind-400-latin.woff2` | 16 KB |
| `hind-600-latin.woff2` | 16 KB |
| `hind-400-deva.woff2` | 70 KB |
| `hind-600-deva.woff2` | 70 KB |

Until they exist the metric-matched fallback renders and nothing breaks — `font-display: swap` plus a real fallback face means there is no invisible-text window at any point.

**Devanagari never loads on first paint**, and this needs no JavaScript. It is gated purely by `unicode-range`: a browser downloads a face only when a codepoint inside that face's range is actually rendered. An English or Hinglish session renders no U+09xx, so no request is made. Two traps the file avoids on purpose:

- **U+20B9 (₹) is assigned to the Latin face.** If it lived only in the Devanagari range, a single rupee sign in an English session would pull down 70 KB.
- **U+200C/200D (ZWNJ/ZWJ) are carved out of the Latin general-punctuation range** (`U+2000-200B, U+200E-206F`) and left to Devanagari, which needs them for half-form shaping.

Two things to fix when the files land:

1. **Re-measure the fallback metrics.** The `ascent-override: 102.4% / descent-override: 40% / size-adjust: 96%` on `"Hind Fallback"` are approximations against Hind's published metrics, not measurements of the shipped file. Run them through capsize or fontkit and correct. They are flagged in the CSS.
2. **Drop Plus Jakarta Sans.** `app/layout.tsx` still imports it via `next/font/google` and the font stack no longer references it. Removing the import saves a request and ~16 KB.

Also in `layout.tsx`: `viewport.themeColor` is still `#5B8DEF`. It should follow the register.

```ts
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f1" },
    { media: "(prefers-color-scheme: dark)",  color: "#221d17" },
  ],
  width: "device-width",
  initialScale: 1,
};
```

Zoom is already not disabled (no `maximumScale`, no `userScalable: false`). Keep it that way.

---

## The margin

A vertical rule down the left edge of the content column, on every route, always. It is **structural, not decorative**: the crisis affordance lives in it permanently, at thumb height. Nothing else may occupy it.

```html
<main class="sheet">…</main>
```

`.sheet` draws the rule via `::before` at full token strength. Gutter is `clamp(2.5rem, 11vw, 3.5rem)` — **40px at the 360px canvas**.

The crisis tab straddles the rule like a bookmark:

```html
<a class="margin-crisis" href="tel:14416" aria-label="Talk to someone now — Tele-MANAS 14416">…</a>
```

At 360×800 its top edge lands ~104px from the bottom — inside the bottom 55% the roadmap requires, and inside comfortable thumb reach. It is 56×56.

Two mounting options:

- **Standalone.** Drop `.margin-crisis` anywhere; the built-in `calc()` centres it on the rule. On desktop with a classic scrollbar it can sit up to ~8px off, because `100vw` counts the scrollbar and the sheet does not. Invisible in practice for a 56px tab that overhangs the rule anyway.
- **Pixel-exact.** Wrap it in `.margin-rail`, which centres exactly as `.sheet` does.

`.ruled` (the ruled-line background) is a `repeating-linear-gradient`. **Apply it to the composer, not to the page.** A repeating gradient over a full-height scroll surface is paint the budget GPU does not need to do — though it is still an order of magnitude cheaper than the `backdrop-filter` it replaces.

---

## Marginalia

The single most important element in the system.

The AI's output is **a note in the margin, in a second ink**. It is not a card. A card frames the AI as an authority delivering a verdict; a margin note frames it as someone reading over your shoulder. That is the entire emotional difference between assessment and company, and it is the whole reason this design exists.

Non-negotiable:

| Marginalia has | Marginalia never has |
|---|---|
| `--ink-second` | a background fill |
| `--t-small` | a border box |
| a hanging rule | a shadow |
| a left indent | a corner radius |
| a lower-case source word | an icon in a circle, an "AI" badge, a score |

```html
<div class="annotated">
  <p>…the student's own words…</p>
  <aside class="marginalia">
    <span class="marginalia__src">noticed</span>
    …the note…
  </aside>
</div>
```

- **Below 62rem** — including the 360px canvas — the note is an inline aside directly under the paragraph, indented, with a hanging rule that sits outside the paragraph's left edge.
- **At and above 62rem** the note moves into a real outer column beside the text, exactly where it would be written in the margin of a page. Same classes; the layout does the work.

`.marginalia__src` names who is speaking in one lower-case word: *noticed*, *पढ़ा*. No colon, no icon. Never the word "Analysis". Never a number.

---

## Motion

The entire budget:

| Rule | Value |
|---|---|
| Properties | `transform` and `opacity` only |
| Duration | ≤ 200ms (`--dur: 180ms`, `--dur-fast: 120ms`) |
| Displacement | ≤ 8px (`--shift: 6px`) |
| Concurrency | one animated element at a time |
| Interruptible | always |
| `prefers-reduced-motion` | everything off |
| `transition: all` | **banned** — enumerate properties |
| `backdrop-filter` | **banned** |
| Celebration animation | does not exist |

Two classes, and that is all:

- **`.rise`** — the single entrance animation. Apply to **one container**. Do not stagger children: a five-step stagger is five animated elements, which is over budget several times over. It also makes a slow connection feel busier than it is.
- **`.pending`** — the one sanctioned looping indicator. One element, opacity only, no displacement. Use instead of a spinner or a shimmer.

`.skeleton` is now **static** — `--paper-sunk` with a hairline. The shimmer sweep it replaces was an infinite animation running on eight elements simultaneously.

Both are neutralised under `prefers-reduced-motion`, along with all `:active` transforms.

Worth adding to CI, per the roadmap's constraint table — a stylelint rule banning `transition: all`, `backdrop-filter`, and `filter: blur(` would catch regressions cheaply.

---

## Touch and the 360px canvas

**360 CSS px is the design canvas, not a breakpoint checked last.** It is ~18.5% of Indian mobile sessions, 2.2× the next bucket.

| Token | Value | For |
|---|---|---|
| `--tap` | 48px | every interactive target |
| `--tap-crisis` | 56px | crisis and panic affordances |
| `--tap-gap` | 8px | minimum gap between targets |

- `touch-action: manipulation` on every control — removes the 300ms double-tap-zoom delay without disabling zoom.
- `-webkit-tap-highlight-color` is a deliberate 18% marker wash, not the browser's default grey-blue box.
- Primary actions belong in the **bottom third**. `.action-dock` is the sticky bottom row for the composer; it respects `env(safe-area-inset-bottom)`.
- 200% zoom must produce no horizontal scroll. `overflow-wrap: break-word` and a `ch`-based measure handle the common cases; verify with Playwright at 180×400 as the roadmap specifies.

---

## Class inventory

### Kept — same name, redefined

| Class | Was | Now | Used by |
|---|---|---|---|
| `.field` | translucent white on dark | `--paper-sunk` well, 2px bottom rule, focuses to `--marker` | `JournalForm.tsx:83,138`, `ProblemSolver.tsx:102` |
| `.skeleton` | shimmering gradient sweep | static `--paper-sunk` block | `AnalysisSkeleton.tsx` (×8) |

### New

| Class | Purpose |
|---|---|
| `.sheet` | the content column, draws the margin rule |
| `.margin-crisis` | the permanent crisis tab in the margin |
| `.margin-rail` | optional pixel-exact shell for `.margin-crisis` |
| `.ruled` | ruled-line background (composer only) |
| `.measure` | 62ch cap |
| `.leaf`, `.leaf--raised`, `.leaf--plain` | a bounded block on the sheet — **the `.glass` replacement** |
| `.hairline` | rule divider |
| `.annotated` | paragraph + its margin note |
| `.marginalia`, `.marginalia__src` | the AI's second ink |
| `.entry` | the student's own writing surface |
| `.btn`, `.btn--marker`, `.btn--quiet` | buttons |
| `.action-dock` | sticky bottom action row |
| `.tap`, `.tap-crisis`, `.tap-row` | touch sizing |
| `.dimmer` | the luminance slider |
| `.rise` | the single entrance animation |
| `.pending` | the single looping indicator |
| `.text-spacious` | accessibility letter/word spacing, Latin only |
| `.visually-hidden` | screen-reader-only text |

### Renamed — update the call sites

| Old | New | Call sites |
|---|---|---|
| `.glass` | `.leaf` | `AnalysisCard.tsx:38`, `AnalysisSkeleton.tsx:5`, `JournalForm.tsx:50`, `ResultsPanel.tsx:33,103` |
| `.glass-soft` | `.leaf` (or `.leaf--plain`) | `ResultsPanel.tsx:118` |
| `.reveal` | `.rise` — **on the container only, drop the stagger** | `AnalysisCard.tsx:40,62,72,96,123` |
| `.card-enter` | `.rise` | `AnalysisCard.tsx:38`, `AnalysisSkeleton.tsx:5` |
| `.float-in` | `.rise` | `app/page.tsx:50,69` |
| `.hero-fade-up` | `.rise` | `Hero.tsx:110,115,126,135,156` |

### Removed — no replacement, by design

| Old | Why | Call sites |
|---|---|---|
| `.tilt` | 3D hover tilt. Paper does not tilt. | `AnalysisCard.tsx:38`, `JournalForm.tsx:50`, `ResultsPanel.tsx:33,103,118` |
| `.orb` | `filter: blur(50px)` on a floating div. The single most expensive thing on the page. | `app/page.tsx:33,37,41` |
| `.drift-a` `.drift-b` `.drift-c` | infinite drift animations | `Hero.tsx:64,73,82,91`, `app/page.tsx:33,37,41` |
| `.breathe` `.breathe-ring` | infinite pulse | `Hero.tsx:103,104,105` |
| `.bob` | infinite bob | `Hero.tsx:171`, `ResultsPanel.tsx:35` |
| `.pulse-once` | scale pulse on the "coping strategy" quote — a celebration animation on advice | `AnalysisCard.tsx:127` |
| `.hero-night` | twilight gradient stack | `Hero.tsx:56` |
| `.hero-stars` | animated star field | `Hero.tsx:60` |
| `input[type=range]` thumb rules | blue gradient thumb | replaced by `.dimmer` + `accent-color` |

Also gone from `body`: the four-layer radial-gradient twilight canvas and `background-attachment: fixed` (a known scroll-performance sink on mobile).

### The compatibility shim

`app/globals.css` §12 aliases every removed and renamed class so **the app is not unreadable mid-migration**. It maps surfaces to `.leaf`, entrances to `.rise` (killing inline stagger delays), and neutralises the atmosphere classes.

**Migration is done when §12 can be deleted outright** and nothing under `components/` or `app/` references those names. Delete it — leaving it is how a design system rots.

### Still hardcoded in components

139 hardcoded colour references across 13 files — `text-white`, `text-slate-*`, `border-white/10`, `from-[#5B8DEF]`, `to-[#7B6FE8]`, `#52C9A0`, `shadow-blue-200`. The shim cannot reach these; they need replacing by hand with `text-ink`, `text-ink-dim`, `border-rule`, `bg-marker`, etc. (all available as Tailwind utilities, see below).

`FOCUS_RING` is defined twice — `JournalForm.tsx:26` and `ProblemSolver.tsx:7` — as `focus-visible:ring-[#5B8DEF]`. Both can be deleted entirely: `:focus-visible` is now handled globally with `--marker`, which clears 4.9:1 against every surface at every dimmer position, well past the 3:1 focus requirement.

---

## Tailwind v4 integration

`globals.css` still starts with `@import "tailwindcss"`, unchanged. Added on top:

- **`@theme inline`** maps every token to a Tailwind utility. `inline` is required — it makes Tailwind emit `var(--paper)` rather than snapshotting the value at build time, so utilities keep tracking the dimmer and the register at runtime.
- **`@custom-variant lamplight`** for `lamplight:` prefixed utilities when you need a night-only override.

Available utilities:

```
bg-paper  bg-paper-raised  bg-paper-sunk  bg-marker  bg-marker-wash
text-ink  text-ink-dim     text-ink-second  text-marker  text-on-marker
border-rule  border-margin-rule
text-micro  text-small  text-body  text-lead  text-head  text-title
min-h-tap  min-h-tap-crisis  ps-margin
```

---

## How to apply this to a component

The rule of thumb: **ask what this element is on the page.** If it is the student's writing, it is `--ink` at `--t-lead`. If it is the app talking back, it is `--ink-second` at `--t-small` in the margin. If it is neither, it is probably `--ink-dim` and probably smaller than you think.

### Before — `AnalysisCard.tsx`

```tsx
<article className="tilt card-enter glass rounded-3xl overflow-hidden">
  <section className="reveal p-5 border-b border-white/10" style={delay(1)}>
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
      <SearchIcon size={14} className="text-[#5B8DEF]" /> What I&apos;m Noticing
    </h3>
    <p className="text-slate-200 text-sm leading-relaxed">
      {analysis.emotionalPatterns}
    </p>
  </section>
  {/* …four more staggered sections… */}
</article>
```

Everything wrong with this in one screenshot: a floating glass card that tilts under the cursor, five staggered entrance animations, an uppercase tracked-out label, an icon in brand blue, and the AI's reading of the student rendered at `text-sm` **inside a box below their words** — the exact card-as-verdict framing the whole design exists to avoid.

### After

```tsx
<div className="annotated rise">
  <p className="entry">{entry.text}</p>

  <aside className="marginalia">
    <span className="marginalia__src">noticed</span>
    <p>{analysis.emotionalPatterns}</p>
  </aside>
</div>
```

What changed and why:

| Change | Reason |
|---|---|
| `article.glass` → `div.annotated` | the AI note is not a peer object to the entry, it is an annotation on it |
| five `.reveal` → one `.rise` | motion budget: one animated element, not five |
| `tilt`, `card-enter` dropped | paper does not tilt or float |
| `.marginalia` instead of a section in a card | the whole thesis |
| `text-slate-200 text-sm` → `--ink-second` at `--t-small` | second ink, and it is measured at 7.61:1 minimum, not guessed |
| uppercase tracked `<h3>` → `.marginalia__src` | a lower-case annotation, not a section header announcing a verdict |
| `text-[#5B8DEF]` icon dropped | there is no brand blue, and the note does not need a badge |

The numbered gradient chips on stress triggers, the `.pulse-once` on the coping strategy, and the `MoodChart` all fall to the same rule: **no numbers, no charts, no celebration.** A trigger list is a `<ul>` in `--ink-second`. The coping strategy is a paragraph. The chart is not on the default surface at all.

---

## Verification

Contrast was computed, not asserted. The method:

1. Reimplement `color-mix(in oklab, …)` — sRGB → linear → LMS → Oklab → lerp → back, with gamut-clip detection.
2. Sample `--dim` at 201 positions for every token pair in both registers.
3. Report the minimum ratio and the position where it occurs.

Result: **all pairs pass at every position in both registers**, no gamut clipping. Tightest number in the system is 4.91:1.

The scratch script was deleted. To re-verify after any palette change, reimplement against the endpoint tables above — or better, per the roadmap's constraint table, make it a CI pass over rendered tokens so the floors cannot silently regress.

### Not verified here (no Node in this environment)

- Rendered output — no build was run. The CSS was parsed independently to confirm it is syntactically valid; the only unknown at-rule is `@theme`, which is Tailwind's and is handled by `@tailwindcss/postcss`.
- `ch`-derived widths depend on Hind's actual metrics; `--measure: 62ch` will shift slightly once the real font loads.
- Fallback font metric overrides are approximations. See §Fonts.
