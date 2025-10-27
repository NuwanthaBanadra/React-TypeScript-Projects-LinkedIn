import React from 'react';
import { GameSettings } from '../types/Game';
import './DifficultySelector.css';

interface DifficultySelectorProps {
    settings: GameSettings;
    onSettingsChange: (settings: GameSettings) => void;
    isGameStarted: boolean;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
    settings,
    onSettingsChange,
    isGameStarted
}) => {
    const difficultyLevels = [
        {
            level: 'easy',
            label: 'Easy',
            gridSize: 4,
            cardCount: 8,
            description: '4x4 Grid (8 pairs)'
        },
        {
            level: 'medium',
            label: 'Medium',
            gridSize: 4,
            cardCount: 10,
            description: '4x5 Grid (10 pairs)'
        },
        {
            level: 'hard',
            label: 'Hard',
            gridSize: 6,
            cardCount: 18,
            description: '6x6 Grid (18 pairs)'
        }
    ];

    const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard'): void => {
        const selectedLevel = difficultyLevels.find(diff => diff.level === level);
        if (selectedLevel) {
            onSettingsChange({
                difficulty: level,
                gridSize: selectedLevel.gridSize,
                cardCount: selectedLevel.cardCount
            });
        }
    };

    return (
        <div className="difficulty-selector">
            <h3>Select Difficulty</h3>
            <div className="difficulty-options">
                {difficultyLevels.map((diff) => (
                    <button
                        key={diff.level}
                        onClick={() => handleDifficultyChange(diff.level as 'easy' | 'medium' | 'hard')}
                        className={`difficulty-btn ${settings.difficulty === diff.level ? 'active' : ''}`}
                        disabled={isGameStarted}
                    >
                        <span className="difficulty-label">{diff.label}</span>
                        <span className="difficulty-description">{diff.description}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DifficultySelector;