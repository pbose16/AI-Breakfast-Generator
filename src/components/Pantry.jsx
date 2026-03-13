import { useState, useMemo } from 'react';

const COMMON_BREAKFAST_STAPLES = [
    'rice', 'atta', 'maida', 'besan', 'suji (semolina)', 'mustard oil', 'refined oil', 'ghee', 'butter', 'milk',
    'eggs', 'potatoes', 'onions', 'tomatoes', 'green chilies', 'garlic', 'ginger', 'coriander leaves',
    'coriander powder', 'cumin seeds', 'cumin powder', 'turmeric powder', 'red chili powder', 'garam masala',
    'black pepper', 'mustard seeds', 'panch phoron', 'bay leaves', 'dry red chilies', 'sugar', 'salt', 'tea',
    'coffee', 'masoor dal', 'moong dal', 'chana dal', 'toor dal', 'urad dal', 'kabuli chana', 'rajma',
    'chira (flattened rice)', 'muri (puffed rice)', 'paneer', 'curd (dahi)', 'green peas', 'carrots', 'cauliflower',
    'spinach', 'bread', 'biscuits', 'milk powder', 'hing', 'cardamom', 'cloves', 'cinnamon'
];

export default function Pantry({ ingredients, setIngredients }) {
    const [newIngredient, setNewIngredient] = useState('');
    const [refreshSeed, setRefreshSeed] = useState(0);

    const addIngredient = (e) => {
        e.preventDefault();
        if (!newIngredient.trim()) return;
        const lowerCaseIng = newIngredient.trim().toLowerCase();
        if (!ingredients.includes(lowerCaseIng)) {
            setIngredients([...ingredients, lowerCaseIng]);
        }
        setNewIngredient('');
    };

    const removeIngredient = (ingToRemove) => {
        setIngredients(ingredients.filter(ing => ing !== ingToRemove));
    };

    const handleRefresh = () => {
        setRefreshSeed(prev => prev + 1);
    };

    // Logic to determine recommended refills based on common staples they DON'T have
    const recommendedRefills = useMemo(() => {
        const ingredientSet = new Set(ingredients.map(i => i.toLowerCase()));

        // Find all missing staples
        let missing = COMMON_BREAKFAST_STAPLES.filter(staple => {
            return !ingredients.some(ing => ing.includes(staple)) && !ingredientSet.has(staple);
        });

        // Pseudo-randomly shuffle based on the refreshSeed state
        if (refreshSeed > 0) {
            missing = missing.sort(() => Math.random() - 0.5);
        }

        return missing.slice(0, 10); // Show top 10 missing staples
    }, [ingredients, refreshSeed]);

    return (
        <div className="panel glass">
            <h2>🛒 Pantry & Ingredients</h2>
            <p>List what you have so we can suggest recipes that use them.</p>

            <form onSubmit={addIngredient} className="input-group" style={{ marginTop: '1rem' }}>
                <input
                    type="text"
                    placeholder="e.g. Atta, Mustard Oil, Potatoes, Rice"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            {ingredients.length > 0 ? (
                <div className="tags">
                    {ingredients.map((ing, idx) => (
                        <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {ing}
                            <button
                                type="button"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'inherit',
                                    padding: 0,
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    lineHeight: 1
                                }}
                                onClick={() => removeIngredient(ing)}
                                aria-label={`Remove ${ing}`}
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.6 }}>Your pantry is empty.</p>
            )}

            {/* Recommendations Section */}
            <div className="recommendations">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ marginBottom: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Restock Suggestions
                    </h3>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        style={{
                            background: 'transparent',
                            color: 'var(--primary)',
                            padding: '4px 8px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: 'none',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10"></polyline>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                        Refresh
                    </button>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Consider adding these common staples:</p>
                <div className="tags">
                    {recommendedRefills.length > 0 ? (
                        recommendedRefills.map(refill => (
                            <span key={refill} className="tag refill-tag" style={{ cursor: 'pointer' }} onClick={() => setIngredients([...ingredients, refill])}>
                                + {refill}
                            </span>
                        ))
                    ) : (
                        <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>You are well stocked on basic staples!</span>
                    )}
                </div>
            </div>
        </div>
    );
}
