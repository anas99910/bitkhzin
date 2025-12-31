import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
    actionLabel?: string;
    onAction?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    isVisible,
    onClose,
    duration = 3000,
    actionLabel,
    onAction
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} color="#4ade80" />;
            case 'error': return <AlertCircle size={20} color="#f87171" />;
            default: return <Info size={20} color="#60a5fa" />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success': return 'rgba(74, 222, 128, 0.5)';
            case 'error': return 'rgba(248, 113, 113, 0.5)';
            default: return 'rgba(96, 165, 250, 0.5)';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '24px', // Safe area from top
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 20px',
            background: 'rgba(20, 20, 30, 0.95)', // Dark background for contrast
            backdropFilter: 'blur(12px)',
            border: `1px solid ${getBorderColor()}`,
            borderRadius: '99px', // Pill shape
            color: 'white',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '90%',
            width: 'max-content',
            animation: 'slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            {getIcon()}
            <span style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{message}</span>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: 'none',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                    }}
                >
                    {actionLabel}
                </button>
            )}

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.6)',
                    display: 'flex'
                }}
            >
                <X size={16} />
            </button>
            <style>{`
                @keyframes slideDownFade {
                    from { opacity: 0; transform: translate(-50%, -20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
};
