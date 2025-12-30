import React, { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/Button';
import { Plus, Trash2, Circle, CheckCircle, ArrowRight } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../types/inventory';
import { Card } from '../ui/Card';

export const TodoView: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const { addItem } = useInventory();
    const [inputText, setInputText] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);

    const handleAdd = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputText.trim()) {
            addTodo(inputText, quantity, category);
            setInputText('');
            setQuantity(1);
        }
    };

    const handleMoveToPantry = (todo: any) => {
        if (confirm(`Move "${todo.text}" to your inventory?`)) {
            addItem({
                name: todo.text,
                category: todo.category,
                quantity: todo.quantity,
                location: 'Kitchen', // Default
                value: 0
            });
            deleteTodo(todo.id);
        }
    };

    // Grouping items by category
    const groupedTodos = todos.reduce((acc, todo) => {
        if (!acc[todo.category]) acc[todo.category] = [];
        acc[todo.category].push(todo);
        return acc;
    }, {} as Record<string, typeof todos>);

    return (
        <div className="animate-slide-up">
            <h2 className="text-title">Shopping List</h2>

            {/* Input Area */}
            <Card className="mb-6">
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Row 1: Qty + Name */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="glass-panel"
                            style={{
                                width: '60px',
                                padding: '12px',
                                background: 'rgba(255,255,255,0.5)',
                                outline: 'none',
                                textAlign: 'center'
                            }}
                            placeholder="Qty"
                        />
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="What do you need?"
                            className="glass-panel"
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(255,255,255,0.5)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Row 2: Category + Add Button */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                            className="glass-panel"
                            style={{
                                flex: 1,
                                padding: '12px',
                                background: 'rgba(255,255,255,0.5)',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <Button type="submit" disabled={!inputText.trim()} style={{ width: '60px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={24} />
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {todos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                        <p>Your shopping list is empty.</p>
                    </div>
                )}

                {Object.entries(groupedTodos).map(([cat, items]) => (
                    <div key={cat} className="animate-fade-in">
                        <h3 style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'hsl(var(--color-primary))',
                            marginBottom: '8px',
                            marginLeft: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            {cat}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(todo => (
                                <div
                                    key={todo.id}
                                    className="glass-panel"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        gap: '12px',
                                        transition: 'all 0.2s',
                                        opacity: todo.completed ? 0.6 : 1,
                                        background: todo.completed ? 'rgba(0,0,0,0.02)' : 'var(--glass-bg)'
                                    }}
                                >
                                    <button
                                        onClick={() => toggleTodo(todo.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: todo.completed ? 'hsl(var(--color-primary))' : 'var(--text-muted)'
                                        }}
                                    >
                                        {todo.completed ? <CheckCircle size={22} fill="currentColor" className="text-primary" /> : <Circle size={22} />}
                                    </button>

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <span style={{
                                            fontSize: '1rem',
                                            textDecoration: todo.completed ? 'line-through' : 'none',
                                            fontWeight: 500
                                        }}>
                                            {todo.text}
                                        </span>
                                        {todo.quantity > 1 && (
                                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                Qty: {todo.quantity}
                                            </span>
                                        )}
                                    </div>

                                    {todo.completed && (
                                        <button
                                            onClick={() => handleMoveToPantry(todo)}
                                            style={{
                                                background: 'none', border: 'none',
                                                cursor: 'pointer',
                                                color: 'hsl(var(--color-primary))',
                                                padding: '4px',
                                                marginRight: '4px'
                                            }}
                                            title="Move to Inventory"
                                        >
                                            <ArrowRight size={18} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            background: 'none', border: 'none',
                                            opacity: 0.3, cursor: 'pointer',
                                            color: '#ef4444',
                                            padding: '4px'
                                        }}
                                        className="hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};
