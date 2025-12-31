import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { DEFAULT_CATEGORIES } from '../types/inventory';

interface Category {
    id: string;
    name: string;
    householdId: string;
    isCustom: boolean;
}

interface CategoriesContextType {
    categories: string[];
    customCategories: Category[];
    addCategory: (name: string) => Promise<void>;
    removeCategory: (id: string, name: string) => Promise<void>;
    loading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType>({
    categories: DEFAULT_CATEGORIES,
    customCategories: [],
    addCategory: async () => { },
    removeCategory: async () => { },
    loading: true
});

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, userProfile } = useAuth();
    const [customCategories, setCustomCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !userProfile?.householdId) {
            setCustomCategories([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'categories'),
            where('householdId', '==', userProfile.householdId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loaded = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isCustom: true
            })) as Category[];
            setCustomCategories(loaded);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, userProfile?.householdId]);

    const addCategory = async (name: string) => {
        if (!name.trim() || !userProfile?.householdId) return;
        // Prevent duplicates
        if (DEFAULT_CATEGORIES.includes(name) || customCategories.some(c => c.name === name)) {
            alert('Category already exists');
            return;
        }

        await addDoc(collection(db, 'categories'), {
            name,
            householdId: userProfile.householdId,
            createdAt: Date.now()
        });
    };

    const removeCategory = async (id: string, name: string) => {
        if (DEFAULT_CATEGORIES.includes(name)) {
            alert('Cannot delete default categories');
            return;
        }
        await deleteDoc(doc(db, 'categories', id));
    };

    // Merge logic
    const allCategories = [...new Set([...DEFAULT_CATEGORIES, ...customCategories.map(c => c.name)])];

    return (
        <CategoriesContext.Provider value={{
            categories: allCategories,
            customCategories,
            addCategory,
            removeCategory,
            loading
        }}>
            {children}
        </CategoriesContext.Provider>
    );
};
