import React, { useState } from 'react';
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

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
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
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(0,0,0,0.5)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        padding: '8px',
                        cursor: 'pointer',
                        zIndex: 10
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
                    border: '2px solid rgba(255, 255, 255, 0.6)',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    zIndex: 5
                }}></div>

                {error ? (
                    <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
                        <AlertCircle size={48} style={{ marginBottom: '16px', color: '#ff4444' }} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <video ref={ref} style={{ width: '100%', display: 'block' }} />
                )}
            </div>

            <p style={{ color: 'white', marginTop: '20px', textAlign: 'center' }}>
                Point your camera at a barcode to scan.
            </p>
        </div>
    );
};
