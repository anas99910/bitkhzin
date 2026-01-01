import { useState, useEffect } from 'react';

interface IBeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Global variable to capture the event if it fires before the hook is used
let globalDeferredPrompt: IBeforeInstallPromptEvent | null = null;

// Immediately listen for the event
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        globalDeferredPrompt = e as IBeforeInstallPromptEvent;
        console.log("Captured beforeinstallprompt interactively");
    });
}

export const useInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<IBeforeInstallPromptEvent | null>(globalDeferredPrompt);
    const [isInstallable, setIsInstallable] = useState(!!globalDeferredPrompt);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            const event = e as IBeforeInstallPromptEvent;
            setDeferredPrompt(event);
            setIsInstallable(true);
            globalDeferredPrompt = event; // Update global ref
        };

        window.addEventListener('beforeinstallprompt', handler);

        // If we already have one globally, ensure state is synced (double check)
        if (globalDeferredPrompt) {
            setDeferredPrompt(globalDeferredPrompt);
            setIsInstallable(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const promptToInstall = async () => {
        const promptEvent = deferredPrompt || globalDeferredPrompt;
        if (!promptEvent) {
            console.log("No deferred prompt found");
            return;
        }

        // Show the install prompt
        await promptEvent.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await promptEvent.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        globalDeferredPrompt = null;
        setIsInstallable(false);
    };

    return { isInstallable, promptToInstall };
};
