import React, { useState } from 'react';
import './TodoForm.css';

interface TodoFormProps {
    onAddTodo: (text: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();

        if (trimmedValue) {
            onAddTodo(trimmedValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <div className="input-group">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="What needs to be done?"
                    className="todo-input"
                    maxLength={100}
                />
                <button
                    type="submit"
                    className="add-btn"
                    disabled={!inputValue.trim()}
                >
                    Add Task
                </button>
            </div>
        </form>
    );
};

export default TodoForm;