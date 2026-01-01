import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const AppInstallButton: React.FC = () => {
    const { triggerInstall, canInstall } = usePWAInstall();

    const handleClick = async () => {
        const success = await triggerInstall();
        if (!success) {
            // Check if already in standalone mode
            const isAhs = window.matchMedia('(display-mode: standalone)').matches;
            if (isAhs) {
                alert("The app is already installed and running in app mode.");
                return;
            }
            // If on mobile but not https/localhost
            if (window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
                alert("Installation requires HTTPS. If you are on a local network, please use a secure connection or localhost via port forwarding.");
                return;
            }

            alert("App installation is not available right now.\n\nPossible reasons:\n1. It's already installed (check your home screen)\n2. Browser limitation (try Chrome/Edge)\n3. You are effectively in Incognito mode");
        }
    };

    // Always render the button
    return (
        <>
            <hr style={{ margin: '16px 0', borderColor: 'var(--glass-border)', opacity: 0.3 }} />
            <Button
                onClick={handleClick}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, hsl(var(--color-primary)), hsl(var(--color-primary) / 0.8))',
                    color: 'white',
                    border: 'none',
                    opacity: canInstall ? 1 : 0.9
                }}
            >
                <Download size={18} />
                Install App
            </Button>
        </>
    );
};
