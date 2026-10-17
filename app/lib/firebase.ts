import { initializeApp, getApp, getApps } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
    connectFirestoreEmulator,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager,
    memoryLocalCache,
    setLogLevel,
    type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isNew = getApps().length === 0;
const app = isNew ? initializeApp(firebaseConfig) : getApp();

const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";

setLogLevel("error");

function createDb(): Firestore {
    if (!isNew) return getFirestore(app);
    if (typeof window === "undefined" || useEmulator) return getFirestore(app);
    try {
        return initializeFirestore(app, {
            // No disk cache during development: avoids lease conflicts with hot reload and many tabs
            localCache:
                process.env.NODE_ENV === "development"
                    ? memoryLocalCache()
                    : persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
        });
    } catch {
        return getFirestore(app);
    }
}

export const db = createDb();
export const auth = getAuth(app);

if (useEmulator && isNew && typeof window !== "undefined") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
}

export default app;
