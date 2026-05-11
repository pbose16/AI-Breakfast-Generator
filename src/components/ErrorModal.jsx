import React from 'react';

export default function ErrorModal({ isOpen, errorMessage, onClose, onUseFallback }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="glass" style={{
                maxWidth: '450px',
                width: '90%',
                padding: '2rem',
                borderRadius: '24px',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖⚠️</div>
                <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>AI Generation Failed</h2>
                <p style={{ 
                    marginBottom: '1.5rem', 
                    fontSize: '0.95rem', 
                    color: 'var(--text-main)',
                    opacity: 0.9,
                    lineHeight: '1.5'
                }}>
                    {errorMessage || "We encountered an issue while trying to generate your Bengali meal options. This could be due to API limits or network issues."}
                </p>
                
                <div style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    marginBottom: '2rem',
                    fontSize: '0.85rem',
                    color: '#f87171',
                    textAlign: 'left',
                    fontFamily: 'monospace'
                }}>
                    <strong>Error Details:</strong><br/>
                    {errorMessage}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                        onClick={onUseFallback}
                        className="gen-btn"
                        style={{ padding: '0.8rem', fontSize: '1rem' }}
                    >
                        Use Fallback Suggestions
                    </button>
                    <button 
                        onClick={onClose}
                        style={{ 
                            background: 'transparent', 
                            border: '1px solid rgba(255,255,255,0.2)', 
                            color: 'var(--text-muted)',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
}
