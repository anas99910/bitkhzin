import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export interface ShoppingItem {
    id: string;
    text: string;
    completed: boolean;
    quantity: number;
    category: string;
    createdAt: number;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<ShoppingItem[]>([]);
    const { user, userProfile } = useAuth(); // Get userProfile

    useEffect(() => {
        if (!user || !userProfile?.householdId) {
            setTodos([]);
            return;
        }

        const q = query(
            collection(db, 'shopping-list'),
            where('householdId', '==', userProfile.householdId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newTodos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ShoppingItem[];

            // Sort client-side: Newest first
            newTodos.sort((a, b) => b.createdAt - a.createdAt);

            setTodos(newTodos);
        }, (error) => {
            console.error("Error fetching shopping list:", error);
        });

        return () => unsubscribe();
    }, [user, userProfile?.householdId]);

    const addTodo = async (text: string, quantity: number = 1, category: string = 'Other') => {
        if (!text.trim() || !user || !userProfile?.householdId) return;

        // Optimistic Update
        const tempId = Date.now().toString();
        const newTodo: ShoppingItem = {
            id: tempId,
            text,
            completed: false,
            quantity,
            category,
            createdAt: Date.now(),
        };
        setTodos(prev => [newTodo, ...prev]);

        try {
            await addDoc(collection(db, 'shopping-list'), {
                text,
                userId: user.uid,
                householdId: userProfile.householdId,
                completed: false,
                quantity,
                category,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error("Error adding item:", error);
            // Rollback on error
            setTodos(prev => prev.filter(t => t.id !== tempId));
            alert("Failed to add item. Please check your connection.");
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        // Optimistic Update
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        ));

        try {
            await updateDoc(doc(db, 'shopping-list', id), {
                completed: !todo.completed
            });
        } catch (error) {
            console.error("Error toggling item:", error);
            // Rollback
            setTodos(prev => prev.map(t =>
                t.id === id ? { ...t, completed: todo.completed } : t
            ));
        }
    };

    const deleteTodo = async (id: string) => {
        const todoBackup = todos.find(t => t.id === id);
        if (!todoBackup) return;

        // Optimistic Update
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            await deleteDoc(doc(db, 'shopping-list', id));
        } catch (error) {
            console.error("Error deleting item:", error);
            // Rollback
            setTodos(prev => {
                const newTodos = [...prev, todoBackup];
                newTodos.sort((a, b) => b.createdAt - a.createdAt);
                return newTodos;
            });
            alert("Failed to delete item. Check console for details.");
        }
    };

    return { todos, addTodo, toggleTodo, deleteTodo };
};
