export interface Card {
    id: string;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
    emoji: string;
}

export interface GameSettings {
    difficulty: 'easy' | 'medium' | 'hard';
    gridSize: number;
    cardCount: number;
}

export interface GameState {
    cards: Card[];
    moves: number;
    time: number;
    isGameStarted: boolean;
    isGameCompleted: boolean;
    firstSelectedCard: Card | null;
    secondSelectedCard: Card | null;
    isChecking: boolean;
}

export interface Score {
    moves: number;
    time: number;
    date: string;
    difficulty: string;
}