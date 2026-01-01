import React from 'react';
import { InventoryItem } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Plus, Check } from 'lucide-react';
import { InventoryForm } from './InventoryForm';
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

    // Bulk Actions & Editing State
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
    const [editingItem, setEditingItem] = React.useState<InventoryItem | null>(null);

    const handleAddToShoppingList = (item: InventoryItem) => {
        addTodo(item.name, 1, item.category);
        setToast({ show: true, msg: `Added ${item.name} to Shopping List` });
        setTimeout(() => setToast({ show: false, msg: '' }), 3000);
    };

    const toggleStatus = (item: InventoryItem, newStatus: 'low' | 'full') => {
        updateItem(item.id, { stockLevel: newStatus });
    };

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedIds.size} items?`)) {
            selectedIds.forEach(id => onDeleteItem(id));
            setIsSelectionMode(false);
            setSelectedIds(new Set());
            setToast({ show: true, msg: 'Items deleted' });
            setTimeout(() => setToast({ show: false, msg: '' }), 3000);
        }
    };

    const handleSaveEdit = (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingItem) {
            updateItem(editingItem.id, item);
            setEditingItem(null);
            setToast({ show: true, msg: 'Item updated' });
            setTimeout(() => setToast({ show: false, msg: '' }), 3000);
        }
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
            {/* Header Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                setSelectedIds(new Set());
                            }}
                            style={{ color: isSelectionMode ? 'var(--color-primary)' : 'var(--text-muted)' }}
                        >
                            {isSelectionMode ? 'Cancel' : 'Select'}
                        </Button>
                    )}
                    {isSelectionMode && selectedIds.size > 0 && (
                        <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                            Delete ({selectedIds.size})
                        </Button>
                    )}
                </div>

                {!isSelectionMode && (
                    <Button onClick={onAddItem} className="tap-scale">
                        <Plus size={18} /> Add Item
                    </Button>
                )}
            </div>

            {/* Edit Modal / Overlay */}
            {editingItem && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                    <div style={{ width: '100%', maxWidth: '500px' }}>
                        <InventoryForm
                            initialValues={editingItem}
                            onSubmit={handleSaveEdit}
                            onCancel={() => setEditingItem(null)}
                        />
                    </div>
                </div>
            )}

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
                                        disabled={isSelectionMode} // Disable swipe in selection mode
                                    >
                                        <div
                                            className="glass-panel"
                                            onClick={() => {
                                                if (isSelectionMode) toggleSelection(item.id);
                                            }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '16px',
                                                background: selectedIds.has(item.id)
                                                    ? 'rgba(99, 102, 241, 0.1)'
                                                    : (item.stockLevel === 'low' ? 'rgba(239, 68, 68, 0.05)' : 'var(--color-surface)'),
                                                border: selectedIds.has(item.id)
                                                    ? '1px solid var(--color-primary)'
                                                    : '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                marginBottom: '8px',
                                                position: 'relative',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {/* Selection Checkbox */}
                                            {isSelectionMode ? (
                                                <div style={{
                                                    width: '24px', height: '24px',
                                                    borderRadius: '6px',
                                                    border: selectedIds.has(item.id) ? 'none' : '2px solid var(--text-muted)',
                                                    background: selectedIds.has(item.id) ? 'var(--color-primary)' : 'transparent',
                                                    marginRight: '16px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white'
                                                }}>
                                                    {selectedIds.has(item.id) && <Check size={16} />}
                                                </div>
                                            ) : (
                                                /* Add to Shop Button (Only in normal mode) */
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddToShoppingList(item);
                                                    }}
                                                    title="Add to Shopping List"
                                                >
                                                    <Plus size={14} />
                                                </div>
                                            )}

                                            {/* Name (Click to Edit) */}
                                            <div style={{ flex: 1 }} onClick={() => !isSelectionMode && setEditingItem(item)}>
                                                <span style={{ fontWeight: 500, fontSize: '1rem', cursor: !isSelectionMode ? 'pointer' : 'default' }}>
                                                    {item.name}
                                                </span>
                                            </div>

                                            {/* Status Toggles (Hidden in selection mode?) - Keeping visible but non-interactive logic maybe? */}
                                            {!isSelectionMode && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleStatus(item, 'low'); }}
                                                        className="tap-scale"
                                                        style={{
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
                                                        onClick={(e) => { e.stopPropagation(); toggleStatus(item, 'full'); }}
                                                        className="tap-scale"
                                                        style={{
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
                                            )}
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
