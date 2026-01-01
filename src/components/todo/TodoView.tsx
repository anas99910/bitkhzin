import React, { useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useInventory } from '../../hooks/useInventory';
import { SwipeableItem } from '../ui/SwipeableItem';
import { Plus, CheckCircle, Archive } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dropdown } from '../ui/Dropdown';
import { Card } from '../ui/Card';
import { useCategories } from '../../context/CategoriesContext';
import { Toast } from '../ui/Toast';
import { useShoppingHistory } from '../../hooks/useShoppingHistory';

export const TodoView: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const { addItem } = useInventory();
    const { categories } = useCategories();
    const { frequentItems } = useShoppingHistory();
    const [inputText, setInputText] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [category, setCategory] = useState(categories[0] || 'Other');

    const handleQuickAdd = (item: any) => {
        addTodo(item.text, 1, item.category);
        showToast(`Added ${item.text}`, 'success');
    };

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


    const handleDelete = (id: string, text: string) => {
        const itemToDelete = todos.find(t => t.id === id);
        deleteTodo(id);
        showToast(`Deleted "${text}"`, 'info', 'Undo', () => {
            if (itemToDelete) {
                // Restore item
                addTodo(itemToDelete.text, itemToDelete.quantity, itemToDelete.category);
                showToast('Item restored');
            }
        });
    };

    const handleMoveAllToPantry = () => {
        const completed = todos.filter(t => t.completed);
        if (completed.length === 0) return;

        if (confirm(`Move ${completed.length} items to pantry ? `)) {
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

    const completedCount = todos.filter(t => t.completed).length;

    return (
        <div className="animate-slide-up" style={{ paddingBottom: '120px' }}>
            <h2 className="text-title">Shopping List</h2>

            {/* Input Area */}
            <Card className="mb-6" style={{ position: 'relative', zIndex: 10 }}>
                {/* Quick Add Suggestions */}
                {frequentItems.length > 0 && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        overflowX: 'auto',
                        paddingBottom: '12px',
                        marginBottom: '12px',
                        borderBottom: '1px solid var(--glass-border)',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }} className="no-scrollbar">
                        {frequentItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleQuickAdd(item)}
                                type="button"
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.2s',
                                    flexShrink: 0
                                }}
                            >
                                <Plus size={12} />
                                {item.text}
                            </button>
                        ))}
                    </div>
                )}

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
                                background: 'rgba(255,255,255,0.05)',
                                outline: 'none',
                                textAlign: 'center',
                                border: '1px solid var(--glass-border)'
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
                                background: 'rgba(255,255,255,0.05)',
                                outline: 'none',
                                border: '1px solid var(--glass-border)'
                            }}
                        />
                    </div>

                    {/* Row 2: Category + Add Button */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Dropdown
                            value={category}
                            onChange={(val) => setCategory(val)}
                            options={categories.map(c => ({ value: c, label: c }))}
                            placeholder="Category"
                        />

                        <Button type="submit" disabled={!inputText.trim()} style={{ width: '60px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Plus size={24} />
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {todos.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                        <p>Your shopping list is empty.</p>
                    </div>
                )}

                {Object.entries(groupedTodos).map(([cat, items]) => (
                    <div key={cat} className="animate-fade-in">
                        <h3 style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: 'hsl(var(--color-primary))',
                            marginBottom: '12px',
                            marginLeft: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            opacity: 0.8
                        }}>
                            {cat}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {items.map((todo) => (
                                <SwipeableItem
                                    key={todo.id}
                                    onSwipeLeft={() => handleDelete(todo.id, todo.text)}
                                >
                                    <div
                                        className="tap-scale glass-panel"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            gap: '16px',
                                            background: todo.completed ? 'rgba(0,0,0,0.2)' : 'var(--color-surface)',
                                            width: '100%',
                                            borderRadius: '16px',
                                            border: '1px solid var(--glass-border)',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => toggleTodo(todo.id)}
                                    >
                                        {/* Checkbox Area */}
                                        <div
                                            style={{
                                                minWidth: '24px',
                                                height: '24px',
                                                borderRadius: '6px',
                                                border: todo.completed ? 'none' : '2px solid var(--text-muted)',
                                                background: todo.completed ? 'hsl(var(--color-primary))' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                flexShrink: 0
                                            }}
                                        >
                                            {todo.completed && <CheckCircle size={16} color="white" />}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                            <span style={{
                                                fontSize: '1rem',
                                                textDecoration: todo.completed ? 'line-through' : 'none',
                                                fontWeight: 500,
                                                color: todo.completed ? 'var(--text-muted)' : 'var(--text-main)',
                                                transition: 'all 0.2s',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {todo.text}
                                            </span>
                                            {todo.quantity > 1 && (
                                                <span style={{ fontSize: '0.8rem', color: 'hsl(var(--color-primary))', fontWeight: 'bold' }}>
                                                    Qty: {todo.quantity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </SwipeableItem>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating "Done Shopping" Button */}
            {
                completedCount > 0 && (
                    <div className="animate-slide-up" style={{
                        position: 'fixed',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20
                    }}>
                        <Button
                            onClick={handleMoveAllToPantry}
                            style={{
                                borderRadius: '32px',
                                padding: '12px 24px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold',
                                background: 'hsl(var(--color-primary))',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            <Archive size={20} />
                            Move {completedCount} to Pantry
                        </Button>
                    </div>
                )
            }

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
