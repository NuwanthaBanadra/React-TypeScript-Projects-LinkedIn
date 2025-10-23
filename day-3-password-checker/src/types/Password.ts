export interface PasswordRequirements {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasSpecialChar: boolean;
}

export interface PasswordStrength {
    score: number;
    label: string;
    color: string;
    description: string;
}