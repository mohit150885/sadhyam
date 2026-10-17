"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import type { UserProfile } from "../../lib/models";

type AuthState = {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
    user: null,
    profile: null,
    loading: true,
    logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubProfile: (() => void) | undefined;
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
            unsubProfile?.();
            unsubProfile = undefined;
            if (!u) {
                setProfile(null);
                return;
            }
            unsubProfile = onSnapshot(
                doc(db, "users", u.uid),
                (snap) => setProfile(snap.exists() ? ({ uid: u.uid, ...snap.data() } as UserProfile) : null),
                () => setProfile(null)
            );
        });
        return () => {
            unsub();
            unsubProfile?.();
        };
    }, []);

    const logout = async () => {
        await signOut(auth);
    };

    return <AuthContext.Provider value={{ user, profile, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
