import React from 'react';
import { TimerMode } from '../types/Timer';
import './TimerDisplay.css';

interface TimerDisplayProps {
    timeLeft: number;
    mode: TimerMode;
    isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, mode, isRunning }) => {
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateProgress = (): number => {
        const totalTime = mode === 'work' ? 25 * 60 : 5 * 60; // 25 min work, 5 min break
        return ((totalTime - timeLeft) / totalTime) * 100;
    };

    return (
        <div className="timer-display">
            <div className="timer-mode">
                <span className={`mode-indicator ${mode}`}>
                    {mode === 'work' ? 'Work Session' : 'Break Time'}
                </span>
                <span className="timer-status">
                    {isRunning ? 'Running' : 'Paused'}
                </span>
            </div>

            <div className="timer-circle">
                <div
                    className="progress-ring"
                    style={{
                        background: `conic-gradient(#4CAF50 ${calculateProgress()}%, #e0e0e0 0%)`
                    }}
                >
                    <div className="timer-text">
                        <div className="time">{formatTime(timeLeft)}</div>
                        <div className="mode">{mode === 'work' ? 'Focus Time' : 'Take a Break'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimerDisplay;