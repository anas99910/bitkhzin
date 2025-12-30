import React, { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { Button } from '../ui/Button';
import { Plus, Trash2, Circle } from 'lucide-react';

export const TodoView: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const [inputText, setInputText] = useState('');

    const handleAdd = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputText.trim()) {
            addTodo(inputText);
            setInputText('');
        }
    };

    return (
        <div className="animate-slide-up">
            <h2 className="text-title">To-Do List</h2>

            {/* Input Area */}
            <form onSubmit={handleAdd} style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Add a new task..."
                    className="glass-panel"
                    style={{
                        flex: 1,
                        padding: '16px',
                        background: 'rgba(255,255,255,0.5)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <Button type="submit" style={{ borderRadius: 'var(--radius-md)' }}>
                    <Plus />
                </Button>
            </form>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                        <p>No tasks yet. Enjoy your day! ☕</p>
                    </div>
                )}

                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className="glass-panel"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            gap: '16px',
                            transition: 'all 0.2s',
                            opacity: todo.completed ? 0.6 : 1,
                            background: todo.completed ? 'rgba(255,255,255,0.05)' : 'var(--glass-bg)'
                        }}
                    >
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: todo.completed ? 'hsl(var(--color-primary))' : 'gray'
                            }}
                        >
                            {todo.completed ? <CheckCircleFilled /> : <Circle size={24} />}
                        </button>

                        <span style={{
                            flex: 1,
                            fontSize: '1.1rem',
                            textDecoration: todo.completed ? 'line-through' : 'none',
                            color: todo.completed ? 'var(--color-text-muted)' : 'inherit'
                        }}>
                            {todo.text}
                        </span>

                        <button
                            onClick={() => deleteTodo(todo.id)}
                            style={{
                                background: 'none', border: 'none',
                                opacity: 0.3, cursor: 'pointer',
                                color: '#ef4444'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div >
    );
};

// Custom filled check icon match
const CheckCircleFilled = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
    </svg>
);
