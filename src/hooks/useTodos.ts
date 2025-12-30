import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export const useTodos = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);

    // Load from LocalStorage
    useEffect(() => {
        const cached = localStorage.getItem('todo_cache');
        if (cached) {
            setTodos(JSON.parse(cached));
        }
    }, []);

    const saveTodos = (newTodos: TodoItem[]) => {
        setTodos(newTodos);
        localStorage.setItem('todo_cache', JSON.stringify(newTodos));
    };

    const addTodo = (text: string) => {
        const newTodo: TodoItem = {
            id: uuidv4(),
            text,
            completed: false,
            createdAt: Date.now(),
        };
        saveTodos([newTodo, ...todos]);
    };

    const toggleTodo = (id: string) => {
        const newTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos(newTodos);
    };

    const deleteTodo = (id: string) => {
        const newTodos = todos.filter(todo => todo.id !== id);
        saveTodos(newTodos);
    };

    return { todos, addTodo, toggleTodo, deleteTodo };
};
