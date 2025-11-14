import React from 'react';

const SettingsScreen = ({ setPortfolio }) => {
    const handleClear = () => {
        if (window.confirm('Clear portfolio? Irreversible.')) {
            setPortfolio([]);
            localStorage.removeItem('portfolio');
            localStorage.removeItem('assetData');
        }
    };

    return (
        <div style={{ backgroundColor: '#1e293b', borderRadius: '1rem', padding: '2rem', border: '2px solid #3b82f6' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem' }}>Settings</h2>
            <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #334155', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>Portfolio</h3>
                <button
                    onClick={handleClear}
                    style={{ padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                    Clear All
                </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #334155' }}>
                <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '1rem' }}>About</h3>
                <p style={{ color: '#94a3b8' }}>v1.0 - Powered by Alpha Vantage</p>
            </div>
        </div>
    );
};

export default SettingsScreen;
