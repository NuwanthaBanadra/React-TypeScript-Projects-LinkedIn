import React from 'react';
import { FilterType } from '../types/Todo';
import './TodoFilter.css';

interface TodoFilterProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    activeCount: number;
    completedCount: number;
}

const TodoFilter: React.FC<TodoFilterProps> = ({
    currentFilter,
    onFilterChange,
    activeCount,
    completedCount
}) => {
    const filters: { key: FilterType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'active', label: 'Active' },
        { key: 'completed', label: 'Completed' }
    ];

    return (
        <div className="todo-filter">
            <div className="filter-stats">
                <span className="stat active-stat">{activeCount} active</span>
                <span className="stat completed-stat">{completedCount} completed</span>
            </div>

            <div className="filter-buttons">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => onFilterChange(filter.key)}
                        className={`filter-btn ${currentFilter === filter.key ? 'active' : ''}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TodoFilter;