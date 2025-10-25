import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ExpenseSummary, ExpenseCategory } from '../types/Expense';
import './ExpenseChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
    summary: ExpenseSummary;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ summary }) => {
    const categories: Record<ExpenseCategory, { label: string; color: string }> = {
        food: { label: 'Food', color: '#FF6B6B' },
        transport: { label: 'Transport', color: '#4ECDC4' },
        shopping: { label: 'Shopping', color: '#45B7D1' },
        entertainment: { label: 'Entertainment', color: '#96CEB4' },
        bills: { label: 'Bills', color: '#FFEAA7' },
        health: { label: 'Health', color: '#DDA0DD' },
        education: { label: 'Education', color: '#98D8C8' },
        other: { label: 'Other', color: '#F7DC6F' }
    };

    const data = {
        labels: Object.entries(summary.byCategory)
            .filter(([_, amount]) => amount > 0)
            .map(([category]) => categories[category as ExpenseCategory].label),

        datasets: [
            {
                data: Object.entries(summary.byCategory)
                    .filter(([_, amount]) => amount > 0)
                    .map(([_, amount]) => amount),

                backgroundColor: Object.entries(summary.byCategory)
                    .filter(([_, amount]) => amount > 0)
                    .map(([category]) => categories[category as ExpenseCategory].color),

                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 8
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `$${value.toFixed(2)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const hasData = Object.values(summary.byCategory).some(amount => amount > 0);

    if (!hasData) {
        return (
            <div className="expense-chart">
                <h3>Expense Distribution</h3>
                <div className="no-data">
                    <div className="no-data-icon">📊</div>
                    <p>No expense data to display</p>
                </div>
            </div>
        );
    }

    return (
        <div className="expense-chart">
            <h3>Expense Distribution</h3>
            <div className="chart-container">
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};

export default ExpenseChart;