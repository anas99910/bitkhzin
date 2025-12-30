import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your actual Firebase config
// You can get this from the Firebase Console specific to your project
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
// This allows the app to work completely offline
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Persistence failed: Multiple tabs open');
    } else if (err.code == 'unimplemented') {
        console.warn('Persistence failed: Browser not supported');
    }
});

export { app, db, auth };

// Utility to simulate offline/online for testing
export const setOffline = async (status: boolean) => {
    if (status) {
        await disableNetwork(db);
    } else {
        await enableNetwork(db);
    }
};
