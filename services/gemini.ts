
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LifecycleResponse, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchLifecycleInfo = async (query: string): Promise<LifecycleResponse> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert in IT Asset Management and Product Lifecycles. 
    Your goal is to provide accurate End of Life (EOL), End of Support (EOS), and General Availability (GA) dates for technology products (software and hardware).
    
    Structure your response clearly. Use Markdown tables if multiple versions are relevant. 
    Include:
    1. A clear heading for the product.
    2. A summary of current status.
    3. A table with Version, Release Date, End of Support, and End of Extended Support dates.
    4. Any specific recommendations for migration if applicable.
    
    Be concise but thorough. Use the provided search tools to ensure the data is up-to-date.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: `Search for the End of Support and End of Life dates for: ${query}`,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    
    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "Source",
        uri: chunk.web.uri || "#",
      }));

    return {
      productName: query,
      summary: text,
      sources: sources,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to retrieve lifecycle data. Please try again.");
  }
};
