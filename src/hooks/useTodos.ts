import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setTodos([]);
            return;
        }

        // Removed orderBy to avoid missing index issues. We sort client-side below.
        const q = query(
            collection(db, 'todos'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newTodos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TodoItem[];

            // Sort client-side: Newest first
            newTodos.sort((a, b) => b.createdAt - a.createdAt);

            setTodos(newTodos);
        }, (error) => {
            console.error("Error fetching todos:", error);
        });

        return () => unsubscribe();
    }, [user]);

    const addTodo = async (text: string) => {
        if (!text.trim() || !user) return;

        // Optimistic Update
        const tempId = Date.now().toString();
        const newTodo: TodoItem = {
            id: tempId,
            text,
            completed: false,
            createdAt: Date.now(),
        };
        setTodos(prev => [newTodo, ...prev]);

        try {
            await addDoc(collection(db, 'todos'), {
                text,
                userId: user.uid,
                completed: false,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error("Error adding todo:", error);
            // Rollback on error
            setTodos(prev => prev.filter(t => t.id !== tempId));
            alert("Failed to add task. Please check your connection.");
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
            await updateDoc(doc(db, 'todos', id), {
                completed: !todo.completed
            });
        } catch (error) {
            console.error("Error toggling todo:", error);
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
        console.log("Optimistically deleting todo:", id);
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            await deleteDoc(doc(db, 'todos', id));
            console.log("Todo deleted successfully from server:", id);
        } catch (error) {
            console.error("Error deleting todo:", error);
            // Rollback
            setTodos(prev => {
                const newTodos = [...prev, todoBackup];
                newTodos.sort((a, b) => b.createdAt - a.createdAt);
                return newTodos;
            });
            alert("Failed to delete task. Check console for details.");
        }
    };

    return { todos, addTodo, toggleTodo, deleteTodo };
};
