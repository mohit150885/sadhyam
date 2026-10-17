import "server-only";

import { getApps, initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore, setLogLevel } from "firebase/firestore/lite";
import { defaultSiteContent, type AllSiteContent, type ContentKey } from "./siteContent";
import { mergeContent } from "./utils";

const NAME = "sadhyam-server-read";
setLogLevel("silent");

function serverDb() {
    const app =
        getApps().find((a) => a.name === NAME) ??
        initializeApp(
            {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            },
            NAME
        );
    return getFirestore(app);
}

/**
 * Reads a public site_content document on the server (used for page titles
 * and SEO tags). Falls back to defaults if Firestore is slow or unreachable.
 */
export async function readContent<K extends ContentKey>(key: K, timeoutMs = 2500): Promise<AllSiteContent[K]> {
    const fallback = defaultSiteContent[key];
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true") {
        return fallback;
    }
    try {
        const snap = await Promise.race([
            getDoc(doc(serverDb(), "site_content", key)),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
        ]);
        if (!snap || !snap.exists()) return fallback;
        return mergeContent(fallback, snap.data());
    } catch {
        return fallback;
    }
}
