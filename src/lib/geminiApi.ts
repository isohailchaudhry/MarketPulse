import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateMarketStrategy(product: string, insights: any[]) {
  const ai = getAiClient();
  
  const insightsSummary = insights.map(i => `- ${i.region}: Trend Score ${i.trend_score} (Source: ${i.source})`).join('\n');

  const prompt = `
    You are a Senior Market Strategist. Based on the following market insights for "${product}" in Pakistan:
    
    ${insightsSummary}
    
    Generate a comprehensive "Pakistan Market Entry Strategy" in JSON format with the following structure:
    {
      "target_audience": "description of the primary and secondary audience",
      "suggested_platforms": ["platform 1", "platform 2", ...],
      "seasonal_advice": "when to push marketing, seasonal trends in Pakistan",
      "risk_assessment": "potential challenges in the local market",
      "entry_tactic": "a specific step-by-step approach"
    }
    
    Keep the tone professional, data-driven, and specific to the Pakistan market.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
