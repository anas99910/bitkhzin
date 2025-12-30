import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { Toast } from '../ui/Toast';

interface InventoryListProps {
    items: InventoryItem[];
    onAddItem: () => void;
    onDeleteItem: (id: string) => void;
    onEditItem?: (item: InventoryItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onAddItem, onDeleteItem }) => {
    const { addTodo } = useTodos();
    const [toast, setToast] = React.useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

    const handleAddToShoppingList = (item: InventoryItem) => {
        addTodo(item.name, 1, item.category);
        setToast({ show: true, msg: `Added ${item.name} to Shopping List` });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button onClick={onAddItem}>
                        <Plus size={18} /> <span className="desktop-only">Add Item</span>
                    </Button>
                </div>
            </div>

            {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', opacity: 0.6 }}>
                    <p>No items found. Add your first item!</p>
                </div>
            ) : (
                <div className="inventory-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '16px'
                }}>
                    {items.map((item, index) => (
                        <div key={item.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                            <Card hoverEffect className="inventory-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <div style={{
                                    height: '140px',
                                    marginBottom: '12px',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    background: 'rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <span style={{ fontSize: '3rem' }}>
                                        {getCategoryEmoji(item.category)}
                                    </span>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAddToShoppingList(item); }}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'hsl(var(--color-primary))',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                        title="Add to Shopping List"
                                    >
                                        <ShoppingCart size={16} />
                                    </button>
                                </div>
                                <div style={{ flex: 1, marginBottom: '12px' }}>
                                    <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</h3>
                                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>{item.location}</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                                    <span style={{ fontWeight: '600', color: 'hsl(var(--color-primary))' }}>
                                        {item.value ? `$${item.value}` : '-'}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>x{item.quantity}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                                            className="icon-button danger"
                                            style={{ padding: '6px' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
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
