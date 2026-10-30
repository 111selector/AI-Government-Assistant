import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { languages } from '../context/AppContext';
import { moderateContent } from './contentModeration';

const getApiKey = (): string => {
    try {
        if (typeof process !== 'undefined' && process.env?.API_KEY) return process.env.API_KEY;
        if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
    } catch {}
    try {
        // @ts-ignore
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
            // @ts-ignore
            return import.meta.env.VITE_GEMINI_API_KEY;
        }
    } catch {}
    return '';
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const getSystemInstruction = (languageCode: string) => {
    const languageName = languages[languageCode as keyof typeof languages] || 'the user\'s specified language';
    return `You are a world-class AI Government Assistant. Your purpose is to provide accurate, helpful, and formal information to citizens about government services.
- You can help with reporting infrastructure problems (like roads, electricity, water), accessing public services (health, education, transport), understanding policies, and getting information on legal and tax matters.
- Always be polite, professional, and empathetic.
- Enforce strict standards of decorum: refuse to generate or engage with insults, vulgarity, hate speech, or adult content.
- Provide clear, step-by-step instructions when possible.
- If you use information from Google Search, cite your sources.
- IMPORTANT: You MUST respond exclusively in ${languageName}. Do not switch languages.`;
};

export const getAIResponse = async (prompt: string, language: string): Promise<GenerateContentResponse> => {
    // Enforce server/service-level moderation guard
    const moderation = moderateContent(prompt);
    if (!moderation.isClean) {
        throw new Error(moderation.reason || "Content moderation rejected this query.");
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
