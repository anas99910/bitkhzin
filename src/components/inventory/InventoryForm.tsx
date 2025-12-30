import React, { useState } from 'react';
import { InventoryItem, DEFAULT_CATEGORIES, DEFAULT_LOCATIONS } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ScanBarcode, Loader2 } from 'lucide-react';
import { BarcodeScanner } from './BarcodeScanner';
import { Toast, ToastType } from '../ui/Toast';

interface InventoryFormProps {
    onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
    const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState('');
    const [barcode, setBarcode] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ msg: string, type: ToastType, show: boolean }>({ msg: '', type: 'info', show: false });

    const showToast = (msg: string, type: ToastType) => {
        setToast({ msg, type, show: true });
    };

    const fetchProductInfo = async (scannedBarcode: string) => {
        setBarcode(scannedBarcode); // Always set barcode
        setIsFetchingInfo(true);
        try {
            const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`);
            const data = await response.json();

            if (data.status === 1 && data.product) {
                const product = data.product;
                setName(product.product_name || '');
                // Try to guess category
                const categories = product.categories || '';

                // Simple heuristic for category mapping
                if (categories.toLowerCase().includes('electronic') || categories.toLowerCase().includes('device')) {
                    setCategory('Electronics');
                } else if (categories.toLowerCase().includes('kitchen') || categories.toLowerCase().includes('food') || categories.toLowerCase().includes('cooking')) {
                    setCategory('Kitchen');
                } else {
                    setCategory('Other');
                }

                showToast("Product found!", 'success');
            } else {
                showToast("Product details not found, but barcode saved.", 'info');
            }
        } catch (error) {
            console.error("Error fetching product info:", error);
            showToast("Network error. Please enter details manually.", 'error');
        } finally {
            setIsFetchingInfo(false);
        }
    };

    const handleScanResult = (result: string) => {
        setShowScanner(false);
        fetchProductInfo(result);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            category,
            location,
            quantity,
            value: value ? parseFloat(value) : 0,
            barcode,
        });
    };

    const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' };
    const labelStyle = { fontWeight: 600, fontSize: '0.875rem' };

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="text-title" style={{ margin: 0 }}>Add New Item</h2>
                <Button variant="secondary" onClick={() => setShowScanner(true)} disabled={isFetchingInfo}>
                    {isFetchingInfo ? <Loader2 size={18} className="animate-spin" /> : <ScanBarcode size={18} />}
                    <span style={{ marginLeft: '8px' }}>Scan Barcode</span>
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
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="glass-panel"
                            style={{ padding: '12px', background: 'rgba(255,255,255,0.5)' }}
                            placeholder="e.g. Sony Bravia TV"
                        />
                    </div>

                    <div className="form-row">
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Category</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value as any)}
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                            >
                                {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div style={fieldStyle}>
                            <label style={labelStyle}>Location</label>
                            <select
                                value={location}
                                onChange={e => setLocation(e.target.value as any)}
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                            >
                                {DEFAULT_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value))}
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                            />
                        </div>
                        <div style={fieldStyle}>
                            <label style={labelStyle}>Value ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={value}
                                onChange={e => setValue(e.target.value)}
                                className="glass-panel"
                                style={{ padding: '12px', background: 'rgba(255,255,255,0.5)', width: '100%' }}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
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
