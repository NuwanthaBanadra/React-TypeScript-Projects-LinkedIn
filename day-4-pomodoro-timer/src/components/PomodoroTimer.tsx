import React, { useState, useEffect, useCallback } from 'react';
import { TimerSettings, TimerState, TimerMode } from '../types/Timer';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import SessionInfo from './SessionInfo';
import SettingsPanel from './SettingsPanel';
import './PomodoroTimer.css';

const PomodoroTimer: React.FC = () => {
    const [settings, setSettings] = useState<TimerSettings>({
        workMinutes: 25,
        breakMinutes: 5,
        longBreakMinutes: 15,
        sessionsBeforeLongBreak: 4,
    });

    const [timerState, setTimerState] = useState<TimerState>({
        mode: 'work',
        timeLeft: 25 * 60, // 25 minutes in seconds
        isRunning: false,
        sessionsCompleted: 0,
        isLongBreak: false,
    });

    const [showSettings, setShowSettings] = useState<boolean>(false);

    // Calculate time left based on current mode
    const getInitialTime = useCallback((mode: TimerMode, isLongBreak: boolean): number => {
        if (mode === 'work') return settings.workMinutes * 60;
        return isLongBreak ? settings.longBreakMinutes * 60 : settings.breakMinutes * 60;
    }, [settings]);

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (timerState.isRunning && timerState.timeLeft > 0) {
            interval = setInterval(() => {
                setTimerState(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1
                }));
            }, 1000);
        } else if (timerState.isRunning && timerState.timeLeft === 0) {
            // Timer completed
            handleTimerComplete();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerState.isRunning, timerState.timeLeft]);

    const handleTimerComplete = (): void => {
        // Play completion sound
        playNotificationSound();

        if (timerState.mode === 'work') {
            const newSessionsCompleted = timerState.sessionsCompleted + 1;
            const isLongBreak = newSessionsCompleted % settings.sessionsBeforeLongBreak === 0;

            setTimerState({
                mode: 'break',
                timeLeft: getInitialTime('break', isLongBreak),
                isRunning: false,
                sessionsCompleted: newSessionsCompleted,
                isLongBreak,
            });

            // Show notification for break
            if (Notification.permission === 'granted') {
                new Notification('Pomodoro Timer', {
                    body: isLongBreak ? 'Time for a long break! 🎉' : 'Time for a break! ☕',
                    icon: '/favicon.ico'
                });
            }
        } else {
            // Break completed, start work session
            setTimerState({
                mode: 'work',
                timeLeft: getInitialTime('work', false),
                isRunning: false,
                sessionsCompleted: timerState.sessionsCompleted,
                isLongBreak: false,
            });

            // Show notification for work
            if (Notification.permission === 'granted') {
                new Notification('Pomodoro Timer', {
                    body: 'Break over! Time to focus! 💪',
                    icon: '/favicon.ico'
                });
            }
        }
    };

    const playNotificationSound = (): void => {
        // Create a simple notification sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    };

    const requestNotificationPermission = (): void => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    // Control handlers
    const handleStart = (): void => {
        setTimerState(prev => ({ ...prev, isRunning: true }));
        requestNotificationPermission();
    };

    const handlePause = (): void => {
        setTimerState(prev => ({ ...prev, isRunning: false }));
    };

    const handleReset = (): void => {
        setTimerState(prev => ({
            ...prev,
            isRunning: false,
            timeLeft: getInitialTime(prev.mode, prev.isLongBreak)
        }));
    };

    const handleSkip = (): void => {
        handleTimerComplete();
    };

    const handleSettingsChange = (newSettings: TimerSettings): void => {
        setSettings(newSettings);
        // Update current timer if needed
        setTimerState(prev => ({
            ...prev,
            timeLeft: getInitialTime(prev.mode, prev.isLongBreak)
        }));
    };

    // Initialize notification permission on component mount
    useEffect(() => {
        requestNotificationPermission();
    }, []);

    return (
        <div className="pomodoro-timer-container">
            <div className="timer-header">
                <h1>Pomodoro Timer</h1>
                <p>Stay focused and productive</p>
                <button
                    onClick={() => setShowSettings(true)}
                    className="settings-btn"
                    aria-label="Open settings"
                >
                    ⚙️ Settings
                </button>
            </div>

            <div className="timer-card">
                <TimerDisplay
                    timeLeft={timerState.timeLeft}
                    mode={timerState.mode}
                    isRunning={timerState.isRunning}
                />

                <TimerControls
                    isRunning={timerState.isRunning}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onSkip={handleSkip}
                />

                <SessionInfo
                    sessionsCompleted={timerState.sessionsCompleted}
                    isLongBreak={timerState.isLongBreak}
                    sessionsBeforeLongBreak={settings.sessionsBeforeLongBreak}
                />

                <div className="timer-tips">
                    <h3>💡 Productivity Tips:</h3>
                    <ul>
                        <li>Focus on one task during work sessions</li>
                        <li>Take real breaks - stretch or walk around</li>
                        <li>After 4 sessions, take a longer break</li>
                        <li>Adjust timer durations to what works for you</li>
                    </ul>
                </div>
            </div>

            <SettingsPanel
                settings={settings}
                onSettingsChange={handleSettingsChange}
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </div>
    );
};

export default PomodoroTimer;