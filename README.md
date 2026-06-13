# 🧠 MindSpace — AI Mental Wellness Companion for Exam Students

> A Generative-AI journaling companion that turns a student's raw emotional prose into
> structured, exam-specific wellness support in under 3 seconds — with crisis safety
> built in at the core.

**Live demo:** https://mindspace-1053195634368.us-central1.run.app

---

## The Challenge

Students preparing for India's highest-stakes exams — **JEE, NEET, CUET, CAT, GATE,
UPSC** — face severe stress, burnout, and self-doubt. Standard mood trackers reduce a
14-hour day of struggle to a single emoji and miss the *why* entirely. MindSpace uses
GenAI to read open-ended journal entries, surface hidden stress triggers and emotional
patterns, and respond with hyper-personalized, contextual support — acting as an
empathetic, always-available digital companion.

## Chosen Vertical

Student mental wellness during high-stakes Indian competitive exams.

## Approach & Logic

The hard problem — turning fuzzy emotional prose into structured wellness insight — is
handled by **Google Gemini 2.5 Flash via Vertex AI**. Everything deterministic (crisis
detection, mood trends, streaks, emotion frequency, study-vs-mood correlation) is **pure
TypeScript**, never the LLM. Every AI response is forced through a strict **Zod schema**
with a self-correcting retry and a safe fallback, so hallucinated or malformed output is
*structurally impossible* to reach the UI.

A deterministic **crisis scanner runs before every AI call**. On any distress signal the
AI is bypassed entirely and verified Indian helplines are shown instead — the LLM never
responds to a crisis.

## How It Works

```
Student writes journal entry
        │
        ▼
Crisis scan (pure TS) ──► CRISIS ──► Hardcoded helpline card (AI never called)
        │
        ▼ safe
POST /api/analyze  (2KB cap · Zod validation · rate-limited · cached)
        │
        ▼
Gemini 2.5 Flash (exam-context system prompt) ──► Zod validate ──► retry ──► fallback
        │
        ▼
5 outputs rendered simultaneously, no reload:
  🎯 Stress triggers   🔍 Emotional pattern   💪 Coping strategy
  🧘 Mindfulness exercise   ✨ Motivational message
        │
        ▼
Mood history saved to localStorage (scores only — raw text never persisted)
```

## Key Features

- **Five exam-aware outputs** generated from one journal entry
- **Crisis safety contract** — deterministic detection, hardcoded helplines, AI bypass
- **Privacy by design** — raw journal text is processed server-side and never stored
- **7-day mood trend** chart (pure SVG, with a screen-reader data table)
- **Streak + average mood** tracking, computed in pure TypeScript
- **Resilient AI** — Zod-validated, self-correcting retry, safe fallback
- **Fully accessible** — keyboard-operable, AA contrast, `aria-live`, reduced-motion, skip link

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript 5 (strict, zero `any`) |
| Styling | Tailwind CSS 4 |
| AI | Google Gemini 2.5 Flash via Vertex AI (ADC — no API keys) |
| Validation | Zod |
| Tests | Vitest + jest-axe |
| Hosting | Google Cloud Run |

## Run Locally in 60 Seconds

```bash
# 1. Install dependencies
npm install

# 2. Authenticate with GCP (one-time — uses Application Default Credentials)
gcloud auth application-default login

# 3. Configure environment
cp .env.example .env.local
#   then set GCP_PROJECT_ID in .env.local to your project

# 4. Start the dev server
npm run dev
# open http://localhost:3000
```

## Run the Tests

```bash
npm test          # all unit tests + jest-axe accessibility smoke test
```

## Deploy to Cloud Run

```bash
gcloud run deploy mindspace \
  --source . \
  --project YOUR_GCP_PROJECT_ID \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --set-env-vars "GCP_PROJECT_ID=YOUR_GCP_PROJECT_ID,GCP_LOCATION=us-central1,GCP_GEMINI_MODEL=gemini-2.5-flash"
```

The Cloud Run service account needs `roles/aiplatform.user` to call Vertex AI.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GCP_PROJECT_ID` | Yes | — | Your GCP project ID |
| `GCP_LOCATION` | No | `us-central1` | Vertex AI region |
| `GCP_GEMINI_MODEL` | No | `gemini-2.5-flash` | Gemini model name |

Authentication is **Application Default Credentials only** — there are no API keys in the
codebase, and no `NEXT_PUBLIC_GCP_*` variables (GCP config never reaches the browser).

## Project Structure

```
app/
  page.tsx            Thin composition layer
  layout.tsx          Root layout + metadata
  api/analyze/        POST endpoint: validate → crisis → cache → AI
components/           Presentational UI (form, results, cards, chart, header)
lib/
  useWellness.ts      Form state + submit pipeline (custom hook)
  vertexClient.ts     Gemini call + Zod guardrail + retry + fallback
  crisisScanner.ts    Deterministic crisis detection (no LLM)
  moodEngine.ts       Trend, streak, frequency, correlation (no LLM)
  cache.ts            LRU cache + in-flight request coalescing
  rateLimit.ts        Per-IP rate limiter
  storage.ts          localStorage (Zod-validated, 90-day cap)
schemas/              Zod schemas for API request + AI response
types/                Shared domain types
tests/                Vitest unit tests + jest-axe smoke test
docs/                 PRD, tech spec, schema, app flow, design, tracker
```

## Assumptions

- Students have phone/laptop access during study breaks
- English-language input (v1)
- No login required — privacy by design, no server-side data storage
- Target users are 16–25, preparing for the listed Indian competitive exams

---

## ⚠️ Mental Health Disclaimer

**MindSpace is an AI wellness companion, not a substitute for professional mental health
care.** If you are in crisis or experiencing thoughts of self-harm, please reach out:

- **iCall:** 9152987821 (Mon–Sat, 8am–10pm IST)
- **Vandrevala Foundation:** 1860-2662-345 (24/7)
- **Emergency:** 112

These helplines are surfaced automatically inside the app whenever a distress signal is
detected.
