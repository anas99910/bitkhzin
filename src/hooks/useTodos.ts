import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, orderBy, where } from 'firebase/firestore';
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

        const q = query(
            collection(db, 'todos'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newTodos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TodoItem[];
            setTodos(newTodos);
        });

        return () => unsubscribe();
    }, [user]);

    const addTodo = async (text: string) => {
        if (!text.trim() || !user) return;
        try {
            await addDoc(collection(db, 'todos'), {
                text,
                userId: user.uid,
                completed: false,
                createdAt: Date.now(),
            });
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        try {
            await updateDoc(doc(db, 'todos', id), {
                completed: !todo.completed
            });
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    return { todos, addTodo, toggleTodo, deleteTodo };
};
