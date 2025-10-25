import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, Budget, ExpenseSummary } from '../types/Expense';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart';
import BudgetSettings from './BudgetSettings';
import './ExpenseTracker.css';

const ExpenseTracker: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>(() => {
        const savedExpenses = localStorage.getItem('expenses');
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    });

    const [budget, setBudget] = useState<Budget>(() => {
        const savedBudget = localStorage.getItem('budget');
        return savedBudget ? JSON.parse(savedBudget) : { monthly: 1000 };
    });

    const [showForm, setShowForm] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
    const [filterMonth, setFilterMonth] = useState<string>(
        new Date().toISOString().slice(0, 7) // YYYY-MM format
    );

    // Save to localStorage whenever expenses or budget change
    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem('budget', JSON.stringify(budget));
    }, [budget]);

    // Calculate expense summary
    const summary: ExpenseSummary = React.useMemo(() => {
        const filteredExpenses = expenses.filter(expense => {
            const expenseMonth = expense.date.slice(0, 7);
            const categoryMatch = filterCategory === 'all' || expense.category === filterCategory;
            const monthMatch = expenseMonth === filterMonth;
            return categoryMatch && monthMatch;
        });

        const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        const byCategory = {
            food: 0, transport: 0, shopping: 0, entertainment: 0,
            bills: 0, health: 0, education: 0, other: 0
        };

        filteredExpenses.forEach(expense => {
            byCategory[expense.category] += expense.amount;
        });

        return {
            total,
            byCategory,
            remainingBudget: budget.monthly - total
        };
    }, [expenses, budget.monthly, filterCategory, filterMonth]);

    // Handler functions
    const handleAddExpense = (expenseData: Omit<Expense, 'id'>): void => {
        const newExpense: Expense = {
            ...expenseData,
            id: Date.now().toString()
        };
        setExpenses(prev => [newExpense, ...prev]);
        setShowForm(false);
    };

    const handleEditExpense = (expenseData: Omit<Expense, 'id'>): void => {
        if (editingExpense) {
            setExpenses(prev => prev.map(exp =>
                exp.id === editingExpense.id ? { ...expenseData, id: editingExpense.id } : exp
            ));
            setEditingExpense(null);
        }
    };

    const handleDeleteExpense = (id: string): void => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        }
    };

    const handleEditClick = (expense: Expense): void => {
        setEditingExpense(expense);
    };

    const getMonthName = (monthString: string): string => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const categories: ExpenseCategory[] = [
        'food', 'transport', 'shopping', 'entertainment',
        'bills', 'health', 'education', 'other'
    ];

    return (
        <div className="expense-tracker-container">
            <div className="tracker-header">
                <h1>Expense Tracker</h1>
                <p>Track and manage your expenses effectively</p>
            </div>

            <div className="tracker-content">
                <div className="sidebar">
                    <div className="summary-card">
                        <h2>Financial Summary</h2>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Total Spent</span>
                                <span className="stat-value">${summary.total.toFixed(2)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Remaining Budget</span>
                                <span className={`stat-value ${summary.remainingBudget < 0 ? 'negative' : 'positive'}`}>
                                    ${summary.remainingBudget.toFixed(2)}
                                </span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Expenses Count</span>
                                <span className="stat-value">
                                    {expenses.filter(exp => exp.date.startsWith(filterMonth)).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    <BudgetSettings
                        budget={budget}
                        onBudgetChange={setBudget}
                        currentSpending={summary.total}
                    />

                    <ExpenseChart summary={summary} />
                </div>

                <div className="main-content">
                    <div className="content-header">
                        <div className="filters">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
                                className="filter-select"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="month"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="month-filter"
                            />
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="add-expense-btn"
                        >
                            + Add Expense
                        </button>
                    </div>

                    <ExpenseList
                        expenses={expenses.filter(expense => {
                            const expenseMonth = expense.date.slice(0, 7);
                            const categoryMatch = filterCategory === 'all' || expense.category === filterCategory;
                            const monthMatch = expenseMonth === filterMonth;
                            return categoryMatch && monthMatch;
                        })}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteExpense}
                    />
                </div>
            </div>

            {(showForm || editingExpense) && (
                <ExpenseForm
                    expense={editingExpense || undefined}
                    onSave={editingExpense ? handleEditExpense : handleAddExpense}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingExpense(null);
                    }}
                />
            )}
        </div>
    );
};

export default ExpenseTracker;