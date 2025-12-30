import React, { useState } from 'react';
import { InventoryItem, DEFAULT_CATEGORIES, DEFAULT_LOCATIONS } from '../../types/inventory';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            category,
            location,
            quantity,
            value: value ? parseFloat(value) : 0,
        });
    };

    const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' };
    const labelStyle = { fontWeight: 600, fontSize: '0.875rem' };

    return (
        <div className="animate-slide-up">
            <h2 className="text-title">Add New Item</h2>
            <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <label style={labelStyle}>Item Name</label>
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
                </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                        <Button type="submit">Save Item</Button>
                    </div>
                </form>
            </Card>
            );
};
