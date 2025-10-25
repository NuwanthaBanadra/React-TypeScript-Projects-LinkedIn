import React, { useState } from 'react';
import { Expense, ExpenseCategory, CategoryInfo } from '../types/Expense';
import './ExpenseForm.css';

interface ExpenseFormProps {
    expense?: Expense;
    onSave: (expense: Omit<Expense, 'id'>) => void;
    onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSave, onCancel }) => {
    const [title, setTitle] = useState(expense?.title || '');
    const [amount, setAmount] = useState(expense?.amount.toString() || '');
    const [category, setCategory] = useState<ExpenseCategory>(expense?.category || 'other');
    const [date, setDate] = useState(expense?.date || new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState(expense?.description || '');

    const categories: Record<ExpenseCategory, CategoryInfo> = {
        food: { label: 'Food & Dining', icon: '🍕', color: '#FF6B6B' },
        transport: { label: 'Transport', icon: '🚗', color: '#4ECDC4' },
        shopping: { label: 'Shopping', icon: '🛍️', color: '#45B7D1' },
        entertainment: { label: 'Entertainment', icon: '🎬', color: '#96CEB4' },
        bills: { label: 'Bills & Utilities', icon: '📱', color: '#FFEAA7' },
        health: { label: 'Health', icon: '🏥', color: '#DDA0DD' },
        education: { label: 'Education', icon: '📚', color: '#98D8C8' },
        other: { label: 'Other', icon: '📦', color: '#F7DC6F' }
    };

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!title.trim() || !amount || !date) {
            alert('Please fill in all required fields');
            return;
        }

        onSave({
            title: title.trim(),
            amount: parseFloat(amount),
            category,
            date,
            description: description.trim() || undefined
        });
    };

    return (
        <div className="expense-form-overlay">
            <div className="expense-form">
                <div className="form-header">
                    <h2>{expense ? 'Edit Expense' : 'Add New Expense'}</h2>
                    <button onClick={onCancel} className="close-btn">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter expense title"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="amount">Amount ($) *</label>
                            <input
                                type="number"
                                id="amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="date">Date *</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <div className="category-grid">
                            {(Object.entries(categories) as [ExpenseCategory, CategoryInfo][]).map(([key, info]) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`category-btn ${category === key ? 'selected' : ''}`}
                                    onClick={() => setCategory(key)}
                                    style={{ borderColor: info.color }}
                                >
                                    <span className="category-icon">{info.icon}</span>
                                    <span className="category-label">{info.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add any additional details..."
                            rows={3}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn btn-cancel">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-save">
                            {expense ? 'Update Expense' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;