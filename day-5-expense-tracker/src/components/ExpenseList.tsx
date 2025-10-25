import React from 'react';
import { Expense, ExpenseCategory, CategoryInfo } from '../types/Expense';
import './ExpenseList.css';

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
    const categories: Record<ExpenseCategory, CategoryInfo> = {
        food: { label: 'Food', icon: '🍕', color: '#FF6B6B' },
        transport: { label: 'Transport', icon: '🚗', color: '#4ECDC4' },
        shopping: { label: 'Shopping', icon: '🛍️', color: '#45B7D1' },
        entertainment: { label: 'Entertainment', icon: '🎬', color: '#96CEB4' },
        bills: { label: 'Bills', icon: '📱', color: '#FFEAA7' },
        health: { label: 'Health', icon: '🏥', color: '#DDA0DD' },
        education: { label: 'Education', icon: '📚', color: '#98D8C8' },
        other: { label: 'Other', icon: '📦', color: '#F7DC6F' }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (expenses.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💸</div>
                <h3>No expenses yet</h3>
                <p>Start by adding your first expense!</p>
            </div>
        );
    }

    return (
        <div className="expense-list">
            <div className="list-header">
                <h3>Recent Expenses</h3>
                <span className="expense-count">{expenses.length} expenses</span>
            </div>

            <div className="expenses-container">
                {expenses.map((expense) => {
                    const categoryInfo = categories[expense.category];

                    return (
                        <div key={expense.id} className="expense-item">
                            <div className="expense-main">
                                <div
                                    className="category-badge"
                                    style={{ backgroundColor: categoryInfo.color }}
                                >
                                    <span className="category-icon">{categoryInfo.icon}</span>
                                </div>

                                <div className="expense-details">
                                    <div className="expense-title">{expense.title}</div>
                                    <div className="expense-meta">
                                        <span className="expense-date">{formatDate(expense.date)}</span>
                                        {expense.description && (
                                            <span className="expense-description">• {expense.description}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="expense-amount">
                                    ${expense.amount.toFixed(2)}
                                </div>
                            </div>

                            <div className="expense-actions">
                                <button
                                    onClick={() => onEdit(expense)}
                                    className="action-btn edit-btn"
                                    aria-label="Edit expense"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => onDelete(expense.id)}
                                    className="action-btn delete-btn"
                                    aria-label="Delete expense"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExpenseList;