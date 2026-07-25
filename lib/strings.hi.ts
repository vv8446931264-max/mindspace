// हिन्दी — Devanagari. Loaded behind `needsDevanagariFont()`; see lib/i18n.ts
// for why this is the only locale that costs a webfont download.
//
// Register: everyday spoken Hindi, the way a 17-year-old in Kota actually talks.
// NOT the Sanskritised register of textbooks and government forms — no "दिवस",
// no "व्यतीत", no "कृपया अपना मनोभाव चयन करें". Short clauses, grade 6–8.
//
// Exam names (JEE, NEET, CUET…) and brand names (MindSpace, iCall, TISS,
// WhatsApp) stay in Latin script: that is how students write them even in
// otherwise-Devanagari text, and transliterating them would look wrong.
// Everything else is Devanagari, including loanwords that have settled into
// spoken Hindi (मॉक टेस्ट, स्कोर, बैकलॉग, प्लान, फ़ीलिंग).

import type { StringCatalogue } from "@/lib/strings";

export const hi: StringCatalogue = {
  // ── Shell ────────────────────────────────────────────────────────────────
  "app.name": "MindSpace",
  "app.tagline": "AI साथी",
  "app.demoBadge": "डेमो मोड",

  "locale.label": "भाषा",
  "locale.name.en": "English",
  "locale.name.hiLatn": "Hinglish",
  "locale.name.hi": "हिन्दी",

  "nav.skipToForm": "सीधे जर्नल फ़ॉर्म पर जाएँ",

  // ── Hero ─────────────────────────────────────────────────────────────────
  "hero.sectionAria": "MindSpace में आपका स्वागत है",
  "hero.eyebrow": "JEE · NEET · CUET · CAT · GATE · UPSC के लिए",
  "hero.titleLead": "बोझ उतारने की",
  "hero.titleAccent": "एक शांत जगह।",
  "hero.subtitle":
    "अपने दिन के बारे में एक सच्ची लाइन लिखिए। MindSpace समझता है कि कौन सी चीज़ आपको थका रही है, और आगे का एक शांत क़दम वापस देता है।",
  "hero.ctaPrimary": "लिखना शुरू कीजिए",
  "hero.ctaSecondary": "ये कैसे काम करता है",
  "hero.trust": "सब कुछ प्राइवेट · भारत की भरोसेमंद हेल्पलाइन अंदर ही",
  "hero.scrollCue": "शुरू",
  "hero.scrollAria": "लिखना शुरू करने के लिए नीचे स्क्रॉल कीजिए",
  "hero.card.trigger": "ट्रिगर: मॉक टेस्ट के स्कोर",
  "hero.card.breathing": "4 मिनट का ब्रीदिंग रीसेट",
  "hero.card.private": "यहाँ कुछ शेयर या स्कोर नहीं होता।",
  "hero.card.crisisSafe": "बुरे वक़्त के लिए तैयार",

  // ── Journal form ─────────────────────────────────────────────────────────
  "form.sectionAria": "जर्नल फ़ॉर्म",
  "form.title": "आज का चेक-इन",
  "form.subtitle": "पढ़ाई से शुरू कीजिए। यहाँ की कोई बात किसी को नहीं जाती।",
  "form.examLabel": "किस एग्ज़ाम की तैयारी",

  "form.studyHours.label": "आज कितने घंटे पढ़ाई",
  "form.studyHours.value": "{hours} घंटे",
  "form.studyHours.scaleLow": "0",
  "form.studyHours.scaleMid": "9",
  "form.studyHours.scaleHigh": "18",
  "form.studyHours.aria": "{hours} घंटे",

  "form.journalLabel": "दिमाग़ में क्या चल रहा है?",
  "form.journalPlaceholder":
    "जो मन में है लिखिए — आज कैसा रहा? क्या भारी लग रहा है? क्या ठीक गया?",
  "form.journalHint":
    "थोड़ा खुल कर लिखिए — जितना ज़्यादा बताएँगे, जवाब उतना सही होगा",
  "form.charCountAria": "{max} में से {used} अक्षर",

  "form.feelings.summary": "कैसा लग रहा है, वो भी जोड़िए",
  "form.feelings.optional": "ज़रूरी नहीं",

  "form.submit": "मेरा दिन समझिए",
  "form.submitting": "आपका दिन पढ़ा जा रहा है…",

  // ── Exam contexts ────────────────────────────────────────────────────────
  "exam.JEE": "JEE",
  "exam.NEET": "NEET",
  "exam.CUET": "CUET",
  "exam.CAT": "CAT",
  "exam.GATE": "GATE",
  "exam.UPSC": "UPSC",
  "exam.Board": "बोर्ड एग्ज़ाम",
  "exam.Other": "कुछ और",

  // ── Mood ─────────────────────────────────────────────────────────────────
  "mood.label": "आज कैसा लग रहा है?",
  "mood.scaleLow": "कम",
  "mood.scaleHigh": "अच्छा",
  "mood.aria": "मूड 10 में से {value} — {label}",
  "mood.level.1": "बहुत नीचे",
  "mood.level.2": "नीचे",
  "mood.level.3": "मुश्किल चल रहा है",
  "mood.level.4": "ऐसे ही",
  "mood.level.5": "ठीक है",
  "mood.level.6": "काफ़ी ठीक",
  "mood.level.7": "अच्छा",
  "mood.level.8": "बहुत अच्छा",
  "mood.level.9": "बहुत ही अच्छा",
  "mood.level.10": "बहुत दिनों बाद ऐसा",

  // ── Emotions ─────────────────────────────────────────────────────────────
  "emotion.legend": "क्या महसूस हो रहा है",
  "emotion.hint": "(3 तक, या छोड़ दीजिए)",
  "emotion.maxReached": "3 हो गए",
  "emotion.groupAria": "फ़ीलिंग्स",
  "emotion.conflict": "{a} और {b} एक साथ होना मुश्किल है।",
  "emotion.anxious": "घबराहट",
  "emotion.overwhelmed": "सँभल नहीं रहा",
  "emotion.hopeful": "उम्मीद",
  "emotion.focused": "ध्यान में",
  "emotion.burnt_out": "बर्नआउट",
  "emotion.motivated": "जोश में",
  "emotion.lonely": "अकेलापन",
  "emotion.calm": "शांति",
  "emotion.frustrated": "चिड़चिड़ाहट",
  "emotion.confident": "भरोसा",
  "emotion.exhausted": "थकान",
  "emotion.numb": "सुन्न",

  // ── Guided problem-solving ───────────────────────────────────────────────
  "solver.sectionAria": "एक दिक़्क़त पर काम करना",
  "solver.title": "एक चीज़ पर काम कीजिए",
  "solver.stepCount": "स्टेप {current} / {total}",
  "solver.stepAnswered": ", {done} हो गए",
  "solver.next": "आगे",
  "solver.back": "पीछे",
  "solver.done": "हो गया",
  "solver.plan.sectionAria": "आपका प्लान",
  "solver.plan.title": "आपका प्लान",
  "solver.plan.restart": "एक और चीज़ पर काम कीजिए",

  "solver.define.question": "अभी सबसे ज़्यादा क्या खटक रहा है?",
  "solver.define.placeholder":
    "फ़िज़िक्स का बैकलॉग तीन चैप्टर का है और अगला टेस्ट रविवार को है।",
  "solver.define.hint":
    "एक चीज़, सब कुछ नहीं। जितना साफ़ लिख सकें, उतना लिखिए।",

  "solver.options.question":
    "इसके बारे में आप असल में क्या कर सकते हैं? कुछ ऑप्शन लिखिए।",
  "solver.options.placeholder":
    "रोटेशनल मोशन अभी छोड़ देना। रोहित से नोट्स माँगना। सर को बता देना कि पीछे हूँ। सिर्फ़ पिछले साल के सवाल करना।",
  "solver.options.hint":
    "बेकार ऑप्शन भी चलेंगे। लिख दीजिए — बात एक से ज़्यादा ऑप्शन होने की है।",

  "solver.choose.question": "इनमें से पहले क्या करेंगे?",
  "solver.choose.placeholder": "रोटेशनल मोशन के सिर्फ़ पिछले साल के सवाल।",
  "solver.choose.hint":
    "वो चुनिए जो आज शुरू हो सके, वो नहीं जो सुनने में सही लगता है।",

  "solver.act.question": "पहला छोटा क़दम क्या है, और कब?",
  "solver.act.placeholder": "आज रात खाने के बाद, 40 मिनट, 2019 और 2020 के पेपर।",
  "solver.act.hint": "इतना छोटा कि फ़ेल होने पर शर्म आए।",

  "solver.review.question": "कैसे पता चलेगा कि काम हो गया?",
  "solver.review.placeholder":
    "अगर मॉड्यूल खोले बिना रोटेशनल मोशन का एक सवाल बना लूँ।",
  "solver.review.hint": "कुछ ऐसा जो सच में देख सकें। फ़ीलिंग नहीं।",

  // ── Wellness flags ───────────────────────────────────────────────────────
  "flag.moodHighEmotionsHeavy":
    "मूड ऊपर है पर फ़ीलिंग्स भारी लग रही हैं — एक बार देख लें?",
  "flag.moodLowEmotionsUpbeat":
    "मूड नीचे है पर फ़ीलिंग्स हल्की लग रही हैं — एक बार देख लें?",
  "flag.overwork":
    "आज पढ़ाई का दिन काफ़ी लंबा रहा। आराम भी तैयारी का हिस्सा है।",

  // ── Crisis ───────────────────────────────────────────────────────────────
  "crisis.title": "ये अकेले झेलने की ज़रूरत नहीं है",
  "crisis.message":
    "अभी आप जो महसूस कर रहे हैं, वो सच है। ये हल्का हो सकता है — भले आज रात ऐसा न लगे। कोई एग्ज़ाम, कोई रैंक, कोई रिज़ल्ट आपसे ज़्यादा क़ीमती नहीं है। प्लीज़ अभी किसी से बात कीजिए — इन नंबरों पर बैठे लोग सुनने के लिए ट्रेन्ड हैं, ये फ़्री है, और आपकी बात कहीं और नहीं जाती।",
  "crisis.helplinesIntro": "अभी कॉल कर सकते हैं। फ़्री है:",
  "crisis.emergency": "अगर अभी ख़तरा है, तो {number} पर कॉल कीजिए",

  // ── Helplines ────────────────────────────────────────────────────────────
  "helpline.heading": "मानसिक सेहत के लिए मदद · भारत",
  "helpline.callAria": "{name} को {number} पर कॉल कीजिए",
  "helpline.telemanas.name": "टेली-मानस (भारत सरकार)",
  "helpline.telemanas.short": "टेली-मानस",
  "helpline.telemanas.hours": "24/7 · फ़्री · 20+ भाषाएँ",
  "helpline.telemanas.aria":
    "टेली-मानस सरकारी हेल्पलाइन को 14416 पर कॉल कीजिए, 24 घंटे खुली",
  "helpline.icall.name": "iCall (TISS)",
  "helpline.icall.short": "iCall",
  "helpline.icall.hours": "सोम–शनि, सुबह 8 से रात 10",
  "helpline.icall.aria": "iCall हेल्पलाइन को 9152987821 पर कॉल कीजिए",
  "helpline.vandrevala.name": "वंद्रेवाला फ़ाउंडेशन",
  "helpline.vandrevala.short": "वंद्रेवाला",
  "helpline.vandrevala.hours": "24/7 · कॉल या WhatsApp",
  "helpline.vandrevala.aria":
    "वंद्रेवाला फ़ाउंडेशन को 9999666555 पर कॉल कीजिए, 24 घंटे खुली",

  // ── Analysis ─────────────────────────────────────────────────────────────
  "analysis.triggers": "क्या बोझ बढ़ा रहा है",
  "analysis.patterns": "जो दिख रहा है",
  "analysis.coping": "एक चीज़ जो कर सकते हैं",
  "analysis.exercise": "{minutes} मिनट की प्रैक्टिस",
  "analysis.message": "एक बात कहने लायक",
  "analysis.duration": "{minutes} मिनट",
  "analysis.disclaimer":
    "ये एक AI साथी है — डॉक्टर या काउंसलर की जगह नहीं ले सकता।",
  "analysis.loading": "आपका दिन पढ़ा जा रहा है…",
  "analysis.loadingAria": "आपका दिन पढ़ा जा रहा है",

  // ── Results panel ────────────────────────────────────────────────────────
  "results.sectionAria": "आपकी सेहत की बातें",
  "results.liveAria": "नतीजा",
  "results.idle.title": "यहाँ आपके दिन की समझ दिखेगी",
  "results.idle.body":
    "आज के बारे में दो-तीन सच्ची लाइनें लिखिए। जवाब कुछ ही सेकंड में यहाँ आ जाएगा।",
  "results.idle.chip.triggers": "स्ट्रेस की वजह",
  "results.idle.chip.coping": "आगे क्या करें",
  "results.idle.chip.mindfulness": "माइंडफ़ुलनेस",
  "results.idle.chip.nextStep": "एक साफ़ अगला क़दम",
  "results.history.toggle": "पुरानी एंट्रियाँ देखिए",

  // ── Mood chart ───────────────────────────────────────────────────────────
  "chart.heading": "7 दिन का मूड",
  "chart.empty": "पहली एंट्री लिखिए, फिर यहाँ ट्रेंड दिखेगा",
  "chart.aria": "7 दिन के मूड का चार्ट",
  "chart.caption": "7 दिन का मूड",
  "chart.col.date": "तारीख़",
  "chart.col.day": "दिन",
  "chart.col.mood": "मूड (1–10)",
  "chart.notLogged": "नहीं लिखा",
  "chart.day.sun": "रवि",
  "chart.day.mon": "सोम",
  "chart.day.tue": "मंगल",
  "chart.day.wed": "बुध",
  "chart.day.thu": "गुरु",
  "chart.day.fri": "शुक्र",
  "chart.day.sat": "शनि",

  // ── Errors ───────────────────────────────────────────────────────────────
  "error.rateLimit":
    "बहुत ज़्यादा रिक्वेस्ट — थोड़ी देर रुककर दोबारा कोशिश कीजिए।",
  "error.generic": "कुछ गड़बड़ हो गई। दोबारा कोशिश कीजिए।",
  "error.network":
    "कनेक्शन में दिक़्क़त है — नेटवर्क देखकर दोबारा कोशिश कीजिए।",
  "error.dismiss": "हटाएँ",

  // ── Validation ───────────────────────────────────────────────────────────
  "validation.text.min": "कम से कम 10 अक्षर लिखिए",
  "validation.text.max": "बहुत लंबा हो गया — ज़्यादा से ज़्यादा 1000 अक्षर",
  "validation.mood.min": "मूड कम से कम 1 होना चाहिए",
  "validation.mood.max": "मूड ज़्यादा से ज़्यादा 10 हो सकता है",
  "validation.emotions.min": "कम से कम एक फ़ीलिंग चुनिए",
  "validation.emotions.max": "ज़्यादा से ज़्यादा 3 फ़ीलिंग चुनिए",
  "validation.studyHours.min": "पढ़ाई के घंटे माइनस में नहीं हो सकते",
  "validation.studyHours.max": "पढ़ाई के घंटे 18 से ज़्यादा नहीं हो सकते",
};
