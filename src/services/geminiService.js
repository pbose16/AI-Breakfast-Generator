export const generateMealsFromGemini = async ({ mealType, pastMealsStr, pantryStr, previouslySuggestedStr }) => {
    const response = await fetch('/.netlify/functions/generateMeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealType, pastMealsStr, pantryStr, previouslySuggestedStr })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || 'Failed to generate. Please try again.');
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
