import { useState } from 'react';

export default function PastDishes({ dishes, setDishes, mealType }) {
    const [newDish, setNewDish] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDishes = dishes.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const addDish = (e) => {
        e.preventDefault();
        if (!newDish.trim()) return;
        if (!dishes.includes(newDish.trim())) {
            setDishes([...dishes, newDish.trim()]);
        }
        setNewDish('');
    };

    const removeDish = (dishToRemove) => {
        setDishes(dishes.filter(dish => dish !== dishToRemove));
    };

    return (
        <div className="panel glass" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h2>{mealType === 'breakfast' ? '🍳' : mealType === 'lunch' ? '🍱' : '🌙'} Past {mealType.charAt(0).toUpperCase() + mealType.slice(1)}s</h2>
            <p>Add meals you liked to help us suggest variations or repeat options.</p>

            <form onSubmit={addDish} className="input-group" style={{ marginTop: '1rem' }}>
                <input
                    type="text"
                    placeholder={`e.g. ${mealType === 'breakfast' ? 'Luchi Alur Dom' : mealType === 'lunch' ? 'Bhat, Dal, Macher Jhol' : 'Ruti, Kosha Mangsho'}`}
                    value={newDish}
                    onChange={(e) => setNewDish(e.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            {dishes.length > 0 && (
                <input
                    type="text"
                    placeholder="Search past dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '1rem', padding: '0.5rem 1rem', fontSize: '0.9rem', width: '100%', borderRadius: '8px' }}
                />
            )}

            {dishes.length > 0 ? (
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
                    <div className="tags">
                        {filteredDishes.length > 0 ? (
                            filteredDishes.map((dish, idx) => (
                                <span key={idx} className="tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                    {dish}
                                    <button
                                        type="button"
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#9f1239', /* Alta Red */
                                            padding: 0,
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            lineHeight: 1,
                                            marginLeft: '4px'
                                        }}
                                        onClick={() => removeDish(dish)}
                                        aria-label={`Remove ${dish}`}
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))
                        ) : (
                            <p style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '0.9rem' }}>No matching dishes found.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p style={{ marginTop: '1rem', fontStyle: 'italic', opacity: 0.6 }}>No past dishes added yet.</p>
            )}
        </div>
    );
}
