import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string;
    householdId: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    updateHousehold: (newHouseholdId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true, updateHousehold: async () => { } });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // Subscribe to user profile changes
                const userRef = doc(db, 'users', currentUser.uid);

                // Real-time listener for profile (so if household changes, we know)
                const unsubProfile = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        // Create profile if not exists
                        const newProfile: UserProfile = {
                            uid: currentUser.uid,
                            email: currentUser.email || '',
                            householdId: currentUser.uid // Default to own ID
                        };
                        try {
                            await setDoc(userRef, newProfile);
                            setUserProfile(newProfile);
                        } catch (e) {
                            console.error("Error creating profile:", e);
                        }
                    }
                    setLoading(false);
                });

                return () => unsubProfile();
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const updateHousehold = async (newHouseholdId: string) => {
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { householdId: newHouseholdId }, { merge: true });
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, updateHousehold }}>
            {children}
        </AuthContext.Provider>
    );
};
