import { describe, it, expect, beforeEach } from "vitest";
import {
  CATALOGUES,
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  clearStoredLocale,
  isLocale,
  needsDevanagariFont,
  pickLocale,
  readStoredLocale,
  resolve,
  storeLocale,
  t,
} from "../lib/i18n";
import { en, hiLatn, hi, STRING_KEYS } from "../lib/strings";
import type { Locale } from "../lib/i18n";
import type { StringKey } from "../lib/strings";

describe("catalogue completeness", () => {
  it("every locale has exactly the English key set", () => {
    const expected = [...STRING_KEYS].sort();
    for (const locale of LOCALES) {
      expect(Object.keys(CATALOGUES[locale]).sort()).toEqual(expected);
    }
  });

  it("has no blank strings in any locale", () => {
    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(CATALOGUES[locale])) {
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });

  it("keeps the same interpolation placeholders in every locale", () => {
    const placeholders = (s: string) =>
      (s.match(/\{(\w+)\}/g) ?? []).sort().join(",");

    for (const key of STRING_KEYS) {
      expect(placeholders(hiLatn[key]), `hi-Latn:${key}`).toBe(
        placeholders(en[key])
      );
      expect(placeholders(hi[key]), `hi:${key}`).toBe(placeholders(en[key]));
    }
  });
});

describe("t / resolve", () => {
  it("returns the string for the requested locale", () => {
    expect(t("form.title", "en")).toBe("Today's check-in");
    expect(t("form.title", "hi-Latn")).toBe("Aaj ka check-in");
    expect(t("form.title", "hi")).toBe("आज का चेक-इन");
  });

  it("falls back to English when a locale is missing the key", () => {
    const gappy = {
      ...CATALOGUES,
      hi: { ...CATALOGUES.hi },
    } as Record<string, Record<string, string>>;
    delete gappy.hi["form.submit"];

    expect(resolve("form.submit", "hi", gappy)).toBe(en["form.submit"]);
  });

  it("falls back to English for a locale that has no table at all", () => {
    expect(resolve("form.submit", "pt-BR" as Locale, {
      en: CATALOGUES.en,
    })).toBe(en["form.submit"]);
  });

  it("returns the key itself when even English is missing it", () => {
    expect(resolve("does.not.exist" as StringKey, "en", { en: {} })).toBe(
      "does.not.exist"
    );
  });

  it("interpolates named variables", () => {
    expect(t("analysis.exercise", "en", { minutes: 4 })).toBe(
      "4-minute practice"
    );
    expect(t("solver.stepCount", "hi", { current: 2, total: 5 })).toBe(
      "स्टेप 2 / 5"
    );
  });

  it("leaves a placeholder alone when no value is supplied", () => {
    expect(t("analysis.duration", "en", {})).toBe("{minutes} min");
  });
});

describe("needsDevanagariFont", () => {
  // A ~70–118 KB webfont download. It must never be triggered by en or
  // hi-Latn, which is the entire cost argument for Hinglish as the default.
  it("is true only for hi", () => {
    for (const locale of LOCALES) {
      expect(needsDevanagariFont(locale), locale).toBe(locale === "hi");
    }
  });

  it("keeps Devanagari out of the Latin-script catalogues", () => {
    const DEVANAGARI = /[ऀ-ॿ]/;
    // The one deliberate exception: the language switcher prints "हिन्दी" in
    // every locale so a user can find their own language. Two characters
    // render from the platform's system face — no webfont required.
    const ALLOWED: StringKey[] = ["locale.name.hi"];

    for (const locale of ["en", "hi-Latn"] as const) {
      for (const [key, value] of Object.entries(CATALOGUES[locale])) {
        if (ALLOWED.includes(key as StringKey)) continue;
        expect(DEVANAGARI.test(value), `${locale}:${key} → ${value}`).toBe(
          false
        );
      }
    }
  });
});

describe("persistence", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when nothing is stored", () => {
    expect(readStoredLocale()).toBeNull();
  });

  it("round-trips every locale", () => {
    for (const locale of LOCALES) {
      storeLocale(locale);
      expect(readStoredLocale()).toBe(locale);
    }
  });

  it("persists under the versioned key", () => {
    storeLocale("hi");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("hi");
  });

  it("drops and clears an unrecognised stored value", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "hi-IN");
    expect(readStoredLocale()).toBeNull();
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it("refuses to store a value that is not a locale", () => {
    storeLocale("klingon" as Locale);
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBeNull();
  });

  it("clears a stored preference", () => {
    storeLocale("hi-Latn");
    clearStoredLocale();
    expect(readStoredLocale()).toBeNull();
  });
});

describe("isLocale", () => {
  it("accepts the three shipped locales", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
  });

  it("rejects near-misses and non-strings", () => {
    for (const value of ["hi-IN", "HI", "en-US", "", null, undefined, 3]) {
      expect(isLocale(value), String(value)).toBe(false);
    }
  });
});

