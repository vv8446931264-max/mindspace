import { describe, it, expect } from "vitest";
import {
  PATHWAY_CATEGORY_HEADINGS,
  getPathwayById,
  getPathwayItems,
  getPathways,
} from "../lib/pathways";
import type { PathwayCategory } from "../lib/pathways";
import type { ExamContext } from "../types";

const ALL_CONTEXTS: ExamContext[] = [
  "JEE",
  "NEET",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Board",
  "Other",
];

const ALL_CATEGORIES: PathwayCategory[] = [
  "recheck_result",
  "retake_same_exam",
  "remaining_rounds",
  "same_field_other_route",
  "adjacent_field",
  "restart_qualification",
];

/**
 * Copy this cohort explicitly resents. Toxic positivity reads as gaslighting to
 * a student who has just been told their result. If one of these appears, the
 * tone rule has been broken somewhere in the content.
 */
const BANNED_PHRASES = [
  "you've got this",
  "you got this",
  "you can do it",
  "believe in yourself",
  "everything happens for a reason",
  "stay positive",
  "stay strong",
  "chin up",
  "keep smiling",
  "bright future",
  "dream big",
  "never give up",
  "failure is not final",
  "one exam does not define you",
];

function textOf(item: {
  title: string;
  description: string;
  whoItIsFor: string;
  caution?: string;
}): string {
  return `${item.title} ${item.description} ${item.whoItIsFor} ${
    item.caution ?? ""
  }`.toLowerCase();
}

