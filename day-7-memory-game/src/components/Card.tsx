import React from 'react';
import { Card as CardType } from '../types/Game';
import './Card.css';

interface CardProps {
    card: CardType;
    onClick: (card: CardType) => void;
    isDisabled: boolean;
}

const Card: React.FC<CardProps> = ({ card, onClick, isDisabled }) => {
    const handleClick = (): void => {
        if (!isDisabled && !card.isFlipped && !card.isMatched) {
            onClick(card);
        }
    };

    return (
        <div
            className={`card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
            onClick={handleClick}
        >
            <div className="card-inner">
                <div className="card-front">
                    <span className="card-emoji">🎴</span>
                </div>
                <div className="card-back">
                    <span className="card-emoji">{card.emoji}</span>
                </div>
            </div>
        </div>
    );
};

export default Card;