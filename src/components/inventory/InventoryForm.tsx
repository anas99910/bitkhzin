import React, { useState } from 'react';
import { Loader2, ScanBarcode } from 'lucide-react';
import { InventoryItem, AUTO_CATEGORIES } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';
import { BarcodeScanner } from './BarcodeScanner';
import { useCategories } from '../../context/CategoriesContext';
import { fetchProduct } from '../../lib/openfoodfacts';

interface InventoryFormProps {
    initialValues?: InventoryItem;
    onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ initialValues, onSubmit, onCancel }) => {
    // State
    const [name, setName] = useState(initialValues?.name || '');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [category, setCategory] = useState(initialValues?.category || '');
    // const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
    // const [quantity, setQuantity] = useState(1);
    // const [value, setValue] = useState('');
    const [barcode, setBarcode] = useState(initialValues?.barcode || '');
    // Image state removed
    const [showScanner, setShowScanner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { categories } = useCategories();
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' }>({
        show: false,
        msg: '',
        type: 'success'
    });

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleScanResult = async (result: string) => {
        setBarcode(result);
        setShowScanner(false);
        showToast('Looking up product...', 'info');

        try {
            const product = await fetchProduct(result);
            if (product) {
                setName(product.name);
                if (product.category) {
                    setCategory(product.category); // You might want to map this to your existing categories or add it as custom
                }
                showToast(`Found: ${product.name}`, 'success');
            } else {
                showToast('Product not found, please enter manually', 'info');
            }
        } catch (e) {
            showToast('Could not fetch product details', 'error');
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);

        if (val.length > 1) {
            const matches = Object.keys(AUTO_CATEGORIES).filter(k =>
                k.toLowerCase().includes(val.toLowerCase())
            ).slice(0, 5); // Limit to 5
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setName(suggestion);
        setSuggestions([]); // Close dropdown

        // Auto-select category
        const cat = AUTO_CATEGORIES[suggestion];
        if (cat) {
            setCategory(cat);
            // Optional: Create a mini-flash effect on the category input to show it changed?
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            onSubmit({
                name,
                category, // Hook will handle auto-detection if empty
                location: 'kichen', // Default to kitchen
                quantity: 1, // Default to 1
                stockLevel: 'full', // Default status
                value: 0,
                barcode,
            });
        } catch (error) {
            console.error("Error preparing submission:", error);
            showToast("Error saving item", 'error');
            setIsSubmitting(false);
        }
    };

    const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' };
    const labelStyle = { fontWeight: 600, fontSize: '0.875rem' };

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h2 className="text-title" style={{ margin: 0, whiteSpace: 'nowrap' }}>{initialValues ? 'Edit Item' : 'Add New Item'}</h2>
                <Button variant="secondary" onClick={() => setShowScanner(true)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                    <ScanBarcode size={16} />
                    <span style={{ marginLeft: '6px' }}>Scan</span>
                </Button>
            </div>

            {showScanner && (
                <BarcodeScanner
                    onResult={handleScanResult}
                    onClose={() => setShowScanner(false)}
                />
            )}

            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={fieldStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={labelStyle}>Item Name</label>
                            {barcode && (
                                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-primary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <ScanBarcode size={12} /> {barcode}
                                </span>
                            )}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={handleNameChange} // USE CUSTOM HANDLER
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                                placeholder="e.g. Milk, Bread, Eggs..."
                                autoFocus
                                onBlur={() => setTimeout(() => setSuggestions([]), 200)} // Delay to allow click
                            />

                            {suggestions.length > 0 && (
                                <ul
                                    className="dropdown-panel"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        marginTop: '4px',
                                        padding: '4px 0',
                                        listStyle: 'none'
                                    }}>
                                    {suggestions.map((s) => (
                                        <li
                                            key={s}
                                            onClick={() => selectSuggestion(s)}
                                            className="hover-lift"
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                textTransform: 'capitalize',
                                                borderBottom: '1px solid rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{s}</span>
                                                <span style={{ fontSize: '0.8rem', opacity: 0.6, fontStyle: 'italic' }}>
                                                    {AUTO_CATEGORIES[s]}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle}>Category (Optional - Auto-detected)</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value as any)}
                            className="glass-panel"
                            style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                        >
                            <option value="">Auto-Detect</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="ghost" onClick={onCancel} style={{ color: 'var(--text-muted)' }}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (initialValues ? 'Save Changes' : 'Add to Pantry')}
                        </Button>
                    </div>
                </form>
            </Card>
            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
            />
        </div>
    );
};
