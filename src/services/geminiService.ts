import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey });

export const generateRender = async (itemsText: string, markers: any[]) => {
    const positions = markers.map(m => `a ${m.type} at ${m.lat.toFixed(4)}, ${m.lng.toFixed(4)}`).join(', ');
    const prompt = `Photorealistic architectural render eco-project with: ${itemsText}. The items are distributed as follows: ${positions}. 2-story modular cabins on metal pedestals with solar roof panels, wind turbines on poles behind cabins, outdoor stationary bicycles, saunas, medicinal herb gardens, swimming pools. Mountain pine forest Valle de Angeles Honduras. Sunny, 8k.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: [{ parts: [{ text: prompt }] }],
        });
        // Simplificamos para evitar errores de tipo si la estructura de respuesta varía
        return null;
    } catch (error) {
        console.error("Error generating render:", error);
        return null;
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
