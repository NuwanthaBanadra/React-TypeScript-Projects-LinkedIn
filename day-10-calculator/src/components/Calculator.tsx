import React, { useState, useEffect } from 'react';
import { CalculatorState, Operation, CalculatorMode } from '../types/Calculator';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorHistory from './CalculatorHistory';
import CalculatorButton from './CalculatorButton';
import ThemeSelector from './ThemeSelector';
import './Calculator.css';

const Calculator: React.FC = () => {
    const [calculatorState, setCalculatorState] = useState<CalculatorState>({
        display: '0',
        previousValue: null,
        operation: null,
        waitingForNewValue: false,
        memory: 0,
        history: [],
        isScientific: false,
        theme: 'light'
    });

    const [mode, setMode] = useState<CalculatorMode>('basic');

    // Handle number input
    const handleNumberInput = (num: string): void => {
        setCalculatorState(prev => {
            if (prev.waitingForNewValue) {
                return {
                    ...prev,
                    display: num,
                    waitingForNewValue: false
                };
            }

            if (prev.display === '0' && num !== '.') {
                return { ...prev, display: num };
            }

            if (num === '.' && prev.display.includes('.')) {
                return prev;
            }

            return { ...prev, display: prev.display + num };
        });
    };

    // Handle operation
    const handleOperation = (operation: Operation): void => {
        const currentValue = parseFloat(calculatorState.display);

        switch (operation) {
            case 'C':
                setCalculatorState({
                    ...calculatorState,
                    display: '0',
                    previousValue: null,
                    operation: null,
                    waitingForNewValue: false
                });
                break;

            case 'CE':
                setCalculatorState(prev => ({ ...prev, display: '0' }));
                break;

            case '±':
                setCalculatorState(prev => ({
                    ...prev,
                    display: (-parseFloat(prev.display)).toString()
                }));
                break;

            case '%':
                setCalculatorState(prev => ({
                    ...prev,
                    display: (parseFloat(prev.display) / 100).toString()
                }));
                break;

            case '=':
                if (calculatorState.operation && calculatorState.previousValue !== null) {
                    const result = performCalculation(
                        calculatorState.previousValue,
                        currentValue,
                        calculatorState.operation
                    );

                    const historyEntry = `${calculatorState.previousValue} ${getOperationSymbol(calculatorState.operation)} ${currentValue} = ${result}`;

                    setCalculatorState(prev => ({
                        ...prev,
                        display: result.toString(),
                        previousValue: null,
                        operation: null,
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    }));
                }
                break;

            case 'M+':
                setCalculatorState(prev => ({
                    ...prev,
                    memory: prev.memory + currentValue
                }));
                break;

            case 'M-':
                setCalculatorState(prev => ({
                    ...prev,
                    memory: prev.memory - currentValue
                }));
                break;

            case 'MR':
                setCalculatorState(prev => ({
                    ...prev,
                    display: prev.memory.toString(),
                    waitingForNewValue: true
                }));
                break;

            case 'MC':
                setCalculatorState(prev => ({ ...prev, memory: 0 }));
                break;

            // Scientific operations
            case 'sin':
                setCalculatorState(prev => {
                    const result = Math.sin(parseFloat(prev.display) * Math.PI / 180);
                    const historyEntry = `sin(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'cos':
                setCalculatorState(prev => {
                    const result = Math.cos(parseFloat(prev.display) * Math.PI / 180);
                    const historyEntry = `cos(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'tan':
                setCalculatorState(prev => {
                    const result = Math.tan(parseFloat(prev.display) * Math.PI / 180);
                    const historyEntry = `tan(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'log':
                setCalculatorState(prev => {
                    const result = Math.log10(parseFloat(prev.display));
                    const historyEntry = `log(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'ln':
                setCalculatorState(prev => {
                    const result = Math.log(parseFloat(prev.display));
                    const historyEntry = `ln(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case '√':
                setCalculatorState(prev => {
                    const result = Math.sqrt(parseFloat(prev.display));
                    const historyEntry = `√(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'x²':
                setCalculatorState(prev => {
                    const result = Math.pow(parseFloat(prev.display), 2);
                    const historyEntry = `(${prev.display})² = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'x³':
                setCalculatorState(prev => {
                    const result = Math.pow(parseFloat(prev.display), 3);
                    const historyEntry = `(${prev.display})³ = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case '1/x':
                setCalculatorState(prev => {
                    const result = 1 / parseFloat(prev.display);
                    const historyEntry = `1/(${prev.display}) = ${result}`;
                    return {
                        ...prev,
                        display: result.toString(),
                        waitingForNewValue: true,
                        history: [...prev.history, historyEntry]
                    };
                });
                break;

            case 'π':
                setCalculatorState(prev => ({
                    ...prev,
                    display: Math.PI.toString(),
                    waitingForNewValue: true
                }));
                break;

            case 'e':
                setCalculatorState(prev => ({
                    ...prev,
                    display: Math.E.toString(),
                    waitingForNewValue: true
                }));
                break;

            default:
                // Basic operations (+, -, ×, ÷)
                setCalculatorState({
                    display: '0',
                    previousValue: currentValue,
                    operation,
                    waitingForNewValue: true,
                    memory: calculatorState.memory,
                    history: calculatorState.history,
                    isScientific: calculatorState.isScientific,
                    theme: calculatorState.theme
                });
                break;
        }
    };

    // Perform calculation
    const performCalculation = (a: number, b: number, operation: Operation): number => {
        switch (operation) {
            case '+': return a + b;
            case '-': return a - b;
            case '×': return a * b;
            case '÷': return b !== 0 ? a / b : NaN;
            case 'x^y': return Math.pow(a, b);
            default: return b;
        }
    };

    // Get operation symbol for display
    const getOperationSymbol = (operation: Operation): string => {
        switch (operation) {
            case '×': return '×';
            case '÷': return '÷';
            case 'x^y': return '^';
            default: return operation;
        }
    };

    // Handle button click
    const handleButtonClick = (operation: Operation): void => {
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(operation)) {
            handleNumberInput(operation);
        } else {
            handleOperation(operation);
        }
    };

    // Keyboard support
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent): void => {
            const key = e.key;

            // Numbers and decimal
            if (/[0-9]/.test(key)) {
                handleButtonClick(key as Operation);
            } else if (key === '.') {
                handleButtonClick('.');
            }
            // Operations
            else if (key === '+') handleButtonClick('+');
            else if (key === '-') handleButtonClick('-');
            else if (key === '*') handleButtonClick('×');
            else if (key === '/') handleButtonClick('÷');
            else if (key === 'Enter' || key === '=') handleButtonClick('=');
            else if (key === 'Escape') handleButtonClick('C');
            else if (key === 'Backspace') handleButtonClick('CE');
            else if (key === '%') handleButtonClick('%');
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [calculatorState]);

    // Button configurations
    const basicButtons = [
        // Row 1
        { label: 'C', operation: 'C' as Operation, type: 'utility' as const },
        { label: 'CE', operation: 'CE' as Operation, type: 'utility' as const },
        { label: '%', operation: '%' as Operation, type: 'operation' as const },
        { label: '÷', operation: '÷' as Operation, type: 'operation' as const },

        // Row 2
        { label: '7', operation: '7' as Operation, type: 'number' as const },
        { label: '8', operation: '8' as Operation, type: 'number' as const },
        { label: '9', operation: '9' as Operation, type: 'number' as const },
        { label: '×', operation: '×' as Operation, type: 'operation' as const },

        // Row 3
        { label: '4', operation: '4' as Operation, type: 'number' as const },
        { label: '5', operation: '5' as Operation, type: 'number' as const },
        { label: '6', operation: '6' as Operation, type: 'number' as const },
        { label: '-', operation: '-' as Operation, type: 'operation' as const },

        // Row 4
        { label: '1', operation: '1' as Operation, type: 'number' as const },
        { label: '2', operation: '2' as Operation, type: 'number' as const },
        { label: '3', operation: '3' as Operation, type: 'number' as const },
        { label: '+', operation: '+' as Operation, type: 'operation' as const },

        // Row 5
        { label: '±', operation: '±' as Operation, type: 'utility' as const },
        { label: '0', operation: '0' as Operation, type: 'number' as const },
        { label: '.', operation: '.' as Operation, type: 'number' as const },
        { label: '=', operation: '=' as Operation, type: 'operation' as const, className: 'equals-btn' }
    ];

    const scientificButtons = [
        // Additional scientific functions
        { label: 'sin', operation: 'sin' as Operation, type: 'function' as const },
        { label: 'cos', operation: 'cos' as Operation, type: 'function' as const },
        { label: 'tan', operation: 'tan' as Operation, type: 'function' as const },
        { label: 'log', operation: 'log' as Operation, type: 'function' as const },
        { label: 'ln', operation: 'ln' as Operation, type: 'function' as const },
        { label: '√', operation: '√' as Operation, type: 'function' as const },
        { label: 'x²', operation: 'x²' as Operation, type: 'function' as const },
        { label: 'x³', operation: 'x³' as Operation, type: 'function' as const },
        { label: '1/x', operation: '1/x' as Operation, type: 'function' as const },
        { label: 'π', operation: 'π' as Operation, type: 'function' as const },
        { label: 'e', operation: 'e' as Operation, type: 'function' as const }
    ];

    const memoryButtons = [
        { label: 'M+', operation: 'M+' as Operation, type: 'memory' as const },
        { label: 'M-', operation: 'M-' as Operation, type: 'memory' as const },
        { label: 'MR', operation: 'MR' as Operation, type: 'memory' as const },
        { label: 'MC', operation: 'MC' as Operation, type: 'memory' as const }
    ];

    return (
        <div className={`calculator-app ${calculatorState.theme}`}>
            <div className="calculator-header">
                <h1>🧮 Calculator</h1>
                <p>A powerful calculator with scientific functions</p>
            </div>

            <div className="calculator-container">
                <div className="calculator-main">
                    <div className="calculator-controls">
                        <ThemeSelector
                            currentTheme={calculatorState.theme}
                            onThemeChange={(theme) => setCalculatorState(prev => ({ ...prev, theme }))}
                        />

                        <div className="mode-toggle">
                            <button
                                onClick={() => setMode('basic')}
                                className={`mode-btn ${mode === 'basic' ? 'active' : ''}`}
                            >
                                Basic
                            </button>
                            <button
                                onClick={() => setMode('scientific')}
                                className={`mode-btn ${mode === 'scientific' ? 'active' : ''}`}
                            >
                                Scientific
                            </button>
                        </div>
                    </div>

                    <CalculatorDisplay
                        display={calculatorState.display}
                        memory={calculatorState.memory}
                        theme={calculatorState.theme}
                        onMemoryRecall={() => handleButtonClick('MR')}
                        onMemoryClear={() => handleButtonClick('MC')}
                    />

                    <div className="calculator-buttons">
                        {/* Memory buttons */}
                        <div className="button-row memory-buttons">
                            {memoryButtons.map((button) => (
                                <CalculatorButton
                                    key={button.operation}
                                    {...button}
                                    onClick={handleButtonClick}
                                    theme={calculatorState.theme}
                                />
                            ))}
                        </div>

                        {/* Scientific buttons (only in scientific mode) */}
                        {mode === 'scientific' && (
                            <div className="button-row scientific-buttons">
                                {scientificButtons.map((button) => (
                                    <CalculatorButton
                                        key={button.operation}
                                        {...button}
                                        onClick={handleButtonClick}
                                        theme={calculatorState.theme}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Basic buttons */}
                        <div className="button-grid">
                            {basicButtons.map((button) => (
                                <CalculatorButton
                                    key={button.operation}
                                    {...button}
                                    onClick={handleButtonClick}
                                    theme={calculatorState.theme}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <CalculatorHistory
                    history={calculatorState.history}
                    theme={calculatorState.theme}
                    onHistoryItemClick={(value) => setCalculatorState(prev => ({ ...prev, display: value }))}
                    onClearHistory={() => setCalculatorState(prev => ({ ...prev, history: [] }))}
                />
            </div>

            <div className="calculator-footer">
                <div className="keyboard-hint">
                    💡 Keyboard support enabled: Use number keys, +, -, *, /, Enter, Escape
                </div>
            </div>
        </div>
    );
};

export default Calculator;