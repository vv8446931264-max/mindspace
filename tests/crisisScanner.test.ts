import { describe, it, expect } from "vitest";
import { scanForCrisis } from "../lib/crisisScanner";

describe("scanForCrisis", () => {
  it("returns crisis:false for normal stress entry", () => {
    const result = scanForCrisis("Failed my mock test, feeling really stressed today");
    expect(result.crisis).toBe(false);
  });

  it("detects 'suicide'", () => {
    const result = scanForCrisis("I keep thinking about suicide");
    expect(result.crisis).toBe(true);
  });

  it("detects 'want to die'", () => {
    const result = scanForCrisis("I just want to die, this is too much");
    expect(result.crisis).toBe(true);
  });

  it("detects 'can't go on'", () => {
    const result = scanForCrisis("I can't go on like this anymore");
    expect(result.crisis).toBe(true);
  });

  it("detects 'hurt myself'", () => {
    const result = scanForCrisis("I feel like hurting myself");
    expect(result.crisis).toBe(true);
  });

  it("detects 'end it'", () => {
    const result = scanForCrisis("I just want to end it all");
    expect(result.crisis).toBe(true);
  });

  it("detects 'kill myself'", () => {
    const result = scanForCrisis("Sometimes I think I should kill myself");
    expect(result.crisis).toBe(true);
  });

  it("is case-insensitive", () => {
    const result = scanForCrisis("SUICIDE IS ON MY MIND");
    expect(result.crisis).toBe(true);
  });

  it("detects 'hopeless' standalone", () => {
    const result = scanForCrisis("Everything feels completely hopeless");
    expect(result.crisis).toBe(true);
  });

  it("does not flag 'I gave up sugar today'", () => {
    // 'give up' would flag this — acceptable: we err conservative
    const result = scanForCrisis("I gave up sugar today to study better");
    expect(result.crisis).toBe(false);
  });

  it("detects 'dont want to exist'", () => {
    const result = scanForCrisis("I dont want to exist anymore");
    expect(result.crisis).toBe(true);
  });

  it("detects 'better off without me'", () => {
    const result = scanForCrisis("My family would be better off without me");
    expect(result.crisis).toBe(true);
  });

  it("returns matchedKeyword when crisis detected", () => {
    const result = scanForCrisis("I want to die");
    expect(result.crisis).toBe(true);
    if (result.crisis) {
      expect(typeof result.matchedKeyword).toBe("string");
      expect(result.matchedKeyword.length).toBeGreaterThan(0);
    }
  });

  it("handles empty string without throwing", () => {
    expect(() => scanForCrisis("")).not.toThrow();
    expect(scanForCrisis("").crisis).toBe(false);
  });

  it("handles very long text without throwing", () => {
    const long = "a".repeat(5000) + " suicide " + "b".repeat(5000);
    const result = scanForCrisis(long);
    expect(result.crisis).toBe(true);
  });

  // ── Expanded coverage: short, high-signal words ──────────────
  it("detects standalone 'die'", () => {
    expect(scanForCrisis("I just want to die").crisis).toBe(true);
    expect(scanForCrisis("let me die").crisis).toBe(true);
  });

  it("detects 'dying'", () => {
    expect(scanForCrisis("I keep thinking about dying").crisis).toBe(true);
  });

  it("detects 'feeling like to do suicide'", () => {
    expect(scanForCrisis("feeling like to do suicide").crisis).toBe(true);
  });

  it("detects 'kill me' / 'take my life' / 'overdose'", () => {
    expect(scanForCrisis("I want someone to kill me").crisis).toBe(true);
    expect(scanForCrisis("thinking about how to take my life").crisis).toBe(true);
    expect(scanForCrisis("what if I overdose").crisis).toBe(true);
  });

  it("detects 'dont want to live'", () => {
    expect(scanForCrisis("I dont want to live anymore").crisis).toBe(true);
  });

  // ── Word boundaries: must NOT false-trigger on innocent words ─
  it("does NOT flag 'studied' (contains 'died')", () => {
    expect(scanForCrisis("I studied for ten hours today").crisis).toBe(false);
  });

  it("does NOT flag 'diet' or 'deadline'", () => {
    expect(scanForCrisis("I started a new diet this week").crisis).toBe(false);
    expect(scanForCrisis("the deadline is killing my schedule").crisis).toBe(false);
  });

  it("tags severity on a match", () => {
    const r = scanForCrisis("I want to die");
    expect(r.crisis).toBe(true);
    if (r.crisis) expect(r.severity).toBe("severe");
  });
});
