import React from 'react';
import './WinModal.css';

interface WinModalProps {
    isOpen: boolean;
    moves: number;
    time: number;
    difficulty: string;
    onRestart: () => void;
    onNewGame: () => void;
}

const WinModal: React.FC<WinModalProps> = ({
    isOpen,
    moves,
    time,
    difficulty,
    onRestart,
    onNewGame
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    if (!isOpen) return null;

    return (
        <div className="win-modal-overlay">
            <div className="win-modal">
                <div className="win-header">
                    <span className="win-emoji">🎉</span>
                    <h2>Congratulations!</h2>
                    <span className="win-emoji">🎉</span>
                </div>

                <div className="win-stats">
                    <div className="win-stat">
                        <span className="win-stat-label">Difficulty</span>
                        <span className="win-stat-value">{difficulty}</span>
                    </div>
                    <div className="win-stat">
                        <span className="win-stat-label">Moves</span>
                        <span className="win-stat-value">{moves}</span>
                    </div>
                    <div className="win-stat">
                        <span className="win-stat-label">Time</span>
                        <span className="win-stat-value">{formatTime(time)}</span>
                    </div>
                </div>

                <div className="win-message">
                    <p>You've matched all the cards! Great memory skills! 🧠</p>
                </div>

                <div className="win-actions">
                    <button onClick={onRestart} className="win-btn play-again-btn">
                        🔄 Play Again
                    </button>
                    <button onClick={onNewGame} className="win-btn new-game-btn">
                        🎮 New Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinModal;