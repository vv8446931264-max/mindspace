// English catalogue. This file is the SOURCE OF TRUTH for the key set — every
// other locale is typed as Record<StringKey, string>, so a key added here and
// not translated is a compile error, not a runtime blank.
//
// Editorial rules that apply to all three locales:
//  - No affirmations, no "you've got this", no topper/success-story framing,
//    no exclamation-mark cheerfulness. This cohort explicitly resents it.
//  - Grade 6–8 reading level. Short clauses.
//  - Crisis and helpline copy is the most carefully written text in the app.
//    Someone may read it on the worst night of their life. Warm, direct,
//    concrete; no euphemism, no clinical register.

export const en = {
  // ── Shell ────────────────────────────────────────────────────────────────
  "app.name": "MindSpace",
  "app.tagline": "AI wellness companion",
  "app.demoBadge": "DEMO MODE",

  "locale.label": "Language",
  // Language names are endonyms — never translated. All three locales show the
  // same three labels, so a user who cannot read the current UI can still find
  // their own language.
  "locale.name.en": "English",
  "locale.name.hiLatn": "Hinglish",
  "locale.name.hi": "हिन्दी",

  "nav.skipToForm": "Skip to journal form",

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.sectionAria": "Welcome to MindSpace",
  "hero.eyebrow": "For JEE · NEET · CUET · CAT · GATE · UPSC",
  "hero.titleLead": "A quiet place to put",
  "hero.titleAccent": "down the weight.",
  "hero.subtitle":
    "Write one honest line about your day. MindSpace works out what is draining you, and hands back one calmer next step.",
  "hero.ctaPrimary": "Start writing",
  "hero.ctaSecondary": "How it works",
  "hero.trust": "Private by default · Verified Indian helplines built in",
  "hero.scrollCue": "Begin",
  "hero.scrollAria": "Scroll to start journaling",
  "hero.card.trigger": "Trigger: mock-test scores",
  "hero.card.breathing": "4-minute breathing reset",
  "hero.card.private": "Nothing here is shared or scored.",
  "hero.card.crisisSafe": "Crisis-safe by design",

  // ── Journal form ─────────────────────────────────────────────────────────
  // Academic front door: students walk in saying "time management" and "low
  // marks". The copy must not ask anyone to self-identify as mentally unwell
  // before they can use the app. See docs/ROADMAP-v2.md P1.
  "form.sectionAria": "Journal entry form",
  "form.title": "Today's check-in",
  "form.subtitle": "Start with the work. Nothing here is shared with anyone.",
  "form.examLabel": "I'm preparing for",

  "form.studyHours.label": "Study hours today",
  "form.studyHours.value": "{hours}h",
  "form.studyHours.scaleLow": "0h",
  "form.studyHours.scaleMid": "9h",
  "form.studyHours.scaleHigh": "18h",
  "form.studyHours.aria": "{hours} hours",

  "form.journalLabel": "What's on your mind?",
  "form.journalPlaceholder":
    "Write freely — how did today go? What's weighing on you? What went well?",
  "form.journalHint": "Be specific — more context means better insights",
  "form.charCountAria": "{used} of {max} characters used",

  "form.feelings.summary": "Add how you're feeling",
  "form.feelings.optional": "optional",

  "form.submit": "Analyse my day",
  "form.submitting": "Reading your day…",

  // ── Exam contexts ────────────────────────────────────────────────────────
  "exam.JEE": "JEE",
  "exam.NEET": "NEET",
  "exam.CUET": "CUET",
  "exam.CAT": "CAT",
  "exam.GATE": "GATE",
  "exam.UPSC": "UPSC",
  "exam.Board": "Board exams",
  "exam.Other": "Something else",

  // ── Mood ─────────────────────────────────────────────────────────────────
  "mood.label": "How are you feeling today?",
  "mood.scaleLow": "Low",
  "mood.scaleHigh": "Good",
  "mood.aria": "Mood {value} out of 10 — {label}",
  "mood.level.1": "Really low",
  "mood.level.2": "Low",
  "mood.level.3": "Struggling",
  "mood.level.4": "Meh",
  "mood.level.5": "Okay",
  "mood.level.6": "Decent",
  "mood.level.7": "Good",
  "mood.level.8": "Great",
  "mood.level.9": "Really good",
  "mood.level.10": "Best in a while",

  // ── Emotions ─────────────────────────────────────────────────────────────
  "emotion.legend": "How you're feeling",
  "emotion.hint": "(up to 3, or skip)",
  "emotion.maxReached": "Max 3 selected",
  "emotion.groupAria": "Emotion tags",
  "emotion.conflict": "Hard to feel {a} and {b} at the same time.",
  "emotion.anxious": "Anxious",
  "emotion.overwhelmed": "Overwhelmed",
  "emotion.hopeful": "Hopeful",
  "emotion.focused": "Focused",
  "emotion.burnt_out": "Burnt out",
  "emotion.motivated": "Motivated",
  "emotion.lonely": "Lonely",
  "emotion.calm": "Calm",
  "emotion.frustrated": "Frustrated",
  "emotion.confident": "Confident",
  "emotion.exhausted": "Exhausted",
  "emotion.numb": "Numb",

  // ── Guided problem-solving ───────────────────────────────────────────────
  // Hints are practical, never encouraging. Placeholders are concrete and
  // exam-flavoured so the student sees the expected size of an answer.
  "solver.sectionAria": "Work through a problem",
  "solver.title": "Work through one thing",
  "solver.stepCount": "Step {current} of {total}",
  "solver.stepAnswered": ", {done} answered",
  "solver.next": "Next",
  "solver.back": "Back",
  "solver.done": "Done",
  "solver.plan.sectionAria": "Your plan",
  "solver.plan.title": "Your plan",
  "solver.plan.restart": "Work through another one",

  "solver.define.question": "What's the one thing bothering you most right now?",
  "solver.define.placeholder":
    "Physics backlog is three chapters deep and the next test is Sunday.",
  "solver.define.hint":
    "One thing, not everything. The most concrete version you can write.",

  "solver.options.question": "What could you actually do about it? List a few.",
  "solver.options.placeholder":
    "Skip rotational motion for now. Ask Rohit for his notes. Tell sir I'm behind. Do past-year questions only.",
  "solver.options.hint":
    "Bad options count. Write them anyway — the point is having more than one.",

  "solver.choose.question": "Which one will you try first?",
  "solver.choose.placeholder": "Past-year questions only, for rotational motion.",
  "solver.choose.hint":
    "Pick the one you could start today, not the one that sounds best.",

  "solver.act.question": "What's the first small step, and when?",
  "solver.act.placeholder": "Tonight after dinner, 40 minutes, 2019 and 2020 papers.",
  "solver.act.hint": "Small enough that you'd be embarrassed to fail at it.",

  "solver.review.question": "How will you know if it worked?",
  "solver.review.placeholder":
    "If I can do a rotational motion question without opening the module.",
  "solver.review.hint": "Something you can actually check. Not a feeling.",

  // ── Wellness flags ───────────────────────────────────────────────────────
  "flag.moodHighEmotionsHeavy":
    "Your mood is high but your feelings read heavy — just checking that's right?",
  "flag.moodLowEmotionsUpbeat":
    "Your mood is low but your feelings sound light — just making sure?",
  "flag.overwork": "That's a long study day. Rest is part of preparation too.",

  // ── Crisis ───────────────────────────────────────────────────────────────
  "crisis.title": "You don't have to handle this alone",
  "crisis.message":
    "What you're feeling right now is real. It can get lighter, even if tonight it doesn't feel that way. No exam, no rank, no result is worth more than you are. Please talk to someone now — the people on these numbers are trained to listen, it's free, and what you say does not go anywhere else.",
  "crisis.helplinesIntro": "You can call right now. It's free:",
  "crisis.emergency": "If you're in danger right now, call {number}",

  // ── Helplines ────────────────────────────────────────────────────────────
  "helpline.heading": "Mental health support · India",
  "helpline.callAria": "Call {name} at {number}",
  "helpline.telemanas.name": "Tele-MANAS (Govt of India)",
  "helpline.telemanas.short": "Tele-MANAS",
  "helpline.telemanas.hours": "24/7 · free · 20+ languages",
  "helpline.telemanas.aria":
    "Call Tele-MANAS government helpline at 14416, available 24 hours",
  "helpline.icall.name": "iCall (TISS)",
  "helpline.icall.short": "iCall",
  "helpline.icall.hours": "Mon–Sat, 8am–10pm IST",
  "helpline.icall.aria": "Call iCall helpline at 9152987821",
  "helpline.vandrevala.name": "Vandrevala Foundation",
  "helpline.vandrevala.short": "Vandrevala",
  "helpline.vandrevala.hours": "24/7 · call or WhatsApp",
  "helpline.vandrevala.aria":
    "Call Vandrevala Foundation at 9999666555, available 24 hours",

  // ── Analysis ─────────────────────────────────────────────────────────────
  "analysis.triggers": "What's adding to the load",
  "analysis.patterns": "What I'm noticing",
  "analysis.coping": "Something to try",
  "analysis.exercise": "{minutes}-minute practice",
  "analysis.message": "One thing worth saying",
  "analysis.duration": "{minutes} min",
  "analysis.disclaimer":
    "This is an AI wellness companion — not a replacement for a doctor or counsellor.",
  "analysis.loading": "Reading your day…",
  "analysis.loadingAria": "Reading your day",

  // ── Results panel ────────────────────────────────────────────────────────
  "results.sectionAria": "Wellness insights",
  "results.liveAria": "Analysis results",
  "results.idle.title": "Your insights will appear here",
  "results.idle.body":
    "Write a few honest lines about today. What comes back shows up here in a few seconds.",
  "results.idle.chip.triggers": "Stress triggers",
  "results.idle.chip.coping": "Coping plan",
  "results.idle.chip.mindfulness": "Mindfulness",
  "results.idle.chip.nextStep": "A clear next step",
  "results.history.toggle": "Show my past entries",

  // ── Mood chart ───────────────────────────────────────────────────────────
  "chart.heading": "7-day mood trend",
  "chart.empty": "Log your first entry to see your trend",
  "chart.aria": "7-day mood trend chart",
  "chart.caption": "7-day mood trend",
  "chart.col.date": "Date",
  "chart.col.day": "Day",
  "chart.col.mood": "Mood (1–10)",
  "chart.notLogged": "Not logged",
  "chart.day.sun": "Sun",
  "chart.day.mon": "Mon",
  "chart.day.tue": "Tue",
  "chart.day.wed": "Wed",
  "chart.day.thu": "Thu",
  "chart.day.fri": "Fri",
  "chart.day.sat": "Sat",

  // ── Errors ───────────────────────────────────────────────────────────────
  "error.rateLimit": "Too many requests — wait a moment, then try again.",
  "error.generic": "Something went wrong. Please try again.",
  "error.network": "Connection problem — check your network and try again.",
  "error.dismiss": "Dismiss",

  // ── Validation ───────────────────────────────────────────────────────────
  "validation.text.min": "Please write at least 10 characters",
  "validation.text.max": "Entry too long — 1000 characters maximum",
  "validation.mood.min": "Mood must be at least 1",
  "validation.mood.max": "Mood must be at most 10",
  "validation.emotions.min": "Select at least one feeling",
  "validation.emotions.max": "Select at most 3 feelings",
  "validation.studyHours.min": "Study hours cannot be negative",
  "validation.studyHours.max": "Study hours cannot be more than 18",
} as const satisfies Record<string, string>;
