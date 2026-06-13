import type { ApiResponse, JournalEntryRequest } from "@/types";

/** Result of a POST /api/analyze call, normalized for the UI layer. */
export type AnalyzeResult =
  | { ok: true; data: ApiResponse }
  | { ok: false; message: string };

/**
 * Sends a journal entry to the analysis endpoint and maps every outcome
 * (success, HTTP error, rate limit, network failure) to a user-safe shape.
 */
export async function requestAnalysis(
  body: JournalEntryRequest
): Promise<AnalyzeResult> {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: ApiResponse | { error?: string } = await res.json();

    if (!res.ok) {
      const message =
        res.status === 429
          ? "Too many requests — please wait a moment before trying again."
          : (data as { error?: string }).error ??
            "Something went wrong. Please try again.";
      return { ok: false, message };
    }

    return { ok: true, data: data as ApiResponse };
  } catch {
    return {
      ok: false,
      message: "Connection issue — please check your network and try again.",
    };
  }
}
