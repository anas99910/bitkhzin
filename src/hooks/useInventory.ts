import { useState, useEffect } from 'react';
import { InventoryItem } from '../types/inventory';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
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

        // Query Firestore collection 'inventory' - REMOVED orderBy to fix index issues
        const q = query(
            collection(db, 'inventory'),
            where('userId', '==', user.uid)
        );

        // Real-time listener
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newItems = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as InventoryItem[];

            // Client-side sorting
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
        if (!user) {
            alert("You must be logged in to add items.");
            return;
        }

        // Optimistic Update
        const tempId = Date.now().toString();
        const optimisticItem: InventoryItem = {
            ...newItem,
            id: tempId,
            userId: user.uid,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setItems(prev => [optimisticItem, ...prev]);

        try {
            await addDoc(collection(db, 'inventory'), {
                ...newItem,
                userId: user.uid,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });
        } catch (error: any) {
            console.error("Error adding item:", error);
            // Rollback
            setItems(prev => prev.filter(item => item.id !== tempId));

            if (error.code === 'permission-denied') {
                alert("Permission denied! Check your login.");
            } else {
                alert(`Failed to save item: ${error.message}`);
            }
            throw error;
        }
    };

    const deleteItem = async (id: string) => {
        const itemBackup = items.find(i => i.id === id);
        if (!itemBackup) return;

        // Optimistic Update
        setItems(prev => prev.filter(item => item.id !== id));

        try {
            await deleteDoc(doc(db, 'inventory', id));
        } catch (error) {
            console.error("Error deleting item:", error);
            // Rollback
            setItems(prev => {
                const newItems = [...prev, itemBackup];
                newItems.sort((a, b) => b.createdAt - a.createdAt);
                return newItems;
            });
        }
    };

    return { items, loading, addItem, deleteItem };
};
