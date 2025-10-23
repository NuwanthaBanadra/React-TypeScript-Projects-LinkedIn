import React from 'react';
import { PasswordRequirements as Requirements } from '../types/Password';
import './PasswordRequirements.css';

interface PasswordRequirementsProps {
    requirements: Requirements;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements }) => {
    const requirementChecks = [
        { key: 'hasMinLength', label: 'At least 8 characters', met: requirements.hasMinLength },
        { key: 'hasUpperCase', label: 'Contains uppercase letter', met: requirements.hasUpperCase },
        { key: 'hasLowerCase', label: 'Contains lowercase letter', met: requirements.hasLowerCase },
        { key: 'hasNumbers', label: 'Contains number', met: requirements.hasNumbers },
        { key: 'hasSpecialChar', label: 'Contains special character', met: requirements.hasSpecialChar },
    ];

    return (
        <div className="requirements-container">
            <h3 className="requirements-title">Password Requirements:</h3>
            <div className="requirements-list">
                {requirementChecks.map((req) => (
                    <div key={req.key} className="requirement-item">
                        <span className={`requirement-check ${req.met ? 'met' : 'unmet'}`}>
                            {req.met ? '✓' : '✗'}
                        </span>
                        <span className={`requirement-text ${req.met ? 'met' : 'unmet'}`}>
                            {req.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PasswordRequirements;