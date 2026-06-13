# MindSpace — Live Tracker

## Live URL

**https://mindspace-1053195634368.us-central1.run.app**

GitHub: **https://github.com/vv8446931264-max/mindspace**

## Quality Snapshot (latest)

- **91 tests passing** across 8 suites (unit + Zod + jest-axe + component interaction)
- ESLint clean (0 warnings), `tsc --noEmit` clean, production build clean
- All source files < 200 lines; `page.tsx` is a 60-line composition layer
- Security headers incl. HSTS + hardened CSP verified live
- UI: Plus Jakarta Sans, gradient mesh background, staggered analysis reveal,
  skeleton loader, gradient cards — responsive + reduced-motion safe

---

## Status Checklist

### Phase 1 — Skeleton + Live Deploy ✅

- [x] Next.js 15.5.19 scaffold complete
- [x] Exact dependency versions set in package.json
- [x] Domain types written (types/index.ts)
- [x] Zod schemas written (schemas/)
- [x] Full page.tsx with all UI states
- [x] /api/analyze route complete
- [x] .env.local created, .env.example committed
- [x] .gitignore correct (env.local, node_modules, .next excluded)
- [x] Git repo initialized, pushed to GitHub (public, single branch main)
- [x] Cloud Run first deploy successful — **200 OK confirmed**

### Phase 2 — Core AI Vertical Slice ✅

- [x] crisisScanner.ts complete (keyword list + scan function)
- [x] 15 crisis scanner unit tests passing
- [x] vertexClient.ts complete (ADC, no API key, JSON response mode)
- [x] /api/analyze route complete (2KB cap, Zod, crisis bypass, cache, rate limit, headers)
- [x] moodEngine.ts complete (trend, streak, frequency, correlation)
- [x] 16 mood engine unit tests passing
- [x] storage.ts complete (Zod-validated on read, 90-day cap, no raw text)
- [x] MoodPicker.tsx — keyboard nav, aria attributes
- [x] EmotionPicker.tsx — chips, max 3, keyboard toggle
- [x] AnalysisCard.tsx — 5 sections, fade+slide animation
- [x] CrisisCard.tsx — hardcoded helplines, warm tone, tel: links
- [x] MoodChart.tsx — pure SVG + sr-only table
- [x] **CHECKPOINT: Real AI response verified:**
  - Triggers: "Bombed JEE Physics mock", "Parental pressure regarding JEE ranks"
  - Coping: "Targeted Review & Short Break" with JEE-specific relevance
  - Mindfulness: Box Breathing for Focus, 5 steps
  - Message: "Your 14 hours aren't wasted" — exam-specific and warm

### Phase 3 — Harden ✅

- [x] Body size cap 2KB verified in route.ts
- [x] Rate limit: 10 req/min/IP (in-memory)
- [x] `grep NEXT_PUBLIC_GCP` = 0 results ✅
- [x] Security headers on ALL responses (via next.config.mjs):
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
  - Content-Security-Policy set
- [x] No stack traces in error responses
- [x] LRU cache (200 entries, TTL 30min)
- [x] Request coalescing (in-flight Map)
- [x] localStorage batched on mount
- [x] All aria attributes: aria-live, aria-busy, aria-valuemin/max/now on sliders
- [x] **CHECKPOINT: npm test — 31/31 green**

### Phase 4 — Polish + Pitch ✅

- [x] CSS range slider theming (blue thumb, smooth gradient)
- [x] Demo-safe crisis mode (?demo=crisis URL param)
- [x] DEMO MODE badge in header when active
- [x] AnalysisCard fade+slide animation (instant under prefers-reduced-motion)
- [x] Crisis helplines always visible at bottom of page
- [x] README complete
- [x] 90-second demo script written (see below)

---

## Security Self-Assessment

| Area | Grade | Evidence |
|------|-------|---------|
| Input validation (Zod) | A | All fields Zod-validated before processing |
| Body size cap | A | 2KB cap in route.ts before JSON parse |
| Rate limiting | B | 10/min/IP in-memory (resets on restart) |
| No GCP keys in browser | A | `grep NEXT_PUBLIC_GCP` = 0 results |
| AI output sanitized | A | Zod transform trims all fields, no dangerouslySetInnerHTML |
| Security headers | A | 5 headers on all routes, confirmed via curl |
| Crisis card hardcoded | A | Server returns static JSON, never LLM output |
| No stack traces leaked | A | All errors return user-safe messages |

