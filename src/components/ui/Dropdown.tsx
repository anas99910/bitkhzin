import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface DropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ value, onChange, options, placeholder = 'Select...', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className={`dropdown-container ${className}`} ref={dropdownRef}>
            {/* Desktop Custom UI */}
            <div className="desktop-only-dropdown" style={{ position: 'relative' }}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="glass-panel"
                    style={{
                        width: '100%',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '16px', // Pill-like
                        border: '1px solid var(--glass-border)',
                        background: 'var(--color-surface)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {selectedLabel}
                    </span>
                    {isOpen ? <ChevronUp size={18} style={{ opacity: 0.6 }} /> : <ChevronDown size={18} style={{ opacity: 0.6 }} />}
                </button>

                {isOpen && (
                    <div
                        className="glass-panel animate-fade-in"
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: 0,
                            right: 0,
                            zIndex: 50,
                            maxHeight: '240px',
                            overflowY: 'auto',
                            borderRadius: '16px',
                            border: '1px solid var(--glass-border)',
                            background: 'var(--color-surface)', // Opaque enough
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                            padding: '4px'
                        }}
                    >
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                style={{
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    fontSize: '0.95rem',
                                    color: value === option.value ? 'hsl(var(--color-primary))' : 'var(--text-primary)',
                                    background: value === option.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                    fontWeight: value === option.value ? 600 : 400,
                                    transition: 'background 0.2s',
                                    marginBottom: '2px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = value === option.value ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = value === option.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Native UI */}
            <select
                className="mobile-only-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    background: 'var(--color-surface)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    appearance: 'none', // Reset default style
                    // Add distinct style or rely on parent styles
                }}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* CSS to switch views */}
            <style>{`
                @media (min-width: 1025px) {
                    .mobile-only-select { display: none !important; }
                    .desktop-only-dropdown { display: block !important; }
                }
                @media (max-width: 1024px) {
                    .mobile-only-select { display: block !important; }
                    .desktop-only-dropdown { display: none !important; }
                }
            `}</style>
        </div>
    );
};
