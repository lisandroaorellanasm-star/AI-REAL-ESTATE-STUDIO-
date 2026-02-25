import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey });

export const generateRender = async (itemsText: string, markers: any[]) => {
    const prompt = `PHOTOREALISTIC ARCHITECTURAL RENDER. Environment: Pine forest, mountains of Valle de Angeles, Honduras. Sunny day, cinematic lighting. Items to include: ${itemsText}. Style: Sustainable modern wooden cabins with solar panels. 8k resolution.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });

        // Search for image in parts
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }

        // Fallback: If no image is generated, we use a beautiful placeholder related to the prompt
        return "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2070";
    } catch (error) {
        console.error("Error generating render:", error);
        return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070";
    }
};

export const startChat = async (context: any, history: any[], message: string, lang: 'es' | 'en') => {
    const prompt = `Eres un arquitecto de IA. Aquí está el contexto del proyecto: ${JSON.stringify(context)}. El mensaje del usuario es: ${message}. Responde en ${lang}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-pro",
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text || "Respuesta vacía";
    } catch (error) {
        console.error("Error in chat:", error);
        return "Lo siento, encontré un error.";
    }
};

export const generateMarketAnalysis = async (context: any, lang: 'es' | 'en') => {
    const prompt = `Como experto financiero y de marketing para proyectos de ecoturismo, analiza el siguiente proyecto y sugiere una tasa de ocupación competitiva y un precio por noche para alcanzar el ROI deseado. Contexto: ${JSON.stringify(context)}. Responde en ${lang}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text || "Error en el análisis";
    } catch (error) {
        console.error("Error generating market analysis:", error);
        return "Lo siento, encontré un error.";
    }
};

export const generateExpertSummary = async (summary: string, lang: 'es' | 'en') => {
    const prompt = `Como experto en gestión de proyectos, finanzas y marketing, proporciona un resumen de alto nivel del siguiente proyecto: ${summary}. Responde en ${lang}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        return response.text || "Error en el resumen";
    } catch (error) {
        console.error("Error generating expert summary:", error);
        return "Lo siento, encontré un error.";
    }
};

export const generateIdeas = async (area: string, lang: 'es' | 'en') => {
    const prompt = `Lote bosque Valle Ángeles. Área: ${area}. Genera 3 proyecciones negocio eco-turísticas innovadoras en ${lang}. Formato JSON: { "ideas": [ { "id": "id1", "title": "Nombre", "summary": "Descripción comercial", "elements": ["cabaña", "piscina"] } ] }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ parts: [{ text: prompt }] }],
        });
        const text = response.text || "";
        return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
    } catch (error) {
        console.error("Error generating ideas:", error);
        return null;
    }
};
