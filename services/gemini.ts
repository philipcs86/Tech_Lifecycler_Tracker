
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { LifecycleResponse, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchLifecycleInfo = async (query: string): Promise<LifecycleResponse> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert in IT Asset Management and Product Lifecycles. 
    Your goal is to provide a comprehensive view of technology product lifecycles (software and hardware).
    
    CRITICAL REQUIREMENT:
    You MUST provide a detailed historical table of versions.
    Include as many past and current versions as possible to show the product's evolution.
    
    For each version, include:
    1. Version Number/Name
    2. Release Date (General Availability)
    3. End of Support (EOS) / End of Mainstream Support
    4. End of Life (EOL) / End of Extended Support
    
    Structure your response:
    - Heading: [Product Name] Lifecycle Overview
    - Summary: Brief current status (e.g., "Version X is the current stable release, Version Y reached EOL on...")
    - Table: Detailed Version History with all milestones.
    - Migration Path: Recommendations for moving from older versions to supported ones.
    
    Use the provided search tools to ensure the data is accurate and up-to-date.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: `Provide a comprehensive version history and end-of-support timeline for: ${query}`,
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
