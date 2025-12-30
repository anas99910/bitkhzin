import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react'; // Removed Search, Edit2 to fix lint

interface InventoryListProps {
    items: InventoryItem[];
    onAddItem: () => void;
    onDeleteItem: (id: string) => void;
    onEditItem?: (item: InventoryItem) => void;
}

export const InventoryList: React.FC<InventoryListProps> = ({ items, onAddItem, onDeleteItem }) => {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className="text-title" style={{ margin: 0 }}>My Items</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Search Bar - Visual only for now - Hiding until implemented to avoid lint error */}
                    {/* <div style={{ position: 'relative', display: 'none' }} className="desktop-only">
             <input placeholder="Search..." ... />
             <Search ... />
           </div> */}

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
                                    justifyContent: 'center'
                                }}>
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: '3rem' }}>
                                            {getCategoryEmoji(item.category)}
                                        </span>
                                    )}
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
