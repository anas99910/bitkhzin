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
    // Dairy
    'milk': 'Dairy', 'cheese': 'Dairy', 'yogurt': 'Dairy', 'butter': 'Dairy', 'egg': 'Dairy',

    // Bakery
    'bread': 'Bakery', 'bagel': 'Bakery', 'sugar': 'Bakery', 'flour': 'Bakery', 'khobz': 'Bakery',

    // Produce
    'apple': 'Produce', 'banana': 'Produce', 'lettuce': 'Produce', 'tomato': 'Produce',
    'onion': 'Produce', 'potato': 'Produce', 'maticha': 'Produce', 'batata': 'Produce',
    'khei': 'Produce', 'carrot': 'Produce',

    // Meat
    'chicken': 'Meat', 'beef': 'Meat', 'steak': 'Meat',

    // Beverages
    'water': 'Beverages', 'juice': 'Beverages', 'soda': 'Beverages', 'coffee': 'Beverages',
    'tea': 'Beverages', 'atay': 'Beverages',

    // Pantry
    'rice': 'Pantry', 'pasta': 'Pantry', 'oil': 'Pantry', 'salt': 'Pantry', 'pepper': 'Pantry',
    'zit': 'Pantry', 'olive oil': 'Pantry', 'skar': 'Pantry', 'smida': 'Pantry',
    'semolina': 'Pantry', 'laadas': 'Pantry', 'lentils': 'Pantry', 'homs': 'Pantry',
    'chickpeas': 'Pantry', 'lubia': 'Pantry', 'couscous': 'Pantry'
};
