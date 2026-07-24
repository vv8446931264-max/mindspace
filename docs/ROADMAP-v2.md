# MindSpace v2 — Research-Grounded Roadmap

**Written:** 25 July 2026
**Basis:** four parallel research passes (Indian student pain points, competitive/legal landscape, codebase inventory, UI/UX direction) plus a direct audit of the shipped crisis scanner.

---

## The uncomfortable headline

The strongest single finding in the research is about a product almost identical to ours.

**Sangath's PRIDE / POD Adventures** is the only Indian-validated adolescent mental health intervention at scale. Same app, two delivery modes:

| Delivery | Completion |
|---|---|
| Guided by a trained lay counsellor, in school | **92.7%** (230/248) |
| Unguided, remote, self-service | **0%** (0/11 enrolled) |

The authors' own conclusion: *"an online study format and remote delivery, rather than the app content, were the biggest barriers."*

MindSpace today is the second row. It is an unguided, remote, self-service wellness app. Every engineering decision in it is sound; the delivery model is the one the evidence says produces zero completion.

**Caveat, stated honestly:** that 0% arm was small (n=11), ran during the COVID second wave, in low-income Delhi schools with real device-access failures. Kota students have phones. The *magnitude* is not trustworthy; the *direction* is, and it is corroborated by the general market — ~95% of mental health app users abandon by day 30, median 30-day retention 3.3%.

This does not mean the work was wasted. The crisis-first architecture, deterministic/LLM separation, Zod guardrails, and accessibility work are genuinely rare and are the foundation everything below is built on. What has to change is the product's framing and delivery, not its engineering.

---

## P0 — Safety defects to fix before promoting the app

### P0.1 The crisis scanner has ~92% false-positive rate on realistic input

Audited by running the real `lib/crisisScanner.ts` against 12 plausible student journal lines. **11 of 12 fired a crisis card.** Recall is fine (3/3 genuine crisis lines caught); precision is the failure.

```
[severe]   "dying"              <- I'm dying to finish this organic chemistry chapter today.
[severe]   "dying"              <- My phone battery is dying and I still have two lectures left.
[distress] "pointless"          <- Rotational motion is pointless, doesn't even come in mains.
[distress] "give up"            <- I give up on this integration problem, moving to the next one.
[distress] "hopeless"           <- I felt hopeless about my rank but then I solved 20 questions.
[distress] "worthless"          <- This mock made me feel worthless at physics specifically.
[severe]   "end it"             <- I want to end it and just start the revision module fresh.
[severe]   "die"                <- Sir said if you give up now the last 2 years die with it.
```

Only *"Slept well, ate properly, finished 40 questions"* passed.

Three consequences, in order of severity:

1. **Cry-wolf on a suicide-prevention path.** A student who sees helplines after writing about a chemistry chapter learns the card is noise, and swipes past it on the night it matters. This is worse than having no card.
2. **It silently disables the product.** Crisis detection returns *before* the AI call. For most real entries MindSpace never analyses anything — it just shows helplines. The five-output analysis is unreachable for anyone who writes "I give up on this problem."
3. **The code comment asserts safety it does not have.** It claims word boundaries let us "safely catch short, high-signal words like die/dying." Word boundaries stop `studied` and `deadline`; they do nothing about `dying` as hyperbole, which is how Indian students actually speak.

**Fix:** single-keyword matching is the wrong model. Split the term list:
- **Standalone-safe** (explicit, rarely idiomatic): `kill myself`, `end my life`, `want to die`, `better off dead`, `no reason to live`, `cut myself`, `overdose`. Keep matching alone.
- **Requires first-person + intent context**: `die`, `dying`, `end it`, `give up`, `pointless`, `hopeless`, `worthless`, `nobody cares`, `done with everything`. Only fire when co-occurring with a first-person subject and absent an academic object (`this problem`, `this chapter`, `question`, `battery`, `phone`).

Ship the audit above as the regression test. Target: 0/12 false positives, 3/3 true positives retained. Err toward recall on the standalone-safe list; never on the contextual list.

### P0.2 Remove the streak counter

`AppHeader` displays it; `moodEngine.computeStreak` computes it.

The mechanism is loss aversion. Loss aversion is the presenting problem — this student already lives inside a counter that resets (rank, attempt number, gap year). We shipped a second one and called it care.

Worse, the semantics invert at exactly the wrong moment: the days a student skips journalling are, with near-certainty, their worst days. Our response to their worst week is to display a **0**.

