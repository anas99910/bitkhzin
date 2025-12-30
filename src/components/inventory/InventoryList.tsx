import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { useInventory } from '../../hooks/useInventory';
import { Toast } from '../ui/Toast';

interface InventoryListProps {
    items: InventoryItem[];
    onAddItem: () => void;
    onDeleteItem: (id: string) => void;
    onEditItem?: (item: InventoryItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onAddItem, onDeleteItem }) => {
    const { addTodo } = useTodos();
    const { updateItem, seedData } = useInventory(); // We need this to toggle status
    const [toast, setToast] = React.useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

    const handleAddToShoppingList = (item: InventoryItem) => {
        addTodo(item.name, 1, item.category);
        setToast({ show: true, msg: `Added ${item.name} to Shopping List` });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    const toggleStatus = (item: InventoryItem, newStatus: 'low' | 'full') => {
        // If clicking the active status, maybe toggle off? Or just keep it.
        // Let's assume clicking 'Low' sets it to low.
        updateItem(item.id, { stockLevel: newStatus });

        if (newStatus === 'low') {
            // Optional: Auto-prompt to shop?
        }
    };

    // Group items by category
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
                            <Card style={{ padding: '0', overflow: 'hidden' }}>
                                {categoryItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            borderBottom: index !== categoryItems.length - 1 ? '1px solid var(--glass-border)' : 'none',
                                            background: item.stockLevel === 'low' ? 'rgba(239, 68, 68, 0.05)' : 'transparent'
                                        }}
                                    >
                                        {/* Checkbox (Visual only for now, or maybe checks "consumed") */}
                                        <div
                                            style={{
                                                width: '20px', height: '20px',
                                                border: '2px solid var(--text-muted)',
                                                borderRadius: '4px',
                                                marginRight: '16px',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            onClick={() => handleAddToShoppingList(item)}
                                            title="Add to Shopping List"
                                        >
                                            {/* Empty square */}
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
                                                    background: 'none',
                                                    border: 'none',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    color: item.stockLevel === 'low' ? '#ef4444' : 'var(--text-muted)', // Red if low
                                                    cursor: 'pointer',
                                                    opacity: item.stockLevel === 'low' ? 1 : 0.5,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Low
                                            </button>

                                            <div style={{ width: '1px', height: '12px', background: 'var(--text-muted)', opacity: 0.3 }}></div>

                                            <button
                                                onClick={() => toggleStatus(item, 'full')}
                                                className="tap-scale"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    color: item.stockLevel === 'full' ? '#10b981' : 'var(--text-muted)', // Green if full
                                                    cursor: 'pointer',
                                                    opacity: item.stockLevel === 'full' ? 1 : 0.5,
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                Full
                                            </button>

                                            {/* Menu / Delete */}
                                            <button
                                                onClick={() => onDeleteItem(item.id)}
                                                style={{ marginLeft: '12px', opacity: 0.3, background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 6px 0 currentColor, 0 -6px 0 currentColor' }}></div>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </Card>
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

const getCategoryEmoji = (category: string) => {
    switch (category) {
        case 'Electronics': return '💻';
        case 'Furniture': return '🛋️';
        case 'Clothing': return '👕';
        case 'Kitchen': return '🍳';
        case 'Tools': return '🔧';
        default: return '📦';
    }
};
