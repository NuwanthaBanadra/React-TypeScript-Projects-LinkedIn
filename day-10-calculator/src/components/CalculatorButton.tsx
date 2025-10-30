import React from 'react';
import { Operation } from '../types/Calculator';
import './CalculatorButton.css';

interface CalculatorButtonProps {
    label: string;
    operation: Operation;
    type: 'number' | 'operation' | 'function' | 'memory' | 'utility';
    onClick: (operation: Operation) => void;
    theme: 'light' | 'dark' | 'professional';
    className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
    label,
    operation,
    type,
    onClick,
    theme,
    className = ''
}) => {
    const handleClick = (): void => {
        onClick(operation);
    };

    const getButtonClass = (): string => {
        const baseClass = `calc-btn ${theme}`;
        const typeClass = `btn-${type}`;
        return `${baseClass} ${typeClass} ${className}`.trim();
    };

    return (
        <button
            className={getButtonClass()}
            onClick={handleClick}
            data-operation={operation}
        >
            {label}
        </button>
    );
};

export default CalculatorButton;