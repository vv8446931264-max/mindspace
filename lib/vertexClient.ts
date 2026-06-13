import { GoogleGenAI } from "@google/genai";
import { WellnessAnalysisSchema } from "@/schemas/wellnessAnalysis";
import type { ExamContext, JournalEntryRequest, WellnessAnalysis } from "@/types";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (client) return client;
  const project = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION ?? "us-central1";
  if (!project) throw new Error("GCP_PROJECT_ID not set");
  client = new GoogleGenAI({ vertexai: true, project, location });
  return client;
}

const MODEL = process.env.GCP_GEMINI_MODEL ?? "gemini-2.5-flash";

const DISCLAIMER =
  "This is an AI wellness companion, not a substitute for professional mental health care.";

// Safe fallback — never mentions clinical terms, always warm
const FALLBACK_ANALYSIS: WellnessAnalysis = {
  stressTriggers: [
    "Academic pressure and high expectations",
    "Fatigue from long study hours",
  ],
  emotionalPatterns:
    "You're carrying a lot right now, and that's completely understandable given how much is at stake. These feelings are a signal to pause and take care of yourself.",
  copingStrategy: {
    title: "Grounding Pause",
    description:
      "Take 5 minutes away from your study material. Drink water, step outside if possible, and remind yourself of one thing you did well today — no matter how small.",
    durationMinutes: 5,
    examRelevance:
      "Short breaks improve retention and reduce cortisol, helping you absorb more in your next study session.",
  },
  mindfulnessExercise: {
    name: "4-7-8 Breathing",
    steps: [
      "Sit comfortably and close your eyes",
      "Breathe in through your nose for 4 counts",
      "Hold your breath for 7 counts",
      "Breathe out completely through your mouth for 8 counts",
      "Repeat 4 times — you'll feel calmer within 2 minutes",
    ],
    durationMinutes: 5,
    type: "breathing",
  },
  motivationalMessage:
    "Every expert was once a student who kept going. You showed up today — that's what matters.",
  crisisFlag: false,
  disclaimer: DISCLAIMER,
};

function buildSystemPrompt(examContext: ExamContext): string {
  const examDescriptions: Record<ExamContext, string> = {
    JEE: "JEE (Joint Entrance Examination) for IIT/NIT admission — Physics, Chemistry, Math",
    NEET: "NEET (National Eligibility Entrance Test) for medical college admission — Biology, Physics, Chemistry",
    CUET: "CUET (Common University Entrance Test) for central university admission",
    CAT: "CAT (Common Admission Test) for IIM/MBA admission — Quant, Verbal, DILR",
    GATE: "GATE (Graduate Aptitude Test in Engineering) for M.Tech/PSU admission",
    UPSC: "UPSC Civil Services Examination — one of India's most demanding exams",
    Board: "Board examinations (CBSE/ICSE/State) — class 10 or 12",
    Other: "competitive exam preparation",
  };

  return `You are MindSpace, an empathetic wellness companion for Indian students preparing for ${examDescriptions[examContext]}.

You analyze journal entries to identify stress triggers and emotional patterns. You speak directly to the student using "you" — warm and specific, like a caring senior who passed the same exam.

ABSOLUTE RULES:
- Never diagnose any mental health condition
- Never prescribe or suggest medication
- Never claim to replace professional mental health care
- Never minimize the student's distress
- Never use toxic positivity ("just think positive!", "you're overthinking it")
- Never use clinical or cold language

Your response MUST be valid JSON only — no markdown, no explanation, just the JSON object.

JSON schema:
{
  "stressTriggers": ["string (max 80 chars)", "string (max 80 chars)"],  // 1-3 items, specific to what the student wrote
  "emotionalPatterns": "string (max 300 chars)",  // 1-2 sentences, observational not diagnostic
  "copingStrategy": {
    "title": "string (max 50 chars)",
    "description": "string (max 200 chars)",
    "durationMinutes": number (1-30),
    "examRelevance": "string (max 100 chars) — specifically why this helps for ${examContext}"
  },
  "mindfulnessExercise": {
    "name": "string (max 50 chars)",
    "steps": ["string (max 100 chars)", ...],  // 3-5 steps
    "durationMinutes": number (2-15),
    "type": one of: "breathing" | "grounding" | "visualization" | "body_scan" | "journaling_prompt"
  },
  "motivationalMessage": "string (max 150 chars) — warm, specific to ${examContext}, not generic",
  "crisisFlag": false
}`;
}

export async function analyzeEntry(
  entry: JournalEntryRequest
): Promise<WellnessAnalysis> {
  const key = cacheKeyFor(entry);
  const ai = getClient();

  const userContent = `Exam: ${entry.examContext}
Mood today: ${entry.moodLevel}/10
Emotions selected: ${entry.emotions.join(", ")}
Study hours today: ${entry.studyHoursToday}h
Journal entry: ${entry.text}`;

  async function attempt(extraContext?: string): Promise<WellnessAnalysis> {
    const systemPrompt = buildSystemPrompt(entry.examContext as ExamContext);
    const fullPrompt = extraContext
      ? `${userContent}\n\nPrevious attempt failed validation: ${extraContext}\nPlease fix and return valid JSON only.`
      : userContent;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const text = response.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = WellnessAnalysisSchema.parse(parsed);
    return {
      ...validated,
      crisisFlag: false,
      disclaimer: DISCLAIMER,
    };
  }

  try {
    return await attempt();
  } catch (firstError) {
    try {
      const errorMsg =
        firstError instanceof Error ? firstError.message : "Validation failed";
      return await attempt(errorMsg);
    } catch {
      return FALLBACK_ANALYSIS;
    }
  }
}

// Exported for use in route.ts
export function cacheKeyFor(entry: JournalEntryRequest): string {
  return `${entry.examContext}:${entry.text.trim().toLowerCase().slice(0, 200)}`;
}
