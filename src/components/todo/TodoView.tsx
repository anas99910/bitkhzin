import React, { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useInventory } from '../../hooks/useInventory';
import { Button } from '../ui/Button';
import { Plus, Trash2, Circle, CheckCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { DEFAULT_CATEGORIES } from '../../types/inventory';
import { Card } from '../ui/Card';
import { SwipeableItem } from '../ui/SwipeableItem';
import { Toast } from '../ui/Toast';
import { useCategories } from '../../context/CategoriesContext';

export const TodoView: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const { addItem } = useInventory();
    const { categories } = useCategories();
    const [inputText, setInputText] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(categories[0] || 'Other');

    // Toast state
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info'; actionLabel?: string; onAction?: () => void }>({
        show: false, msg: '', type: 'success'
    });

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success', actionLabel?: string, onAction?: () => void) => {
        setToast({ show: true, msg, type, actionLabel, onAction });
        // Don't auto-hide if there is an action, or make it longer
        const duration = actionLabel ? 5000 : 3000;
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), duration);
    };

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
                stockLevel: 'full',
                value: 0
            });
            deleteTodo(todo.id);
            showToast(`Moved ${todo.text} to pantry`);
        }
    };

    const handleDelete = (id: string, text: string) => {
        // optimistic delete happens in hook, but we need to supply UNDO capability
        // The hook doesn't support "restore" easily unless we re-add.
        // Actually, let's just re-add it if they undo. 
        // Ideally, we'd have a soft-delete or a true undo in the hook, but let's simulate it by keeping the data in closure.

        const itemToDelete = todos.find(t => t.id === id);

        deleteTodo(id);

        showToast(`Deleted "${text}"`, 'info', 'Undo', () => {
            if (itemToDelete) {
                // Restore item
                addTodo(itemToDelete.text, itemToDelete.quantity, itemToDelete.category);
                // Note: This creates a new ID, but that's acceptable for simple undo
                showToast('Item restored');
            }
        });
    };

    const handleClearCompleted = () => {
        if (confirm('Delete all completed items?')) {
            const completed = todos.filter(t => t.completed);
            completed.forEach(t => deleteTodo(t.id));
            showToast(`Cleared ${completed.length} items`);
        }
    }

    const handleMoveAllToPantry = () => {
        const completed = todos.filter(t => t.completed);
        if (completed.length === 0) return;

        if (confirm(`Move ${completed.length} items to pantry?`)) {
            completed.forEach(t => {
                addItem({
                    name: t.text,
                    category: t.category,
                    quantity: t.quantity,
                    location: 'Kitchen',
                    stockLevel: 'full',
                    value: 0
                });
                deleteTodo(t.id);
            });
            showToast(`Moved ${completed.length} items to Pantry`, 'success');
        }
    }

    // Grouping items by category
    const groupedTodos = todos.reduce((acc, todo) => {
        if (!acc[todo.category]) acc[todo.category] = [];
        acc[todo.category].push(todo);
        return acc;
    }, {} as Record<string, typeof todos>);

    const hasCompleted = todos.some(t => t.completed);

    return (
        <div className="animate-slide-up" style={{ paddingBottom: '100px' }}>
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
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                            {items.map((todo, index) => (
                                <SwipeableItem
                                    key={todo.id}
                                    onSwipeLeft={() => handleDelete(todo.id, todo.text)}
                                    onSwipeRight={() => toggleTodo(todo.id)} // Swipe right to toggle completion
                                >
                                    <div
                                        className="tap-scale"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px 16px',
                                            gap: '12px',
                                            // background handled by SwipeableItem container now. But we need transparency here?
                                            // No, SwipeableItem forces specific background. Let's make sure it looks good.
                                            // Actually SwipeableItem sets glass-panel style.
                                            background: todo.completed ? 'rgba(0,0,0,0.02)' : 'transparent', // Light dim if completed
                                            width: '100%'
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
                                                fontWeight: 500,
                                                opacity: todo.completed ? 0.5 : 1
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
                                    </div>
                                </SwipeableItem>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bulk Actions Footer */}
            {hasCompleted && (
                <div style={{
                    position: 'fixed',
                    bottom: '84px', // Above nav
                    left: 0, right: 0,
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    pointerEvents: 'none' // Let clicks pass through if not on buttons
                }}>
                    <div style={{ pointerEvents: 'auto', display: 'flex', gap: '8px' }}>
                        <Button size="sm" variant="secondary" onClick={handleClearCompleted} style={{ boxShadow: 'var(--shadow-lg)', background: 'var(--color-surface-light)' }}>
                            <Trash2 size={16} style={{ marginRight: '4px' }} /> Clear Done
                        </Button>
                        <Button size="sm" onClick={handleMoveAllToPantry} style={{ boxShadow: 'var(--shadow-lg)' }}>
                            <Archive size={16} style={{ marginRight: '4px' }} /> Move All to Pantry
                        </Button>
                    </div>
                </div>
            )}

            <Toast
                isVisible={toast.show}
                message={toast.msg}
                type={toast.type}
                actionLabel={toast.actionLabel}
                onAction={toast.onAction}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div >
    );
};
