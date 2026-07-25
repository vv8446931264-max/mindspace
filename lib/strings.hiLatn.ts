// Hinglish — Hindi in Latin script. The DEFAULT locale for India.
//
// This is not romanised formal Hindi. It is how this cohort actually types:
// English stays English for exam and technical vocabulary (mock test, rank,
// syllabus, backlog, counselling, module, past-year, score, plan, step), Hindi
// carries the emotional and connective register. "Aaj ka din kaisa raha?", not
// "Aaj ka divas kaisa vyateet hua?".
//
// Register: "aap" with -iye/-ein imperatives, and pronoun-free phrasing wherever
// it reads naturally — which is most of the time, and is also the most natural
// Hinglish. Verb forms are kept gender-neutral throughout: we do not know the
// student's gender and must never guess at it in a mental-health context.

import type { StringCatalogue } from "@/lib/strings";

export const hiLatn: StringCatalogue = {
  // ── Shell ────────────────────────────────────────────────────────────────
  "app.name": "MindSpace",
  "app.tagline": "AI wellness saathi",
  "app.demoBadge": "DEMO MODE",

  "locale.label": "Bhasha",
  "locale.name.en": "English",
  "locale.name.hiLatn": "Hinglish",
  "locale.name.hi": "हिन्दी",

  "nav.skipToForm": "Seedhe journal form par jaayein",

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.sectionAria": "MindSpace mein aapka swagat hai",
  "hero.eyebrow": "JEE · NEET · CUET · CAT · GATE · UPSC ke liye",
  "hero.titleLead": "Bojh utaarne ki",
  "hero.titleAccent": "ek shaant jagah.",
  "hero.subtitle":
    "Apne din ke baare mein ek sacchi line likhiye. MindSpace samajhta hai ki kaunsi cheez aapko thaka rahi hai, aur aage ka ek shaant kadam wapas deta hai.",
  "hero.ctaPrimary": "Likhna shuru kijiye",
  "hero.ctaSecondary": "Ye kaam kaise karta hai",
  "hero.trust": "Sab kuch private · India ki verified helplines andar hi",
  "hero.scrollCue": "Shuru",
  "hero.scrollAria": "Likhna shuru karne ke liye neeche scroll kijiye",
  "hero.card.trigger": "Trigger: mock test ke scores",
  "hero.card.breathing": "4 minute ka breathing reset",
  "hero.card.private": "Yahan kuch share ya score nahi hota.",
  "hero.card.crisisSafe": "Bure waqt ke liye tayyar",

  // ── Journal form ─────────────────────────────────────────────────────────
  "form.sectionAria": "Journal form",
  "form.title": "Aaj ka check-in",
  "form.subtitle": "Padhai se shuru kijiye. Yahan ki koi baat kisi ko nahi jaati.",
  "form.examLabel": "Kis exam ki tayyari",

  "form.studyHours.label": "Aaj kitne ghante padhai",
  "form.studyHours.value": "{hours}h",
  "form.studyHours.scaleLow": "0h",
  "form.studyHours.scaleMid": "9h",
  "form.studyHours.scaleHigh": "18h",
  "form.studyHours.aria": "{hours} ghante",

  "form.journalLabel": "Dimaag mein kya chal raha hai?",
  "form.journalPlaceholder":
    "Jo mann mein hai likhiye — aaj kaisa raha? Kya bhaari lag raha hai? Kya theek gaya?",
  "form.journalHint":
    "Thoda khul kar likhiye — jitna zyada batayenge, jawab utna sahi hoga",
  "form.charCountAria": "{max} mein se {used} characters",

  "form.feelings.summary": "Kaisa lag raha hai, wo bhi jodiye",
  "form.feelings.optional": "optional",

  "form.submit": "Mera din samajhiye",
  "form.submitting": "Aapka din padha ja raha hai…",

  // ── Exam contexts ────────────────────────────────────────────────────────
  "exam.JEE": "JEE",
  "exam.NEET": "NEET",
  "exam.CUET": "CUET",
  "exam.CAT": "CAT",
  "exam.GATE": "GATE",
  "exam.UPSC": "UPSC",
  "exam.Board": "Board exams",
  "exam.Other": "Kuch aur",

  // ── Mood ─────────────────────────────────────────────────────────────────
  "mood.label": "Aaj kaisa lag raha hai?",
  "mood.scaleLow": "Kam",
  "mood.scaleHigh": "Achha",
  "mood.aria": "Mood 10 mein se {value} — {label}",
  "mood.level.1": "Bahut neeche",
  "mood.level.2": "Neeche",
  "mood.level.3": "Mushkil chal raha hai",
  "mood.level.4": "Aise hi",
  "mood.level.5": "Theek hai",
  "mood.level.6": "Kaafi theek",
  "mood.level.7": "Achha",
  "mood.level.8": "Bahut achha",
  "mood.level.9": "Bahut hi achha",
  "mood.level.10": "Bahut dinon baad aisa",

  // ── Emotions ─────────────────────────────────────────────────────────────
  "emotion.legend": "Kya feel ho raha hai",
  "emotion.hint": "(3 tak, ya chhod dijiye)",
  "emotion.maxReached": "3 ho gaye",
  "emotion.groupAria": "Feelings",
  "emotion.conflict": "{a} aur {b} ek saath hona mushkil hai.",
  "emotion.anxious": "Ghabrahat",
  "emotion.overwhelmed": "Sambhal nahi raha",
  "emotion.hopeful": "Ummeed",
  "emotion.focused": "Focus mein",
  "emotion.burnt_out": "Burnt out",
  "emotion.motivated": "Josh mein",
  "emotion.lonely": "Akelapan",
  "emotion.calm": "Shaanti",
  "emotion.frustrated": "Chidchid",
  "emotion.confident": "Bharosa",
  "emotion.exhausted": "Thakan",
  "emotion.numb": "Sunn",

  // ── Guided problem-solving ───────────────────────────────────────────────
  "solver.sectionAria": "Ek problem par kaam karna",
  "solver.title": "Ek cheez par kaam kijiye",
  "solver.stepCount": "Step {current} / {total}",
  "solver.stepAnswered": ", {done} ho gaye",
  "solver.next": "Aage",
  "solver.back": "Peeche",
  "solver.done": "Ho gaya",
  "solver.plan.sectionAria": "Aapka plan",
  "solver.plan.title": "Aapka plan",
  "solver.plan.restart": "Ek aur cheez par kaam kijiye",

  "solver.define.question": "Abhi sabse zyada kya khatak raha hai?",
  "solver.define.placeholder":
    "Physics ka backlog teen chapter ka hai aur agla test Sunday ko hai.",
  "solver.define.hint":
    "Ek cheez, sab kuch nahi. Jitna concrete likh sakein, utna likhiye.",

  "solver.options.question":
    "Iske baare mein aap actually kya kar sakte hain? Kuch options likhiye.",
  "solver.options.placeholder":
    "Rotational motion abhi chhod dena. Rohit se notes maangna. Sir ko bata dena ki peeche hoon. Sirf past-year questions karna.",
  "solver.options.hint":
    "Bekaar options bhi chalenge. Likh dijiye — baat ek se zyada option hone ki hai.",

  "solver.choose.question": "Inme se pehle kya try karenge?",
  "solver.choose.placeholder": "Rotational motion ke sirf past-year questions.",
  "solver.choose.hint":
    "Wo chuniye jo aaj shuru ho sake, wo nahi jo sunne mein sahi lagta hai.",

  "solver.act.question": "Pehla chhota step kya hai, aur kab?",
  "solver.act.placeholder":
    "Aaj raat khaane ke baad, 40 minute, 2019 aur 2020 ke papers.",
  "solver.act.hint": "Itna chhota ki fail hone par sharm aaye.",

  "solver.review.question": "Kaise pata chalega ki kaam ho gaya?",
  "solver.review.placeholder":
    "Agar module khole bina rotational motion ka ek question bana loon.",
  "solver.review.hint": "Kuch aisa jo sach mein check kar sakein. Feeling nahi.",

  // ── Wellness flags ───────────────────────────────────────────────────────
  "flag.moodHighEmotionsHeavy":
    "Mood upar hai par feelings bhaari lag rahi hain — ek baar dekh lein?",
  "flag.moodLowEmotionsUpbeat":
    "Mood neeche hai par feelings halki lag rahi hain — ek baar dekh lein?",
  "flag.overwork":
    "Aaj padhai ka din kaafi lamba raha. Aaram bhi tayyari ka hissa hai.",

  // ── Crisis ───────────────────────────────────────────────────────────────
  "crisis.title": "Ye akele jhelne ki zaroorat nahi hai",
  "crisis.message":
    "Abhi aap jo mehsoos kar rahe hain, wo sach hai. Ye halka ho sakta hai — bhale aaj raat aisa na lage. Koi exam, koi rank, koi result aapse zyada keemti nahi hai. Please abhi kisi se baat kijiye — in numbers par baithe log sunne ke liye trained hain, ye free hai, aur aapki baat kahin aur nahi jaati.",
  "crisis.helplinesIntro": "Abhi call kar sakte hain. Free hai:",
  "crisis.emergency": "Agar abhi khatra hai, to {number} par call kijiye",

  // ── Helplines ────────────────────────────────────────────────────────────
  "helpline.heading": "Mental health support · India",
  "helpline.callAria": "{name} ko {number} par call kijiye",
  "helpline.telemanas.name": "Tele-MANAS (Bharat Sarkar)",
  "helpline.telemanas.short": "Tele-MANAS",
  "helpline.telemanas.hours": "24/7 · free · 20+ bhashayein",
  "helpline.telemanas.aria":
    "Tele-MANAS sarkari helpline ko 14416 par call kijiye, 24 ghante khuli",
  "helpline.icall.name": "iCall (TISS)",
  "helpline.icall.short": "iCall",
  "helpline.icall.hours": "Som–Shani, subah 8 se raat 10",
  "helpline.icall.aria": "iCall helpline ko 9152987821 par call kijiye",
  "helpline.vandrevala.name": "Vandrevala Foundation",
  "helpline.vandrevala.short": "Vandrevala",
  "helpline.vandrevala.hours": "24/7 · call ya WhatsApp",
  "helpline.vandrevala.aria":
    "Vandrevala Foundation ko 9999666555 par call kijiye, 24 ghante khuli",

  // ── Analysis ─────────────────────────────────────────────────────────────
  "analysis.triggers": "Kya bojh badha raha hai",
  "analysis.patterns": "Jo dikh raha hai",
  "analysis.coping": "Ek cheez jo try kar sakte hain",
  "analysis.exercise": "{minutes} minute ki practice",
  "analysis.message": "Ek baat kehne layak",
  "analysis.duration": "{minutes} min",
  "analysis.disclaimer":
    "Ye ek AI wellness saathi hai — doctor ya counsellor ki jagah nahi le sakta.",
  "analysis.loading": "Aapka din padha ja raha hai…",
  "analysis.loadingAria": "Aapka din padha ja raha hai",

  // ── Results panel ────────────────────────────────────────────────────────
  "results.sectionAria": "Wellness insights",
  "results.liveAria": "Analysis ka result",
  "results.idle.title": "Aapke insights yahan dikhenge",
  "results.idle.body":
    "Aaj ke baare mein do-teen sacchi lines likhiye. Jawab kuch hi second mein yahan aa jaayega.",
  "results.idle.chip.triggers": "Stress ki wajah",
  "results.idle.chip.coping": "Coping plan",
  "results.idle.chip.mindfulness": "Mindfulness",
  "results.idle.chip.nextStep": "Ek saaf agla kadam",
  "results.history.toggle": "Purani entries dekhiye",

  // ── Mood chart ───────────────────────────────────────────────────────────
  "chart.heading": "7 din ka mood",
  "chart.empty": "Pehli entry likhiye, phir yahan trend dikhega",
  "chart.aria": "7 din ke mood ka chart",
  "chart.caption": "7 din ka mood",
  "chart.col.date": "Taareekh",
  "chart.col.day": "Din",
  "chart.col.mood": "Mood (1–10)",
  "chart.notLogged": "Likha nahi",
  "chart.day.sun": "Sun",
  "chart.day.mon": "Mon",
  "chart.day.tue": "Tue",
  "chart.day.wed": "Wed",
  "chart.day.thu": "Thu",
  "chart.day.fri": "Fri",
  "chart.day.sat": "Sat",

  // ── Errors ───────────────────────────────────────────────────────────────
  "error.rateLimit":
    "Bahut zyada requests — thodi der ruk kar dobara try kijiye.",
  "error.generic": "Kuch gadbad ho gayi. Dobara try kijiye.",
  "error.network":
    "Connection ki dikkat hai — network dekh kar dobara try kijiye.",
  "error.dismiss": "Hata dein",

  // ── Validation ───────────────────────────────────────────────────────────
  "validation.text.min": "Kam se kam 10 characters likhiye",
  "validation.text.max":
    "Bahut lamba ho gaya — zyada se zyada 1000 characters",
  "validation.mood.min": "Mood kam se kam 1 hona chahiye",
  "validation.mood.max": "Mood zyada se zyada 10 ho sakta hai",
  "validation.emotions.min": "Kam se kam ek feeling chuniye",
  "validation.emotions.max": "Zyada se zyada 3 feelings chuniye",
  "validation.studyHours.min": "Study hours minus mein nahi ho sakte",
  "validation.studyHours.max": "Study hours 18 se zyada nahi ho sakte",
};
