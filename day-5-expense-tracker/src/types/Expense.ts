export interface Expense {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    description?: string;
}

export type ExpenseCategory =
    | 'food'
    | 'transport'
    | 'shopping'
    | 'entertainment'
    | 'bills'
    | 'health'
    | 'education'
    | 'other';

export interface CategoryInfo {
    label: string;
    icon: string;
    color: string;
}

export interface Budget {
    monthly: number;
}

export interface ExpenseSummary {
    total: number;
    byCategory: Record<ExpenseCategory, number>;
    remainingBudget: number;
}