## Mental Health Safety Self-Assessment

| Check | Status |
|-------|--------|
| Crisis detection runs before AI call | ✅ Server-side + client-side |
| Crisis card shows hardcoded helplines | ✅ iCall + Vandrevala always present |
| Disclaimer always visible on AI responses | ✅ Server-injected, never LLM-generated |
| Raw journal text never persisted | ✅ Only mood/emotions/hours in localStorage |
| AI never diagnoses or prescribes | ✅ System prompt + Zod enforcement |
| Crisis path tested end-to-end | ✅ "want to die" → crisis card, AI never called |

## Git Log Clean Check

```
ac5e1b7 feat: demo mode toggle, polished styles, range slider theming
bf0b3d3 feat: add global security headers and clean up debug logging
940180f fix: resilient Zod schema with trim transforms for AI output
d4db012 fix: increase token limit and use JSON response mode for Gemini
8303736 fix: convert next.config.ts to .mjs for Cloud Run compatibility
3b51de4 feat: initial MindSpace wellness tracker
```
✅ No AI tool names, no co-authored-by trailers.

---

## Known Limitations

| Limitation | Risk | Upgrade Path |
|-----------|------|-------------|
| Rate limit resets on Cloud Run restart | Low | Redis for production |
| In-memory cache not shared across instances | Low | Redis or Firestore |
| English-only UI | Medium | i18n with next-intl |
| Crisis scanner keyword-based | Medium | ML classifier in v2 |
| No user accounts | Low | NextAuth in v2 |

---

## 90-Second Demo Script

**Setup:** Open https://mindspace-1053195634368.us-central1.run.app

**[0–10s]** "This is MindSpace — an AI wellness companion for students preparing for India's toughest exams. Meet Arjun, 18, JEE aspirant in Kota. He's been studying 14 hours a day and just bombed his physics mock."

**[10–20s]** Select **JEE** from dropdown. Drag mood to **2**. Click **Burnt out**, **Exhausted**, **Anxious**.

**[20–30s]** "First, I want to show you the safety feature." Type: **"Failed my mock test again, feel like giving up"** → Hit **Analyze my day**.

**[30–40s]** Crisis card appears instantly. "The app detected a distress signal — no AI was called. It shows verified helplines: iCall and Vandrevala Foundation, available 24/7. This is hardcoded. The AI cannot touch it."

**[40–45s]** Clear the entry. Type: **"Bombed my physics mock today. Rotational dynamics is destroying me. 14 hours of study and I still can't solve it. Parents keep asking about ranks."**

**[45–55s]** Hit Analyze. Watch spinner. **[Results appear]**

**[55–80s]** Walk through each section:
- "Stress triggers: Gemini identified rotational dynamics specifically — not generic stress"
- "Emotional pattern: non-diagnostic observation — 'your 14 hours aren't wasted'"
- "Coping strategy: Targeted Review — with JEE-specific exam relevance"
- "5-step Box Breathing exercise"
- "Message: 'Your 14 hours aren't wasted' — exam-specific, warm"

**[80–90s]** Point to mood chart. "History tracked locally — no server storage, no login. All of this in under 3 seconds. MindSpace understands the student."

---

## Submission Requirements Checklist

- [x] GitHub repo is public — https://github.com/vv8446931264-max/mindspace
- [x] Repo has single branch only (main)
- [x] Repo size < 10 MB — verified
- [x] README contains: vertical, approach, logic, how it works, assumptions
- [x] Deployed link live without login — https://mindspace-1053195634368.us-central1.run.app
- [x] Crisis helpline numbers visible in app UI (bottom of page, always)
- [x] .env.local NOT committed — `git ls-files | grep env` = 0
- [x] git log — no AI tool names in any commit

## Stretch Goals (post-submission)

- Streak calendar view (GitHub-style heatmap)
- Emotion trend visualization over 30 days
- Exam-day countdown with adaptive advice intensity
- PWA with offline support
- Hindi/regional language support
- Redis cache for multi-instance production deployment
