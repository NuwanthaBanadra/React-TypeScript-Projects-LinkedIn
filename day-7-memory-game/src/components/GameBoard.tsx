import React from 'react';
import { Card as CardType } from '../types/Game';
import Card from './Card';
import './GameBoard.css';

interface GameBoardProps {
    cards: CardType[];
    onCardClick: (card: CardType) => void;
    isDisabled: boolean;
    gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
    cards,
    onCardClick,
    isDisabled,
    gridSize
}) => {
    const gridStyle = {
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
    };

    return (
        <div className="game-board" style={gridStyle}>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    card={card}
                    onClick={onCardClick}
                    isDisabled={isDisabled}
                />
            ))}
        </div>
    );
};

export default GameBoard;