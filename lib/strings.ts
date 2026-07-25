// String catalogue assembly point.
//
// The key set is derived from the English catalogue, so `hiLatn` and `hi` are
// typed Record<StringKey, string> — a key added to en and forgotten in either
// translation is a TYPE ERROR at build time. That is the whole point of the
// split: no runtime "missing key" blanks, no silent English leaking into a
// Hindi screen without someone deciding it should.
//
// Locales live in separate files purely to keep each one readable and
// reviewable on its own; the type-only import back into this module is erased
// at compile time, so there is no runtime cycle.

import { en } from "@/lib/strings.en";
import { hiLatn } from "@/lib/strings.hiLatn";
import { hi } from "@/lib/strings.hi";

export type StringKey = keyof typeof en;

export type StringCatalogue = Record<StringKey, string>;

export { en, hiLatn, hi };

/** Every key in the catalogue, for exhaustiveness checks and lint gates. */
export const STRING_KEYS = Object.keys(en) as StringKey[];
