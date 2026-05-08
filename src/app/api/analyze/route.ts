import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let client;
    try {
      client = getGeminiClient();
    } catch (e: unknown) {
      console.error((e as Error).message);
      return NextResponse.json({ error: `Internal Server Error: ${(e as Error).message}` }, { status: 500 });
    }

    // Define the extended schema constraints.
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        trustScore: {
          type: Type.INTEGER,
          description: "A score from 0 to 100 where 0 is fake/scam and 100 is highly reliable truth.",
        },
        riskCategory: {
          type: Type.STRING,
          description: "Primary category of this threat: one of 'Financial Scam', 'Health Misinformation', 'Political Manipulation', 'Job Fraud', 'Cyber Crime', or 'General'.",
        },
        language: {
          type: Type.STRING,
          description: "Detected language of the input text, e.g. English, Hindi, Tamil, Telugu, Marathi, Bengali.",
        },
        viralRisk: {
          type: Type.INTEGER,
          description: "Score from 0-100 estimating how likely this content is to spread virally and cause harm at scale.",
        },
        metrics: {
          type: Type.OBJECT,
          properties: {
            logicalConsistency: { type: Type.INTEGER, description: "Score from 0-100 on how logical the core claim is." },
            sourceCredibility: { type: Type.INTEGER, description: "Score from 0-100 on the typical credibility of this type of claim/source." },
            factualAccuracy: { type: Type.INTEGER, description: "Score from 0-100 based on verified facts." },
            emotionalManipulation: { type: Type.INTEGER, description: "Score from 0-100 on how manipulative the language is (100 = highly manipulative)." }
          },
          required: ["logicalConsistency", "sourceCredibility", "factualAccuracy", "emotionalManipulation"],
          description: "Detailed sub-scores analyzing the claim.",
        },
        techniques: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of manipulation techniques detected in the message, e.g. Sensationalism, Urgency tactics, False authority.",
        },
        verdict: {
          type: Type.STRING,
          description: "A short, 1-2 sentence high-level verdict.",
        },
        explanation: {
          type: Type.STRING,
          description: "Detailed step-by-step explanation breaking down why this is fake, misleading, or true.",
        },
        sources: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Name of the publisher (e.g., AltNews, BOOM FactCheck, PIB, WHO)" },
              link: { type: Type.STRING, description: "URL pointing to the fact-check or general authoritative source" }
            },
            required: ["title", "link"]
          },
          description: "List of 1 to 3 relevant real-world URLs for fact-checking this specific type of claim.",
        }
      },
      required: ["trustScore", "riskCategory", "language", "viralRisk", "metrics", "techniques", "verdict", "explanation", "sources"],
    };

    const prompt = `
Analyze the following message for misinformation, specifically in an Indian context (e.g. WhatsApp forwards, RBI/KYC scams, fake health remedies, political manipulation, etc.).

Return ONLY JSON matching the scheme. Ensure the "sources" array contains plausible URLs from recognized fact-checkers like AltNews, BOOM Live, PIB Fact Check, or official government portals relevant to the topic.

Message to analyze:
"""
${message}
"""`;

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    const text = result.text;

    return NextResponse.json(JSON.parse(text ?? "{}"));
  } catch (error) {
    console.error("Error analyzing message with Gemini:", error);
    return NextResponse.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}
