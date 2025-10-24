import React from 'react';
import './SessionInfo.css';

interface SessionInfoProps {
    sessionsCompleted: number;
    isLongBreak: boolean;
    sessionsBeforeLongBreak: number;
}

const SessionInfo: React.FC<SessionInfoProps> = ({
    sessionsCompleted,
    isLongBreak,
    sessionsBeforeLongBreak,
}) => {
    const nextLongBreak = sessionsBeforeLongBreak - (sessionsCompleted % sessionsBeforeLongBreak);

    return (
        <div className="session-info">
            <div className="session-stats">
                <div className="stat-item">
                    <span className="stat-label">Sessions Completed:</span>
                    <span className="stat-value">{sessionsCompleted}</span>
                </div>

                <div className="stat-item">
                    <span className="stat-label">Next Long Break:</span>
                    <span className="stat-value">
                        {nextLongBreak === 0 ? 'Now!' : `in ${nextLongBreak} session${nextLongBreak > 1 ? 's' : ''}`}
                    </span>
                </div>

                <div className="stat-item">
                    <span className="stat-label">Current Break:</span>
                    <span className="stat-value">
                        {isLongBreak ? 'Long Break' : 'Short Break'}
                    </span>
                </div>
            </div>

            <div className="session-progress">
                <div className="progress-label">
                    Progress to Long Break:
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${(sessionsCompleted % sessionsBeforeLongBreak) / sessionsBeforeLongBreak * 100}%`
                        }}
                    />
                </div>
                <div className="progress-text">
                    {sessionsCompleted % sessionsBeforeLongBreak} / {sessionsBeforeLongBreak}
                </div>
            </div>
        </div>
    );
};

export default SessionInfo;