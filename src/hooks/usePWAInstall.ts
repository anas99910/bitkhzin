import { useState, useEffect } from 'react';

interface IBeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
}

declare global {
    interface Window {
        deferredPrompt: IBeforeInstallPromptEvent | null;
    }
}

export const usePWAInstall = () => {
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        // Check if the event was already captured globally
        if (typeof window !== 'undefined' && window.deferredPrompt) {
            console.log('[PWA] Hook found global deferredPrompt on mount');
            setCanInstall(true);
        }

        const handler = (e: Event) => {
            e.preventDefault();
            console.log('[PWA] Hook captured beforeinstallprompt dynamically');
            setCanInstall(true);
            // The global listener in index.html already sets window.deferredPrompt,
            // but we can ensure it's set here too just in case.
            window.deferredPrompt = e as IBeforeInstallPromptEvent;
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const triggerInstall = async (): Promise<boolean> => {
        const promptEvent = window.deferredPrompt;
        if (!promptEvent) {
            console.warn('[PWA] No prompt event available to trigger');
            return false;
        }

        await promptEvent.prompt();

        const { outcome } = await promptEvent.userChoice;
        console.log(`[PWA] User response: ${outcome}`);

        // Clear the saved prompt since it can't be used again
        window.deferredPrompt = null;
        setCanInstall(false);
        return true;
    };

    return { canInstall, triggerInstall };
};
