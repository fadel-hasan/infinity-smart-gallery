
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const IMAGE_MODEL = 'gemini-2.5-flash-image';
const TEXT_MODEL = 'gemini-2.5-flash';

/**
 * Generates an image based on a text prompt.
 */
export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const mimeType = part.inlineData.mimeType || 'image/png';
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Edits an existing image based on a text prompt.
 */
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    const mimeMatch = base64Image.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const outMimeType = part.inlineData.mimeType || 'image/png';
        return `data:${outMimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

/**
 * Classifies a prompt into one of the existing categories OR suggests a new one.
 */
export const classifyPrompt = async (prompt: string, existingCategories: string[]): Promise<string> => {
  try {
    // We exclude 'All' from the classification logic
    const validCategories = existingCategories.filter(c => c !== 'All').join(', ');
    
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `You are an intelligent archive librarian.
      Task: Analyze the Main Subject of the image prompt and assign a Category.
      
      Existing Categories: [${validCategories}]
      
      Rules:
      1. **Subject Priority**: If the prompt describes a specific noun (e.g., "A Woman", "The Batman", "A red Ferrari", "A Sushi platter"), you MUST return that specific Noun as the category (e.g., "Woman", "Batman", "Cars", "Food"). 
      2. **Create New**: Do NOT force specific subjects into generic categories like "Urban" or "Nature" if a specific one fits better. Create the new category.
      3. **Existing**: Only use an existing category if it is a perfect fit (e.g. "Trees in a forest" -> "Nature").
      4. **Format**: Return a Single Word (Title Case). Max 2 words if absolutely necessary.
      
      Prompt: "${prompt}"
      
      Return only the Category Name string.`,
    });
    
    let text = response.text?.trim();
    
    if (!text) return 'Abstract';

    // Remove any accidental punctuation or filler
    text = text.replace(/[".]/g, '');
    
    // Capitalize first letter just in case
    text = text.charAt(0).toUpperCase() + text.slice(1);

    return text;
  } catch (error) {
    console.error("Classification failed, defaulting to Abstract", error);
    return 'Abstract';
  }
};
