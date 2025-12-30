export interface InventoryItem {
    id: string;
    name: string;
    category: string;
    location: string;
    quantity: number; // Default 1
    value?: number;
    purchaseDate?: string; // ISO Date
    description?: string;
    barcode?: string;
    imageUrl?: string; // Base64 or URL
    createdAt: number;
    updatedAt: number;
}

export type Category = 'Electronics' | 'Furniture' | 'Clothing' | 'Kitchen' | 'Tools' | 'Other';
export type Location = 'Living Room' | 'Bedroom' | 'Kitchen' | 'Garage' | 'Office' | 'Storage';

export const DEFAULT_CATEGORIES: Category[] = ['Electronics', 'Furniture', 'Clothing', 'Kitchen', 'Tools', 'Other'];
export const DEFAULT_LOCATIONS: Location[] = ['Living Room', 'Bedroom', 'Kitchen', 'Garage', 'Office', 'Storage'];
