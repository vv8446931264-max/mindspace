import { describe, it, expect, vi, afterEach } from "vitest";
import { checkRateLimit } from "../lib/rateLimit";

// Unique IP per test isolates the module-level window store.
let counter = 0;
const freshIp = () => `10.0.0.${counter++}`;

afterEach(() => vi.useRealTimers());

describe("checkRateLimit", () => {
  it("allows the first request", () => {
    expect(checkRateLimit(freshIp()).allowed).toBe(true);
  });

  it("allows up to 10 requests in the window", () => {
    const ip = freshIp();
    for (let i = 0; i < 10; i++) {
      expect(checkRateLimit(ip).allowed).toBe(true);
    }
  });

  it("blocks the 11th request in the same window", () => {
    const ip = freshIp();
    for (let i = 0; i < 10; i++) checkRateLimit(ip);
    const result = checkRateLimit(ip);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterMs).toBeGreaterThan(0);
    }
  });

  it("resets after the 1-minute window elapses", () => {
    vi.useFakeTimers();
    const ip = freshIp();
    for (let i = 0; i < 10; i++) checkRateLimit(ip);
    expect(checkRateLimit(ip).allowed).toBe(false);

    vi.advanceTimersByTime(61 * 1000);
    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  it("tracks separate IPs independently", () => {
    const a = freshIp();
    const b = freshIp();
    for (let i = 0; i < 10; i++) checkRateLimit(a);
    expect(checkRateLimit(a).allowed).toBe(false);
    expect(checkRateLimit(b).allowed).toBe(true);
  });
});
