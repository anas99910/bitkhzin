export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    location: string;
    quantity: number; // Default 1
    stockLevel: 'low' | 'full' | 'normal';
    value?: number;
    purchaseDate?: string; // ISO Date
    description?: string;
    barcode?: string;
    userId?: string;
    householdId?: string;
    createdAt: number;
    updatedAt: number;
}

export type Category = 'produce' | 'dairy' | 'bakery' | 'meat' | 'frozen' | 'pantry' | 'beverages' | 'snacks' | 'household' | 'other';
export type Location = 'kitchen' | 'pantry' | 'fridge' | 'freezer';

export const DEFAULT_CATEGORIES: string[] = ['Produce', 'Dairy', 'Bakery', 'Meat', 'Frozen', 'Pantry', 'Beverages', 'Snacks', 'Household', 'Other'];

export const AUTO_CATEGORIES: Record<string, string> = {
    'milk': 'Dairy',
    'cheese': 'Dairy',
    'yogurt': 'Dairy',
    'butter': 'Dairy',
    'egg': 'Dairy',
    'eggs': 'Dairy',
    'bread': 'Bakery',
    'bagel': 'Bakery',
    'sugar': 'Bakery',
    'flour': 'Bakery',
    'apple': 'Produce',
    'banana': 'Produce',
    'lettuce': 'Produce',
    'tomato': 'Produce',
    'onion': 'Produce',
    'potato': 'Produce',
    'chicken': 'Meat',
    'beef': 'Meat',
    'steak': 'Meat',
    'water': 'Beverages',
    'juice': 'Beverages',
    'soda': 'Beverages',
    'coffee': 'Pantry',
    'tea': 'Pantry',
    'rice': 'Pantry',
    'pasta': 'Pantry',
    'oil': 'Pantry',
    'salt': 'Pantry',
    'pepper': 'Pantry'
};
