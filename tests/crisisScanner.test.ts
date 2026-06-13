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
});
