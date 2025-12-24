import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LifecycleResponse, GroundingSource } from "../types";

export const searchLifecycleInfo = async (query: string): Promise<LifecycleResponse> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined') {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert in IT Asset Management and Product Lifecycles. 
    Your goal is to provide a comprehensive view of technology product lifecycles.
    
    CRITICAL REQUIREMENT:
    Always include a clear Markdown table for version history.
    Format: | Version | Release Date | End of Support (EOS) | End of Life (EOL) |
    Ensure the table is continuous and uses standard Markdown syntax.
    
    Structure your response:
    - Heading: # [Product Name] Lifecycle Report
    - Summary section.
    - Detailed Version History Table.
    - Migration Path / Recommendations.
    
    Use the provided googleSearch tool for real-time accuracy.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: `Provide a detailed lifecycle and support audit for: ${query}`,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source Reference",
        uri: chunk.web.uri || "#",
      }));

    return {
      productName: query,
      summary: text,
      sources: sources,
    };
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    let errorMessage = error.message || "";
    
    // Attempt to parse JSON error if it's a stringified object
    try {
      if (typeof errorMessage === 'string' && errorMessage.startsWith('{')) {
        const parsed = JSON.parse(errorMessage);
        if (parsed.error) {
          if (parsed.error.code === 429) {
            throw new Error("QUOTA_EXHAUSTED");
          }
          errorMessage = parsed.error.message;
        }
      }
    } catch (e) {
      // If parsing fails, just use the original message
    }

    if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota")) {
      throw new Error("QUOTA_EXHAUSTED");
    }
    
    if (errorMessage.includes("not found")) {
      throw new Error("MODEL_NOT_AVAILABLE");
    }
    
    throw new Error(errorMessage || "Failed to retrieve lifecycle data. Please check your network connection.");
  }
};