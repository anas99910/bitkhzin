import { useState, useEffect } from 'react';

interface IBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Global capture to handle race conditions (event firing before React hydrates)
let globalDeferredPrompt: IBeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        globalDeferredPrompt = e as IBeforeInstallPromptEvent;
        console.log('[PWA] Global fetch of beforeinstallprompt');
    });
}

export const usePWAInstall = () => {
    const [canInstall, setCanInstall] = useState(!!globalDeferredPrompt);
    const [deferredPrompt, setDeferredPrompt] = useState<IBeforeInstallPromptEvent | null>(globalDeferredPrompt);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            const event = e as IBeforeInstallPromptEvent;
            console.log('[PWA] Hook captured beforeinstallprompt');
            setDeferredPrompt(event);
            setCanInstall(true);
            globalDeferredPrompt = event;
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Initial check in case global fired before hook mount
        if (globalDeferredPrompt) {
            setDeferredPrompt(globalDeferredPrompt);
            setCanInstall(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const triggerInstall = async () => {
        const promptEvent = deferredPrompt || globalDeferredPrompt;
        if (!promptEvent) {
            console.warn('[PWA] No prompt event available to trigger');
            return;
        }

        await promptEvent.prompt();

        const { outcome } = await promptEvent.userChoice;
        console.log(`[PWA] User response: ${outcome}`);

        // Clear state after usage
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
        setCanInstall(false);
    };

    return { canInstall, triggerInstall };
};
