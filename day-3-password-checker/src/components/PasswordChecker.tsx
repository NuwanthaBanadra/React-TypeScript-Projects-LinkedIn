import React, { useState, useMemo } from 'react';
import { PasswordRequirements, PasswordStrength } from '../types/Password';
import PasswordInput from './PasswordInput';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import PasswordRequirementsComponent from './PasswordRequirements';
import './PasswordChecker.css';

const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Calculate password requirements
  const requirements: PasswordRequirements = useMemo(() => ({
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }), [password]);

  // Calculate password strength
  const strength: PasswordStrength = useMemo(() => {
    let score = 0;
    
    // Base score calculation
    if (requirements.hasMinLength) score += 1;
    if (requirements.hasUpperCase) score += 1;
    if (requirements.hasLowerCase) score += 1;
    if (requirements.hasNumbers) score += 1;
    if (requirements.hasSpecialChar) score += 1;

    // Additional points for length
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Cap the score at 5 for our indicator
    score = Math.min(score, 5);

    // Determine strength level
    const strengthLevels = [
      { label: 'Very Weak', color: '#e74c3c', description: 'Easily guessable' },
      { label: 'Weak', color: '#e67e22', description: 'Could be stronger' },
      { label: 'Fair', color: '#f1c40f', description: 'Moderate security' },
      { label: 'Good', color: '#2ecc71', description: 'Good security' },
      { label: 'Strong', color: '#27ae60', description: 'Excellent security' },
      { label: 'Very Strong', color: '#16a085', description: 'Maximum security' },
    ];

    return {
      score,
      ...strengthLevels[score],
    };
  }, [password, requirements]);

  const handlePasswordChange = (newPassword: string): void => {
    setPassword(newPassword);
  };

  const toggleShowPassword = (): void => {
    setShowPassword(!showPassword);
  };

  const getSecurityTips = (): string[] => {
    const tips = [
      'Use a mix of uppercase and lowercase letters',
      'Include numbers and special characters',
      'Make it at least 12 characters long',
      'Avoid common words and patterns',
      'Consider using a passphrase',
    ];

    return tips;
  };

  return (
    <div className="password-checker-container">
      <div className="password-header">
        <h1>Password Strength Checker</h1>
        <p>Check how secure your password is in real-time</p>
      </div>

      <div className="password-card">
        <PasswordInput
          password={password}
          onPasswordChange={handlePasswordChange}
          showPassword={showPassword}
          onToggleShowPassword={toggleShowPassword}
        />

        {password && (
          <>
            <PasswordStrengthIndicator strength={strength} />
            <PasswordRequirementsComponent requirements={requirements} />
          </>
        )}

        <div className="security-tips">
          <h3>💡 Security Tips:</h3>
          <ul>
            {getSecurityTips().map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        {!password && (
          <div className="empty-state">
            <p>Start typing to check your password strength...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordChecker;