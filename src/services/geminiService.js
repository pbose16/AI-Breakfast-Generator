import { MEAL_GENERATOR_PROMPT } from '../prompts';
import { API_ENDPOINTS } from '../constants/apiConstants';

export const generateMealsFromGemini = async ({ mealType, pastMealsStr, pantryStr, previouslySuggestedStr }) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('API key is missing. Please check your .env file or environment variables.');
    }

    const prompt = MEAL_GENERATOR_PROMPT
        .replace(/\$\{mealType\}/g, mealType)
        .replace('${pastMealsStr}', pastMealsStr)
        .replace('${pantryStr}', pantryStr)
        .replace('${previouslySuggestedStr}', previouslySuggestedStr);

    const response = await fetch(`${API_ENDPOINTS.GEMINI_GENERATE_CONTENT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Failed to generate. Please check your API key.');
    }

    const data = await response.json();
    const textObj = data.candidates[0]?.content?.parts[0]?.text || "[]";

    let options = [];
    try {
        options = JSON.parse(textObj);
    } catch (err) {
        throw new Error("AI returned an invalid response block. Could not parse JSON.");
    }

    // Map options to add youtube & web search links dynamically
    const finalOptions = options.map(opt => ({
        ...opt,
        youtube: `https://www.youtube.com/results?search_query=${encodeURIComponent(opt.title + ` bengali ${mealType} recipe`)}`,
        web: `https://www.google.com/search?q=${encodeURIComponent(opt.title + ' authentic bengali recipe')}`
    }));

    return finalOptions;
};
