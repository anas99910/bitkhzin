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
                <div className="grid-auto-fit">
                    {items.map((item, i) => (
                        <Card key={item.id} hoverEffect style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{
                                    width: '80px', height: '80px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem'
                                }}>
                                    {getCategoryEmoji(item.category)}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.name}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>{item.category} • {item.location}</p>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <span style={{ fontWeight: '600', color: 'hsl(var(--color-primary))' }}>
                                            {item.value ? `$${item.value}` : '-'}
                                        </span>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                                                style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
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
