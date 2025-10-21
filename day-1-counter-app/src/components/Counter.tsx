import React, { useState } from 'react';
import './Counter.css';

// Define the type for our component props (empty in this case)
interface CounterProps { }

const Counter: React.FC<CounterProps> = () => {
    // State with TypeScript type annotation
    const [count, setCount] = useState<number>(0);

    // Event handlers
    const increment = (): void => {
        setCount(prevCount => prevCount + 1);
    };

    const decrement = (): void => {
        setCount(prevCount => prevCount - 1);
    };

    const reset = (): void => {
        setCount(0);
    };

    // Determine color based on count value
    const getCounterColor = (): string => {
        if (count > 0) return 'positive';
        if (count < 0) return 'negative';
        return 'zero';
    };

    return (
        <div className="counter-container">
            <h1>Simple Counter App</h1>
            <div className={`counter-display ${getCounterColor()}`}>
                {count}
            </div>
            <div className="button-group">
                <button
                    className="btn btn-decrement"
                    onClick={decrement}
                    aria-label="Decrease counter"
                >
                    -
                </button>
                <button
                    className="btn btn-reset"
                    onClick={reset}
                    aria-label="Reset counter"
                >
                    Reset
                </button>
                <button
                    className="btn btn-increment"
                    onClick={increment}
                    aria-label="Increase counter"
                >
                    +
                </button>
            </div>
        </div>
    );
};

export default Counter;