describe("getPathways - coverage", () => {
  it.each(ALL_CONTEXTS)("returns at least one group for %s", (context) => {
    expect(getPathways(context).length).toBeGreaterThan(0);
  });

  it.each(ALL_CONTEXTS)("returns at least one item for %s", (context) => {
    expect(getPathwayItems(context).length).toBeGreaterThan(0);
  });

  it.each(ALL_CONTEXTS)("returns no empty groups for %s", (context) => {
    for (const group of getPathways(context)) {
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it.each(ALL_CONTEXTS)("only returns items for %s itself", (context) => {
    for (const item of getPathwayItems(context)) {
      expect(item.examContext).toBe(context);
    }
  });

  it("gives every context a route that is not just retaking the exam", () => {
    // The informational gap is "what are my options now", not "try again".
    for (const context of ALL_CONTEXTS) {
      const categories = getPathways(context).map((g) => g.category);
      const nonRetake = categories.filter((c) => c !== "retake_same_exam");
      expect(nonRetake.length).toBeGreaterThan(0);
    }
  });

  it("gives JEE and NEET a same-field alternative route", () => {
    for (const context of ["JEE", "NEET"] as ExamContext[]) {
      const categories = getPathways(context).map((g) => g.category);
      expect(categories).toContain("same_field_other_route");
      expect(categories).toContain("adjacent_field");
    }
  });

  it("covers state quota for NEET, which is 85 percent of the seats", () => {
    const ids = getPathwayItems("NEET").map((i) => i.id);
    expect(ids).toContain("neet-state-quota");
    expect(ids).toContain("neet-mcc-aiq");
    expect(ids).toContain("neet-mop-up-stray");
    expect(ids).toContain("neet-deemed-universities");
    expect(ids).toContain("neet-bsc-nursing");
  });

  it("covers NIOS for board students who did not clear", () => {
    const categories = getPathways("Board").map((g) => g.category);
    expect(categories).toContain("restart_qualification");
    expect(getPathwayItems("Board").map((i) => i.id)).toContain(
      "board-nios-stream-2"
    );
  });
});

describe("getPathways - grouping", () => {
  it("returns groups in a stable order across calls", () => {
    const first = getPathways("NEET").map((g) => g.category);
    const second = getPathways("NEET").map((g) => g.category);
    expect(first).toEqual(second);
  });

  it("puts checking the result before retaking the exam", () => {
    const categories = getPathways("NEET").map((g) => g.category);
    const recheck = categories.indexOf("recheck_result");
    const retake = categories.indexOf("retake_same_exam");
    expect(recheck).toBeGreaterThanOrEqual(0);
    expect(retake).toBeGreaterThan(recheck);
  });

  it("gives every group a plain-language heading", () => {
    for (const context of ALL_CONTEXTS) {
      for (const group of getPathways(context)) {
        expect(group.heading).toBe(
          PATHWAY_CATEGORY_HEADINGS[group.category]
        );
        expect(group.heading.length).toBeGreaterThan(0);
      }
    }
  });

  it("has a heading for every category in the type", () => {
    for (const category of ALL_CATEGORIES) {
      expect(PATHWAY_CATEGORY_HEADINGS[category]).toBeTruthy();
    }
  });

  it("flattens to the same items the groups contain", () => {
    for (const context of ALL_CONTEXTS) {
      const grouped = getPathways(context).flatMap((g) => g.items.length);
      const total = grouped.reduce((sum, n) => sum + n, 0);
      expect(getPathwayItems(context).length).toBe(total);
    }
  });
});

describe("getPathwayById", () => {
  it("finds a known pathway", () => {
    expect(getPathwayById("neet-state-quota")?.category).toBe(
      "remaining_rounds"
    );
  });

  it("returns null for an unknown id", () => {
    expect(getPathwayById("no-such-pathway")).toBeNull();
  });

  it("resolves every id returned by getPathwayItems", () => {
    for (const context of ALL_CONTEXTS) {
      for (const item of getPathwayItems(context)) {
        expect(getPathwayById(item.id)).not.toBeNull();
      }
    }
  });
});

describe("pathway content integrity", () => {
  const everyItem = ALL_CONTEXTS.flatMap((c) => getPathwayItems(c));

  it("has unique ids across all contexts", () => {
    const ids = everyItem.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every item a description and an audience", () => {
    for (const item of everyItem) {
      expect(item.description.trim().length).toBeGreaterThan(20);
      expect(item.whoItIsFor.trim().length).toBeGreaterThan(0);
    }
  });

  it("attaches a caution to every unverified claim", () => {
    // An unverified item must tell the reader to check it themselves. A wrong
    // claim about a counselling deadline can cost someone a seat.
    for (const item of everyItem.filter((i) => !i.verified)) {
      expect(item.caution && item.caution.length > 0).toBe(true);
    }
  });

  it("uses https for every source it cites", () => {
    for (const item of everyItem) {
      if (item.source) {
        expect(item.source.startsWith("https://")).toBe(true);
      }
    }
  });

  it("flags the rules that changed recently", () => {
    // NEET became a requirement for some allied and healthcare courses from
    // 2026-27. Old advice that they need no NEET score is now wrong.
    const allied = getPathwayById("neet-allied-health");
    expect(allied?.caution).toContain("2026-27");

    // BSc Nursing NEET requirements differ by state.
    const nursing = getPathwayById("neet-bsc-nursing");
    expect(nursing?.caution).toBeTruthy();
  });

  it("keeps deadlines and fees off the content and on the source", () => {
    // Fees and dates change every cycle. Baking them in makes the content go
    // stale silently.
    for (const item of everyItem) {
      expect(item.description).not.toMatch(/₹\s?\d/); // rupee amount
      expect(item.description).not.toMatch(/\bRs\.?\s?\d/);
      expect(item.description).not.toMatch(/\b\d{4}-\d{2}-\d{2}\b/);
    }
  });
});

describe("pathway tone rules", () => {
  const everyItem = ALL_CONTEXTS.flatMap((c) => getPathwayItems(c));

  it("contains no motivational or affirming copy", () => {
    const offenders = everyItem.filter((item) =>
      BANNED_PHRASES.some((phrase) => textOf(item).includes(phrase))
    );
    expect(offenders.map((o) => o.id)).toEqual([]);
  });

  it("uses no exclamation marks", () => {
    for (const item of everyItem) {
      expect(textOf(item)).not.toContain("!");
    }
  });

  it("keeps sentences short enough to read under stress", () => {
    // Grade 6-8 target. Anything past ~35 words in one sentence is too long.
    for (const item of everyItem) {
      const sentences = item.description
        .split(/(?<=[.?])\s+/)
        .filter((s) => s.trim().length > 0);
      expect(sentences.length).toBeGreaterThan(0);
      for (const sentence of sentences) {
        expect(sentence.trim().split(/\s+/).length).toBeLessThanOrEqual(35);
      }
    }
  });
});
