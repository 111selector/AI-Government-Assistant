
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { languages } from '../context/AppContext';

// IMPORTANT: This check is for the browser environment where process.env is not defined.
// In a real production environment, the API key would be securely managed.
const API_KEY = typeof process !== 'undefined' ? process.env.API_KEY : "";

if (!API_KEY) {
    console.warn("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getSystemInstruction = (languageCode: string) => {
    const languageName = languages[languageCode as keyof typeof languages] || 'the user\'s specified language';
    return `You are a world-class AI Government Assistant. Your purpose is to provide accurate, helpful, and formal information to citizens about government services.
- You can help with reporting infrastructure problems (like roads, electricity, water), accessing public services (health, education, transport), understanding policies, and getting information on legal and tax matters.
- Always be polite, professional, and empathetic.
- Provide clear, step-by-step instructions when possible.
- If you use information from Google Search, it is crucial that you cite your sources.
- IMPORTANT: You MUST respond exclusively in ${languageName}. Do not switch languages.`;
};


export const getAIResponse = async (prompt: string, language: string): Promise<GenerateContentResponse> => {
    if (!API_KEY) {
        // Return a mock response if API key is not available
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            text: "This is a mock response as the API key is not configured. In a real scenario, I would provide helpful information about your query. To get a real response, please configure your Gemini API key.",
            candidates: [{
                content: {
                    parts: [{ text: "This is a mock response..." }],
                    role: 'model'
                },
                finishReason: 'STOP',
                index: 0,
                safetyRatings: [],
            }]
        } as unknown as GenerateContentResponse;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: getSystemInstruction(language),
                tools: [{ googleSearch: {} }],
            },
        });
        return response;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        throw new Error("Failed to get a response from the AI assistant. Please try again later.");
    }
};
   