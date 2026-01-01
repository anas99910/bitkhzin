import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { useInventory } from '../../hooks/useInventory';
import { Toast } from '../ui/Toast';

interface InventoryListProps {
    items: InventoryItem[];
    onAddItem: () => void;
    onDeleteItem: (id: string) => void;
    onEditItem?: (item: InventoryItem) => void;
}
import { SwipeableItem } from '../ui/SwipeableItem';

export const InventoryList: React.FC<InventoryListProps> = ({ items, onAddItem, onDeleteItem }) => {
    // ... (keep existing hooks)
    const { addTodo } = useTodos();
    const { updateItem, seedData } = useInventory();
    const [toast, setToast] = React.useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

    const handleAddToShoppingList = (item: InventoryItem) => {
        addTodo(item.name, 1, item.category);
        setToast({ show: true, msg: `Added ${item.name} to Shopping List` });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    const toggleStatus = (item: InventoryItem, newStatus: 'low' | 'full') => {
        updateItem(item.id, { stockLevel: newStatus });
    };

    // Group items by category (keep existing logic)
    const groupedItems = items.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, InventoryItem[]>);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
                <Button onClick={onAddItem} className="tap-scale">
                    <Plus size={18} /> Add Item
                </Button>
            </div>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', opacity: 0.8 }}>
                    <p style={{ marginBottom: '16px' }}>Your pantry is empty.</p>
                    <Button onClick={() => seedData && seedData()}>
                        Preload Essentials
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {Object.entries(groupedItems).map(([category, categoryItems], groupIndex) => (
                        <div key={category} className="animate-slide-up" style={{ animationDelay: `${groupIndex * 50}ms` }}>
                            {/* Category Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '8px',
                                paddingLeft: '8px',
                                borderLeft: '4px solid hsl(var(--color-primary))'
                            }}>
                                <h3 style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: 'hsl(var(--color-primary))',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {category}
                                </h3>
                            </div>

                            {/* Items List */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                {categoryItems.map((item) => (
                                    <SwipeableItem
                                        key={item.id}
                                        onSwipeLeft={() => onDeleteItem(item.id)}
                                    >
                                        <div
                                            className="glass-panel"
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '16px',
                                                background: item.stockLevel === 'low' ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-surface)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                marginBottom: '8px'
                                            }}
                                        >
                                            {/* Checkbox (Add to Shop) */}
                                            <div
                                                style={{
                                                    width: '24px', height: '24px',
                                                    border: '2px solid var(--text-muted)',
                                                    borderRadius: '6px',
                                                    marginRight: '16px',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'var(--text-muted)',
                                                    opacity: 0.5
                                                }}
                                                onClick={() => handleAddToShoppingList(item)}
                                                title="Add to Shopping List"
                                            >
                                                <Plus size={14} />
                                            </div>

                                            {/* Name */}
                                            <div style={{ flex: 1 }}>
                                                <span style={{ fontWeight: 500, fontSize: '1rem' }}>{item.name}</span>
                                            </div>

                                            {/* Status Toggles */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    onClick={() => toggleStatus(item, 'low')}
                                                    className="tap-scale"
                                                    style={{
                                                        // Combined background logic
                                                        background: item.stockLevel === 'low' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                                        border: 'none',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        color: item.stockLevel === 'low' ? '#ef4444' : 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        opacity: item.stockLevel === 'low' ? 1 : 0.4,
                                                        transition: 'all 0.2s',
                                                        padding: '4px 8px',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    Low
                                                </button>

                                                <button
                                                    onClick={() => toggleStatus(item, 'full')}
                                                    className="tap-scale"
                                                    style={{
                                                        // Combined background logic
                                                        background: item.stockLevel === 'full' ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                                        border: 'none',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        color: item.stockLevel === 'full' ? '#10b981' : 'var(--text-muted)',
                                                        cursor: 'pointer',
                                                        opacity: item.stockLevel === 'full' ? 1 : 0.4,
                                                        transition: 'all 0.2s',
                                                        padding: '4px 8px',
                                                        borderRadius: '8px'
                                                    }}
                                                >
                                                    Full
                                                </button>
                                            </div>
                                        </div>
                                    </SwipeableItem>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Toast
                isVisible={toast.show}
                message={toast.msg}
                type="success"
                onClose={() => setToast({ show: false, msg: '' })}
            />
        </div>
    );
};

// Removed getCategoryEmoji function
