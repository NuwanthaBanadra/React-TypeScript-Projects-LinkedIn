export type TimerMode = 'work' | 'break';

export interface TimerSettings {
    workMinutes: number;
    breakMinutes: number;
    longBreakMinutes: number;
    sessionsBeforeLongBreak: number;
}

export interface TimerState {
    mode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
    sessionsCompleted: number;
    isLongBreak: boolean;
}