There is no configuration of a resetting streak that avoids this. Replace with either nothing, or a plain "Last entry: Tuesday" with no elapsed-day arithmetic.

**Hard rule going forward:** no number in the UI may ever decrease as a consequence of user inaction.

### P0.3 Demote the mood chart from default

`MoodChart` renders a 7-day line graph on the main panel.

Self-monitoring of mood is documented to induce rumination and hypervigilance in a meaningful subset of users; the evidence on net effect is genuinely mixed, and the *variance* is the problem — it helps some and harms others and you cannot tell which in advance. For this population specifically, a line with a downward slope is one more thing grading them.

Make it opt-in, off by default, and never on the landing surface. If history is shown at all, show texture (what recurred, what helped), not trend.

### P0.4 Positioning and legal exposure

- **Telemedicine Practice Guidelines 2020**: only certified professionals may offer therapy online. Every user-facing string must stay in self-help/wellness framing. Audit for any word implying treatment.
- **CDSCO draft guidance (Oct 2025)** pulls AI software that *screens or scores severity* toward medical-device classification. Any "wellness index" or severity score walks into this. Do not build one.
- **Woebot shut down June 2025** citing exactly this regulatory path as unsustainable for a consumer chatbot. Treat as precedent, not trivia.

---

## P1 — The front door is wrong

Kota's own counselling data (TISS, n=1,051; 45% of students used counselling) on why students walked in:

| Stated reason | % |
|---|---|
| Time management | 45% |
| Low marks / performance | 35% |
| Exam nervousness | 31% |
| Academic stress | 29% |
| **Suicidal thoughts** | **17%** |

Students present **academically** and disclose emotionally only after. "Time management" is the socially acceptable door. That 17% eventually surface suicidal ideation inside an academically-framed service is the whole finding.

MindSpace's front door is a mood slider and twelve emotion tags. It requires the user to self-identify as mentally unwell before they can use it — which in a culture where the available label is *pagal* excludes precisely the students most at risk.

**P1.1 Ship an academic front door.** First-run is schedule, backlog triage, revision planning. Emotional support lives inside, always reachable, never the pitch.

**P1.2 Replace meditation-first with problem-solving-first.** The measured deficit in Kota students is coping *style*: ~50% avoidance coping in both coaching and non-coaching groups. Nobody taught them to approach problems. PRIDE's validated core is problem-solving (define → options → choose → act → review), effect size d=1.47. Mindfulness is the default import and does not touch avoidance coping.

**P1.3 Ban affirmations and topper stories.** Toxic positivity is explicitly and repeatedly resented by this cohort. Affirmation content tests well in Western samples and reads as gaslighting to a student in the C9 batch.

---

## P2 — Build for the calendar, not the daily habit

Distress here is **episodic and predictable**, not a smooth daily curve.

- Dr. Dinesh Sharma (400+ Kota students counselled, PhD): *"the majority of suicides happened on the day the result of the fortnightly exam was announced."* Kota Police independently report weekends, when weekly test results are distributed.
- Karnataka SSLC results helpline: **532 calls total — 49 before results, 452 on results day, 25 the next day.**
- Peak months of documented aspirant deaths: **September 16.5%, August 12.7%**. That is not exam season. **August–September is the season of deciding what your failure means and telling your family.** It is almost entirely unserved — the coaching institute has moved on to the next batch, the student has no institution, and the family conversation can no longer be deferred.

**P2.1 Result-day mode.** A pre-armed surface that activates on known national dates (JEE/NEET/board results, JoSAA and MCC round allotments) and on user-entered coaching test-result days.

**P2.2 "What happens next" answer engine.** The largest single crisis-call category in the Karnataka data was **informational (203/532)** — re-evaluation process, what a grade means, what options remain. Larger than emotional (191). In the acute post-result window, *"I don't know what my options are"* is an acute-risk state. Nobody treats it as one.

Content: re-evaluation windows, supplementary exams, mop-up and spot rounds, state quota vs AIQ, deemed universities, NIOS, BSc Nursing and paramedical entrance boards, state engineering counselling. Small-town students widely and wrongly believe non-NEET healthcare means expensive private colleges.

**P2.3 Pre-result inoculation, 72 hours out.** Structured rehearsal of the specific worst case — including the sentence they will say to their father. Telangana's results-day cluster notably hit *students confident of passing*: the trigger is shock and public exposure, not chronic hopelessness. Engage before the scheduled shock, not after distress.

