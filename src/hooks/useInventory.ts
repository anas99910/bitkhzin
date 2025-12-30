import { useState, useEffect } from 'react';
import { InventoryItem } from '../types/inventory';
import { v4 as uuidv4 } from 'uuid';

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load from LocalStorage first (Cache) or offline fallback
    useEffect(() => {
        const cached = localStorage.getItem('inventory_cache');
        if (cached) {
            setItems(JSON.parse(cached));
        }
        setLoading(false);
    }, []);

    const addItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newItem: InventoryItem = {
            ...item,
            id: uuidv4(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        setItems(prev => {
            const updated = [newItem, ...prev];
            localStorage.setItem('inventory_cache', JSON.stringify(updated));
            return updated;
        });
    };

    const deleteItem = async (id: string) => {
        setItems(prev => {
            const updated = prev.filter(i => i.id !== id);
            localStorage.setItem('inventory_cache', JSON.stringify(updated));
            return updated;
        });
    };

    return { items, loading, addItem, deleteItem };
};
