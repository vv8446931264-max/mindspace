// Locale resolution, persistence, and string lookup. No i18n library — this is
// a lookup table with a fallback chain, and adding a runtime dependency for that
// would cost more bytes than the entire Hinglish catalogue.
//
// WHY HINGLISH IS THE DEFAULT (docs/ROADMAP-v2.md P3.1)
// 57.8% of surveyed Hindi speakers prefer Hindi written in Latin script; only
// 25.1% prefer Devanagari. Among frequent-Hindi users it is 42% Latin vs 37%
// Devanagari. Those surveys skew urban, English-literate and smartphone-owning
// — which is precisely the JEE/NEET coaching cohort, so the sampling bias runs
// in our favour rather than against us.
//
// WHY DEVANAGARI IS GATED (docs/ROADMAP-v2.md P3.3)
// Hinglish costs zero extra font bytes: it is Latin. A Devanagari webfont subset
// is ~70 KB at best (Hind 400) and 118 KB for Noto Sans Devanagari 400, against
// 13–16 KB for a Latin subset. Subsetting does not rescue this — the payload is
// conjunct ligatures and GSUB shaping tables, so realistic yield is 20–30%, not
// the ~90% Latin gives, and over-pruning breaks shaping rather than falling back
// gracefully. So: `needsDevanagariFont()` is true for "hi" and nothing else, and
// the font must never be on the critical path for "en" or "hi-Latn".

import { en, hiLatn, hi } from "@/lib/strings";
import type { StringCatalogue, StringKey } from "@/lib/strings";

export type Locale = "en" | "hi-Latn" | "hi";

export const LOCALES = ["en", "hi-Latn", "hi"] as const;

/** India-first product. When we know nothing else, Hinglish. */
export const DEFAULT_LOCALE: Locale = "hi-Latn";

/** Every locale falls back here for a key it is missing. */
export const FALLBACK_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "locale:v1";

export const CATALOGUES: Record<Locale, StringCatalogue> = {
  en,
  "hi-Latn": hiLatn,
  hi,
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/**
 * True only for Devanagari. The caller lazy-loads the Devanagari webfont on this
 * signal and on nothing else — never on first paint for "en" or "hi-Latn".
 *
 * Note the language *switcher* can still print "हिन्दी" without this: two
 * characters render fine in the platform's system Devanagari face (Noto on
 * Android, Nirmala UI on Windows) with no download at all.
 */
export function needsDevanagariFont(locale: Locale): boolean {
  return locale === "hi";
}

// ── Lookup ───────────────────────────────────────────────────────────────────

const VAR_PATTERN = /\{(\w+)\}/g;

function interpolate(
  template: string,
  vars: Readonly<Record<string, string | number>>
): string {
  return template.replace(VAR_PATTERN, (match, name: string) => {
    const value = vars[name];
    return value === undefined ? match : String(value);
  });
}

/**
 * Raw lookup with the en fallback. `catalogues` is injectable so the fallback
 * path is testable without mutating module state — the type system already
 * makes a missing key impossible in the shipped tables, but a locale table can
 * still arrive incomplete at runtime (unvalidated locale string, hand-edited
 * build artefact), and silently rendering nothing is the worst outcome.
 */
export function resolve(
  key: StringKey,
  locale: Locale,
  catalogues: Readonly<Record<string, Partial<StringCatalogue>>> = CATALOGUES
): string {
  return (
    catalogues[locale]?.[key] ?? catalogues[FALLBACK_LOCALE]?.[key] ?? key
  );
}

/** Look up `key` in `locale`, falling back to en, then to the key itself. */
export function t(
  key: StringKey,
  locale: Locale,
  vars?: Readonly<Record<string, string | number>>
): string {
  const raw = resolve(key, locale);
  return vars ? interpolate(raw, vars) : raw;
}

// ── Persistence ──────────────────────────────────────────────────────────────
// Same defensive shape as lib/storage.ts: never throw, never trust what is
// already in localStorage, drop anything that fails validation.

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw === null) return null;
    if (!isLocale(raw)) {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  if (!isLocale(locale)) return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Quota exceeded or storage disabled (private mode). A language preference
    // is not worth breaking a render over.
  }
}

export function clearStoredLocale(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCALE_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// ── Detection ────────────────────────────────────────────────────────────────

const INDIA_TIME_ZONES = new Set(["Asia/Kolkata", "Asia/Calcutta"]);

/**
 * Indian languages that are not Hindi. These map to English, not Hinglish:
 * a Tamil or Bengali speaker gains nothing from Romanised Hindi, and defaulting
 * them into it is the exact imposition this cohort reacts badly to.
 */
const INDIAN_NON_HINDI = new Set([
  "bn", "ta", "te", "mr", "gu", "kn", "ml", "pa", "or", "as",
  "ur", "kok", "sd", "ks", "mni", "sat", "doi", "brx", "ne", "si",
]);

function isIndiaTimeZone(timeZone: string | undefined): boolean {
  return timeZone !== undefined && INDIA_TIME_ZONES.has(timeZone);
}

/**
 * Pure locale choice from BCP-47 tags and an IANA time zone. Split out from the
 * browser globals so it is directly testable.
 *
 * Rules, in order:
 *  - `hi-Latn` tag            -> Hinglish (explicit)
 *  - `hi-Deva` or bare `hi`   -> Devanagari. A device UI set to Hindi is a
 *                                deliberate choice by someone who reads the
 *                                script; respect it over the global default.
 *  - English in India         -> Hinglish (P3.1). One tap switches back.
 *  - English elsewhere        -> English
 *  - other Indian language    -> English (see INDIAN_NON_HINDI)
 *  - nothing usable           -> India time zone ? Hinglish : English
 */
export function pickLocale(
  languageTags: readonly string[],
  timeZone?: string
): Locale {
  const india = isIndiaTimeZone(timeZone);

  for (const tag of languageTags) {
    const lower = tag.toLowerCase();
    const subtags = lower.split("-");
    const language = subtags[0];

    if (language === "hi") {
      if (subtags.includes("latn")) return "hi-Latn";
      return "hi";
    }

    if (language === "en") {
      return india || subtags.includes("in") ? "hi-Latn" : "en";
    }

    if (INDIAN_NON_HINDI.has(language)) return "en";
  }

  if (india) return DEFAULT_LOCALE;
  if (timeZone !== undefined) return "en";
  return DEFAULT_LOCALE;
}

/** Browser-signal locale guess. Never throws; falls back to DEFAULT_LOCALE. */
export function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  let tags: readonly string[] = [];
  let timeZone: string | undefined;

  try {
    const nav = window.navigator;
    tags = nav.languages?.length
      ? nav.languages
      : nav.language
        ? [nav.language]
        : [];
  } catch {
    tags = [];
  }

  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    timeZone = undefined;
  }

  return pickLocale(tags, timeZone);
}

/** Stored choice wins over detection. Call once on mount. */
export function resolveInitialLocale(): Locale {
  return readStoredLocale() ?? detectLocale();
}
