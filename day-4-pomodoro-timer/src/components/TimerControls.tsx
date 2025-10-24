import React from 'react';
import './TimerControls.css';

interface TimerControlsProps {
    isRunning: boolean;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
    isRunning,
    onStart,
    onPause,
    onReset,
    onSkip,
}) => {
    return (
        <div className="timer-controls">
            <div className="control-buttons">
                {!isRunning ? (
                    <button
                        onClick={onStart}
                        className="control-btn start-btn"
                        aria-label="Start timer"
                    >
                        ▶ Start
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="control-btn pause-btn"
                        aria-label="Pause timer"
                    >
                        ⏸️ Pause
                    </button>
                )}

                <button
                    onClick={onReset}
                    className="control-btn reset-btn"
                    aria-label="Reset timer"
                >
                    🔄 Reset
                </button>

                <button
                    onClick={onSkip}
                    className="control-btn skip-btn"
                    aria-label="Skip to next session"
                >
                    ⏭️ Skip
                </button>
            </div>
        </div>
    );
};

export default TimerControls;