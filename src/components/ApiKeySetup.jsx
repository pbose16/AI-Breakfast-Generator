import { useState } from 'react';

export default function ApiKeySetup({ apiKey, setApiKey }) {
    const [inputVal, setInputVal] = useState(apiKey || '');
    const [isOpen, setIsOpen] = useState(!apiKey);

    const handleSave = (e) => {
        e.preventDefault();
        setApiKey(inputVal.trim());
        if (inputVal.trim()) {
            setIsOpen(false);
        }
    };

    if (!isOpen) {
        return (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        boxShadow: 'none'
                    }}
                >
                    ⚙️ Update API Key
                </button>
            </div>
        );
    }

    return (
        <div className="panel glass" style={{ marginTop: '2rem', borderColor: 'rgba(217, 119, 6, 0.4)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>🔑 Gemini API Connection</h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                To generate real AI suggestions, please provide your Google Gemini API Key. Your key is saved locally in your browser and never sent anywhere except the official Google API.
            </p>

            <form onSubmit={handleSave} className="input-group" style={{ marginBottom: 0 }}>
                <input
                    type="password"
                    placeholder="Enter your Gemini API Key..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    required
                />
                <button type="submit">Save Key</button>
            </form>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Google AI Studio</a>.
            </div>
        </div>
    );
}
