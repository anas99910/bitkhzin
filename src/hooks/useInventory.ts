import { useState, useEffect } from 'react';
import { InventoryItem, AUTO_CATEGORIES } from '../types/inventory';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setItems([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'inventory'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InventoryItem[];

            newItems.sort((a, b) => b.createdAt - a.createdAt);

            setItems(newItems);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addItem = async (newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (!user) return;

        // Auto-categorize if needed
        let finalCategory = newItem.category;
        if (!finalCategory || finalCategory === 'Other') {
            const lowerName = newItem.name.toLowerCase();
            // Simple keyword matching from dictionary
            for (const [key, cat] of Object.entries(AUTO_CATEGORIES)) {
                if (lowerName.includes(key)) {
                    finalCategory = cat;
                    break;
                }
            }
        }

        const tempId = Date.now().toString();
        const optimisticItem: InventoryItem = {
            ...newItem,
            category: finalCategory,
            stockLevel: newItem.stockLevel || 'full', // Default to full
            id: tempId,
            userId: user.uid,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setItems(prev => [optimisticItem, ...prev]);

        try {
            await addDoc(collection(db, 'inventory'), {
                ...newItem,
                category: finalCategory,
                stockLevel: newItem.stockLevel || 'full',
                userId: user.uid,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        } catch (error: any) {
            console.error("Error adding item:", error);
            setItems(prev => prev.filter(item => item.id !== tempId));
            throw error;
        }
    };

    const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
        // Optimistic Update
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
        ));

        try {
            await updateDoc(doc(db, 'inventory', id), {
                ...updates,
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error("Error updating item:", error);
            // Revert would be complex here, assuming success for now but in prod we'd re-fetch or rollback
        }
    };

    const deleteItem = async (id: string) => {
        const itemBackup = items.find(i => i.id === id);
        if (!itemBackup) return;

        setItems(prev => prev.filter(item => item.id !== id));

        try {
            await deleteDoc(doc(db, 'inventory', id));
        } catch (error) {
            console.error("Error deleting item:", error);
            if (itemBackup) {
                setItems(prev => [...prev, itemBackup].sort((a, b) => b.createdAt - a.createdAt));
            }
        }
    };

    const seedData = async () => {
        if (!user) return;

        const essentials = [
            { name: 'Milk', category: 'Dairy', stockLevel: 'full' },
            { name: 'Eggs', category: 'Dairy', stockLevel: 'low' },
            { name: 'Bread', category: 'Bakery', stockLevel: 'full' },
            { name: 'Rice', category: 'Pantry', stockLevel: 'full' },
            { name: 'Pasta', category: 'Pantry', stockLevel: 'normal' },
        ];

        try {
            const promises = essentials.map(item => {
                return addDoc(collection(db, 'inventory'), {
                    ...item,
                    location: 'kitchen',
                    quantity: 1,
                    value: 0,
                    userId: user.uid,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                });
            });
            await Promise.all(promises);
            // We depend on the onSnapshot listener to update the state
        } catch (error) {
            console.error("Error seeding data:", error);
        }
    };

    return { items, loading, addItem, updateItem, deleteItem, seedData };
};
