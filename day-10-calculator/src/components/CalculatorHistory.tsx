import React from 'react';
import './CalculatorHistory.css';

interface CalculatorHistoryProps {
    history: string[];
    theme: 'light' | 'dark' | 'professional';
    onHistoryItemClick: (value: string) => void;
    onClearHistory: () => void;
}

const CalculatorHistory: React.FC<CalculatorHistoryProps> = ({
    history,
    theme,
    onHistoryItemClick,
    onClearHistory
}) => {
    const parseHistoryValue = (historyItem: string): string => {
        const parts = historyItem.split(' = ');
        return parts[parts.length - 1];
    };

    return (
        <div className={`calculator-history ${theme}`}>
            <div className="history-header">
                <h4>History</h4>
                {history.length > 0 && (
                    <button onClick={onClearHistory} className="clear-history-btn" title="Clear History">
                        🗑️
                    </button>
                )}
            </div>
            <div className="history-list">
                {history.length === 0 ? (
                    <div className="empty-history">
                        No calculations yet
                    </div>
                ) : (
                    history.slice().reverse().map((item, index) => (
                        <div
                            key={index}
                            className="history-item"
                            onClick={() => onHistoryItemClick(parseHistoryValue(item))}
                        >
                            {item}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CalculatorHistory;