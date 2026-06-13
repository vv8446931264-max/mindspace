const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

type Window = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Window>();

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const window = store.get(ip);

  if (!window || now > window.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (window.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: window.resetAt - now };
  }

  window.count++;
  return { allowed: true };
}

// Periodic cleanup to prevent memory leak on long-running servers
let lastCleanup = Date.now();

export function maybeCleanup(): void {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [ip, window] of store) {
    if (now > window.resetAt) store.delete(ip);
  }
}
