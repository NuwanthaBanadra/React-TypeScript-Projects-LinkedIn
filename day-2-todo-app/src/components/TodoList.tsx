import React, { useState, useEffect } from 'react';
import { Todo, FilterType } from '../types/Todo';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import './TodoList.css';

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        // Load todos from localStorage on initial render
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    const [filter, setFilter] = useState<FilterType>('all');

    // Save todos to localStorage whenever todos change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (text: string): void => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date()
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
    };

    const toggleTodo = (id: string): void => {
        setTodos(prevTodos =>
            prevTodos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string): void => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    };

    const clearCompleted = (): void => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    };

    // Filter todos based on current filter
    const filteredTodos = todos.filter(todo => {
        switch (filter) {
            case 'active':
                return !todo.completed;
            case 'completed':
                return todo.completed;
            default:
                return true;
        }
    });

    const activeCount = todos.filter(todo => !todo.completed).length;
    const completedCount = todos.filter(todo => todo.completed).length;

    return (
        <div className="todo-list-container">
            <div className="todo-header">
                <h1>Todo List</h1>
                <p>Get things done, one task at a time</p>
            </div>

            <div className="todo-card">
                <TodoForm onAddTodo={addTodo} />

                <TodoFilter
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    activeCount={activeCount}
                    completedCount={completedCount}
                />

                {filteredTodos.length === 0 ? (
                    <div className="empty-state">
                        <p>
                            {filter === 'completed'
                                ? 'No completed tasks yet!'
                                : filter === 'active'
                                    ? 'No active tasks - add some above!'
                                    : 'No tasks yet - add your first task above!'}
                        </p>
                    </div>
                ) : (
                    <div className="todos-container">
                        {filteredTodos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleTodo}
                                onDelete={deleteTodo}
                            />
                        ))}
                    </div>
                )}

                {completedCount > 0 && (
                    <div className="todo-actions">
                        <button onClick={clearCompleted} className="clear-completed-btn">
                            Clear Completed ({completedCount})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoList;