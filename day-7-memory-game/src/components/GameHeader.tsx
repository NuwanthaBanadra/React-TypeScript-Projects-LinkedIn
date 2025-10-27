import React from 'react';
import './GameHeader.css';

interface GameHeaderProps {
    moves: number;
    time: number;
    isGameStarted: boolean;
    onRestart: () => void;
    onNewGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
    moves,
    time,
    isGameStarted,
    onRestart,
    onNewGame
}) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-header">
            <div className="game-stats">
                <div className="stat">
                    <span className="stat-label">Moves</span>
                    <span className="stat-value">{moves}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Time</span>
                    <span className="stat-value">{formatTime(time)}</span>
                </div>
            </div>

            <div className="game-controls">
                <button
                    onClick={onRestart}
                    className="control-btn restart-btn"
                    disabled={!isGameStarted}
                >
                    🔄 Restart
                </button>
                <button
                    onClick={onNewGame}
                    className="control-btn new-game-btn"
                >
                    🎮 New Game
                </button>
            </div>
        </div>
    );
};

export default GameHeader;