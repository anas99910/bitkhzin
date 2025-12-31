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
    '7lib': 'Dairy', 'lben': 'Dairy', 'bayd': 'Dairy', 'fermaj': 'Dairy', 'danon': 'Dairy',

    // Bakery
    'bread': 'Bakery', 'bagel': 'Bakery', 'sugar': 'Bakery', 'flour': 'Bakery', 'khobz': 'Bakery',

    // Produce
    'apple': 'Produce', 'banana': 'Produce', 'lettuce': 'Produce', 'tomato': 'Produce',
    'onion': 'Produce', 'potato': 'Produce', 'maticha': 'Produce', 'batata': 'Produce',
    'khei': 'Produce', 'carrot': 'Produce', 'khodra': 'Produce', 'fakiya': 'Produce',
    'bsla': 'Produce', 'touma': 'Produce', 'na3na3': 'Produce', 'rbi3': 'Produce',

    // Meat
    'chicken': 'Meat', 'beef': 'Meat', 'steak': 'Meat', 'djaj': 'Meat', 'l7em': 'Meat',
    'kefta': 'Meat', 'saucisse': 'Meat', 'hout': 'Meat',

    // Beverages
    'water': 'Beverages', 'juice': 'Beverages', 'soda': 'Beverages', 'coffee': 'Beverages',
    'tea': 'Beverages', 'atay': 'Beverages', '9ahwa': 'Beverages', 'monada': 'Beverages',

    // Pantry
    'rice': 'Pantry', 'pasta': 'Pantry', 'oil': 'Pantry', 'salt': 'Pantry', 'pepper': 'Pantry',
    'zit': 'Pantry', 'olive oil': 'Pantry', 'skar': 'Pantry', 'smida': 'Pantry',
    'semolina': 'Pantry', 'laadas': 'Pantry', 'lentils': 'Pantry', 'homs': 'Pantry',
    'chickpeas': 'Pantry', 'lubia': 'Pantry', 'couscous': 'Pantry'
};
