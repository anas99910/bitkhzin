import React, { useState, useRef } from 'react';
import { Loader2, ScanBarcode, ImageIcon, X } from 'lucide-react';
import { InventoryItem, DEFAULT_CATEGORIES, DEFAULT_LOCATIONS } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Toast } from '../ui/Toast';
import { BarcodeScanner } from './BarcodeScanner';
import { compressImage } from '../../utils/imageUtils';

interface InventoryFormProps {
    onSubmit: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>, imageUrl?: string) => void;
    onCancel: () => void;
}

export const InventoryForm: React.FC<InventoryFormProps> = ({ onSubmit, onCancel }) => {
    // State
    const [name, setName] = useState('');
    const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
    const [location, setLocation] = useState(DEFAULT_LOCATIONS[0]);
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState('');
    const [barcode, setBarcode] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; msg: string; type: 'success' | 'error' }>({
        show: false,
        msg: '',
        type: 'success'
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, msg, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleScanResult = (result: string) => {
        setBarcode(result);
        setShowScanner(false);
        showToast('Barcode scanned successfully!');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            let finalImageUrl = undefined;
            if (selectedImage) {
                finalImageUrl = await compressImage(selectedImage);
            }

            onSubmit({
                name,
                category,
                location,
                quantity,
                value: value ? parseFloat(value) : 0,
                barcode,
            }, finalImageUrl);
        } catch (error) {
            console.error("Error preparing submission:", error);
            showToast("Error processing image", 'error');
            setIsSubmitting(false);
        }
    };

    const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' };
    const labelStyle = { fontWeight: 600, fontSize: '0.875rem' };

    return (
        <div className="animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="text-title" style={{ margin: 0 }}>Add New Item</h2>
                <Button variant="secondary" onClick={() => setShowScanner(true)}>
                    <ScanBarcode size={18} />
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
                    {/* Image Upload Section */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <div
                            className="glass-panel"
                            style={{
                                width: '100%',
                                maxWidth: '300px',
                                height: '200px',
                                border: '2px dashed var(--glass-border)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {previewUrl ? (
                                <>
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                        style={{
                                            position: 'absolute',
                                            top: '8px',
                                            right: '8px',
                                            background: 'rgba(0,0,0,0.6)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            padding: '4px',
                                            border: 'none',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', opacity: 0.7, padding: '20px' }}>
                                    <ImageIcon size={48} style={{ marginBottom: '8px', opacity: 0.5 }} />
                                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Click to add photo</p>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleImageSelect}
                            />
                        </div>
                    </div>

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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Save Item'}
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
