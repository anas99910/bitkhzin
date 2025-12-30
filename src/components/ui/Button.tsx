import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {

    // Base styles (using CSS classes defined in index.css + Tailwind-like utils if available, but relying on inline style mapping for robust vanilla usage)
    // For 'Premium' feel, we use the classes directly.

    const getVariantClass = () => {
        switch (variant) {
            case 'primary': return 'btn-primary';
            case 'secondary': return 'btn-secondary';
            case 'danger': return 'btn-primary'; // TODO: Add danger style
            case 'ghost': return 'btn-ghost'; // TODO: Add ghost style
            default: return 'btn-primary';
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm': return { padding: '8px 16px', fontSize: '0.875rem' };
            case 'lg': return { padding: '16px 32px', fontSize: '1.25rem' };
            default: return {}; // Default defined in CSS
        }
    };

    const variantClass = getVariantClass();

    return (
        <button
            className={`${variantClass} ${className}`}
            disabled={isLoading || disabled}
            style={{
                ...getSizeStyle(),
                opacity: (isLoading || disabled) ? 0.7 : 1,
                cursor: (isLoading || disabled) ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                ...props.style
            }}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="30 60" />
                </svg>
            )}
            {children}
        </button>
    );
};
