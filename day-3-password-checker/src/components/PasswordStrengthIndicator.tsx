import React from 'react';
import { PasswordStrength } from '../types/Password';
import './PasswordStrengthIndicator.css';

interface PasswordStrengthIndicatorProps {
    strength: PasswordStrength;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ strength }) => {
    const strengthLevels = [1, 2, 3, 4];

    return (
        <div className="strength-indicator">
            <div className="strength-header">
                <span className="strength-label">Password Strength: </span>
                <span className="strength-value" style={{ color: strength.color }}>
                    {strength.label}
                </span>
            </div>

            <div className="strength-bars">
                {strengthLevels.map((level) => (
                    <div
                        key={level}
                        className={`strength-bar ${level <= strength.score ? 'active' : 'inactive'
                            }`}
                        style={{
                            backgroundColor: level <= strength.score ? strength.color : '#e0e0e0'
                        }}
                    />
                ))}
            </div>

            <p className="strength-description">{strength.description}</p>
        </div>
    );
};

export default PasswordStrengthIndicator;