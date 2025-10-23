import React from 'react';
import './PasswordInput.css';

interface PasswordInputProps {
    password: string;
    onPasswordChange: (password: string) => void;
    showPassword: boolean;
    onToggleShowPassword: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    password,
    onPasswordChange,
    showPassword,
    onToggleShowPassword,
}) => {
    const handleCopyToClipboard = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(password);
            alert('Password copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy password: ', err);
        }
    };

    return (
        <div className="password-input-container">
            <div className="input-group">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    className="password-input"
                    aria-label="Password input"
                />
                <div className="input-actions">
                    <button
                        type="button"
                        onClick={onToggleShowPassword}
                        className="action-btn toggle-btn"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>

                    {password && (
                        <button
                            type="button"
                            onClick={handleCopyToClipboard}
                            className="action-btn copy-btn"
                            aria-label="Copy password to clipboard"
                        >
                            📋
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordInput;