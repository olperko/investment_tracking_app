import React from 'react';
import { Home, BarChart3, Settings } from 'lucide-react';

const Navigation = ({ currentScreen, onScreenChange }) => {
    const navItems = [
        { key: 'portfolio', icon: <Home size={20} />, label: 'Portfolio' },
        { key: 'analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
        { key: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <nav style={{
            maxWidth: '1400px',
            margin: '0 auto 2rem',
            padding: '0 1rem',
            display: 'flex',
            gap: '1rem',
            borderBottom: '2px solid #334155',
            paddingBottom: '1rem'
        }}>
            {navItems.map(({ key, icon, label }) => (
                <button
                    key={key}
                    onClick={() => onScreenChange(key)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: currentScreen === key ? '#3b82f6' : 'transparent',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        if (currentScreen !== key) e.currentTarget.style.backgroundColor = '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                        if (currentScreen !== key) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-current={currentScreen === key ? 'page' : undefined}
                >
                    {icon} {label}
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
