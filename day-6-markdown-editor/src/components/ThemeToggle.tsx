import React from 'react';
import './ThemeToggle.css';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onThemeChange: (theme: 'light' | 'dark') => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onThemeChange }) => {
    return (
        <div className="theme-toggle">
            <button
                onClick={() => onThemeChange('light')}
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                aria-label="Light theme"
            >
                ☀️ Light
            </button>
            <button
                onClick={() => onThemeChange('dark')}
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                aria-label="Dark theme"
            >
                🌙 Dark
            </button>
        </div>
    );
};

export default ThemeToggle;