**P2.4 Batch-demotion handler.** Let a student log "moved to a lower batch" and respond with the structural truth: teaching ratios are **1:30 in top batches vs 1:100–1:200 in regular batches** (TISS). The rank drop is a rationed system, not personal worthlessness. No external product knows what "I got moved to C batch" means.

---

## P3 — Language

**P3.1 Three options, Hinglish default.** 57.8% of surveyed Hindi speakers prefer Hindi written in Latin script; only 25.1% prefer Devanagari. Among frequent-Hindi users, 42% Latin vs 37% Devanagari. The surveys skew urban, English-literate, smartphone-owning — which is exactly our cohort, so the bias runs in our favour.

Ship **English / Hinglish (Latin) / हिन्दी**. Hinglish costs **zero additional font bytes**.

**P3.2 Never force a script on input.** Accept code-mixed text as-is. `spellcheck="false"` on the journal textarea — a wall of red squiggles under an honest sentence is a small cruelty, and Romanised Hindi spelling variance is the norm, not error.

**P3.3 Devanagari is expensive; lazy-load it.** Measured woff2 payloads: Noto Sans Devanagari 400 = **118 KB**; Hind 400 = **70 KB** (cheapest quality option, ITF, harmonised Devanagari+Latin in one family). Latin subsets are 13–16 KB. Standard subsetting advice does not transfer — Devanagari payload is dominated by conjunct ligatures and GSUB shaping tables, so realistic yield is **20–30%, not 90%**, and pruning wrongly breaks shaping rather than falling back.

Serve Latin always; load the Devanagari subset only when Hindi is selected. Two weights maximum.

**P3.4 Distress lexicons are safety-critical, not a localisation ticket.** Distress in Bhojpuri-inflected Hindi is lexically different from clinical Hindi. Given P0.1, our *English* lexicon is already wrong. Do not ship a second language's crisis detection until the first one is fixed and validated.

---

## P4 — The guided layer (the expensive, decisive one)

This is the 0% → 92.7% lever and the single most consequential decision in the roadmap.

Pair every user with a trained **lay guide** — not a clinician. Students explicitly asked for "student volunteers and peer-friendly staff" as first contact, trained by professionals, in non-clinical settings (canteen, library — *not* the psychiatry department). They distrusted existing institutional mentorship on confidentiality grounds.

**Recruit from the failure cohort**: people who dropped twice, took a state college seat, and are fine.

This breaks zero-marginal-cost self-service economics. That is the point — it is why incumbents don't do it, and why the evidence favours it.

**P4.1 Independence is the moat.** Kota's own institute counsellors say students won't talk to them. Bansal Classes' chief counsellor, on record: students don't share because those things *"might not be safe with them since they are the institute's employees."* A provably-not-reporting-to-the-institute service is something an institute-funded app structurally cannot copy.

---

## P5 — Family layer (largest greenfield)

The suicide notes are **apologies and exonerations**, not accusations: *"Sorry mummy papa par mai kisi cheez ke layak nahi hu."* *"neither my family nor NEET is to be blamed."*

**Design constraint that falls out of this:** asking "who is pressuring you?" will return "no one." The pressure has been fully internalised and relabelled as personal inadequacy. Do not ask that question.

**P5.1 A separate parent product, in Hindi.** Not a progress-sharing toggle. ~10,000 mothers now live in Kota accompanying their children; Allen's "Vatsalya" sessions drew 1,130 in a 30-day window. Parents control both the money and the shame. Every wellness app treats the parent purely as a privacy threat, which is only half true.

**P5.2 "The conversation" rehearsal.** Scripted, language-specific practice for: telling parents you want to quit; telling them your rank; telling them you want to drop again; telling them you want to do BSc Nursing instead. This is the August–September need.

**P5.3 Financial-guilt module with real numbers.** Families spend ₹15–20 lakh over five or six years. Show the actual odds — **only ~1 in 10 JEE Advanced *qualifiers* got an IIT seat**; ~5% of NEET candidates get MBBS; 98% of Kota aspirants fail — to reframe failure as a rationed system rather than personal fraud against the family.

---

## P6 — Privacy is physical, not legal

The threat model is not a hacker. It is a parent who paid the fees and a roommate two feet away. Hostels confiscate phones after 10pm; wardens check rooms; parents inspect devices.

