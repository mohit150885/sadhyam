import "server-only";

import { adminDb } from "./firebase-admin";
import { CONTENT_KEYS, defaultSiteContent } from "./siteContent";

let done: Promise<string[]> | null = null;

/**
 * Creates any site_content/<page> document that doesn't exist yet, using the
 * built-in defaults. Existing documents are never touched. Runs once per server
 * start, the first time someone opens the admin panel, so you never have to
 * create collections or fields by hand in the Firebase console.
 * (All other collections — orders, users, coupons … — are created by Firestore
 * automatically on their first write.)
 */
export function ensureSiteContent(): Promise<string[]> {
    if (!done) {
        done = (async () => {
            const db = adminDb();
            const refs = CONTENT_KEYS.map((k) => db.doc(`site_content/${k}`));
            const snaps = await db.getAll(...refs);
            const missing = CONTENT_KEYS.filter((_, i) => !snaps[i].exists);
            if (missing.length) {
                const batch = db.batch();
                for (const key of missing) {
                    batch.set(db.doc(`site_content/${key}`), {
                        ...JSON.parse(JSON.stringify(defaultSiteContent[key])),
                        updatedAt: Date.now(),
                        updatedBy: "auto-setup",
                    });
                }
                await batch.commit();
            }
            return missing;
        })().catch((err) => {
            done = null; // retry next time (e.g. service account not configured yet)
            console.warn("Auto-setup of site_content skipped:", err instanceof Error ? err.message : err);
            return [];
        });
    }
    return done;
}
