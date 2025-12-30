import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false, style, ...props }) => {
    return (
        <div
            className={`glass-panel ${hoverEffect ? 'hover-lift' : ''} ${className}`}
            style={{
                padding: '24px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: hoverEffect ? 'pointer' : 'default',
                ...style
            }}
            {...props}
        >
            {children}
        </div>
    );
};
