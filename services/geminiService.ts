
import { GoogleGenAI, Type } from "@google/genai";
// Fix: Add .ts extension to module path
import type { Dilemma } from '../types.ts';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock response.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'mock_key' });

const dilemmaSchema = {
  type: Type.OBJECT,
  properties: {
    problem: {
      type: Type.STRING,
      description: "A short, real-world Python problem, 1-2 sentences long. e.g., 'You need to store a user's contact info (name, age, email) and access it quickly by key.'",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 4 Python data structure names: 'List', 'Tuple', 'Dictionary', 'Set'.",
    },
    answer: {
      type: Type.STRING,
      description: "The correct data structure from the options.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation of why that answer is correct.",
    },
  },
  required: ["problem", "options", "answer", "explanation"],
};

const mockDilemma: Dilemma = {
    problem: "You need to store a collection of unique tags for a blog post, and the order doesn't matter. Which data structure is most efficient for checking if a tag already exists?",
    options: ["List", "Tuple", "Dictionary", "Set"],
    answer: "Set",
    explanation: "Sets provide fast O(1) average time complexity for membership testing (checking for existence)."
};

export const generateDataStructureDilemma = async (): Promise<Dilemma> => {
  if (!process.env.API_KEY) {
    return mockDilemma;
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a new, unique Python data structure dilemma based on the provided schema. The problem should be distinct from previous examples.",
      config: {
        responseMimeType: "application/json",
        responseSchema: dilemmaSchema,
        temperature: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const parsedDilemma = JSON.parse(jsonText) as Dilemma;

    // Basic validation
    if (
      !parsedDilemma.problem ||
      !parsedDilemma.answer ||
      !parsedDilemma.explanation ||
      !Array.isArray(parsedDilemma.options) ||
      parsedDilemma.options.length !== 4
    ) {
      throw new Error("Invalid dilemma format received from API");
    }

    return parsedDilemma;
  } catch (error) {
    console.error("Error fetching dilemma from Gemini API, returning mock data:", error);
    return mockDilemma;
  }
};