**P6.1 Panic exit.** Copy GOV.UK's researched `Exit this page` mechanics exactly: bottom-anchored (they moved it from the top because top placement was itself a risk), `history.replaceState` so Back cannot return, triple-Shift keyboard trigger. Do not reinvent a trauma-informed component that has already been user-tested and published.

**P6.2 Installable PWA with user-chosen name and icon**, not a Play Store listing. A store install is a permanent, searchable artefact on a shared or parent-paid phone. Flipkart Lite (100 KB, 70% conversion lift, 63% of users on 2G) and Ola (200 KB, 300× smaller than native) show this works in exactly this market.

**P6.3 Content-free notifications.** Lock-screen previews must never contain mood, diagnosis, or mental-health vocabulary. Zero notifications and zero badges by default.

**P6.4 Audio off by default, always.** 68.2% of Indian adolescents preferred text over voice specifically because voice is intrusive in shared joint-family rooms. This also settles any future voice-input proposal: text is not a fallback here, it is the requirement.

**P6.5 DPDP Act 2023 + Rules 2025.** Under-18 is legally a child and requires **verifiable parental consent** via a specified mechanism (DigiLocker / Aadhaar-linked tokens), not a checkbox. Profiling and behavioural tracking of children are flatly prohibited. Enforceable **13 May 2027**. Most JEE/NEET aspirants are 15–19.

There is a possible healthcare-provider carve-out, but whether a non-clinical wellness app can rely on it is a live legal question that research cannot close. **Get counsel before writing the schema.** Building consent in now is cheaper than retrofitting.

---

## P7 — Visual and interaction overhaul

**The current dark glassmorphism should go.** Three independent reasons:

1. **Readability.** Positive polarity (dark text on light) is read faster and more accurately. Astigmatism affects 30–60% of people and high-contrast negative polarity causes halation — a glow around light text on dark. `backdrop-filter` plus light-on-dark is a halation generator, and long study hours make it worse.
2. **Cost.** `backdrop-filter` is one of the most expensive things you can ask a budget GPU to do. Our users are on 4–8 GB RAM vivo/realme/Xiaomi devices; Apple is not in India's top six vendors.
3. **It says nothing.** It is the house style of every AI wellness app shipped since 2023.

**Recommended direction — "Registers."** The thesis: *this is the page nobody grades.*

Every sheet of paper in this student's life — OMR sheets, rank lists, cutoff tables, red-pen corrections — is an instrument of evaluation. The ruled copy they write in for themselves is the one surface that isn't. Build the app as that surface.

This also rules out, by construction: dashboards, score rings, progress bars, red-as-status, and charts.

The load-bearing detail: **the AI's analysis renders as marginalia in a second ink** — set in the margin, smaller, alongside the student's own words, rather than in a card below them. A card frames the AI as an authority delivering a verdict. A margin note frames it as someone reading over your shoulder. That is the entire emotional difference between *assessment* and *company*, and it is the right call for a product whose users are drowning in assessment.

Graft in two things: a continuous **dimmer** (a luminance control, not a light/dark toggle — it solves the shared-room problem) and a **no-numbers rule** enforceable in CI.

### Hard constraints (each testable)

| Constraint | Test |
|---|---|
| FCP ≤ 1.8s, TTI ≤ 5s on Moto-G-class CPU throttle over Slow 4G | Lighthouse mobile in CI |
| Critical path ≤ 150 KB; first-load JS ≤ 100 KB compressed | `size-limit` in CI |
| Journal entry writes, saves, re-reads fully offline | Playwright `setOffline(true)` |
| Crisis affordance on 100% of routes, bottom 55% of a 360×800 viewport, ≥56×56px, Tele-MANAS 14416 in one tap | Per-route assertion on position/size/`href^="tel:"` |
| No number decreases from user inaction | CI grep for streak/consecutive/days-since |
| Body contrast ≥ 7:1 at every dimmer position | Automated pass over rendered tokens |
| Animation: transform/opacity only, ≤200ms, ≤8px, one at a time, absent under `prefers-reduced-motion` | stylelint ban on `transition: all` and `backdrop-filter` |
| No Devanagari woff2 request in an English or Hinglish session | Network assertion |
| Usable one-handed at 360px and at 200% zoom, no horizontal scroll, zoom never disabled | Playwright at 360×800 and 180×400 |

