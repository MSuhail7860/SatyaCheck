import { NextRequest, NextResponse } from "next/server";
import { Schema, SchemaType } from "@google/generative-ai";
import { getGeminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let model;
    try {
      model = getGeminiModel("gemini-2.5-flash");
    } catch (e: any) {
      console.error(e.message);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
    
    // Define the extended schema constraints.
    const responseSchema: Schema = {
      type: SchemaType.OBJECT,
      properties: {
        trustScore: {
          type: SchemaType.INTEGER,
          description: "A score from 0 to 100 where 0 is fake/scam and 100 is highly reliable truth.",
        },
        riskCategory: {
          type: SchemaType.STRING,
          description: "Primary category of this threat: one of 'Financial Scam', 'Health Misinformation', 'Political Manipulation', 'Job Fraud', 'Cyber Crime', or 'General'.",
        },
        language: {
          type: SchemaType.STRING,
          description: "Detected language of the input text, e.g. English, Hindi, Tamil, Telugu, Marathi, Bengali.",
        },
        viralRisk: {
          type: SchemaType.INTEGER,
          description: "Score from 0-100 estimating how likely this content is to spread virally and cause harm at scale.",
        },
        metrics: {
          type: SchemaType.OBJECT,
          properties: {
            logicalConsistency: { type: SchemaType.INTEGER, description: "Score from 0-100 on how logical the core claim is." },
            sourceCredibility: { type: SchemaType.INTEGER, description: "Score from 0-100 on the typical credibility of this type of claim/source." },
            factualAccuracy: { type: SchemaType.INTEGER, description: "Score from 0-100 based on verified facts." },
            emotionalManipulation: { type: SchemaType.INTEGER, description: "Score from 0-100 on how manipulative the language is (100 = highly manipulative)." }
          },
          required: ["logicalConsistency", "sourceCredibility", "factualAccuracy", "emotionalManipulation"],
          description: "Detailed sub-scores analyzing the claim."
        },
        techniques: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of manipulation techniques detected in the message, e.g. Sensationalism, Urgency tactics, False authority.",
        },
        verdict: {
          type: SchemaType.STRING,
          description: "A short, 1-2 sentence high-level verdict.",
        },
        explanation: {
          type: SchemaType.STRING,
          description: "Detailed step-by-step explanation breaking down why this is fake, misleading, or true.",
        },
        sources: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING, description: "Name of the publisher (e.g., AltNews, BOOM FactCheck, PIB, WHO)" },
              link: { type: SchemaType.STRING, description: "URL pointing to the fact-check or general authoritative source" }
            },
            required: ["title", "link"]
          },
          description: "List of 1 to 3 relevant real-world URLs for fact-checking this specific type of claim."
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

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
    
    const text = result.response.text();

    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Error analyzing message with Gemini:", error);
    return NextResponse.json({ error: "Failed to analyze message" }, { status: 500 });
  }
}