describe("pickLocale", () => {
  it("defaults India to Hinglish", () => {
    expect(pickLocale(["en-IN"], "Asia/Kolkata")).toBe("hi-Latn");
    expect(pickLocale(["en-US"], "Asia/Kolkata")).toBe("hi-Latn");
    expect(pickLocale([], "Asia/Calcutta")).toBe("hi-Latn");
    expect(pickLocale(["en-IN"], undefined)).toBe("hi-Latn");
  });

  it("honours an explicit Devanagari or Hindi device language", () => {
    expect(pickLocale(["hi"], "Asia/Kolkata")).toBe("hi");
    expect(pickLocale(["hi-IN"], "Asia/Kolkata")).toBe("hi");
    expect(pickLocale(["hi-Deva-IN"], undefined)).toBe("hi");
  });

  it("honours an explicit Latin-script Hindi tag", () => {
    expect(pickLocale(["hi-Latn"], "Asia/Kolkata")).toBe("hi-Latn");
    expect(pickLocale(["hi-Latn-IN"], undefined)).toBe("hi-Latn");
  });

  it("gives English, not Hinglish, to non-Hindi Indian languages", () => {
    // Romanised Hindi helps a Tamil or Bengali speaker not at all, and
    // defaulting them into it is exactly the imposition to avoid.
    expect(pickLocale(["ta-IN"], "Asia/Kolkata")).toBe("en");
    expect(pickLocale(["bn-IN"], "Asia/Kolkata")).toBe("en");
    expect(pickLocale(["ml-IN"], "Asia/Kolkata")).toBe("en");
  });

  it("gives English outside India", () => {
    expect(pickLocale(["en-US"], "America/New_York")).toBe("en");
    expect(pickLocale(["en-GB"], "Europe/London")).toBe("en");
    expect(pickLocale([], "America/Chicago")).toBe("en");
    expect(pickLocale(["fr-FR", "en-US"], "Europe/Paris")).toBe("en");
  });

  it("falls back to the default when there is no signal at all", () => {
    expect(pickLocale([], undefined)).toBe(DEFAULT_LOCALE);
    expect(DEFAULT_LOCALE).toBe("hi-Latn");
  });
});

describe("tone", () => {
  // This cohort explicitly resents toxic positivity, and every one of these
  // phrases is a documented way to lose them. Assert it, do not trust review.
  const BANNED: { pattern: RegExp; why: string }[] = [
    { pattern: /!/, why: "exclamation-mark cheerfulness" },
    { pattern: /you'?ve got this/i, why: "affirmation" },
    { pattern: /you can do it/i, why: "affirmation" },
    { pattern: /believe in yourself/i, why: "affirmation" },
    { pattern: /stay positive/i, why: "toxic positivity" },
    { pattern: /keep pushing/i, why: "grind framing" },
    { pattern: /never give up/i, why: "grind framing" },
    { pattern: /don'?t give up/i, why: "grind framing" },
    { pattern: /topper/i, why: "topper framing" },
    { pattern: /success story/i, why: "success-story framing" },
    { pattern: /everything happens for a reason/i, why: "platitude" },
    { pattern: /you'?ll be fine/i, why: "dismissive reassurance" },
    { pattern: /aap kar sakte h/i, why: "affirmation (Hinglish)" },
    { pattern: /tum kar sakte h/i, why: "affirmation (Hinglish)" },
    { pattern: /himmat mat har/i, why: "grind framing (Hinglish)" },
    { pattern: /haar mat man/i, why: "grind framing (Hinglish)" },
    { pattern: /positive raho/i, why: "toxic positivity (Hinglish)" },
    { pattern: /mehnat rang la/i, why: "grind framing (Hinglish)" },
    { pattern: /आप कर सकते ह/, why: "affirmation (Hindi)" },
    { pattern: /तुम कर सकते ह/, why: "affirmation (Hindi)" },
    { pattern: /हिम्मत मत हार/, why: "grind framing (Hindi)" },
    { pattern: /हार मत मान/, why: "grind framing (Hindi)" },
    { pattern: /पॉज़िटिव रहो/, why: "toxic positivity (Hindi)" },
    { pattern: /मेहनत रंग ला/, why: "grind framing (Hindi)" },
  ];

  it("contains no banned phrase in any locale", () => {
    const offences: string[] = [];

    for (const locale of LOCALES) {
      for (const [key, value] of Object.entries(CATALOGUES[locale])) {
        for (const { pattern, why } of BANNED) {
          if (pattern.test(value)) {
            offences.push(`${locale}:${key} — ${why} — "${value}"`);
          }
        }
      }
    }

    expect(offences).toEqual([]);
  });
});

describe("crisis copy", () => {
  // The strings most likely to be read on someone's worst night. Guard the
  // properties that matter rather than the exact wording.
  it("names the concrete alternatives to the exam in every locale", () => {
    expect(t("crisis.message", "en")).toMatch(/exam/i);
    expect(t("crisis.message", "hi-Latn")).toMatch(/exam/i);
    expect(t("crisis.message", "hi")).toMatch(/एग्ज़ाम/);
  });

  it("promises confidentiality in every locale", () => {
    expect(t("crisis.message", "en")).toMatch(/does not go anywhere else/i);
    expect(t("crisis.message", "hi-Latn")).toMatch(/kahin aur nahi jaati/i);
    expect(t("crisis.message", "hi")).toMatch(/कहीं और नहीं जाती/);
  });

  it("keeps the emergency number interpolatable rather than hard-coded", () => {
    for (const locale of LOCALES) {
      expect(CATALOGUES[locale]["crisis.emergency"]).toContain("{number}");
      expect(t("crisis.emergency", locale, { number: 112 })).toContain("112");
    }
  });

  it("keeps helpline numbers out of the translated prose", () => {
    // Numbers live in lib/crisisScanner.ts. A stale number copied into a
    // translation is a safety bug, so the copy must never carry one.
    for (const locale of LOCALES) {
      expect(CATALOGUES[locale]["crisis.message"]).not.toMatch(/\d{5,}/);
      expect(CATALOGUES[locale]["crisis.helplinesIntro"]).not.toMatch(/\d{5,}/);
    }
  });
});
