import React from 'react';
import './CalculatorDisplay.css';

interface CalculatorDisplayProps {
    display: string;
    memory: number;
    theme: 'light' | 'dark' | 'professional';
    onMemoryRecall: () => void;
    onMemoryClear: () => void;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
    display,
    memory,
    theme,
    onMemoryRecall,
    onMemoryClear
}) => {
    const formatDisplay = (value: string): string => {
        if (value === 'Error' || value === 'Infinity') return value;

        const num = parseFloat(value);
        if (isNaN(num)) return value;

        // Format large numbers with scientific notation
        if (Math.abs(num) > 999999999999) {
            return num.toExponential(6);
        }

        // Format with commas for thousands
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 10
        }).format(num);
    };

    return (
        <div className={`calculator-display ${theme}`}>
            <div className="display-memory">
                {memory !== 0 && (
                    <div className="memory-indicator">
                        <span>M: {formatDisplay(memory.toString())}</span>
                        <div className="memory-buttons">
                            <button onClick={onMemoryRecall} className="memory-btn" title="Memory Recall">
                                MR
                            </button>
                            <button onClick={onMemoryClear} className="memory-btn" title="Memory Clear">
                                MC
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="display-value">
                {formatDisplay(display)}
            </div>
        </div>
    );
};

export default CalculatorDisplay;