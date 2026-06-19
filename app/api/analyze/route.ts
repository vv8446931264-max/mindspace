import { NextRequest, NextResponse } from "next/server";
import { JournalEntryRequestSchema } from "@/schemas/journalEntry";
import { scanForCrisis, CRISIS_HELPLINES, CRISIS_MESSAGE } from "@/lib/crisisScanner";
import { analyzeEntry } from "@/lib/vertexClient";
import {
  cacheGet,
  cacheSet,
  cacheKey,
  getInFlight,
  setInFlight,
} from "@/lib/cache";
import { checkRateLimit, maybeCleanup } from "@/lib/rateLimit";
import type { CrisisResponse, WellnessAnalysis } from "@/types";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
};

const MAX_BODY_BYTES = 2048;

export async function POST(req: NextRequest): Promise<NextResponse> {
  maybeCleanup();

  // Body size cap
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return errorResponse("Request too large", 413);
  }

  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests — please wait a moment before trying again." },
      {
        status: 429,
        headers: {
          ...SECURITY_HEADERS,
          "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)),
        },
      }
    );
  }

  // Parse and validate body
  let body: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) {
      return errorResponse("Request too large", 413);
    }
    body = JSON.parse(text);
  } catch {
    return errorResponse("Invalid JSON in request body", 400);
  }

  const parsed = JournalEntryRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: SECURITY_HEADERS }
    );
  }

  const entry = parsed.data;

  // Crisis scan — server-side defense-in-depth
  const scanResult = scanForCrisis(entry.text);
  if (scanResult.crisis) {
    // Log event only (no user content) for audit
    console.error(`[CRISIS_EVENT] ip=${ip} timestamp=${new Date().toISOString()}`);

    const crisisResponse: CrisisResponse = {
      crisisFlag: true,
      message: CRISIS_MESSAGE,
      helplines: [...CRISIS_HELPLINES],
    };
    return NextResponse.json(crisisResponse, {
      status: 200,
      headers: SECURITY_HEADERS,
    });
  }

  // Cache lookup
  const key = cacheKey(entry.text, entry.examContext);
  const cached = cacheGet(key);
  if (cached) {
    return NextResponse.json(cached, { status: 200, headers: SECURITY_HEADERS });
  }

  // Coalesce in-flight duplicates
  const inFlight = getInFlight(key);
  if (inFlight) {
    const result = await inFlight;
    return NextResponse.json(result, { status: 200, headers: SECURITY_HEADERS });
  }

  // AI analysis
  const analysisPromise = analyzeEntry(entry).then((result: WellnessAnalysis) => {
    cacheSet(key, result);
    return result;
  });
  setInFlight(key, analysisPromise);

  try {
    const result = await analysisPromise;
    return NextResponse.json(result, { status: 200, headers: SECURITY_HEADERS });
  } catch {
    return errorResponse("Something went wrong — please try again.", 500);
  }
}

function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status, headers: SECURITY_HEADERS });
}
