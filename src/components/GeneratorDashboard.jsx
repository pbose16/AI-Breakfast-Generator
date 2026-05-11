import { useState, useEffect } from 'react';
import { generateMealsFromGemini } from '../services/geminiService';
import { getFallbackMeals } from '../constants/fallbackMeals';
import ErrorModal from './ErrorModal';

export default function GeneratorDashboard({ ingredients, pastDishes, mealType }) {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [previousGenerations, setPreviousGenerations] = useState([]);
    const [showFallback, setShowFallback] = useState(false);

    useEffect(() => {
        setResults([]);
        setErrorMsg('');
        setPreviousGenerations([]);
    }, [mealType]);

    const generateOptions = async () => {
        setLoading(true);
        setResults([]);
        setErrorMsg('');

        try {
            const pastMealsStr = pastDishes.length > 0 ? pastDishes.join(', ') : 'None';
            const pantryStr = ingredients.length > 0 ? ingredients.join(', ') : 'None';
            const previouslySuggestedStr = previousGenerations.length > 0 ? previousGenerations.join(', ') : 'None';

            const finalOptions = await generateMealsFromGemini({
                mealType,
                pastMealsStr,
                pantryStr,
                previouslySuggestedStr
            });

            // Save the titles to prevent duplicates in next generate clicks
            setPreviousGenerations(prev => {
                const newTitles = finalOptions.map(o => o.title);
                return [...prev, ...newTitles];
            });

            setResults(finalOptions);
        } catch (error) {
            console.error('Generation Error:', error);
            const msg = error.message || 'An error occurred during generation.';
            setErrorMsg(msg);
            setResults(getFallbackMeals(mealType, 10));
            setShowFallback(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="generator">
            <button
                className="gen-btn"
                onClick={generateOptions}
                disabled={loading}
            >
                {loading ? (
                    <>

                        <span className="spinner"></span> Generating AI Magic...
                    </>
                ) : (
                    `✨ Generate ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Options ✨`
                )}
            </button>

            {errorMsg && (
                <div style={{ marginTop: '1rem', color: '#dc2626', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                    ⚠️ {errorMsg}
                </div>
            )}

            {/* Results Section */}
            {results.length > 0 && (
                <div className="results">
                    {results.map((option) => (
                        <div key={option.id} className="result-card glass">
                            {option.imageUrl && (
                                <img
                                    src={option.imageUrl}
                                    alt={option.title}
                                    loading="lazy"
                                    className="card-img"
                                />
                            )}
                            <div className="result-card-content">
                                <h3>{option.title}</h3>
                                <div className="tags">
                                    {option.tags.map(tag => (
                                        <span key={tag} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <p style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    {option.desc}
                                </p>

                                <div className="links">
                                    <a href={option.youtube} target="_blank" rel="noopener noreferrer" className="link" style={{ color: '#ef4444' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                        </svg>
                                        YouTube
                                    </a>
                                    <a href={option.web} target="_blank" rel="noopener noreferrer" className="link" style={{ color: '#3b82f6', marginLeft: 'auto' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="2" y1="12" x2="22" y2="12"></line>
                                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                        </svg>
                                        Web Search
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showFallback && (
                <ErrorModal 
                    isOpen={showFallback}
                    errorMessage={errorMsg}
                    onClose={() => setShowFallback(false)}
                    onUseFallback={() => setShowFallback(false)}
                />
            )}
        </div>
    );
}
