import { API_ENDPOINTS } from '../../src/constants/apiConstants.js';
import { MEAL_GENERATOR_PROMPT } from '../../src/prompts/index.js';

export default async (req) => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'API key not configured on server.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: 'Invalid request body.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const { mealType, pastMealsStr, pantryStr, previouslySuggestedStr } = body;

    const prompt = MEAL_GENERATOR_PROMPT
        .replace(/\$\{mealType\}/g, mealType)
        .replace('${pastMealsStr}', pastMealsStr)
        .replace('${pantryStr}', pantryStr)
        .replace('${previouslySuggestedStr}', previouslySuggestedStr);

    const geminiResponse = await fetch(`${API_ENDPOINTS.GEMINI_GENERATE_CONTENT}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        })
    });

    const data = await geminiResponse.json();

    return new Response(JSON.stringify(data), {
        status: geminiResponse.status,
        headers: { 'Content-Type': 'application/json' }
    });
};

export const config = { path: '/.netlify/functions/generateMeals' };
