import React from 'react';
import './ThemeSelector.css';

interface ThemeSelectorProps {
    currentTheme: 'light' | 'dark' | 'professional';
    onThemeChange: (theme: 'light' | 'dark' | 'professional') => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    currentTheme,
    onThemeChange
}) => {
    const themes = [
        { id: 'light', name: 'Light', icon: '☀️' },
        { id: 'dark', name: 'Dark', icon: '🌙' },
        { id: 'professional', name: 'Professional', icon: '💼' }
    ] as const;

    return (
        <div className="theme-selector">
            <span className="theme-label">Theme:</span>
            <div className="theme-options">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={`theme-btn ${currentTheme === theme.id ? 'active' : ''}`}
                        title={theme.name}
                    >
                        <span className="theme-icon">{theme.icon}</span>
                        <span className="theme-name">{theme.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSelector;