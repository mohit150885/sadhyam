import { adminDb, resolveBucket } from "../../../lib/firebase-admin";
import { CONTENT_KEYS } from "../../../lib/siteContent";
import { ensureSiteContent } from "../../../lib/autoSeed";
import { ok, requireAdmin } from "../../../lib/server";

export const runtime = "nodejs";

/** Setup checklist shown on the admin dashboard. */
export async function GET() {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const result = {
        serviceAccount: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) || Boolean(process.env.FIRESTORE_EMULATOR_HOST),
        firestore: { ok: false, error: "" },
        storage: { ok: false, error: "", bucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "" },
        content: {} as Record<string, boolean>,
        role: auth.admin.role,
        name: auth.admin.name,
    };

    try {
        await ensureSiteContent();
        const db = adminDb();
        const refs = CONTENT_KEYS.map((k) => db.doc(`site_content/${k}`));
        const snaps = await db.getAll(...refs);
        snaps.forEach((s, i) => (result.content[CONTENT_KEYS[i]] = s.exists));
        result.firestore.ok = true;
    } catch (err) {
        result.firestore.error = err instanceof Error ? err.message : String(err);
    }

    try {
        const found = await resolveBucket();
        result.storage.ok = Boolean(found.bucket);
        if (found.bucket) result.storage.bucket = found.bucket.name;
        else result.storage.error = `No bucket found (tried ${found.tried.join(", ")}).`;
    } catch (err) {
        result.storage.error = err instanceof Error ? err.message.split("\n")[0] : String(err);
    }

    return ok(result);
}
