export type CalculatorMode = 'basic' | 'scientific';

export type Operation =
    | '+' | '-' | '×' | '÷'
    | 'sin' | 'cos' | 'tan'
    | 'log' | 'ln' | '√'
    | 'x²' | 'x³' | 'x^y'
    | '1/x' | 'π' | 'e'
    | '=' | 'C' | 'CE'
    | '%' | '±' | '.'
    | 'M+' | 'M-' | 'MR' | 'MC';

export interface CalculatorState {
    display: string;
    previousValue: number | null;
    operation: Operation | null;
    waitingForNewValue: boolean;
    memory: number;
    history: string[];
    isScientific: boolean;
    theme: 'light' | 'dark' | 'professional';
}

export interface CalculatorButton {
    label: string;
    operation: Operation;
    type: 'number' | 'operation' | 'function' | 'memory' | 'utility';
    className?: string;
}