**Note on the JS budget:** a hello-world Next.js 15 App Router build is already **~105 kB First Load JS** before any of our code — over the entire budget. Either the journal composer and crisis panel ship as server components with zero client JS, or the framework itself is on the table. The product is a textarea, a save, a fetch, and a read view.

**360 CSS px is the design canvas, not a breakpoint checked last** — it is ~18.5% of Indian mobile sessions, 2.2× the next bucket.

**Design for the 11pm post-cap case.** India leads the world at 21.2 GB/subscriber/month on almost universally *daily-capped* plans; after the cap, speed drops to **64 kbps**. The median 131 Mbps figure is a trap. Late night, post-cap, on congested hostel wifi is exactly when a wellness app gets opened.

---

## DO NOT BUILD

- **Unsupervised LLM as crisis responder.** A psychiatrist stress-testing 10 popular chatbots as a fictional distressed 14-year-old reported several urged suicide. India has no regulator — CDSCO/MDR 2017 do not cover standalone health apps. See also the Character.AI wrongful-death litigation: minor + companion AI + crisis is our exact fact pattern.
- **Risk detection with nowhere to escalate.** Tele-MANAS has ~1,900 counsellors nationally against a reported 40% budget cut; there are **fewer than 50 child and adolescent psychiatrists in India**. Detecting risk and handing over a number that doesn't answer teaches the student that reaching out failed.
- **Any parent-notification that isn't 100% student-controlled.** Given documented parental ultimatums (*"either achieve something or don't return home"*), auto-notifying a parent of suicidal ideation could be the precipitating event. Never auto-notify.
- **Streaks, scores, or leaderboards on wellbeing.** Recreating the ranking mechanism that is harming them.
- **Predictive risk scores visible to institutions.** A coaching centre that knows which students are high-risk has a commercial incentive to remove them.
- **PHQ-9 / GAD-7 self-service.** Telling a 17-year-old they are "severely depressed" with no clinician, no follow-up, and a parent who might see the screen.
- **Marketing on Kota's death toll.** Suicide-contagion effects are established, the number is disputed by ±50%, and the students we want to reach will read it as "people like me die."

---

## Where the research is soft

Stated so nobody builds on sand:

- **Kota's 2023 death count** has seven different published figures (22–32). Any claim resting on a specific number is unsafe. Contributing cause: the Supreme Court found police were refusing to register FIRs.
- **Whether 2023–25 interventions worked is unknowable from current data.** Deaths fell 22–32 → 17 → 14, but the student population also roughly halved (2–2.5 lakh → 85k–1.25 lakh) and revenue fell from ₹6,500–7,000 crore to ₹3,500 crore. Nobody separates these. Admissions are up 20–30% for 2026–27, so this is about to be re-tested.
- **"80% of Kota students have anxiety, 40% depression"** circulates widely, including in a 2026 peer-reviewed paper, but could not be traced to a primary study with a stated sample and instrument. Use TISS (n=1,051) and the n=180 comparative study instead.
- **NCRB attributes a single cause per death** and recorded exactly one transgender suicide in 2022. Treat as a floor, not a measurement. Notably, "exam failure" as a recorded cause is *shrinking* as a share even as total student suicides rise — the popular narrative is right about the environment and wrong about the proximate cause.
- **Caste dynamics inside coaching hubs are unstudied.** Strong evidence post-admission (58% of 122 IIT/NIT/IISc suicides 2014–21 were from SC/ST/OBC/minority communities); essentially none from inside Kota.
- **LGBTQ+ students in coaching hubs: zero research.** A closeted student in a shared hostel room with no privacy and no exit is a plausibly extreme-risk profile that nobody is measuring.

---

## Sequencing

| Phase | Scope | Gate |
|---|---|---|
| **P0** | Crisis scanner precision, remove streak, demote chart, positioning audit | Before any further promotion of the live app |
| **P1** | Academic front door, problem-solving core | Before claiming the product fits the user |
| **P2** | Result-day mode, "what happens next", pre-result inoculation | Before the next result cycle |
| **P3** | Hinglish default, Devanagari lazy-load | After P0 (English lexicon must be correct first) |
| **P7** | Visual overhaul to "Registers" | Can run parallel to P1–P2 |
| **P6** | Panic exit, PWA, DPDP consent | Before any under-18 launch. Legal counsel first. |
| **P4** | Guided lay-counsellor layer | The strategic bet. Requires people and money. |
| **P5** | Parent product, institution compliance layer | After P4 proves the guide model |

P0 is days of work. P4 changes what the company is.
