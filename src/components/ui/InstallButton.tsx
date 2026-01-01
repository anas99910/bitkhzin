import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const InstallButton: React.FC = () => {
    const { canInstall, triggerInstall } = usePWAInstall();

    // STRICT RULE: If the browser is not ready to install, DO NOT RENDER ANYTHING.
    // No instructions, no toasts, no disabled buttons.
    if (!canInstall) {
        return null;
    }

    return (
        <>
            <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />
            <Button
                onClick={triggerInstall}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
            >
                <Download size={18} />
                Install App
            </Button>
        </>
    );
};
