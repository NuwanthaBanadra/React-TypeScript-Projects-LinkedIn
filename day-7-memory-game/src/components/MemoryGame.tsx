import React, { useState, useEffect, useCallback } from 'react';
import { Card, GameSettings, GameState } from '../types/Game';
import GameBoard from './GameBoard';
import GameHeader from './GameHeader';
import DifficultySelector from './DifficultySelector';
import WinModal from './WinModal';
import './MemoryGame.css';

const MemoryGame: React.FC = () => {
    // Available emojis for cards
    const emojiSets = {
        easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
        medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
        hard: [
            '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
            '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦'
        ]
    };

    const [settings, setSettings] = useState<GameSettings>({
        difficulty: 'easy',
        gridSize: 4,
        cardCount: 8
    });

    const [gameState, setGameState] = useState<GameState>({
        cards: [],
        moves: 0,
        time: 0,
        isGameStarted: false,
        isGameCompleted: false,
        firstSelectedCard: null,
        secondSelectedCard: null,
        isChecking: false
    });

    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    // Initialize cards based on difficulty
    const initializeCards = useCallback((): Card[] => {
        const emojis = emojiSets[settings.difficulty];
        const cards: Card[] = [];

        // Create pairs of cards
        emojis.forEach((emoji, index) => {
            cards.push(
                {
                    id: `card-${index}-1`,
                    value: emoji,
                    isFlipped: false,
                    isMatched: false,
                    emoji: emoji
                },
                {
                    id: `card-${index}-2`,
                    value: emoji,
                    isFlipped: false,
                    isMatched: false,
                    emoji: emoji
                }
            );
        });

        // Shuffle cards
        return cards.sort(() => Math.random() - 0.5);
    }, [settings.difficulty]);

    // Start new game
    const startNewGame = (): void => {
        const newCards = initializeCards();
        setGameState({
            cards: newCards,
            moves: 0,
            time: 0,
            isGameStarted: true,
            isGameCompleted: false,
            firstSelectedCard: null,
            secondSelectedCard: null,
            isChecking: false
        });

        // Start timer
        if (timer) clearInterval(timer);
        const newTimer = setInterval(() => {
            setGameState(prev => ({ ...prev, time: prev.time + 1 }));
        }, 1000);
        setTimer(newTimer);
    };

    // Restart current game
    const restartGame = (): void => {
        const newCards = initializeCards();
        setGameState(prev => ({
            ...prev,
            cards: newCards,
            moves: 0,
            time: 0,
            isGameCompleted: false,
            firstSelectedCard: null,
            secondSelectedCard: null,
            isChecking: false
        }));
    };

    // Handle card click
    const handleCardClick = (clickedCard: Card): void => {
        if (
            gameState.isChecking ||
            clickedCard.isFlipped ||
            clickedCard.isMatched
        ) {
            return;
        }

        const newCards = gameState.cards.map(card =>
            card.id === clickedCard.id ? { ...card, isFlipped: true } : card
        );

        setGameState(prev => {
            const newState = { ...prev, cards: newCards };

            if (!prev.firstSelectedCard) {
                // First card selection
                return { ...newState, firstSelectedCard: clickedCard };
            } else {
                // Second card selection
                newState.secondSelectedCard = clickedCard;
                newState.isChecking = true;
                newState.moves += 1;

                // Check for match
                if (prev.firstSelectedCard.value === clickedCard.value) {
                    // Match found
                    setTimeout(() => {
                        setGameState(prevState => {
                            const updatedCards = prevState.cards.map(card =>
                                card.value === clickedCard.value
                                    ? { ...card, isMatched: true }
                                    : card
                            );

                            const isGameCompleted = updatedCards.every(card => card.isMatched);

                            return {
                                ...prevState,
                                cards: updatedCards,
                                isChecking: false,
                                firstSelectedCard: null,
                                secondSelectedCard: null,
                                isGameCompleted
                            };
                        });
                    }, 500);
                } else {
                    // No match - flip cards back
                    setTimeout(() => {
                        setGameState(prevState => ({
                            ...prevState,
                            cards: prevState.cards.map(card =>
                                card.id === prevState.firstSelectedCard?.id ||
                                    card.id === prevState.secondSelectedCard?.id
                                    ? { ...card, isFlipped: false }
                                    : card
                            ),
                            isChecking: false,
                            firstSelectedCard: null,
                            secondSelectedCard: null
                        }));
                    }, 1000);
                }

                return newState;
            }
        });
    };

    // Handle settings change
    const handleSettingsChange = (newSettings: GameSettings): void => {
        setSettings(newSettings);
        if (gameState.isGameStarted) {
            // If game is in progress, ask for confirmation
            if (window.confirm('Changing difficulty will start a new game. Continue?')) {
                startNewGame();
            }
        }
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    // Initialize game on first render
    useEffect(() => {
        const initialCards = initializeCards();
        setGameState(prev => ({ ...prev, cards: initialCards }));
    }, [initializeCards]);

    return (
        <div className="memory-game">
            <div className="game-container">
                <div className="game-sidebar">
                    <DifficultySelector
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        isGameStarted={gameState.isGameStarted}
                    />

                    <div className="game-instructions">
                        <h3>How to Play</h3>
                        <ul>
                            <li>Click on cards to flip them</li>
                            <li>Match pairs of identical cards</li>
                            <li>Complete the game with fewest moves and time</li>
                            <li>Different difficulties change grid size</li>
                        </ul>
                    </div>
                </div>

                <div className="game-main">
                    <GameHeader
                        moves={gameState.moves}
                        time={gameState.time}
                        isGameStarted={gameState.isGameStarted}
                        onRestart={restartGame}
                        onNewGame={startNewGame}
                    />

                    <GameBoard
                        cards={gameState.cards}
                        onCardClick={handleCardClick}
                        isDisabled={gameState.isChecking}
                        gridSize={settings.gridSize}
                    />

                    {!gameState.isGameStarted && (
                        <div className="start-prompt">
                            <h2>Ready to Play?</h2>
                            <p>Select a difficulty and start the game to begin!</p>
                            <button onClick={startNewGame} className="start-game-btn">
                                🎯 Start Game
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <WinModal
                isOpen={gameState.isGameCompleted}
                moves={gameState.moves}
                time={gameState.time}
                difficulty={settings.difficulty}
                onRestart={restartGame}
                onNewGame={startNewGame}
            />
        </div>
    );
};

export default MemoryGame;