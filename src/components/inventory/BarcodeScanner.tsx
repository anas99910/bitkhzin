import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useZxing } from 'react-zxing';
import { X, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
    onResult: (result: string) => void;
    onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onResult, onClose }) => {
    const [error, setError] = useState<string | null>(null);

    const { ref } = useZxing({
        onDecodeResult(result) {
            onResult(result.getText());
        },
        onError(err) {
            // Only show relevant camera errors, ignore transient scanning errors
            if (err instanceof DOMException && err.name === 'NotAllowedError') {
                setError("Camera access denied. Please allow camera permissions.");
            }
        },
    });

    const content = (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)', // Slightly darker for better focus
            zIndex: 9999, // Super high z-index to be safe
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                background: '#000',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.6)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <X size={24} />
                </button>

                {/* Viewfinder Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    height: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    zIndex: 5,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)' // Dim the area outside the viewfinder
                }}>
                    {/* Scanning Line Animation */}
                    <div style={{
                        width: '100%',
                        height: '2px',
                        background: 'hsl(var(--color-primary))',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        animation: 'scan 2s infinite ease-in-out',
                        boxShadow: '0 0 4px hsl(var(--color-primary))'
                    }} />
                    <style>{`
                     @keyframes scan {
                       0% { top: 0; opacity: 0; }
                       10% { opacity: 1; }
                       90% { opacity: 1; }
                       100% { top: 100%; opacity: 0; }
                     }
                   `}</style>
                </div>

                {error ? (
                    <div style={{ padding: '60px 40px', color: 'white', textAlign: 'center' }}>
                        <AlertCircle size={48} style={{ marginBottom: '16px', color: '#ef4444' }} />
                        <p style={{ fontSize: '1.1rem' }}>{error}</p>
                    </div>
                ) : (
                    <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '400px' }} />
                )}
            </div>

            <p style={{
                color: 'white',
                marginTop: '24px',
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '1.1rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
                Point camera at a barcode
            </p>
        </div>
    );

    return createPortal(content, document.body);
};
