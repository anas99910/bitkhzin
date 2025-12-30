import { useState, useEffect } from 'react';
import { InventoryItem, DEFAULT_CATEGORIES, DEFAULT_LOCATIONS } from '../types/inventory';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

// Fallback data for initial load/offline if needed, but we rely on Firebase persistence
const DEFAULT_ITEMS: InventoryItem[] = [];

export const useInventory = () => {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query Firestore collection 'inventory'
        const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'));

        // Real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InventoryItem[];
            setItems(newItems);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching inventory:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addItem = async (newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            await addDoc(collection(db, 'inventory'), {
                ...newItem,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    const deleteItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'inventory', id));
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return { items, loading, addItem, deleteItem };
};
