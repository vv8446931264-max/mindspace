import type { WellnessAnalysis } from "@/types";

const TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ENTRIES = 200;

type CacheEntry = {
  value: WellnessAnalysis;
  expiresAt: number;
  lastUsed: number;
};

const store = new Map<string, CacheEntry>();
// Tracks in-flight requests to coalesce duplicates
const inFlight = new Map<string, Promise<WellnessAnalysis>>();

export function cacheGet(key: string): WellnessAnalysis | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  entry.lastUsed = Date.now();
  return entry.value;
}

export function cacheSet(key: string, value: WellnessAnalysis): void {
  if (store.size >= MAX_ENTRIES) {
    evictLRU();
  }
  store.set(key, {
    value,
    expiresAt: Date.now() + TTL_MS,
    lastUsed: Date.now(),
  });
}

export function cacheKey(text: string, examContext: string): string {
  // Simple hash: first 200 chars of text + examContext
  const normalized = text.trim().toLowerCase().slice(0, 200);
  return `${examContext}:${normalized}`;
}

export function getInFlight(key: string): Promise<WellnessAnalysis> | null {
  return inFlight.get(key) ?? null;
}

export function setInFlight(
  key: string,
  promise: Promise<WellnessAnalysis>
): void {
  inFlight.set(key, promise);
  promise.finally(() => inFlight.delete(key));
}

function evictLRU(): void {
  let oldest: string | null = null;
  let oldestTime = Infinity;
  for (const [key, entry] of store) {
    if (entry.lastUsed < oldestTime) {
      oldestTime = entry.lastUsed;
      oldest = key;
    }
  }
  if (oldest) store.delete(oldest);
}
