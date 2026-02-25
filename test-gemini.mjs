import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey) {
    console.error("GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const models = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy to get the list
        // Note: The SDK doesn't have a direct 'listModels' in the simple GoogleGenAI class, 
        // you usually have to use the generativeAI.listModels() if available or just test specific ones.
        // Actually, let's just test the specific one we want.

        const testRender = async (modelName) => {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = ai.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("A small wooden cabin in the forest.");
                console.log(`- ${modelName} responded.`);
                // If it's an image model, we check candidates
                const candidates = result.response.candidates;
                console.log(`- Candidates: ${candidates?.length}`);
                if (candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                    console.log(`- SUCCESS: ${modelName} generated image data.`);
                } else {
                    console.log(`- INFO: ${modelName} generated text/other, not inline image data.`);
                }
            } catch (e) {
                console.log(`- FAILED: ${modelName} error: ${e.message}`);
            }
        };

        await testRender('gemini-2.5-flash-image');
        await testRender('gemini-1.5-flash');
        await testRender('gemini-1.5-pro');

    } catch (error) {
        console.error("Error during diagnostics:", error);
    }
}

listModels();
