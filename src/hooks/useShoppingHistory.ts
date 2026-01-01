import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc, increment, limit, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export interface HistoryItem {
    id: string;
    text: string;
    category: string;
    count: number;
    lastUsed: number;
}

export const useShoppingHistory = () => {
    const { userProfile } = useAuth();
    const [frequentItems, setFrequentItems] = useState<HistoryItem[]>([]);

    // Fetch frequent items
    useEffect(() => {
        if (!userProfile?.householdId) return;

        const fetchHistory = async () => {
            try {
                const q = query(
                    collection(db, 'shopping-history'),
                    where('householdId', '==', userProfile.householdId),
                    orderBy('count', 'desc'),
                    limit(15) // Top 15 items
                );

                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as HistoryItem[];

                setFrequentItems(items);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, [userProfile?.householdId]);

    // Add/Update item in history
    const addToHistory = async (text: string, category: string) => {
        if (!userProfile?.householdId || !text.trim()) return;

        const normalizedText = text.trim();
        // Create a consistent ID based on text (simple slug)
        const itemId = `${userProfile.householdId}_${normalizedText.toLowerCase().replace(/\s+/g, '-')}`;

        try {
            const itemRef = doc(db, 'shopping-history', itemId);

            // Try to update first (using set with merge is safer for "upsert" like behavior if we knew it existed, 
            // but here we want to increment if exists, or set if new. 
            // setDoc with merge doesn't support 'increment' on new fields cleanly in one go without native SDK support for upserts,
            // but we can just use setDoc with merge: true which basically does it).

            await setDoc(itemRef, {
                householdId: userProfile.householdId,
                text: normalizedText,
                category,
                count: increment(1),
                lastUsed: Date.now()
            }, { merge: true });

            // Optimistically update local state if needed, or just re-fetch. 
            // For simplicity/performance, we might not re-fetch immediately every time, 
            // but let's at least try to update the local list if it's there.
        } catch (error) {
            console.error("Error adding to history:", error);
        }
    };

    return { frequentItems, addToHistory };
};
