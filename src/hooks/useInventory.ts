import { useState, useEffect } from 'react';
import { InventoryItem } from '../types/inventory';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
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

        // Query Firestore collection 'inventory'
        const q = query(
            collection(db, 'inventory'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

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
    }, [user]);

    const addItem = async (newItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            if (!user) return;
            await addDoc(collection(db, 'inventory'), {
                ...newItem,
                userId: user.uid,
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
