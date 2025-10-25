import React, { useState } from 'react';
import { Budget } from '../types/Expense';
import './BudgetSettings.css';

interface BudgetSettingsProps {
    budget: Budget;
    onBudgetChange: (budget: Budget) => void;
    currentSpending: number;
}

const BudgetSettings: React.FC<BudgetSettingsProps> = ({
    budget,
    onBudgetChange,
    currentSpending
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [monthlyBudget, setMonthlyBudget] = useState(budget.monthly.toString());

    const handleSave = (): void => {
        const newBudget = parseFloat(monthlyBudget);
        if (newBudget >= 0) {
            onBudgetChange({ monthly: newBudget });
            setIsEditing(false);
        }
    };

    const handleCancel = (): void => {
        setMonthlyBudget(budget.monthly.toString());
        setIsEditing(false);
    };

    const remaining = budget.monthly - currentSpending;
    const progress = budget.monthly > 0 ? (currentSpending / budget.monthly) * 100 : 0;

    return (
        <div className="budget-settings">
            <div className="budget-header">
                <h3>Monthly Budget</h3>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="edit-budget-btn"
                        aria-label="Edit budget"
                    >
                        ✏️
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="budget-edit">
                    <div className="budget-input-group">
                        <label htmlFor="monthly-budget">Monthly Budget ($)</label>
                        <input
                            type="number"
                            id="monthly-budget"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(e.target.value)}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="budget-edit-actions">
                        <button onClick={handleCancel} className="btn btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="btn btn-save">
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="budget-display">
                    <div className="budget-amount">${budget.monthly.toFixed(2)}</div>

                    <div className="budget-progress">
                        <div className="progress-labels">
                            <span>Spent: ${currentSpending.toFixed(2)}</span>
                            <span>Remaining: ${remaining.toFixed(2)}</span>
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(progress, 100)}%`,
                                    backgroundColor: progress > 80 ? '#e74c3c' : progress > 60 ? '#f39c12' : '#2ecc71'
                                }}
                            />
                        </div>

                        <div className="progress-percentage">
                            {progress.toFixed(1)}% of budget used
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetSettings;