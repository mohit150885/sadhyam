import "server-only";

import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const APP_NAME = "sadhyam-admin";

function readServiceAccount() {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as { project_id: string; client_email: string; private_key: string };
        if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
            throw new Error("missing fields");
        }
        return parsed;
    } catch {
        throw new Error(
            "FIREBASE_SERVICE_ACCOUNT_JSON must be the full service-account JSON on one line (project_id, client_email, private_key)."
        );
    }
}

function getAdminApp(): App {
    const existing = getApps().find((a) => a.name === APP_NAME);
    if (existing) return existing;

    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    // Emulator: no credentials needed.
    if (process.env.FIRESTORE_EMULATOR_HOST) {
        return initializeApp({ projectId, storageBucket }, APP_NAME);
    }

    const sa = readServiceAccount();
    if (!sa) {
        throw new Error(
            "Missing FIREBASE_SERVICE_ACCOUNT_JSON. Add your Firebase service-account key to .env.local (see README)."
        );
    }

    return initializeApp(
        {
            credential: cert({
                projectId: sa.project_id,
                clientEmail: sa.client_email,
                privateKey: sa.private_key.replace(/\\n/g, "\n"),
            }),
            storageBucket,
        },
        APP_NAME
    );
}

export function adminDb() {
    return getFirestore(getAdminApp());
}

export function adminAuth() {
    return getAuth(getAdminApp());
}

export function adminBucket(name?: string) {
    return name ? getStorage(getAdminApp()).bucket(name) : getStorage(getAdminApp()).bucket();
}

let resolvedBucket: string | null | undefined;

/**
 * Finds a Storage bucket that actually exists. New Firebase projects use
 * "<project>.firebasestorage.app", older ones "<project>.appspot.com", and the
 * env var is often set to the wrong one — so try both before giving up.
 * Returns null when Storage is not enabled on the project at all.
 */
export async function resolveBucket(): Promise<{ bucket: ReturnType<typeof adminBucket> | null; tried: string[]; error: string }> {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
    const configured = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "";
    const candidates = Array.from(
        new Set([configured, projectId && `${projectId}.firebasestorage.app`, projectId && `${projectId}.appspot.com`].filter(Boolean))
    ).map((b) => b.replace(/^gs:\/\//, ""));

    if (resolvedBucket) return { bucket: adminBucket(resolvedBucket), tried: candidates, error: "" };
    if (resolvedBucket === null) return { bucket: null, tried: candidates, error: "Firebase Storage is not enabled for this project." };

    let error = "";
    for (const name of candidates) {
        try {
            const [exists] = await adminBucket(name).exists();
            if (exists) {
                resolvedBucket = name;
                return { bucket: adminBucket(name), tried: candidates, error: "" };
            }
        } catch (err) {
            error = err instanceof Error ? err.message.split("\n")[0] : String(err);
        }
    }
    // Remember the miss for 5 minutes so every upload doesn't re-check.
    resolvedBucket = null;
    setTimeout(() => (resolvedBucket = undefined), 5 * 60 * 1000).unref?.();
    return { bucket: null, tried: candidates, error: error || "Firebase Storage is not enabled for this project." };
}
