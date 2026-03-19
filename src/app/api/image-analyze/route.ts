import { NextRequest, NextResponse } from "next/server";
import { Schema, SchemaType } from "@google/generative-ai";
import { getGeminiModel } from "@/lib/gemini";

// ─── Response Schema ──────────────────────────────────────────────────────────

const responseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    trustScore: {
      type: SchemaType.INTEGER,
      description:
        "Authenticity score 0–100. 0 = clearly fake/AI-generated, 100 = highly authentic and unmodified.",
    },
    riskCategory: {
      type: SchemaType.STRING,
      description: "Primary category of this threat: one of 'Financial Scam', 'Health Misinformation', 'Political Manipulation', 'Job Fraud', 'Cyber Crime', or 'General'.",
    },
    language: {
      type: SchemaType.STRING,
      description: "Detected language of any text present in the image, e.g. English, Hindi, Tamil, Telugu. Use 'None' if no text detected.",
    },
    viralRisk: {
      type: SchemaType.INTEGER,
      description: "Score from 0-100 estimating how likely this image is to spread virally and cause harm at scale.",
    },
    metrics: {
      type: SchemaType.OBJECT,
      properties: {
        logicalConsistency: { type: SchemaType.INTEGER, description: "Score from 0-100 on visual and logical consistency (fewer artifacts = higher score)." },
        sourceCredibility: { type: SchemaType.INTEGER, description: "Score from 0-100 on the typical credibility of this type of image source." },
        factualAccuracy: { type: SchemaType.INTEGER, description: "Score from 0-100 based on verified context of the image." },
        emotionalManipulation: { type: SchemaType.INTEGER, description: "Score from 0-100 on how manipulative the imagery is (100 = highly manipulative/sensational)." }
      },
      required: ["logicalConsistency", "sourceCredibility", "factualAccuracy", "emotionalManipulation"],
      description: "Detailed sub-scores analyzing the image."
    },
    techniques: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description:
        "List of manipulation/misinformation flags detected, e.g. 'AI-Generated Face', 'Bad Photoshop', 'Misleading Caption', 'Out-of-Context Image', 'Viral Meme Format'.",
    },
    verdict: {
      type: SchemaType.STRING,
      description: "Short 1–2 sentence verdict on the image's authenticity.",
    },
    explanation: {
      type: SchemaType.STRING,
      description:
        "Detailed explanation referencing visual clues (edge artifacts, lighting inconsistencies, text overlays, metadata signs) or why this image format is commonly misused in Indian social media.",
    },
    sources: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: {
            type: SchemaType.STRING,
            description: "Name of the authoritative publisher (e.g. AltNews, BOOM FactCheck, PIB)",
          },
          link: {
            type: SchemaType.STRING,
            description: "URL to a relevant fact-check or official resource",
          },
        },
        required: ["title", "link"],
      },
      description: "1–3 relevant fact-checking or authoritative source URLs.",
    },
  },
  required: ["trustScore", "riskCategory", "language", "viralRisk", "metrics", "techniques", "verdict", "explanation", "sources"],
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `
You are an expert image forensics and misinformation analyst specialising in the Indian digital context.

Analyse the provided image and detect any of the following:
- AI-generated or deepfake faces/scenes
- Photo manipulation or Photoshop artifacts (edge bleeding, lighting mismatches, clone stamps)
- Misleading or out-of-context captions / text overlays
- Viral misinformation formats common in India (political rally doctoring, fake death/disaster news, WhatsApp forwards)
- Screenshots of fabricated news headlines or government notifications

Return ONLY valid JSON that strictly matches the provided schema. Do not include any explanatory text outside the JSON.
`.trim();

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // A. Environment variable validation — fail fast before any processing
  if (!process.env.GEMINI_API_KEY) {
    console.error("Image Analysis: GEMINI_API_KEY is not configured.");
    return NextResponse.json(
      { error: "Server misconfiguration: Missing API key" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body as {
      imageBase64?: string;
      mimeType?: string;
    };

    // B. Input validation
    if (!imageBase64 || typeof imageBase64 !== "string") {
      return NextResponse.json(
        { error: "imageBase64 is required and must be a string" },
        { status: 400 }
      );
    }
    if (!mimeType || typeof mimeType !== "string") {
      return NextResponse.json(
        { error: "mimeType is required and must be a string" },
        { status: 400 }
      );
    }

    // C. Base64 sanitization — strip data URI prefix if present
    // e.g. "data:image/png;base64,iVBORw0..." → "iVBORw0..."
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

    if (!cleanBase64) {
      return NextResponse.json(
        { error: "Provided imageBase64 is empty after sanitization" },
        { status: 400 }
      );
    }

    // D. Initialise Gemini model
    const model = getGeminiModel("gemini-2.5-flash");

    // E. Multimodal Gemini call with structured JSON output
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: ANALYSIS_PROMPT },
            {
              inlineData: {
                data: cleanBase64,
                mimeType,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const rawText = result.response.text();

    // F. Safe JSON parsing — Gemini may occasionally return malformed responses
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      console.error("Image Analysis: Gemini returned invalid JSON.", rawText.slice(0, 200));
      return NextResponse.json(
        { error: "AI returned an invalid response. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Gemini Image Analysis Error:", message);
    return NextResponse.json(
      { error: "Failed to analyze image. Please try again." },
      { status: 500 }
    );
  }
}
